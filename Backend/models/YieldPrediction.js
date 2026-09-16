import mongoose from 'mongoose';

const yieldPredictionSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true,
  },
  crop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop',
    required: true,
  },
  field: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Field',
  },
  predictionDate: {
    type: Date,
    default: Date.now,
  },
  predictedYieldPerAcre: {
    type: Number,
    required: true,
  },
  totalPredictedYield: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    default: 'quintals/acre',
  },
  yieldRange: {
    min: { type: Number },
    expected: { type: Number },
    max: { type: Number },
  },
  confidenceScore: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  contributingFactors: {
    soilNutrientScore: { type: Number },
    thermalSuitability: { type: Number },
    moistureAdequacy: { type: Number },
    canopyVigorNdvi: { type: Number },
  },
  modelName: {
    type: String,
    default: 'RandomForest_CropYield_v1',
  },
}, {
  timestamps: true,
});

const YieldPrediction = mongoose.model('YieldPrediction', yieldPredictionSchema);
export default YieldPrediction;
