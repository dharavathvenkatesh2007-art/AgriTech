import express from 'express';
import multer from 'multer';
import CropImage from '../models/CropImage.js';
import DiseasePrediction from '../models/DiseasePrediction.js';
import YieldPrediction from '../models/YieldPrediction.js';
import IrrigationRecommendation from '../models/IrrigationRecommendation.js';
import Alert from '../models/Alert.js';
import { protect, authorizeRoles } from '../middleware/auth.js';


const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:5001';

// @desc    Predict crop yield
// @route   POST /api/predict/yield
// @access  Private
router.post('/yield', protect, async (req, res) => {
  try {
    const { cropId, fieldId, cropName, area, N, P, K, pH, temperature, rainfall, ndvi } = req.body;

    const aiRes = await fetch(`${AI_SERVICE_URL}/predict-yield`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        crop_name: cropName || 'Paddy',
        area: area || 1.0,
        N: N || 80,
        P: P || 40,
        K: K || 40,
        pH: pH || 6.5,
        temperature: temperature || 28.0,
        rainfall: rainfall || 1000.0,
        ndvi: ndvi || 0.68,
      }),
    });

    if (!aiRes.ok) {
      throw new Error(`AI Service error: ${aiRes.statusText}`);
    }

    const aiData = await aiRes.json();

    // Persist prediction
    let savedPrediction = null;
    if (cropId) {
      savedPrediction = await YieldPrediction.create({
        farmer: req.farmerId,
        crop: cropId,
        field: fieldId || undefined,
        predictedYieldPerAcre: aiData.predicted_yield_per_acre,
        totalPredictedYield: aiData.total_predicted_yield,
        unit: aiData.unit,
        yieldRange: aiData.yield_range,
        confidenceScore: aiData.confidence_score,
        contributingFactors: {
          soilNutrientScore: aiData.factors?.nutrient_adequacy,
          thermalSuitability: aiData.factors?.thermal_suitability,
          moistureAdequacy: aiData.factors?.moisture_adequacy,
          canopyVigorNdvi: aiData.factors?.canopy_vigor_ndvi,
        },
      });
    }

    res.json({
      ...aiData,
      predictionRecordId: savedPrediction ? savedPrediction._id : null,
    });
  } catch (error) {
    console.error('Yield prediction error:', error);
    res.status(500).json({ message: 'Error computing yield prediction', error: error.message });
  }
});

