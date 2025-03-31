import express from 'express';
import { getAllUsers, getUserById, updateUser, getAllDrivers, toggleDutyStatus } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../models/user.model';
import { asHandler } from '../utils/express-utils';

const router = express.Router();

// Get all users (dispatcher only)
router.get('/', asHandler(authenticate), asHandler(authorize(UserRole.DISPATCHER)), asHandler(getAllUsers));

// Get all drivers
router.get('/drivers', asHandler(authenticate), asHandler(getAllDrivers));

// Get a single user
router.get('/:id', asHandler(authenticate), asHandler(getUserById));

// Update user
router.put('/:id', asHandler(authenticate), asHandler(updateUser));

// Toggle duty status (driver only)
router.patch('/:id/toggle-duty', asHandler(authenticate), asHandler(toggleDutyStatus));

export default router; 