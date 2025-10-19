// Vercel Serverless Function Entry Point
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from '../server/routes/auth.js';
import energyRoutes from '../server/routes/energy.js';
import energyDataRoutes from '../server/routes/energyData.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB connection (will be reused across invocations)
let isConnected = false;

async function connectDB() {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    throw err;
  }
}

// Routes - mounted at /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/energy', energyRoutes);
app.use('/api/energy-data', energyDataRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'GridShare API is running' });
});

// Root API endpoint
app.get('/api', (req, res) => {
  res.json({ 
    message: 'GridShare API',
    endpoints: ['/api/auth', '/api/energy', '/api/energy-data']
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Vercel serverless function handler
export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}
