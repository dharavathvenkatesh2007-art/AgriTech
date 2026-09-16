import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true,
  },
  cropName: {
    type: String,
    required: true,
  },
  variety: {
    type: String,
    default: '',
  },
  area: {
    type: Number,
    default: 0,
  },
  sowingDate: {
    type: Date,
    default: Date.now,
  },
  expectedHarvest: {
    type: Date,
  },
  actualHarvest: {
    type: Date,
  },
  yield: {
    type: Number,
  },
  profit: {
    type: Number,
  },
  active: {
    type: Boolean,
    default: true,
  },
  soilTest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SoilTest',
  },
}, {
  timestamps: true,
});

const Crop = mongoose.model('Crop', cropSchema);
export default Crop;
