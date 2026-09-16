import express from 'express';
import Advisory from '../models/Advisory.js';
import Crop from '../models/Crop.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    List all advisories for a crop
// @route   GET /api/advisories/crop/:cropId
// @access  Private
router.get('/crop/:cropId', protect, async (req, res) => {
  try {
    const crop = await Crop.findOne({ _id: req.params.cropId, farmer: req.farmerId });
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    const advisories = await Advisory.find({ crop: crop._id }).sort({ dayNumber: 1 });
    res.json(advisories);
  } catch (error) {
    console.error('Error fetching advisories:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get today's advisory for a crop (with manual day override for testing)
// @route   GET /api/advisories/crop/:cropId/today
// @access  Private
router.get('/crop/:cropId/today', protect, async (req, res) => {
  try {
    const crop = await Crop.findOne({ _id: req.params.cropId, farmer: req.farmerId });
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }

    // Calculate current day number since sowing
    let currentDayNum;
    if (req.query.day !== undefined) {
      currentDayNum = parseInt(req.query.day, 10);
    } else {
      const sowing = new Date(crop.sowingDate);
      const today = new Date();
      const diffTime = today - sowing;
      currentDayNum = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (currentDayNum < 0) currentDayNum = 0;
    }

    // Find the most recent advisory that is due (dayNumber <= currentDayNum)
    const advisory = await Advisory.findOne({
      crop: crop._id,
      dayNumber: { $lte: currentDayNum }
    }).sort({ dayNumber: -1 });

    if (!advisory) {
      return res.status(404).json({ message: 'No advisory available for this stage of the crop yet.' });
    }

    // If it's pending, mark it as delivered
    if (advisory.status === 'pending') {
      advisory.status = 'delivered';
      advisory.deliveredDate = new Date();
      await advisory.save();
    }

    res.json({
      currentDay: currentDayNum,
      advisory
    });
  } catch (error) {
    console.error('Error fetching today\'s advisory:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Mark advisory as listened
// @route   PUT /api/advisories/:id/listen
// @access  Private
router.put('/:id/listen', protect, async (req, res) => {
  try {
    const advisory = await Advisory.findOne({ _id: req.params.id, farmer: req.farmerId });

    if (advisory) {
      advisory.status = 'listened';
      advisory.listenedDate = new Date();
      if (!advisory.deliveredDate) {
        advisory.deliveredDate = new Date();
      }
      const updatedAdvisory = await advisory.save();
      res.json(updatedAdvisory);
    } else {
      res.status(404).json({ message: 'Advisory not found' });
    }
  } catch (error) {
    console.error('Error marking advisory as listened:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
