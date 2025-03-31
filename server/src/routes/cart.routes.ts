import express from 'express';
import { 
  getAllCarts, 
  getCartById, 
  createCart, 
  updateCart, 
  assignCartToDriver, 
  unassignCart
} from '../controllers/cart.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../models/user.model';
import { asHandler } from '../utils/express-utils';

const router = express.Router();

// Get all carts (all authenticated users)
router.get('/', asHandler(authenticate), asHandler(getAllCarts));

// Get a single cart
router.get('/:id', asHandler(authenticate), asHandler(getCartById));

// Create a new cart (dispatcher only)
router.post('/', asHandler(authenticate), asHandler(authorize(UserRole.DISPATCHER)), asHandler(createCart));

// Update a cart (dispatcher only)
router.put('/:id', asHandler(authenticate), asHandler(authorize(UserRole.DISPATCHER)), asHandler(updateCart));

// Assign a cart to a driver (dispatcher only)
router.post('/:id/assign', asHandler(authenticate), asHandler(authorize(UserRole.DISPATCHER)), asHandler(assignCartToDriver));

// Unassign a cart from a driver (dispatcher or the driver assigned to the cart)
router.post('/:id/unassign', asHandler(authenticate), asHandler(unassignCart));

export default router; 