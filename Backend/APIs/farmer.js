import express from 'express';
import Farmer from '../models/Farmer.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get current farmer profile
// @route   GET /api/farmer/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.farmerId).select('-password');
    if (farmer) {
      res.json(farmer);
    } else {
      res.status(404).json({ message: 'Farmer not found' });
    }
  } catch (error) {
    console.error('Error fetching farmer profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Update farmer profile
// @route   PUT /api/farmer/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.farmerId);

    if (farmer) {
      farmer.name = req.body.name || farmer.name;
      
      if (req.body.location) {
        farmer.location = {
          state: req.body.location.state !== undefined ? req.body.location.state : farmer.location.state,
          district: req.body.location.district !== undefined ? req.body.location.district : farmer.location.district,
          village: req.body.location.village !== undefined ? req.body.location.village : farmer.location.village,
        };
      }
      
      farmer.landArea = req.body.landArea !== undefined ? req.body.landArea : farmer.landArea;
      farmer.preferredLanguage = req.body.preferredLanguage || farmer.preferredLanguage;

      if (req.body.password) {
        farmer.password = req.body.password;
      }

      const updatedFarmer = await farmer.save();

      res.json({
        _id: updatedFarmer._id,
        name: updatedFarmer.name,
        phone: updatedFarmer.phone,
        location: updatedFarmer.location,
        landArea: updatedFarmer.landArea,
        preferredLanguage: updatedFarmer.preferredLanguage,
      });
    } else {
      res.status(404).json({ message: 'Farmer not found' });
    }
  } catch (error) {
    console.error('Error updating farmer profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
