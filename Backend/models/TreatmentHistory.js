import mongoose from 'mongoose';

const treatmentHistorySchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true,
  },
  field: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Field',
    required: true,
  },
  crop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop',
    required: true,
  },
  treatmentType: {
    type: String,
    enum: ['Pesticide', 'Fungicide', 'Herbicide', 'Fertilizer', 'Biocontrol', 'Foliar Spray'],
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  targetPestOrDisease: {
    type: String,
    default: '',
  },
  dosageApplied: {
    amount: { type: Number, required: true },
    unit: { type: String, default: 'mL/L' },
  },
  applicationMethod: {
    type: String,
    enum: ['Targeted Spot Spray', 'Knapsack Foliar', 'Drip Fertigation', 'Broadcast', 'Drone Spray'],
    default: 'Targeted Spot Spray',
  },
  treatedAreaAcres: {
    type: Number,
    required: true,
  },
  weatherConditionsAtSpraying: {
    temperatureC: { type: Number },
    windSpeedKph: { type: Number },
  },
  preHarvestIntervalDays: {
    type: Number,
    default: 14,
  },
  applicationDate: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const TreatmentHistory = mongoose.model('TreatmentHistory', treatmentHistorySchema);
export default TreatmentHistory;
