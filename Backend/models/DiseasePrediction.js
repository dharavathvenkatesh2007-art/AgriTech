import mongoose from 'mongoose';

const diseasePredictionSchema = new mongoose.Schema({
  cropImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CropImage',
    required: true,
  },
  crop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop',
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true,
  },
  detectedCrop: {
    type: String,
    default: 'Unknown',
  },
  detectedDisease: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['DISEASE', 'PEST', 'INSECT_DAMAGE', 'HEALTHY', 'UNCERTAIN'],
    default: 'DISEASE',
  },
  confidenceScore: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  confidenceLevel: {
    type: String,
    enum: ['HIGH', 'MODERATE', 'LOW', 'VERY_LOW'],
    default: 'MODERATE',
  },
  severity: {
    type: String,
    enum: ['None', 'Mild', 'Moderate', 'Severe', 'Critical'],
    default: 'Mild',
  },
  affectedSurfaceAreaPct: {
    type: Number,
    default: 0,
  },
  treatmentRecommendation: {
    type: String,
    required: true,
  },
  expertValidationStatus: {
    type: String,
    enum: ['Pending', 'Validated', 'Corrected', 'Rejected'],
    default: 'Pending',
  },
  validatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  expertFeedbackNotes: {
    type: String,
    default: '',
  },
  expertDisclaimer: {
    type: String,
    default: 'AI recommendations should be validated by an agricultural expert for high-stakes decisions.',
  },
}, {
  timestamps: true,
});

const DiseasePrediction = mongoose.model('DiseasePrediction', diseasePredictionSchema);
export default DiseasePrediction;
