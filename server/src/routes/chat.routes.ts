import express from 'express';
import { 
  getUserChats, 
  getChatById, 
  getDriverChat, 
  createPrivateChat, 
  sendMessage, 
  markChatAsRead 
} from '../controllers/chat.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../models/user.model';
import { asHandler } from '../utils/express-utils';

const router = express.Router();

// Get all chats for the current user
router.get('/', asHandler(authenticate), asHandler(getUserChats));

// Get the driver group chat (drivers and dispatchers only)
router.get('/driver-group', asHandler(authenticate), asHandler(getDriverChat));

// Create a private chat
router.post('/private', asHandler(authenticate), asHandler(createPrivateChat));

// Get a specific chat by ID
router.get('/:id', asHandler(authenticate), asHandler(getChatById));

// Send a message in a chat
router.post('/:id/messages', asHandler(authenticate), asHandler(sendMessage));

// Mark all messages in a chat as read
router.patch('/:id/read', asHandler(authenticate), asHandler(markChatAsRead));

export default router; 