import { Request, Response } from 'express';
import User, { UserRole } from '../models/user.model';
import { toObjectId } from '../utils/mongoose-utils';

// Get all users (admin/dispatcher only)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const query: any = {};
    
    // Filter by role if provided
    if (req.query.role) {
      query.role = req.query.role;
    }
    
    const users = await User.find(query).select('-password');
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const userId = toObjectId(req.user._id);
    
    // Check if the user is updating their own profile or if they're a dispatcher
    if (userId && userId.toString() !== req.params.id && req.user.role !== UserRole.DISPATCHER) {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }
    
    const { firstName, lastName, email, phoneNumber, profilePicture, isOnDuty } = req.body;
    
    // Don't allow role changes through this endpoint
    const updateData = {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(email && { email }),
      ...(phoneNumber && { phoneNumber }),
      ...(profilePicture && { profilePicture }),
      ...(isOnDuty !== undefined && { isOnDuty })
    };
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get all drivers
export const getAllDrivers = async (req: Request, res: Response) => {
  try {
    const onDutyOnly = req.query.onDutyOnly === 'true';
    
    const query: any = { role: UserRole.DRIVER };
    
    if (onDutyOnly) {
      query.isOnDuty = true;
    }
    
    const drivers = await User.find(query)
      .select('-password')
      .populate('assignedCart');
      
    res.status(200).json(drivers);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle duty status for drivers
export const toggleDutyStatus = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const userId = toObjectId(req.user._id);
    
    // Only allow drivers to toggle their own status
    if (req.user.role !== UserRole.DRIVER || (userId && userId.toString() !== req.params.id)) {
      return res.status(403).json({ message: 'Not authorized to update duty status' });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Toggle duty status
    user.isOnDuty = !user.isOnDuty;
    await user.save();
    
    res.status(200).json({ 
      _id: user._id,
      isOnDuty: user.isOnDuty
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}; 