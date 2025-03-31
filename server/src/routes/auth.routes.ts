import express from 'express';
import { register, login, getProfile } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { asHandler } from '../utils/express-utils';

const router = express.Router();

// Register route
router.post('/register', asHandler(register));

// Login route
router.post('/login', asHandler(login));

// Get user profile route (protected)
router.get('/profile', asHandler(authenticate), asHandler(getProfile));

export default router; 