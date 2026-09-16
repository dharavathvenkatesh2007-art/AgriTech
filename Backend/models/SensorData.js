import mongoose from 'mongoose';

const sensorDataSchema = new mongoose.Schema({
  field: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Field',
    required: true,
  },
  sensorNodeId: {
    type: String,
    required: true,
    index: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  soilMoisturePct: {
    type: Number,
    required: true,
  },
  soilTemperatureC: {
    type: Number,
    required: true,
  },
  ambientTemperatureC: {
    type: Number,
  },
  ambientHumidityPct: {
    type: Number,
  },
  soilNutrients: {
    nitrogen_mg_kg: { type: Number, default: 0 },
    phosphorus_mg_kg: { type: Number, default: 0 },
    potassium_mg_kg: { type: Number, default: 0 },
    electricalConductivity_dS_m: { type: Number, default: 0 },
    pH: { type: Number, default: 6.5 },
  },
  batteryVoltage: {
    type: Number,
    default: 3.7,
  },
  signalQualityDbm: {
    type: Number,
    default: -75,
  }
}, {
  timestamps: true,
});

sensorDataSchema.index({ field: 1, timestamp: -1 });

const SensorData = mongoose.model('SensorData', sensorDataSchema);
export default SensorData;
