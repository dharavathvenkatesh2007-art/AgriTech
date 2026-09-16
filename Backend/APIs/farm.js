import express from 'express';
import Farm from '../models/Farm.js';
import Field from '../models/Field.js';
import SensorData from '../models/SensorData.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all farms for the current user
// @route   GET /api/farms
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const filter = req.userRole === 'admin' ? {} : { owner: req.farmerId };
    const farms = await Farm.find(filter).populate('assignedExpert', 'name email').sort({ createdAt: -1 });
    res.json(farms);
  } catch (error) {
    console.error('Error fetching farms:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Create a new farm
// @route   POST /api/farms
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { farmName, totalAreaAcres, location, soilType, irrigationSource } = req.body;
    if (!farmName || !totalAreaAcres) {
      return res.status(400).json({ message: 'Farm name and total acreage are required' });
    }

    const farm = await Farm.create({
      owner: req.farmerId,
      farmName,
      totalAreaAcres,
      location: location || { state: 'Andhra Pradesh', district: '', village: '' },
      soilType: soilType || 'Red Sandy Loam',
      irrigationSource: irrigationSource || 'Borewell',
    });

    res.status(201).json(farm);
  } catch (error) {
    console.error('Error creating farm:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get fields for a farm or farmer
// @route   GET /api/fields
// @access  Private
router.get('/fields', protect, async (req, res) => {
  try {
    const { farmId } = req.query;
    let query = {};
    if (farmId) {
      query.farm = farmId;
    } else {
      const userFarms = await Farm.find({ owner: req.farmerId }).select('_id');
      const farmIds = userFarms.map(f => f._id);
      query.farm = { $in: farmIds };
    }

    const fields = await Field.find(query).populate('farm', 'farmName location').populate('currentCrop');
    res.json(fields);
  } catch (error) {
    console.error('Error fetching fields:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Create a new field in a farm
// @route   POST /api/fields
// @access  Private
router.post('/fields', protect, async (req, res) => {
  try {
    const { farmId, fieldName, areaAcres, currentCropId, iotSensorsAttached, irrigationZoneId } = req.body;
    if (!farmId || !fieldName || !areaAcres) {
      return res.status(400).json({ message: 'Farm ID, field name, and area in acres are required' });
    }

    const field = await Field.create({
      farm: farmId,
      fieldName,
      areaAcres,
      currentCrop: currentCropId || undefined,
      iotSensorsAttached: iotSensorsAttached || [{ sensorNodeId: `NODE-${Date.now().toString().slice(-4)}` }],
      irrigationZoneId: irrigationZoneId || 'Zone-A',
    });

    res.status(201).json(field);
  } catch (error) {
    console.error('Error creating field:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Post IoT telemetry for a field
// @route   POST /api/fields/:id/telemetry
// @access  Private
router.post('/fields/:id/telemetry', protect, async (req, res) => {
  try {
    const {
      sensorNodeId,
      soilMoisturePct,
      soilTemperatureC,
      ambientTemperatureC,
      ambientHumidityPct,
      soilNutrients,
      batteryVoltage,
    } = req.body;

    const sensorEntry = await SensorData.create({
      field: req.params.id,
      sensorNodeId: sensorNodeId || 'NODE-01',
      soilMoisturePct: soilMoisturePct !== undefined ? soilMoisturePct : 32.5,
      soilTemperatureC: soilTemperatureC !== undefined ? soilTemperatureC : 26.0,
      ambientTemperatureC: ambientTemperatureC !== undefined ? ambientTemperatureC : 30.5,
      ambientHumidityPct: ambientHumidityPct !== undefined ? ambientHumidityPct : 65.0,
      soilNutrients: soilNutrients || {
        nitrogen_mg_kg: 85,
        phosphorus_mg_kg: 40,
        potassium_mg_kg: 45,
        electricalConductivity_dS_m: 0.8,
        pH: 6.5,
      },
      batteryVoltage: batteryVoltage || 3.9,
    });

    res.status(201).json(sensorEntry);
  } catch (error) {
    console.error('Error posting telemetry:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get telemetry history for a field
// @route   GET /api/fields/:id/telemetry
// @access  Private
router.get('/fields/:id/telemetry', protect, async (req, res) => {
  try {
    const telemetry = await SensorData.find({ field: req.params.id })
      .sort({ timestamp: -1 })
      .limit(30);
    res.json(telemetry);
  } catch (error) {
    console.error('Error fetching telemetry:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
