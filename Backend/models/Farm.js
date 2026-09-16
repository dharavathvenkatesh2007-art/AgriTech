import mongoose from 'mongoose';

const farmSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true,
  },
  farmName: {
    type: String,
    required: true,
    trim: true,
  },
  totalAreaAcres: {
    type: Number,
    required: true,
    min: 0,
  },
  location: {
    state: { type: String, required: true },
    district: { type: String, required: true },
    mandalOrTehsil: { type: String, default: '' },
    village: { type: String, default: '' },
    coordinates: {
      latitude: { type: Number, default: 0 },
      longitude: { type: Number, default: 0 },
    },
  },
  soilType: {
    type: String,
    enum: ['Black Cotton', 'Red Sandy Loam', 'Clayey', 'Alluvial', 'Laterite', 'Loamy', 'Unknown'],
    default: 'Red Sandy Loam',
  },
  irrigationSource: {
    type: String,
    enum: ['Borewell', 'Canal', 'Drip System', 'Rainfed', 'Sprinkler', 'Mixed'],
    default: 'Borewell',
  },
  assignedExpert: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

const Farm = mongoose.model('Farm', farmSchema);
export default Farm;
