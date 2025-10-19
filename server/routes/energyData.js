import express from 'express';
import jwt from 'jsonwebtoken';
import EnergyData from '../models/EnergyData.js';

const router = express.Router();

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get energy data for user
router.get('/', auth, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    const energyData = await EnergyData.find({
      userId: req.user.id,
      timestamp: { $gte: daysAgo }
    }).sort({ timestamp: 1 });

    res.json(energyData);
  } catch (error) {
    console.error('Get energy data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create energy data (for simulation/testing)
router.post('/', auth, async (req, res) => {
  try {
    const { production, consumption, gridImport, gridExport, batteryLevel, timestamp } = req.body;

    const energyData = new EnergyData({
      userId: req.user.id,
      timestamp: timestamp || new Date(),
      production: production || 0,
      consumption: consumption || 0,
      gridImport: gridImport || 0,
      gridExport: gridExport || 0,
      batteryLevel: batteryLevel || 50
    });

    await energyData.save();
    res.status(201).json(energyData);
  } catch (error) {
    console.error('Create energy data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
