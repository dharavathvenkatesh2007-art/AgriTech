import express from 'express';
import Crop from '../models/Crop.js';
import Advisory from '../models/Advisory.js';
import SoilTest from '../models/SoilTest.js';
import { protect } from '../middleware/auth.js';
import advisoryTemplates from '../config/advisoryTemplates.js';
import Farmer from '../models/Farmer.js';
import { synthesizeSpeech } from '../services/voiceService.js';

const router = express.Router();

// @desc    Register a new crop & pre-generate advisories
// @route   POST /api/crops
// @access  Private
router.post('/', protect, async (req, res) => {
  const { cropName, variety, area, sowingDate, soilTestId } = req.body;

  if (!cropName) {
    return res.status(400).json({ message: 'Crop name is required' });
  }

  try {
    // 1. Verify soil test if provided
    let linkedSoilTest = null;
    if (soilTestId) {
      linkedSoilTest = await SoilTest.findOne({ _id: soilTestId, farmer: req.farmerId });
      if (!linkedSoilTest) {
        return res.status(404).json({ message: 'Soil test not found' });
      }
    }

    // 2. Compute expected harvest date if we want (e.g., Paddy takes about 110 days, Cotton 120, Maize 100)
    let durationDays = 110;
    const nameLower = cropName.trim().toLowerCase();
    if (nameLower === 'cotton') durationDays = 120;
    else if (nameLower === 'maize') durationDays = 100;
    else if (nameLower === 'paddy') durationDays = 110;

    const sowDate = sowingDate ? new Date(sowingDate) : new Date();
    const expectedHarvest = new Date(sowDate);
    expectedHarvest.setDate(expectedHarvest.getDate() + durationDays);

    // 3. Create crop
    const crop = await Crop.create({
      farmer: req.farmerId,
      cropName,
      variety: variety || '',
      area: area || 0,
      sowingDate: sowDate,
      expectedHarvest,
      soilTest: linkedSoilTest ? linkedSoilTest._id : undefined,
    });

    // 4. Pre-generate advisories from template
    let templateKey = 'Paddy';
    if (nameLower === 'cotton') {
      templateKey = 'Cotton';
    } else if (nameLower === 'maize') {
      templateKey = 'Maize';
    } else {
      templateKey = 'Paddy'; // default to Paddy template
    }

    const templates = advisoryTemplates[templateKey] || [];
    
    // Fetch farmer to get preferred language for audio pre-generation
    const farmer = await Farmer.findById(req.farmerId);
    const preferredLanguage = farmer ? farmer.preferredLanguage || 'Telugu' : 'Telugu';

    const advisoriesToCreate = await Promise.all(
      templates.map(async (template) => {
        const message = template.messages[preferredLanguage] || template.messages['English'];
        let generatedAudioUrl = '';
        try {
          generatedAudioUrl = await synthesizeSpeech(message, preferredLanguage);
        } catch (err) {
          console.error(`Failed to pre-generate audio for day ${template.dayNumber}:`, err);
        }

        return {
          crop: crop._id,
          farmer: req.farmerId,
          dayNumber: template.dayNumber,
          type: template.type,
          title: template.title,
          messages: template.messages,
          audioUrl: {
            Telugu: preferredLanguage === 'Telugu' ? generatedAudioUrl : '',
            Hindi: preferredLanguage === 'Hindi' ? generatedAudioUrl : '',
            English: preferredLanguage === 'English' ? generatedAudioUrl : '',
          },
          status: 'pending',
        };
      })
    );

    if (advisoriesToCreate.length > 0) {
      await Advisory.insertMany(advisoriesToCreate);
    }

    res.status(201).json({
      crop,
      message: `Crop registered successfully. Pre-generated ${advisoriesToCreate.length} advisories.`,
    });
  } catch (error) {
    console.error('Error creating crop:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get all crops for the logged-in farmer
// @route   GET /api/crops
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const crops = await Crop.find({ farmer: req.farmerId }).populate('soilTest').sort({ createdAt: -1 });
    res.json(crops);
  } catch (error) {
    console.error('Error fetching crops:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Get active farm plan for logged-in farmer
// @route   GET /api/crops/my-plan
// @access  Private
router.get('/my-plan', protect, async (req, res) => {
  try {
    const activeCrops = await Crop.find({ farmer: req.farmerId, active: true }).sort({ createdAt: -1 });
    const farmer = await Farmer.findById(req.farmerId);
    
    const allocations = activeCrops.map(c => ({
      id: c._id,
      cropKey: c.cropName,
      cropName: c.cropName,
      acres: c.area,
      variety: c.variety,
      sowingDate: c.sowingDate,
      expectedHarvest: c.expectedHarvest
    }));

    res.json({
      totalLandArea: farmer?.landArea || (allocations.reduce((s, a) => s + (a.acres || 0), 0) || 3.0),
      allocations,
      lastUpdated: activeCrops[0]?.updatedAt || new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching my-plan:', error);
    res.status(500).json({ message: 'Server error fetching crop plan', error: error.message });
  }
});

// @desc    Register a multi-crop land plan
// @route   POST /api/crops/multi-plan
// @access  Private
router.post('/multi-plan', protect, async (req, res) => {
  const { totalLandArea, allocations, soilData } = req.body;
  if (!allocations || !Array.isArray(allocations) || allocations.length === 0) {
    return res.status(400).json({ message: 'Allocations array is required' });
  }

  try {
    // Archive previous active crops for this farmer
    await Crop.updateMany({ farmer: req.farmerId, active: true }, { active: false });

    let linkedSoilTest = null;
    if (soilData) {
      linkedSoilTest = await SoilTest.create({
        farmer: req.farmerId,
        N: Number(soilData.N) || 80,
        P: Number(soilData.P) || 40,
        K: Number(soilData.K) || 40,
        pH: Number(soilData.pH) || 6.5,
        soilType: soilData.soilType || 'Loamy',
      });
    }

    const createdCrops = [];
    for (const item of allocations) {
      const cropName = item.cropKey || item.cropName || 'Paddy';
      const area = parseFloat(item.acres || item.area) || 1.0;
      
      let durationDays = 110;
      const nameLower = cropName.trim().toLowerCase();
      if (nameLower.includes('cotton')) durationDays = 120;
      else if (nameLower.includes('maize')) durationDays = 100;
      else if (nameLower.includes('chilli')) durationDays = 130;
      else if (nameLower.includes('sugarcane')) durationDays = 300;

      const sowDate = new Date();
      const expectedHarvest = new Date(sowDate);
      expectedHarvest.setDate(expectedHarvest.getDate() + durationDays);

      const crop = await Crop.create({
        farmer: req.farmerId,
        cropName,
        variety: item.variety || 'AI Selected High-Yield',
        area,
        sowingDate: sowDate,
        expectedHarvest,
        active: true,
        soilTest: linkedSoilTest ? linkedSoilTest._id : undefined,
      });

      let templateKey = 'Paddy';
      if (nameLower.includes('cotton')) templateKey = 'Cotton';
      else if (nameLower.includes('maize')) templateKey = 'Maize';

      const templates = advisoryTemplates[templateKey] || advisoryTemplates['Paddy'] || [];
      const advisoriesToCreate = templates.map((t) => ({
        crop: crop._id,
        farmer: req.farmerId,
        dayNumber: t.dayNumber,
        type: t.type,
        title: t.title,
        messages: t.messages,
        status: 'pending',
      }));

      if (advisoriesToCreate.length > 0) {
        await Advisory.insertMany(advisoriesToCreate);
      }

      createdCrops.push(crop);
    }

    res.status(201).json({
      message: `Multi-crop plan saved! Registered ${createdCrops.length} crop parcels.`,
      crops: createdCrops,
    });
  } catch (error) {
    console.error('Error saving multi-crop plan:', error);
    res.status(500).json({ message: 'Server error saving multi-crop plan', error: error.message });
  }
});

// @desc    Get crop details by ID
// @route   GET /api/crops/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const crop = await Crop.findOne({ _id: req.params.id, farmer: req.farmerId }).populate('soilTest');

    if (crop) {
      // Fetch advisories generated for this crop
      const advisories = await Advisory.find({ crop: crop._id }).sort({ dayNumber: 1 });
      res.json({ crop, advisories });
    } else {
      res.status(404).json({ message: 'Crop not found' });
    }
  } catch (error) {
    console.error('Error fetching crop details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Mark crop as harvested
// @route   PUT /api/crops/:id/harvest
// @access  Private
router.put('/:id/harvest', protect, async (req, res) => {
  const { actualHarvest, yield: cropYield, profit } = req.body;

  try {
    const crop = await Crop.findOne({ _id: req.params.id, farmer: req.farmerId });

    if (crop) {
      crop.active = false;
      crop.actualHarvest = actualHarvest ? new Date(actualHarvest) : new Date();
      crop.yield = cropYield !== undefined ? cropYield : crop.yield;
      crop.profit = profit !== undefined ? profit : crop.profit;

      const updatedCrop = await crop.save();
      res.json(updatedCrop);
    } else {
      res.status(404).json({ message: 'Crop not found' });
    }
  } catch (error) {
    console.error('Error harvesting crop:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

