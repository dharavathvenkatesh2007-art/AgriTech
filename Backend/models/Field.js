import mongoose from 'mongoose';

const fieldSchema = new mongoose.Schema({
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true,
  },
  fieldName: {
    type: String,
    required: true,
    trim: true,
  },
  areaAcres: {
    type: Number,
    required: true,
    min: 0,
  },
  currentCrop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop',
  },
  iotSensorsAttached: [{
    sensorNodeId: { type: String, required: true },
    sensorType: {
      type: String,
      enum: ['SoilMoisture', 'NPK_Probe', 'WeatherStation', 'Combined'],
      default: 'Combined'
    },
    installedDepthCm: { type: Number, default: 15 },
    active: { type: Boolean, default: true }
  }],
  irrigationZoneId: {
    type: String,
    default: 'Zone-A',
  },
}, {
  timestamps: true,
});

const Field = mongoose.model('Field', fieldSchema);
export default Field;
