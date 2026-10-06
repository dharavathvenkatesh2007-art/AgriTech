import { identifyPlantDisease } from '../services/plantDiseaseService.js';
import DiseasePrediction from '../models/DiseasePrediction.js';
import CropImage from '../models/CropImage.js';
import Crop from '../models/Crop.js';

/**
 * Controller to handle Plant Disease & Pest Identification
 */
export const detectDisease = async (req, res) => {
  try {
    // 1. Gather image buffers (support single 'image' or array 'images')
    let imageBuffers = [];

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      imageBuffers = req.files.map(f => f.buffer);
    } else if (req.files && typeof req.files === 'object') {
      const allFiles = Object.values(req.files).flat();
      imageBuffers = allFiles.map(f => f.buffer);
    } else if (req.file) {
      imageBuffers = [req.file.buffer];
    }

    if (imageBuffers.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No plant leaf image uploaded. Please upload up to 3 clear photos of the affected plant leaf.' 
      });
    }

    // 2. Extract farmer and crop context
    const farmerId = req.farmerId;
    if (!farmerId) {
      return res.status(401).json({ success: false, message: 'Unauthorized farmer session.' });
    }

    const { cropName, cropId, growthStage } = req.body;

    // Resolve crop from database if cropId is provided
    let linkedCrop = null;
    if (cropId && cropId !== 'undefined' && cropId !== 'null') {
      try {
        linkedCrop = await Crop.findOne({ _id: cropId, farmer: farmerId });
      } catch (e) {
        // invalid ObjectId
      }
    }

    // If cropName wasn't provided directly, attempt to fetch farmer's active crops
    let resolvedCropName = cropName || linkedCrop?.cropName;
    if (!resolvedCropName) {
      const farmerCrops = await Crop.find({ farmer: farmerId, active: { $ne: false } }).limit(1);
      if (farmerCrops.length > 0) {
        resolvedCropName = farmerCrops[0].cropName;
        linkedCrop = farmerCrops[0];
      }
    }

    if (!resolvedCropName) {
      return res.status(400).json({
        success: false,
        message: 'No Crop Selected. Please select your crop in Crop Planner before running Plant Scanner.'
      });
    }

    // 3. Call Pl@ntNet identification & classification pipeline
    const aiResult = await identifyPlantDisease({
      imageBuffers,
      cropName: resolvedCropName,
      weather: req.weatherData || null,
      growthStage: growthStage || 'mid_season'
    });

    if (aiResult.success === false) {
      return res.status(500).json({
        success: false,
        message: aiResult.error || 'Unable to analyze image. Please try again.'
      });
    }

    // 4. Save CropImage record in MongoDB
    const primaryFile = (req.files && req.files[0]) || req.file;
    const base64Data = primaryFile ? primaryFile.buffer.toString('base64') : '';
    const simulatedImageUrl = base64Data 
      ? `data:${primaryFile.mimetype || 'image/jpeg'};base64,${base64Data.slice(0, 500)}...`
      : '';

    let savedImage = null;
    try {
      savedImage = await CropImage.create({
        farmer: farmerId,
        crop: linkedCrop ? linkedCrop._id : undefined,
        imageUrl: simulatedImageUrl,
        imageType: 'Leaf',
        metadata: {
          fileSizeBytes: primaryFile ? primaryFile.size : 0,
          imageCount: imageBuffers.length
        }
      });
    } catch (err) {
      console.warn('CropImage record creation warning:', err.message);
    }

    // 5. Save DiseasePrediction record in MongoDB
    let savedPrediction = null;
    try {
      savedPrediction = await DiseasePrediction.create({
        cropImage: savedImage ? savedImage._id : undefined,
        farmer: farmerId,
        crop: linkedCrop ? linkedCrop._id : undefined,
        detectedCrop: aiResult.crop,
        detectedDisease: aiResult.diagnosis,
        category: aiResult.category,
        confidenceScore: aiResult.confidence,
        confidenceLevel: aiResult.confidenceLevel,
        severity: aiResult.confidenceLevel === 'HIGH' ? 'Severe' : (aiResult.confidenceLevel === 'MODERATE' ? 'Moderate' : 'Mild'),
        affectedSurfaceAreaPct: 15.0,
        treatmentRecommendation: aiResult.recommendation?.treatmentGuidance || '',
        expertValidationStatus: 'Pending',
        expertDisclaimer: aiResult.recommendation?.chemicalSafetyDisclaimer || ''
      });
    } catch (err) {
      console.warn('DiseasePrediction record creation warning:', err.message);
    }

    return res.status(200).json({
      success: true,
      data: {
        crop: aiResult.crop,
        category: aiResult.category,
        diagnosis: aiResult.diagnosis,
        disease: aiResult.diagnosis, // backwards compatibility
        confidence: aiResult.confidence,
        confidenceLevel: aiResult.confidenceLevel,
        confidenceStatus: aiResult.confidenceStatus,
        cropMatchMessage: aiResult.cropMatchMessage || null,
        alternatives: aiResult.alternatives,
        imageQuality: aiResult.imageQuality || { acceptable: true },
        recommendation: aiResult.recommendation,
        predictionId: savedPrediction ? savedPrediction._id : null,
        imageId: savedImage ? savedImage._id : null,
        scannedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error in detectDisease controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to connect to the disease detection service. Please try again.',
      error: error.message
    });
  }
};

export const getDiseaseHistory = async (req, res) => {
  try {
    const farmerId = req.farmerId;
    if (!farmerId) {
      return res.status(401).json({ success: false, message: 'Unauthorized farmer session.' });
    }

    const { cropName, cropId } = req.query;
    const query = { farmer: farmerId };

    if (cropId && cropId !== 'undefined') {
      query.crop = cropId;
    } else if (cropName && cropName !== 'undefined') {
      query.detectedCrop = new RegExp(`^${cropName}$`, 'i');
    }

    const history = await DiseasePrediction.find(query)
      .populate('cropImage', 'imageUrl createdAt')
      .sort({ createdAt: -1 })
      .limit(30);

    const formattedHistory = history.map(item => ({
      id: item._id,
      cropName: item.detectedCrop,
      disease: item.detectedDisease,
      diagnosis: item.detectedDisease,
      category: item.category || 'DISEASE',
      confidence: item.confidenceScore,
      confidenceLevel: item.confidenceLevel || 'MODERATE',
      severity: item.severity,
      treatment: item.treatmentRecommendation,
      scannedAt: item.createdAt,
      imageUrl: item.cropImage?.imageUrl || ''
    }));

    res.status(200).json({
      success: true,
      history: formattedHistory
    });
  } catch (error) {
    console.error('Error in getDiseaseHistory controller:', error);
    res.status(500).json({ success: false, message: 'Error fetching scan history', error: error.message });
  }
};