// @desc    Predict irrigation requirements
// @route   POST /api/predict/irrigation
// @access  Private
router.post('/irrigation', protect, async (req, res) => {
  try {
    const {
      fieldId,
      cropId,
      cropName,
      growthStage,
      soilMoisture,
      fieldCapacity,
      wiltingPoint,
      temperature,
      humidity,
      solarRadiation,
      forecastedRainMm,
    } = req.body;

    const aiRes = await fetch(`${AI_SERVICE_URL}/predict-irrigation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        crop_name: cropName || 'Paddy',
        growth_stage: growthStage || 'mid_season',
        soil_moisture: soilMoisture !== undefined ? soilMoisture : 32.0,
        field_capacity: fieldCapacity || 45.0,
        wilting_point: wiltingPoint || 18.0,
        temperature: temperature || 31.0,
        humidity: humidity || 60.0,
        solar_radiation: solarRadiation || 22.0,
        forecasted_rain_mm: forecastedRainMm || 0.0,
      }),
    });

    if (!aiRes.ok) {
      throw new Error(`AI Service error: ${aiRes.statusText}`);
    }

    const aiData = await aiRes.json();

    // Persist recommendation if field provided
    let savedRec = null;
    if (fieldId) {
      savedRec = await IrrigationRecommendation.create({
        farmer: req.farmerId,
        field: fieldId,
        crop: cropId || undefined,
        irrigationNeeded: aiData.irrigation_needed,
        urgency: aiData.urgency,
        metrics: {
          currentSoilMoisturePct: aiData.metrics.current_soil_moisture_pct,
          fieldCapacityPct: aiData.metrics.field_capacity_pct,
          wiltingPointPct: aiData.metrics.wilting_point_pct,
          et0ReferenceMmDay: aiData.metrics.et0_reference_mm_day,
          etcCropMmDay: aiData.metrics.etc_crop_mm_day,
          cropCoefficientKc: aiData.metrics.crop_coefficient_kc,
          forecastedRainMm: aiData.metrics.forecasted_rain_mm,
        },
        waterDepthMm: aiData.recommendation.water_depth_mm,
        recommendedLitersPerAcre: aiData.recommendation.water_volume_liters_per_acre,
        optimalTimeWindow: aiData.recommendation.optimal_time_window,
        waterSavingAnalytics: {
          traditionalFloodLiters: aiData.water_saving_analytics.traditional_flood_liters,
          precisionIrrigationLiters: aiData.water_saving_analytics.precision_irrigation_liters,
          litersSaved: aiData.water_saving_analytics.liters_saved,
          estimatedReductionPct: aiData.water_saving_analytics.estimated_water_reduction_pct,
        },
      });

      // If urgent irrigation needed, trigger an alert
      if (aiData.irrigation_needed) {
        await Alert.create({
          farmer: req.farmerId,
          field: fieldId,
          crop: cropId || undefined,
          title: `Irrigation Alert: ${aiData.crop_name} (${aiData.urgency})`,
          message: `Soil moisture is at ${aiData.metrics.current_soil_moisture_pct}%. Supply ${aiData.recommendation.water_volume_liters_per_acre.toLocaleString()} L/acre.`,
          category: 'Irrigation',
          severity: aiData.urgency.includes('Immediate') ? 'Critical' : 'Warning',
          actionableRecommendation: aiData.recommendation.optimal_time_window,
        });
      }
    }

    res.json({
      ...aiData,
      recommendationRecordId: savedRec ? savedRec._id : null,
    });
  } catch (error) {
    console.error('Irrigation prediction error:', error);
    res.status(500).json({ message: 'Error computing irrigation requirement', error: error.message });
  }
});

// @desc    Detect crop disease from uploaded leaf image
// @route   POST /api/predict/disease
// @access  Private
router.post('/disease', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    const { cropId, fieldId } = req.body;

    // Build native multipart form data for Python microservice
    const fileBlob = new Blob([req.file.buffer], { type: req.file.mimetype || 'image/jpeg' });
    const formData = new globalThis.FormData();
    formData.append('image', fileBlob, req.file.originalname || 'leaf.jpg');

    const aiRes = await fetch(`${AI_SERVICE_URL}/detect-disease`, {
      method: 'POST',
      body: formData,
    });


    if (!aiRes.ok) {
      throw new Error(`AI Disease Service failed: ${aiRes.statusText}`);
    }

    const aiData = await aiRes.json();

    // Create CropImage record (simulated data URL / path)
    const base64Data = req.file.buffer.toString('base64');
    const simulatedImageUrl = `data:${req.file.mimetype || 'image/jpeg'};base64,${base64Data.slice(0, 500)}...`;

    const cropImage = await CropImage.create({
      farmer: req.farmerId,
      crop: cropId || undefined,
      field: fieldId || undefined,
      imageUrl: simulatedImageUrl,
      imageType: 'Leaf',
      metadata: {
        fileSizeBytes: req.file.size,
      },
    });

    // Create DiseasePrediction record
    const diseasePrediction = await DiseasePrediction.create({
      cropImage: cropImage._id,
      farmer: req.farmerId,
      crop: cropId || undefined,
      detectedCrop: aiData.crop,
      detectedDisease: aiData.disease,
      confidenceScore: aiData.confidence,
      severity: aiData.severity ? (aiData.severity.includes('Severe') ? 'Severe' : aiData.severity.includes('Moderate') ? 'Moderate' : 'Mild') : 'Mild',
      affectedSurfaceAreaPct: aiData.affected_surface_area_pct || 0,
      treatmentRecommendation: aiData.treatment,
      expertValidationStatus: 'Pending',
      expertDisclaimer: aiData.expert_disclaimer || 'AI recommendations should be validated by an agricultural expert for high-stakes decisions.',
    });

    // If severe disease, fire an alert
    if (diseasePrediction.severity === 'Severe' || diseasePrediction.severity === 'Critical') {
      await Alert.create({
        farmer: req.farmerId,
        crop: cropId || undefined,
        field: fieldId || undefined,
        title: `Disease Outbreak Warning: ${aiData.disease}`,
        message: `High severity detected on ${aiData.crop} leaf. Immediate treatment recommended.`,
        category: 'Disease',
        severity: 'Critical',
        actionableRecommendation: aiData.treatment,
      });
    }

    res.status(201).json({
      ...aiData,
      predictionId: diseasePrediction._id,
      imageId: cropImage._id,
    });
  } catch (error) {
    console.error('Disease detection error:', error);
    res.status(500).json({ message: 'Error processing disease detection', error: error.message });
  }
});

// @desc    Detect pests
// @route   POST /api/predict/pests
// @access  Private
router.post('/pests', protect, async (req, res) => {
  try {
    const { crop, symptoms } = req.body;
    const aiRes = await fetch(`${AI_SERVICE_URL}/detect-pests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ crop: crop || 'Cotton', symptoms: symptoms || '' }),
    });

    if (!aiRes.ok) {
      throw new Error(`AI Pest service error: ${aiRes.statusText}`);
    }

    const aiData = await aiRes.json();
    res.json(aiData);
  } catch (error) {
    console.error('Pest detection error:', error);
    res.status(500).json({ message: 'Error detecting pests', error: error.message });
  }
});

// @desc    Get disease predictions history
// @route   GET /api/predict/disease/history
// @access  Private
router.get('/disease/history', protect, async (req, res) => {
  try {
    const filter = req.userRole === 'admin' || req.userRole === 'expert' ? {} : { farmer: req.farmerId };
    const history = await DiseasePrediction.find(filter)
      .populate('cropImage', 'imageUrl createdAt')
      .populate('validatedBy', 'name role')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(history);
  } catch (error) {
    console.error('Error fetching disease history:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Expert/Admin validates or overrides AI disease prediction
// @route   PUT /api/predict/disease/:id/validate
// @access  Private (Expert / Admin only)
router.put('/disease/:id/validate', protect, authorizeRoles('expert', 'admin'), async (req, res) => {
  try {
    const { status, correctedDisease, expertNotes, updatedTreatment } = req.body;
    const prediction = await DiseasePrediction.findById(req.params.id);

    if (!prediction) {
      return res.status(404).json({ message: 'Prediction record not found' });
    }

    prediction.expertValidationStatus = status || 'Validated';
    prediction.validatedBy = req.userId;
    if (correctedDisease) prediction.detectedDisease = correctedDisease;
    if (expertNotes) prediction.expertFeedbackNotes = expertNotes;
    if (updatedTreatment) prediction.treatmentRecommendation = updatedTreatment;

    const updated = await prediction.save();
    res.json({ message: 'Prediction validated by agricultural expert', updated });
  } catch (error) {
    console.error('Error validating prediction:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
