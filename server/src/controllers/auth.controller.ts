import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser, UserRole } from '../models/user.model';

// Generate JWT token
const generateToken = (user: IUser): string => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d'
  });
};

// Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, role, phoneNumber } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || UserRole.RIDER, // Default to rider role
      phoneNumber
    });
    
    if (user) {
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        token: generateToken(user)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Check if password matches
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture,
      isOnDuty: user.isOnDuty,
      token: generateToken(user)
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get current user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}; 