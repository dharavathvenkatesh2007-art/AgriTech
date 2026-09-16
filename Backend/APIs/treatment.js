import express from 'express';
import TreatmentHistory from '../models/TreatmentHistory.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all chemical and biological treatment records for traceability
// @route   GET /api/treatments
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const filter = req.userRole === 'admin' ? {} : { farmer: req.farmerId };
    const treatments = await TreatmentHistory.find(filter)
      .populate('field', 'fieldName')
      .populate('crop', 'cropName variety')
      .sort({ applicationDate: -1 });
    res.json(treatments);
  } catch (error) {
    console.error('Error fetching treatment history:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Log a new targeted pesticide/fertilizer application
// @route   POST /api/treatments
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      fieldId,
      cropId,
      treatmentType,
      productName,
      targetPestOrDisease,
      dosageApplied,
      applicationMethod,
      treatedAreaAcres,
      weatherConditionsAtSpraying,
      preHarvestIntervalDays,
      notes,
    } = req.body;

    if (!fieldId || !cropId || !productName) {
      return res.status(400).json({ message: 'Field, crop, and product name are required' });
    }

    const treatment = await TreatmentHistory.create({
      farmer: req.farmerId,
      field: fieldId,
      crop: cropId,
      treatmentType: treatmentType || 'Pesticide',
      productName,
      targetPestOrDisease: targetPestOrDisease || '',
      dosageApplied: dosageApplied || { amount: 2, unit: 'mL/L' },
      applicationMethod: applicationMethod || 'Targeted Spot Spray',
      treatedAreaAcres: treatedAreaAcres || 1.0,
      weatherConditionsAtSpraying: weatherConditionsAtSpraying || { temperatureC: 28, windSpeedKph: 5 },
      preHarvestIntervalDays: preHarvestIntervalDays || 14,
      notes: notes || '',
    });

    res.status(201).json(treatment);
  } catch (error) {
    console.error('Error logging treatment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
