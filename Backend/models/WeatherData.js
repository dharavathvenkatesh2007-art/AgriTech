import mongoose from 'mongoose';

const weatherDataSchema = new mongoose.Schema({
  location: {
    state: { type: String, required: true },
    district: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, default: 0 },
      longitude: { type: Number, default: 0 },
    },
  },
  forecastDate: {
    type: Date,
    required: true,
    index: true,
  },
  temperatureC: {
    min: { type: Number },
    max: { type: Number },
    current: { type: Number },
  },
  humidityPct: {
    type: Number,
  },
  precipitationMm: {
    type: Number,
    default: 0,
  },
  popPct: {
    type: Number,
    default: 0,
  },
  windSpeedKph: {
    type: Number,
    default: 0,
  },
  solarRadiationMjM2: {
    type: Number,
    default: 20,
  },
  conditionSummary: {
    type: String,
    default: 'Sunny',
  },
  agrometAdvisory: {
    type: String,
    default: '',
  }
}, {
  timestamps: true,
});

const WeatherData = mongoose.model('WeatherData', weatherDataSchema);
export default WeatherData;
