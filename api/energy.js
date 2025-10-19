import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// MongoDB connection
let cachedConnection = null;

async function connectDB() {
  if (cachedConnection) {
    return cachedConnection;
  }

  const connection = await mongoose.connect(process.env.MONGODB_URI, {
    bufferCommands: false,
  });

  cachedConnection = connection;
  return connection;
}

// Listing Schema
const ListingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  prosumerName: { type: String, required: true },
  energyAmount: { type: Number, required: true },
  pricePerKwh: { type: Number, required: true },
  energySource: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, default: 'available' },
  availableFrom: { type: Date, default: Date.now },
  availableUntil: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
}, { bufferCommands: false });

// Transaction Schema
const TransactionSchema = new mongoose.Schema({
  buyerId: { type: String, required: true },
  sellerId: { type: String, required: true },
  listingId: { type: String, required: true },
  energyAmount: { type: Number, required: true },
  pricePerKwh: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  energySource: { type: String, required: true },
  status: { type: String, default: 'confirmed' },
  timestamp: { type: Date, default: Date.now },
}, { bufferCommands: false });

// Energy Data Schema
const EnergyDataSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  production: { type: Number, default: 0 },
  consumption: { type: Number, default: 0 },
  gridImport: { type: Number, default: 0 },
  gridExport: { type: Number, default: 0 },
  batteryLevel: { type: Number, default: 50 },
}, { bufferCommands: false });

const Listing = mongoose.models.Listing || mongoose.model('Listing', ListingSchema);
const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
const EnergyData = mongoose.models.EnergyData || mongoose.model('EnergyData', EnergyDataSchema);

// Verify JWT token and extract user info
function verifyToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.substring(7);
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
  // The JWT payload structure is { user: { id, email, role } }
  // Return the user object with normalized field names
  return {
    userId: decoded.user.id,
    email: decoded.user.email,
    role: decoded.user.role
  };
}

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    return res.status(200).end();
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    await connectDB();

    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    const path = pathname.replace('/api/energy', '');

    // GET /listings - Get all available listings
    if (path === '/listings' && req.method === 'GET') {
      const listings = await Listing.find({ status: 'available' }).sort({ createdAt: -1 });
      return res.status(200).json(listings);
    }

    // POST /listings - Create a new listing (requires auth)
    if (path === '/listings' && req.method === 'POST') {
      const userAuth = verifyToken(req);
      
      // Import User model to get user details
      const UserModel = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
        name: String,
        email: String,
        location: { address: String }
      }));
      
      const userDoc = await UserModel.findById(userAuth.userId);
      if (!userDoc) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const { energyAmount, pricePerKwh, energySource, availableFrom, availableUntil, location } = req.body;
      
      console.log('Creating listing with userId:', userAuth.userId);
      
      const listing = await Listing.create({
        userId: userAuth.userId,
        prosumerName: userDoc.name || userAuth.email || 'Anonymous',
        energyAmount,
        pricePerKwh,
        energySource,
        location: location || userDoc.location?.address || 'Unknown',
        availableFrom: availableFrom || new Date(),
        availableUntil: new Date(availableUntil),
        status: 'available',
      });

      return res.status(201).json(listing);
    }

    // GET /transactions - Get user's transactions (requires auth)
    if (path === '/transactions' && req.method === 'GET') {
      const user = verifyToken(req);
      
      const transactions = await Transaction.find({
        $or: [{ buyerId: user.userId }, { sellerId: user.userId }]
      }).sort({ timestamp: -1 });

      return res.status(200).json(transactions);
    }

    // POST /purchase/:listingId - Purchase energy (requires auth)
    if (path.startsWith('/purchase/') && req.method === 'POST') {
      const user = verifyToken(req);
      const listingId = path.split('/')[2];
      const { amount } = req.body;

      const listing = await Listing.findById(listingId);
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }

      if (listing.status !== 'available') {
        return res.status(400).json({ message: 'Listing not available' });
      }

      if (amount > listing.energyAmount) {
        return res.status(400).json({ message: 'Not enough energy available' });
      }

      // Create transaction
      const transaction = await Transaction.create({
        buyerId: user.userId,
        sellerId: listing.userId,
        listingId: listing._id.toString(),
        energyAmount: amount,
        pricePerKwh: listing.pricePerKwh,
        totalPrice: amount * listing.pricePerKwh,
        energySource: listing.energySource,
        status: 'confirmed',
      });

      // Update listing
      listing.energyAmount -= amount;
      if (listing.energyAmount <= 0) {
        listing.status = 'sold';
      }
      await listing.save();

      return res.status(200).json({ transaction, listing });
    }

    // GET /energy-data - Get energy data for user (requires auth)
    if (path === '/energy-data' && req.method === 'GET') {
      const user = verifyToken(req);
      const days = parseInt(req.query?.days || '7');
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const energyData = await EnergyData.find({
        userId: user.userId,
        timestamp: { $gte: startDate }
      }).sort({ timestamp: 1 });

      return res.status(200).json(energyData);
    }

    // POST /energy-data - Add energy data (requires auth)
    if (path === '/energy-data' && req.method === 'POST') {
      const user = verifyToken(req);
      
      const { production, consumption, gridImport, gridExport, batteryLevel } = req.body;
      
      const energyData = await EnergyData.create({
        userId: user.userId,
        production,
        consumption,
        gridImport,
        gridExport,
        batteryLevel,
      });

      return res.status(201).json(energyData);
    }

    return res.status(404).json({ message: 'Endpoint not found' });

  } catch (error) {
    console.error('Energy API error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
}
