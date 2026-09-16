import mongoose from 'mongoose';

const irrigationRecommendationSchema = new mongoose.Schema({
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
  },
  irrigationNeeded: {
    type: Boolean,
    required: true,
  },
  urgency: {
    type: String,
    enum: ['Adequate', 'Within 24 hours', 'Immediate (Severe Soil Deficit)'],
    default: 'Adequate',
  },
  metrics: {
    currentSoilMoisturePct: { type: Number, required: true },
    fieldCapacityPct: { type: Number, default: 45 },
    wiltingPointPct: { type: Number, default: 18 },
    et0ReferenceMmDay: { type: Number },
    etcCropMmDay: { type: Number },
    cropCoefficientKc: { type: Number },
    forecastedRainMm: { type: Number, default: 0 },
  },
  waterDepthMm: {
    type: Number,
    default: 0,
  },
  recommendedLitersPerAcre: {
    type: Number,
    default: 0,
  },
  optimalTimeWindow: {
    type: String,
    default: 'Early morning (05:30 - 08:30 AM) or late evening (05:30 - 07:30 PM)',
  },
  waterSavingAnalytics: {
    traditionalFloodLiters: { type: Number, default: 0 },
    precisionIrrigationLiters: { type: Number, default: 0 },
    litersSaved: { type: Number, default: 0 },
    estimatedReductionPct: { type: Number, default: 30 },
  },
  executedStatus: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed', 'Skipped'],
    default: 'Scheduled',
  },
}, {
  timestamps: true,
});

const IrrigationRecommendation = mongoose.model('IrrigationRecommendation', irrigationRecommendationSchema);
export default IrrigationRecommendation;
