import mongoose from 'mongoose';

const energyListingSchema = new mongoose.Schema({
  prosumerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  prosumerName: {
    type: String,
    required: true
  },
  energyAmount: {
    type: Number,
    required: true,
    min: 0
  },
  pricePerKwh: {
    type: Number,
    required: true,
    min: 0
  },
  availableFrom: {
    type: Date,
    required: true
  },
  availableUntil: {
    type: Date,
    required: true
  },
  energySource: {
    type: String,
    enum: ['solar', 'wind', 'hydro', 'mixed'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'expired'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('EnergyListing', energyListingSchema);
