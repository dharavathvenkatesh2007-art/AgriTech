import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const farmerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    state: { type: String, default: '' },
    district: { type: String, default: '' },
    village: { type: String, default: '' },
  },
  landArea: {
    type: Number,
    default: 0,
  },
  preferredLanguage: {
    type: String,
    enum: ['Telugu', 'Hindi', 'English'],
    default: 'Telugu',
  },
}, {
  timestamps: true,
});

// Hash password before saving
farmerSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
farmerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Farmer = mongoose.model('Farmer', farmerSchema);
export default Farmer;
