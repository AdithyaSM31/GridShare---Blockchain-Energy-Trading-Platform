import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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

async function getBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  
  // Handle string body
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch (e) {
      return {};
    }
  }
  
  // Handle buffer or stream (shouldn't happen in Vercel but just in case)
  return {};
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const body = await getBody(req);
    const { name, email, password, role, walletAddress, energyPreferences, location } = body;

    console.log('Register request body:', { name, email, hasPassword: !!password, role });

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
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}
