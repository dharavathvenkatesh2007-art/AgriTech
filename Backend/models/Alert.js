import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true,
  },
  field: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Field',
  },
  crop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop',
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Disease', 'Pest', 'Irrigation', 'Weather', 'Nutrient', 'System'],
    default: 'System',
  },
  severity: {
    type: String,
    enum: ['Info', 'Warning', 'Critical'],
    default: 'Info',
  },
  actionableRecommendation: {
    type: String,
    default: '',
  },
  isRead: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Alert = mongoose.model('Alert', alertSchema);
export default Alert;
