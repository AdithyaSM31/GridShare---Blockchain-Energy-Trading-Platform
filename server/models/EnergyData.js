import mongoose from 'mongoose';

const energyDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  },
  production: {
    type: Number,
    default: 0
  },
  consumption: {
    type: Number,
    default: 0
  },
  gridImport: {
    type: Number,
    default: 0
  },
  gridExport: {
    type: Number,
    default: 0
  },
  batteryLevel: {
    type: Number,
    default: 50
  }
});

energyDataSchema.index({ userId: 1, timestamp: -1 });

export default mongoose.model('EnergyData', energyDataSchema);
