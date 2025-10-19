import express from 'express';
import jwt from 'jsonwebtoken';
import EnergyListing from '../models/EnergyListing.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

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

// Get all available listings
router.get('/listings', async (req, res) => {
  try {
    const listings = await EnergyListing.find({ 
      status: 'available',
      availableUntil: { $gt: new Date() }
    }).sort({ createdAt: -1 });
    
    res.json(listings);
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new listing
router.post('/listings', auth, async (req, res) => {
  try {
    const { energyAmount, pricePerKwh, energySource, availableFrom, availableUntil, location } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const listing = new EnergyListing({
      prosumerId: user._id,
      prosumerName: user.name,
      energyAmount,
      pricePerKwh: Math.round(pricePerKwh * 1000) / 1000,
      energySource,
      availableFrom: availableFrom || new Date(),
      availableUntil,
      location: location || user.location.address,
      status: 'available'
    });

    await listing.save();
    res.status(201).json(listing);
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Purchase energy from a listing
router.post('/purchase/:listingId', auth, async (req, res) => {
  try {
    const { listingId } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const listing = await EnergyListing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.status !== 'available') {
      return res.status(400).json({ message: 'Listing is not available' });
    }

    if (amount > listing.energyAmount) {
      return res.status(400).json({ message: 'Requested amount exceeds available energy' });
    }

    const buyer = await User.findById(req.user.id);
    if (!buyer) {
      return res.status(404).json({ message: 'Buyer not found' });
    }

    // Create transaction
    const totalAmount = Math.round(listing.pricePerKwh * amount * 100) / 100;
    const transaction = new Transaction({
      buyerId: buyer._id,
      sellerId: listing.prosumerId,
      buyerName: buyer.name,
      sellerName: listing.prosumerName,
      energyAmount: amount,
      pricePerKwh: listing.pricePerKwh,
      totalAmount,
      transactionHash: Math.random().toString(16).slice(2),
      blockNumber: 1000 + Math.floor(Math.random() * 10000),
      status: 'confirmed',
      energySource: listing.energySource
    });

    await transaction.save();

    // Update listing
    listing.energyAmount = Math.round((listing.energyAmount - amount) * 1000) / 1000;
    if (listing.energyAmount <= 0) {
      listing.status = 'sold';
    }
    await listing.save();

    res.json({ transaction, listing });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's transactions
router.get('/transactions', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [
        { buyerId: req.user.id },
        { sellerId: req.user.id }
      ]
    }).sort({ timestamp: -1 });

    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all transactions (for analytics)
router.get('/transactions/all', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ timestamp: -1 }).limit(100);
    res.json(transactions);
  } catch (error) {
    console.error('Get all transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
