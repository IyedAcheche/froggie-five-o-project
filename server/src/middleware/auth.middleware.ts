import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser, UserRole } from '../models/user.model';
import { Types } from 'mongoose';

// JWT token interface
interface JwtPayload {
  id: string;
}

// Authentication middleware
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }
    
    // Verify token
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    
    // Find user
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Add user to request with proper typing
    req.user = user as unknown as IUser & { _id: Types.ObjectId };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Authorization middleware for specific roles
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }
    
    next();
  };
}; 