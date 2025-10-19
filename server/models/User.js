import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['consumer', 'prosumer', 'both'],
    default: 'consumer'
  },
  walletAddress: {
    type: String,
    required: true
  },
  energyPreferences: {
    maxPrice: {
      type: Number,
      default: 0.20
    },
    preferRenewable: {
      type: Boolean,
      default: true
    },
    autoTrade: {
      type: Boolean,
      default: false
    }
  },
  location: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', userSchema);
