import express from 'express';
import SoilTest from '../models/SoilTest.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Create a new soil test
// @route   POST /api/soil-tests
// @access  Private
router.post('/', protect, async (req, res) => {
  const { N, P, K, pH, soilType, labName, reportUrl, testDate } = req.body;

  if (N === undefined || P === undefined || K === undefined || pH === undefined) {
    return res.status(400).json({ message: 'Please provide N, P, K, and pH values' });
  }

  try {
    const soilTest = await SoilTest.create({
      farmer: req.farmerId,
      N,
      P,
      K,
      pH,
      soilType: soilType || '',
      labName: labName || '',
      reportUrl: reportUrl || '',
      testDate: testDate || Date.now(),
    });

    res.status(201).json(soilTest);
  } catch (error) {
    console.error('Error creating soil test:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get latest soil test for farmer
// @route   GET /api/soil-tests/latest
// @access  Private
router.get('/latest', protect, async (req, res) => {
  try {
    const soilTest = await SoilTest.findOne({ farmer: req.farmerId })
      .sort({ testDate: -1, createdAt: -1 });

    if (soilTest) {
      res.json(soilTest);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error('Error fetching latest soil test:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
