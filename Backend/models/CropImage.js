import mongoose from 'mongoose';

const cropImageSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true,
  },
  crop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop',
  },
  field: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Field',
  },
  imageUrl: {
    type: String,
    required: true,
  },
  imageType: {
    type: String,
    enum: ['Leaf', 'Canopy', 'Fruit', 'Soil', 'Drone/Aerial', 'Satellite'],
    default: 'Leaf',
  },
  captureDevice: {
    type: String,
    default: 'Mobile Camera',
  },
  metadata: {
    resolution: { type: String, default: '' },
    fileSizeBytes: { type: Number, default: 0 },
    gpsCoordinates: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
  },
}, {
  timestamps: true,
});

const CropImage = mongoose.model('CropImage', cropImageSchema);
export default CropImage;
