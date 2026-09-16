import mongoose from 'mongoose';

const soilTestSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true,
  },
  N: {
    type: Number,
    required: true,
  },
  P: {
    type: Number,
    required: true,
  },
  K: {
    type: Number,
    required: true,
  },
  pH: {
    type: Number,
    required: true,
  },
  soilType: {
    type: String,
    default: '',
  },
  testDate: {
    type: Date,
    default: Date.now,
  },
  labName: {
    type: String,
    default: '',
  },
  reportUrl: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const SoilTest = mongoose.model('SoilTest', soilTestSchema);
export default SoilTest;
