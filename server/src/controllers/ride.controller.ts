import { Request, Response } from 'express';
import Ride, { RideStatus } from '../models/ride.model';
import User, { UserRole } from '../models/user.model';
import Chat, { ChatType } from '../models/chat.model';
import { toObjectId } from '../utils/mongoose-utils';

// Request a new ride (rider only)
export const requestRide = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Only riders can request rides
    if (req.user.role !== UserRole.RIDER) {
      return res.status(403).json({ message: 'Only riders can request rides' });
    }
    
    const { pickupLocation, dropoffLocation, notes } = req.body;
    
    if (!pickupLocation || !dropoffLocation) {
      return res.status(400).json({ message: 'Pickup and dropoff locations are required' });
    }
    
    // Create a new ride
    const ride = await Ride.create({
      rider: req.user._id,
      pickupLocation,
      dropoffLocation,
      notes,
      status: RideStatus.REQUESTED,
      requestTime: new Date()
    });
    
    // Create a chat for this ride
    await Chat.create({
      type: ChatType.RIDE,
      participants: [req.user._id],
      ride: ride._id,
      messages: []
    });
    
    res.status(201).json(ride);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get all rides
export const getAllRides = async (req: Request, res: Response) => {
  try {
    const status = req.query.status as RideStatus | undefined;
    
    const query: any = {};
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    // If user is a rider, only show their rides
    if (req.user?.role === UserRole.RIDER) {
      query.rider = req.user._id;
    }
    // If user is a driver, show rides they're assigned to or available rides
    else if (req.user?.role === UserRole.DRIVER) {
      if (status === RideStatus.REQUESTED) {
        // Show available rides
      } else {
        // Show rides assigned to this driver
        query.driver = req.user._id;
      }
    }
    // Dispatchers can see all rides
    
    const rides = await Ride.find(query)
      .populate('rider', 'firstName lastName email phoneNumber')
      .populate('driver', 'firstName lastName email phoneNumber')
      .populate('cart', 'cartNumber')
      .sort({ requestTime: -1 });
      
    res.status(200).json(rides);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single ride
export const getRideById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const ride = await Ride.findById(req.params.id)
      .populate('rider', 'firstName lastName email phoneNumber')
      .populate('driver', 'firstName lastName email phoneNumber')
      .populate('cart', 'cartNumber');
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    const userId = toObjectId(req.user._id);
    
    // Check if user is authorized to view this ride
    if (req.user?.role === UserRole.RIDER && 
        userId && ride.rider._id.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this ride' });
    }
    
    if (req.user?.role === UserRole.DRIVER && 
        ride.status !== RideStatus.REQUESTED && 
        ride.driver && userId && ride.driver._id.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this ride' });
    }
    
    res.status(200).json(ride);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Accept a ride (driver only)
export const acceptRide = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Only drivers can accept rides
    if (req.user.role !== UserRole.DRIVER) {
      return res.status(403).json({ message: 'Only drivers can accept rides' });
    }
    
    const driverId = toObjectId(req.user._id);
    if (!driverId) {
      return res.status(400).json({ message: 'Invalid driver ID' });
    }
    
    // Check if driver is on duty
    const driver = await User.findById(driverId);
    
    if (!driver || !driver.isOnDuty) {
      return res.status(400).json({ message: 'Driver must be on duty to accept rides' });
    }
    
    // Check if driver has an assigned cart
    if (!driver.assignedCart) {
      return res.status(400).json({ message: 'Driver must have an assigned cart to accept rides' });
    }
    
    // Find the ride
    const ride = await Ride.findById(req.params.id);
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    // Check if ride is in 'requested' status
    if (ride.status !== RideStatus.REQUESTED) {
      return res.status(400).json({ message: 'Ride is no longer available' });
    }
    
    // Update the ride
    ride.driver = driverId;
    ride.cart = driver.assignedCart;
    ride.status = RideStatus.ACCEPTED;
    ride.acceptTime = new Date();
    await ride.save();
    
    // Add driver to the ride's chat
    const chat = await Chat.findOne({ ride: ride._id });
    if (chat) {
      const participantExists = chat.participants.some(
        p => p.toString() === driverId.toString()
      );
      
      if (!participantExists) {
        chat.participants.push(driverId);
        await chat.save();
      }
    }
    
    const updatedRide = await Ride.findById(ride._id)
      .populate('rider', 'firstName lastName email phoneNumber')
      .populate('driver', 'firstName lastName email phoneNumber')
      .populate('cart', 'cartNumber');
    
    res.status(200).json(updatedRide);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update ride status (driver or dispatcher)
export const updateRideStatus = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    // Find the ride
    const ride = await Ride.findById(req.params.id);
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    const userId = toObjectId(req.user._id);
    
    // Check if user is authorized to update this ride
    if (req.user.role === UserRole.DRIVER) {
      if (!ride.driver || (userId && ride.driver.toString() !== userId.toString())) {
        return res.status(403).json({ message: 'Not authorized to update this ride' });
      }
    } else if (req.user.role !== UserRole.DISPATCHER) {
      return res.status(403).json({ message: 'Not authorized to update ride status' });
    }
    
    // Validate status transition
    const validTransitions: Record<RideStatus, RideStatus[]> = {
      [RideStatus.REQUESTED]: [RideStatus.ACCEPTED, RideStatus.CANCELLED],
      [RideStatus.ACCEPTED]: [RideStatus.IN_PROGRESS, RideStatus.CANCELLED],
      [RideStatus.IN_PROGRESS]: [RideStatus.COMPLETED, RideStatus.CANCELLED],
      [RideStatus.COMPLETED]: [],
      [RideStatus.CANCELLED]: []
    };
    
    if (!validTransitions[ride.status].includes(status as RideStatus)) {
      return res.status(400).json({ 
        message: `Cannot transition from ${ride.status} to ${status}` 
      });
    }
    
    // Update the ride
    ride.status = status as RideStatus;
    
    // Update timestamps based on status
    if (status === RideStatus.IN_PROGRESS) {
      ride.pickupTime = new Date();
    } else if (status === RideStatus.COMPLETED) {
      ride.dropoffTime = new Date();
    }
    
    await ride.save();
    
    res.status(200).json(ride);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel a ride (rider, driver, or dispatcher)
export const cancelRide = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Find the ride
    const ride = await Ride.findById(req.params.id);
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    const userId = toObjectId(req.user._id);
    
    // Check if user is authorized to cancel this ride
    if (req.user.role === UserRole.RIDER) {
      if (userId && ride.rider.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'Not authorized to cancel this ride' });
      }
    } else if (req.user.role === UserRole.DRIVER) {
      if (!ride.driver || (userId && ride.driver.toString() !== userId.toString())) {
        return res.status(403).json({ message: 'Not authorized to cancel this ride' });
      }
    }
    // Dispatchers can cancel any ride
    
    // Check if ride can be cancelled
    if (ride.status === RideStatus.COMPLETED || ride.status === RideStatus.CANCELLED) {
      return res.status(400).json({ message: 'Ride cannot be cancelled' });
    }
    
    // Update the ride
    ride.status = RideStatus.CANCELLED;
    await ride.save();
    
    res.status(200).json(ride);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}; 