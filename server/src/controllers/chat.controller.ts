import { Request, Response } from 'express';
import Chat, { ChatType, IMessage } from '../models/chat.model';
import User, { UserRole } from '../models/user.model';
import Ride from '../models/ride.model';
import { toObjectId } from '../utils/mongoose-utils';
import { Types } from 'mongoose';

// Get all chats for a user
export const getUserChats = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const chats = await Chat.find({
      participants: req.user._id
    })
      .populate('participants', 'firstName lastName email role')
      .populate('ride', 'status pickupLocation dropoffLocation')
      .sort({ lastActivity: -1 });
    
    res.status(200).json(chats);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific chat by ID
export const getChatById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const chat = await Chat.findById(req.params.id)
      .populate('participants', 'firstName lastName email role')
      .populate('ride', 'status pickupLocation dropoffLocation');
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    // Check if user is a participant in this chat
    if (!chat.participants.some(p => p._id.toString() === req.user?._id.toString())) {
      return res.status(403).json({ message: 'Not authorized to access this chat' });
    }
    
    res.status(200).json(chat);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get the driver group chat
export const getDriverChat = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Only drivers and dispatchers can access the driver chat
    if (req.user.role !== UserRole.DRIVER && req.user.role !== UserRole.DISPATCHER) {
      return res.status(403).json({ message: 'Not authorized to access driver chat' });
    }
    
    const userId = toObjectId(req.user._id);
    if (!userId) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    // Find or create the driver group chat
    let driverChat = await Chat.findOne({ type: ChatType.DRIVER_GROUP })
      .populate('participants', 'firstName lastName email role');
    
    if (!driverChat) {
      // Create the driver group chat if it doesn't exist
      const drivers = await User.find({ role: UserRole.DRIVER });
      const dispatchers = await User.find({ role: UserRole.DISPATCHER });
      
      const participants = [
        ...drivers.map(d => d._id),
        ...dispatchers.map(d => d._id)
      ];
      
      driverChat = await Chat.create({
        type: ChatType.DRIVER_GROUP,
        participants,
        messages: []
      });
      
      driverChat = await Chat.findById(driverChat._id)
        .populate('participants', 'firstName lastName email role');
    } else {
      // Make sure the user is a participant
      if (!driverChat.participants.some(p => p._id.toString() === req.user?._id.toString())) {
        driverChat.participants.push(req.user._id);
        await driverChat.save();
      }
    }
    
    res.status(200).json(driverChat);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create a private chat between users
export const createPrivateChat = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const userId = toObjectId(req.user._id);
    if (!userId) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const { recipientId } = req.body;
    
    if (!recipientId) {
      return res.status(400).json({ message: 'Recipient ID is required' });
    }
    
    const recipientObjId = toObjectId(recipientId);
    if (!recipientObjId) {
      return res.status(400).json({ message: 'Invalid recipient ID format' });
    }
    
    // Check if recipient exists
    const recipient = await User.findById(recipientObjId);
    
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }
    
    // Check if a chat already exists between these users
    const existingChat = await Chat.findOne({
      type: ChatType.PRIVATE,
      participants: { $all: [userId, recipientObjId] }
    }).populate('participants', 'firstName lastName email role');
    
    if (existingChat) {
      return res.status(200).json(existingChat);
    }
    
    // Create a new private chat
    const newChat = await Chat.create({
      type: ChatType.PRIVATE,
      participants: [userId, recipientObjId],
      messages: []
    });
    
    const populatedChat = await Chat.findById(newChat._id)
      .populate('participants', 'firstName lastName email role');
    
    res.status(201).json(populatedChat);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Send a message in a chat
export const sendMessage = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Message content is required' });
    }
    
    // Find the chat
    const chat = await Chat.findById(req.params.id);
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    // Check if user is a participant in this chat
    if (!chat.participants.some(p => p.toString() === req.user?._id.toString())) {
      return res.status(403).json({ message: 'Not authorized to send messages in this chat' });
    }
    
    // Create and add the new message
    const newMessage: IMessage = {
      sender: req.user._id,
      content,
      timestamp: new Date(),
      read: false
    };
    
    chat.messages.push(newMessage);
    chat.lastActivity = new Date();
    await chat.save();
    
    // Return the new message
    const updatedChat = await Chat.findById(chat._id)
      .populate('participants', 'firstName lastName email role');
      
    res.status(201).json({
      message: newMessage,
      chat: updatedChat
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Mark all messages in a chat as read
export const markChatAsRead = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const userId = toObjectId(req.user._id);
    if (!userId) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    // Find the chat
    const chat = await Chat.findById(req.params.id);
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    // Check if user is a participant in this chat
    if (!chat.participants.some(p => p.toString() === req.user?._id.toString())) {
      return res.status(403).json({ message: 'Not authorized to access this chat' });
    }
    
    // Mark all messages as read
    chat.messages.forEach(message => {
      if (message.sender.toString() !== req.user?._id.toString()) {
        message.read = true;
      }
    });
    
    await chat.save();
    
    res.status(200).json({ message: 'Messages marked as read' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}; 