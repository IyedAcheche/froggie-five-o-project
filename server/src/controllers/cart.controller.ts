import { Request, Response } from 'express';
import Cart, { CartStatus } from '../models/cart.model';
import User, { UserRole } from '../models/user.model';
import { toObjectId } from '../utils/mongoose-utils';
import { Types } from 'mongoose';

// Get all carts
export const getAllCarts = async (req: Request, res: Response) => {
  try {
    const status = req.query.status as CartStatus | undefined;
    
    const query: any = {};
    if (status) {
      query.status = status;
    }
    
    const carts = await Cart.find(query).populate('currentDriver', 'firstName lastName email');
    res.status(200).json(carts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single cart by ID
export const getCartById = async (req: Request, res: Response) => {
  try {
    const cart = await Cart.findById(req.params.id).populate('currentDriver', 'firstName lastName email');
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    res.status(200).json(cart);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new cart (dispatcher only)
export const createCart = async (req: Request, res: Response) => {
  try {
    const { cartNumber, description, status } = req.body;
    
    // Check if cart number already exists
    const cartExists = await Cart.findOne({ cartNumber });
    
    if (cartExists) {
      return res.status(400).json({ message: 'Cart with this number already exists' });
    }
    
    const cart = await Cart.create({
      cartNumber,
      description,
      status: status || CartStatus.AVAILABLE
    });
    
    res.status(201).json(cart);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update a cart (dispatcher only)
export const updateCart = async (req: Request, res: Response) => {
  try {
    const { cartNumber, description, status, lastMaintenance } = req.body;
    
    const cart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...(cartNumber && { cartNumber }),
          ...(description && { description }),
          ...(status && { status }),
          ...(lastMaintenance && { lastMaintenance })
        }
      },
      { new: true }
    );
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    res.status(200).json(cart);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Assign a cart to a driver (dispatcher only)
export const assignCartToDriver = async (req: Request, res: Response) => {
  try {
    const { driverId } = req.body;
    
    if (!driverId) {
      return res.status(400).json({ message: 'Driver ID is required' });
    }
    
    // Verify driver exists and is a driver
    const driver = await User.findById(driverId);
    
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    
    if (driver.role !== UserRole.DRIVER) {
      return res.status(400).json({ message: 'User is not a driver' });
    }
    
    // Check if cart exists
    const cart = await Cart.findById(req.params.id);
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    // Check if cart is available
    if (cart.status !== CartStatus.AVAILABLE) {
      return res.status(400).json({ message: 'Cart is not available' });
    }
    
    // Unassign any previously assigned cart from the driver
    if (driver.assignedCart) {
      await Cart.findByIdAndUpdate(driver.assignedCart, {
        $set: {
          currentDriver: null,
          status: CartStatus.AVAILABLE
        }
      });
    }
    
    // Assign the cart to the driver
    const driverObjId = toObjectId(driverId);
    if (!driverObjId) {
      return res.status(400).json({ message: 'Invalid driver ID format' });
    }
    
    cart.currentDriver = driverObjId;
    cart.status = CartStatus.IN_USE;
    await cart.save();
    
    // Update the driver with the assigned cart
    const cartObjId = toObjectId(cart._id);
    if (!cartObjId) {
      return res.status(400).json({ message: 'Invalid cart ID' });
    }
    
    driver.assignedCart = cart._id as Types.ObjectId;
    await driver.save();
    
    res.status(200).json({
      message: 'Cart assigned successfully',
      cart,
      driver: {
        _id: driver._id,
        firstName: driver.firstName,
        lastName: driver.lastName,
        email: driver.email,
        assignedCart: driver.assignedCart
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Unassign a cart from a driver (dispatcher or the assigned driver)
export const unassignCart = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Check if cart exists
    const cart = await Cart.findById(req.params.id);
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    // If not a dispatcher, check if the user is the assigned driver
    if (req.user.role !== UserRole.DISPATCHER && 
        (!cart.currentDriver || cart.currentDriver.toString() !== req.user?._id.toString())) {
      return res.status(403).json({ message: 'Not authorized to unassign this cart' });
    }
    
    // If cart has a driver assigned, update the driver
    if (cart.currentDriver) {
      await User.findByIdAndUpdate(cart.currentDriver, {
        $set: { assignedCart: null }
      });
    }
    
    // Update the cart
    cart.currentDriver = undefined;
    cart.status = CartStatus.AVAILABLE;
    await cart.save();
    
    res.status(200).json({
      message: 'Cart unassigned successfully',
      cart
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}; 