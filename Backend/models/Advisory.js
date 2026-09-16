import mongoose from 'mongoose';

const advisorySchema = new mongoose.Schema({
  crop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop',
    required: true,
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true,
  },
  dayNumber: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['sowing', 'fertilizer', 'pesticide', 'irrigation', 'weather', 'disease', 'harvest', 'market'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  messages: {
    Telugu: { type: String, default: '' },
    Hindi: { type: String, default: '' },
    English: { type: String, default: '' },
  },
  audioUrl: {
    Telugu: { type: String, default: '' },
    Hindi: { type: String, default: '' },
    English: { type: String, default: '' },
  },
  status: {
    type: String,
    enum: ['pending', 'delivered', 'listened'],
    default: 'pending',
  },
  deliveredDate: {
    type: Date,
  },
  listenedDate: {
    type: Date,
  },
}, {
  timestamps: true,
});

const Advisory = mongoose.model('Advisory', advisorySchema);
export default Advisory;
