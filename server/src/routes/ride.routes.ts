import express from 'express';
import { 
  requestRide, 
  getAllRides, 
  getRideById, 
  acceptRide, 
  updateRideStatus, 
  cancelRide 
} from '../controllers/ride.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../models/user.model';
import { asHandler } from '../utils/express-utils';

const router = express.Router();

// Request a new ride (rider only)
router.post('/', asHandler(authenticate), asHandler(authorize(UserRole.RIDER)), asHandler(requestRide));

// Get all rides (all authenticated users, but filtered based on role)
router.get('/', asHandler(authenticate), asHandler(getAllRides));

// Get a single ride
router.get('/:id', asHandler(authenticate), asHandler(getRideById));

// Accept a ride (driver only)
router.post('/:id/accept', asHandler(authenticate), asHandler(authorize(UserRole.DRIVER)), asHandler(acceptRide));

// Update ride status (driver or dispatcher)
router.patch('/:id/status', asHandler(authenticate), asHandler(updateRideStatus));

// Cancel a ride (any authenticated user, but controller checks permissions)
router.post('/:id/cancel', asHandler(authenticate), asHandler(cancelRide));

export default router; 