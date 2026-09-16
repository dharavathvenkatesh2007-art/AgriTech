import express from 'express';
import Alert from '../models/Alert.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get alerts for current user
// @route   GET /api/alerts
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const filter = req.userRole === 'admin' ? {} : { farmer: req.farmerId };
    const alerts = await Alert.find(filter)
      .populate('field', 'fieldName')
      .populate('crop', 'cropName')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(alerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Mark alert as read
// @route   PUT /api/alerts/:id/read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    alert.isRead = true;
    await alert.save();
    res.json({ message: 'Alert marked as read', alert });
  } catch (error) {
    console.error('Error updating alert:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Create an alert manually or from sensor triggers
// @route   POST /api/alerts
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { fieldId, cropId, title, message, category, severity, actionableRecommendation } = req.body;
    const alert = await Alert.create({
      farmer: req.farmerId,
      field: fieldId || undefined,
      crop: cropId || undefined,
      title,
      message,
      category: category || 'System',
      severity: severity || 'Info',
      actionableRecommendation: actionableRecommendation || '',
    });
    res.status(201).json(alert);
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
