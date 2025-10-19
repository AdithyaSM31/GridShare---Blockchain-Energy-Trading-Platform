import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../../server/models/User.js';

// MongoDB connection
let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB error:', err);
    throw err;
  }
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    await connectDB();

    // Register endpoint
    if (req.method === 'POST' && req.url.includes('/register')) {
      const { name, email, password, role, walletAddress, energyPreferences, location } = req.body;

      // Validate input
      if (!email || !password || !name) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }

      // Check if user exists
      let user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      user = new User({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role || 'consumer',
        walletAddress: walletAddress || `0x${Math.random().toString(16).substr(2, 40)}`,
        energyPreferences: energyPreferences || {},
        location: location || { address: '', coordinates: [0, 0] }
      });

      await user.save();

      // Create JWT token
      const payload = {
        user: {
          id: user._id,
          email: user.email,
          role: user.role
        }
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

      // Return user data without password
      const userResponse = {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress,
        energyPreferences: user.energyPreferences,
        location: user.location,
        createdAt: user.createdAt
      };

      return res.status(201).json({ token, user: userResponse });
    }

    // Login endpoint
    if (req.method === 'POST' && req.url.includes('/login')) {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Missing email or password' });
      }

      // Check if user exists
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Create JWT token
      const payload = {
        user: {
          id: user._id,
          email: user.email,
          role: user.role
        }
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

      // Return user data without password
      const userResponse = {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress,
        energyPreferences: user.energyPreferences,
        location: user.location,
        createdAt: user.createdAt
      };

      return res.json({ token, user: userResponse });
    }

    // Get current user endpoint
    if (req.method === 'GET' && req.url.includes('/me')) {
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
    }

    return res.status(404).json({ message: 'Endpoint not found' });
  } catch (error) {
    console.error('Auth API error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}
