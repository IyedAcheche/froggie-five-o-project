import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import rideRoutes from './routes/ride.routes';
import cartRoutes from './routes/cart.routes';
import chatRoutes from './routes/chat.routes';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const server = http.createServer(app);

// Set up Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/chats', chatRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Froggie Five-O API is running');
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  // Handle ride requests
  socket.on('requestRide', (data) => {
    io.emit('newRideRequest', data);
  });
  
  // Handle ride status updates
  socket.on('updateRideStatus', (data) => {
    io.emit('rideStatusUpdated', data);
  });
  
  // Handle driver location updates
  socket.on('updateDriverLocation', (data) => {
    io.emit('driverLocationUpdated', data);
  });
  
  // Handle chat messages
  socket.on('sendMessage', (data) => {
    io.emit('newMessage', data);
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  }); 