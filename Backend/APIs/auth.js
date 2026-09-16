import express from 'express';
import Farmer from '../models/Farmer.js';
import { protect } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretagritechkey123', {
    expiresIn: '30d',
  });
};

// @desc    Register a new farmer
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  const { name, phone, password, location, landArea, preferredLanguage } = req.body;

  if (!name || !phone || !password) {
    return res.status(400).json({ message: 'Please provide name, phone, and password' });
  }

  try {
    const farmerExists = await Farmer.findOne({ phone });

    if (farmerExists) {
      return res.status(400).json({ message: 'Farmer already registered with this phone number' });
    }

    const farmer = await Farmer.create({
      name,
      phone,
      password,
      location: location || { state: '', district: '', village: '' },
      landArea: landArea || 0,
      preferredLanguage: preferredLanguage || 'Telugu',
    });

    if (farmer) {
      res.status(201).json({
        _id: farmer._id,
        name: farmer.name,
        phone: farmer.phone,
        location: farmer.location,
        landArea: farmer.landArea,
        preferredLanguage: farmer.preferredLanguage,
        token: generateToken(farmer._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid farmer data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Auth farmer & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ message: 'Please provide phone and password' });
  }

  try {
    const farmer = await Farmer.findOne({ phone });

    if (farmer && (await farmer.matchPassword(password))) {
      res.json({
        _id: farmer._id,
        name: farmer.name,
        phone: farmer.phone,
        location: farmer.location,
        landArea: farmer.landArea,
        preferredLanguage: farmer.preferredLanguage,
        token: generateToken(farmer._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid phone or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get current farmer profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.farmerId).select('-password');
    if (farmer) {
      res.json(farmer);
    } else {
      res.status(404).json({ message: 'Farmer not found' });
    }
  } catch (error) {
    console.error('Error fetching current farmer:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
