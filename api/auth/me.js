import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../../server/models/User.js';

// MongoDB connection with proper waiting
let cachedConnection = null;

async function connectDB() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  try {
    // Close any stale connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    const opts = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    };

    cachedConnection = await mongoose.connect(process.env.MONGODB_URI, opts);
    console.log('✅ MongoDB connected');
    return cachedConnection;
  } catch (err) {
    console.error('❌ MongoDB error:', err);
    throw err;
  }
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      ...user.toObject(),
      id: user._id,
      _id: user._id
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
}
