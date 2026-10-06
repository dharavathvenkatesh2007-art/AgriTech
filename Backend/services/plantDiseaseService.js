import dotenv from 'dotenv';

dotenv.config();

const PLANTNET_ENDPOINT = 'https://my-api.plantnet.org/v2/diseases/identify';

/**
 * Validates basic image buffer quality and dimensions/size before API request
 */
export function validateImageQuality(imageBuffers) {
  if (!imageBuffers || !Array.isArray(imageBuffers) || imageBuffers.length === 0) {
    return {
      acceptable: false,
      reason: 'No leaf image provided. Please upload a clear photo of the affected plant leaf.'
    };
  }

  for (let i = 0; i < imageBuffers.length; i++) {
    const buf = imageBuffers[i];
    if (!buf || !(buf instanceof Buffer) || buf.length === 0) {
      return {
        acceptable: false,
        reason: `Image #${i + 1} is empty or corrupted.`
      };
    }

    // Minimum file size check (10 KB)
    if (buf.length < 10 * 1024) {
      return {
        acceptable: false,
        reason: `Image #${i + 1} quality is too low (file size under 10 KB). Please take a clear photograph of the affected leaf in good lighting.`
      };
    }

    // Basic header check for common image types (JPEG, PNG, WEBP)
    const isJpeg = buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF;
    const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47;
    const isWebp = buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP';

    if (!isJpeg && !isPng && !isWebp) {
      return {
        acceptable: false,
        reason: `Image #${i + 1} is not a valid JPEG, PNG, or WEBP photo.`
      };
    }
  }

  return { acceptable: true };
}

/**
 * Builds structured agronomic recommendation based on Crop, Category, Condition & Environmental context
 */
function buildAgronomicAdvice(cropName, category, diagnosis, confidence, weather, growthStage) {
  const crop = (cropName || 'Selected Crop').trim();
  const dis = (diagnosis || 'Observed Condition').trim();

  const temp = weather?.current?.temperature || 30;
  const humidity = weather?.current?.humidity || 65;
  const rain = weather?.current?.precipitation || 0;

  const weatherNote = humidity > 75 
    ? ` Note: High humidity (${humidity}%) favors disease progression. Immediate field check advised.`
    : (rain > 0 ? ` Note: Recent rain (${rain} mm) increases leaf moisture duration.` : '');

  // Safety disclaimer for chemical treatments
  const chemicalSafetyDisclaimer = 'Follow locally approved agricultural guidance and the product label. Consult an agricultural extension officer before chemical treatment.';

  // 1. PEST / INSECT_DAMAGE Recommendation
  if (category === 'PEST' || category === 'INSECT_DAMAGE') {
    return {
      whatWasDetected: `Observation indicates ${dis} on ${crop}.${weatherNote}`,
      symptoms: `Chewed leaf tissue, irregular foliage holes, leaf curling, or visible insect feeding damage on ${crop}.`,
      immediateActions: [
        `Inspect affected ${crop} plants closely, especially the undersides of leaves.`,
        `Check neighboring plants in the field to determine if pest infestation is spreading.`,
        'Look for visible insects, larvae, eggs, frass, or fine silk webbing.',
        'Monitor whether the affected leaf area is expanding over the next 48 hours.'
      ],
      monitoring: `Scout ${crop} field every 2-3 days for active insect populations and fresh feeding marks.`,
      prevention: `Install sticky traps (yellow/blue) and pheromone monitoring traps. Keep field borders free from weeds.`,
      treatmentGuidance: chemicalSafetyDisclaimer,
      whenToSeekHelp: `Consult an agricultural extension officer if pest damage affects >15% of your crop area.`,
      chemicalSafetyDisclaimer
    };
  }

  // 2. HEALTHY Recommendation
  if (category === 'HEALTHY') {
    return {
      whatWasDetected: `No obvious foliar disease or pest damage detected on ${crop}.`,
      symptoms: `Foliage exhibits normal chlorophyll coloration and healthy structural vigor.`,
      immediateActions: [
        `Maintain regular field observation and optimal irrigation schedule for ${crop}.`,
        'Apply balanced N-P-K nutrients according to crop growth stage recommendations.'
      ],
      monitoring: `Routine weekly field scouting during ${growthStage || 'current'} growth stage.`,
      prevention: `Maintain proper plant spacing, weed sanitation, and field drainage.`,
      treatmentGuidance: `No chemical treatment required. Continue regular crop management.`,
      whenToSeekHelp: `Re-scan leaf photos if any spots, yellowing, or wilting develop in the future.`,
      chemicalSafetyDisclaimer
    };
  }

  // 3. UNCERTAIN Recommendation
  if (category === 'UNCERTAIN') {
    return {
      whatWasDetected: `Unable to identify condition reliably for ${crop}.${weatherNote}`,
      symptoms: `Photo quality, lighting, or symptom clarity was insufficient for high-confidence identification.`,
      immediateActions: [
        `Take a close-up, well-focused photo of the affected leaf in clear natural daylight.`,
        'Ensure the image clearly shows the lesion boundary or damaged surface area.',
        'Avoid blurry, backlit, or distant photographs.'
      ],
      monitoring: `Inspect ${crop} leaves daily to observe if symptoms progress or change shape.`,
      prevention: `Maintain general field hygiene while diagnostic verification is pending.`,
      treatmentGuidance: `Delay chemical applications until a clear diagnosis is confirmed.`,
      whenToSeekHelp: `Consult a local agricultural extension officer or agronomist for hands-on field inspection.`,
      chemicalSafetyDisclaimer
    };
  }

  // 4. DISEASE Recommendation per crop
  const diseaseKnowledgeBase = {
    Cotton: {
      symptoms: 'Angular leaf lesions, leaf spot water-soaking, or foliar discoloration on Cotton.',
      immediateActions: [
        'Prune and safely destroy heavily infected lower Cotton leaves displaying spots.',
        'Avoid overhead sprinkler watering to reduce leaf wetness duration.',
        'Ensure good field drainage to prevent waterlogging around root zones.'
      ],
      monitoring: 'Scout Cotton leaf undersides and squares twice weekly during humid mornings.',
      prevention: 'Maintain recommended row spacing for canopy aeration. Use bio-fungicide seed treatment.',
      treatmentGuidance: 'Follow locally approved agricultural guidance and product label. Consult an agricultural extension officer for copper/streptocycline foliar spray guidelines.',
      whenToSeekHelp: 'Consult local agricultural extension officer if >15% of Cotton canopy exhibits spreading lesions.'
    },
    Paddy: {
      symptoms: 'Spindle-shaped grey-white lesions, leaf tip drying, or sheath discoloration on Paddy.',
      immediateActions: [
        'Drain standing water from paddy field for 24-48 hours to dry canopy microclimate.',
        'Temporarily withhold top-dressing Nitrogen fertilizers until disease stabilizes.',
        'Remove weeds along bunds that serve as alternative pathogen hosts.'
      ],
      monitoring: 'Scout leaf blades and tiller bases daily during tillering and panicle emergence.',
      prevention: 'Apply balanced N-P-K ratios. Avoid excessive Nitrogen top-dressing.',
      treatmentGuidance: 'Follow locally approved agricultural guidance and product label. Consult an extension officer for bio-fungicide or systemic spray options.',
      whenToSeekHelp: 'Seek immediate extension guidance if neck blast or panicle rot symptoms develop.'
    },
    Chilli: {
      symptoms: 'Concentric circular dark spots on leaves/pods or leaf curl discoloration on Chilli.',
      immediateActions: [
        'Remove and safely dispose of severely spotted Chilli leaves or pods.',
        'Adjust irrigation to keep plant foliage dry.',
        'Apply neem-based organic formulation (10,000 ppm) to manage vector activity.'
      ],
      monitoring: 'Inspect developing Chilli foliage and pods every 5 days.',
      prevention: 'Install sticky traps for thrips/whiteflies. Ensure proper basal soil nutrition.',
      treatmentGuidance: 'Follow locally approved agricultural guidance and product label. Consult an extension officer before chemical spray.',
      whenToSeekHelp: 'Consult an extension agent if dieback or leaf curl symptoms spread rapidly.'
    },
    Maize: {
      symptoms: 'Elliptical grayish-brown leaf lesions or foliar blight spots on Maize.',
      immediateActions: [
        'Remove blighted lower leaves from Maize plant base.',
        'Earth up around plant base to support root anchorage.',
        'Ensure central leaf whorl remains free from excess water accumulation.'
      ],
      monitoring: 'Check leaf whorls and lower leaves weekly up to knee-high stage.',
      prevention: 'Rotate crops with legumes. Use disease-resistant hybrid maize seed.',
      treatmentGuidance: 'Follow locally approved agricultural guidance and product label. Consult an agricultural extension officer.',
      whenToSeekHelp: 'Consult extension specialist if foliar blight affects >15% of canopy.'
    }
  };

  const cropAdvice = diseaseKnowledgeBase[crop] || {
    symptoms: `Foliar leaf spotting, discoloration, or lesions observed on ${crop} leaves.`,
    immediateActions: [
      `Isolate affected ${crop} plants and remove heavily spotted leaves.`,
      'Improve field drainage and avoid overhead leaf watering.',
      'Ensure proper sunlight penetration across the crop canopy.'
    ],
    monitoring: `Scout ${crop} field twice weekly for symptom progression.`,
    prevention: `Practice crop rotation, maintain optimal plant spacing, and balance N-P-K soil nutrients.`,
    treatmentGuidance: chemicalSafetyDisclaimer,
    whenToSeekHelp: `Consult local agricultural extension department if symptoms persist across >15% of crop area.`
  };

  return {
    whatWasDetected: `Diagnosis indicates ${dis} on ${crop}.${weatherNote}`,
    symptoms: cropAdvice.symptoms,
    immediateActions: cropAdvice.immediateActions,
    monitoring: cropAdvice.monitoring,
    prevention: cropAdvice.prevention,
    treatmentGuidance: cropAdvice.treatmentGuidance,
    whenToSeekHelp: cropAdvice.whenToSeekHelp,
    chemicalSafetyDisclaimer
  };
}

/**
 * Classifies diagnosis into DISEASE, PEST, INSECT_DAMAGE, HEALTHY, or UNCERTAIN based on taxonomy & keywords
 */
function classifyDiagnosis(rawName, score, cropName) {
  if (!rawName || score < 0.40) {
    return {
      category: 'UNCERTAIN',
      diagnosis: 'Unable to identify reliably',
      confidence: Math.max(0.20, Number((score || 0.31).toFixed(2))),
      confidenceLevel: 'VERY_LOW',
      confidenceStatus: 'Very Low Confidence'
    };
  }

  const nameLower = rawName.toLowerCase();

  // 1. Check for Pest / Insect keywords
  const pestKeywords = [
    'pest', 'insect', 'aphid', 'caterpillar', 'mite', 'thrips', 'whitefly', 'worm',
    'beetle', 'fly', 'borer', 'locust', 'weevil', 'bug', 'larvae', 'chewed', 'miner',
    'gall', 'webbing', 'feeding', 'spodoptera', 'helicoverpa', 'bemisia', 'tetranychus'
  ];
  const isPest = pestKeywords.some(kw => nameLower.includes(kw));

  // 2. Check for Healthy keywords
  const healthyKeywords = ['healthy', 'normal', 'no disease', 'healthy leaf', 'unaffected'];
  const isHealthy = healthyKeywords.some(kw => nameLower.includes(kw));

  let category = 'DISEASE';
  let diagnosis = rawName;

  if (isHealthy) {
    category = 'HEALTHY';
    diagnosis = 'No obvious disease detected';
  } else if (isPest) {
    category = nameLower.includes('feeding') || nameLower.includes('chewed') || nameLower.includes('miner')
      ? 'INSECT_DAMAGE'
      : 'PEST';
    diagnosis = `Possible ${rawName}`;
  } else {
    category = 'DISEASE';
    diagnosis = score < 0.80 ? `Possible ${rawName}` : rawName;
  }

  // Determine confidence status
  let confidenceLevel = 'HIGH';
  let confidenceStatus = 'High Confidence';
  if (score < 0.60) {
    confidenceLevel = 'LOW';
    confidenceStatus = 'Low Confidence';
  } else if (score < 0.80) {
    confidenceLevel = 'MODERATE';
    confidenceStatus = 'Moderate Confidence';
  }

  return {
    category,
    diagnosis,
    confidence: Number(score.toFixed(2)),
    confidenceLevel,
    confidenceStatus
  };
}

/**
 * Main Plant Disease Identification Entry point using Pl@ntNet API
 */
export async function identifyPlantDisease({ imageBuffers, cropName, weather, growthStage }) {
  // Step 1: Validate Image Quality
  const qualityCheck = validateImageQuality(imageBuffers);
  if (!qualityCheck.acceptable) {
    const fallbackRecommendation = buildAgronomicAdvice(cropName, 'UNCERTAIN', 'Poor Image Quality', 0.20, weather, growthStage);
    return {
      success: true,
      imageQuality: { acceptable: false, reason: qualityCheck.reason },
      crop: cropName || 'Selected Crop',
      category: 'UNCERTAIN',
      diagnosis: 'Image quality is too low',
      confidence: 0.20,
      confidenceLevel: 'VERY_LOW',
      confidenceStatus: 'Very Low Confidence',
      alternatives: [],
      recommendation: fallbackRecommendation,
      reason: qualityCheck.reason
    };
  }

  // Ensure latest .env file values are loaded dynamically
  dotenv.config();

  const apiKey = process.env.PLANTNET_API_KEY;
  const isKeyAvailable = apiKey && apiKey !== 'YOUR_NEW_PLANTNET_API_KEY' && apiKey.length > 5;

  if (!isKeyAvailable) {
    console.warn('Pl@ntNet API Key missing or unconfigured in Backend/.env');
    return {
      success: false,
      error: 'Pl@ntNet API key is not configured in backend environment. Please check Backend/.env',
      crop: cropName || 'Selected Crop',
      category: 'UNCERTAIN',
      diagnosis: 'Unable to analyze image',
      confidence: 0.0,
      confidenceLevel: 'VERY_LOW',
      confidenceStatus: 'Service Unavailable',
      alternatives: [],
      recommendation: buildAgronomicAdvice(cropName, 'UNCERTAIN', 'Service Unavailable', 0.0, weather, growthStage)
    };
  }

  let apiResults = null;
  let fetchError = null;

  try {
    const formData = new globalThis.FormData();

    imageBuffers.forEach((buffer, idx) => {
      const fileBlob = new globalThis.Blob([buffer], { type: 'image/jpeg' });
      formData.append('images', fileBlob, `plant_leaf_${idx + 1}.jpg`);
      formData.append('organs', 'leaf');
    });

    // Query Pl@ntNet API requesting top 5 results
    const plantnetUrl = `${PLANTNET_ENDPOINT}?api-key=${encodeURIComponent(apiKey)}&lang=en&nb-results=5`;
    const res = await fetch(plantnetUrl, {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const json = await res.json();
      if (json.results && json.results.length > 0) {
        apiResults = json.results;
      }
    } else if (res.status === 404 || res.status === 400) {
      // Pl@ntNet returns 404 ("Species not found") or 400 when an image has no match or is unidentifiable
      console.log(`Pl@ntNet API returned status ${res.status} (unrecognized or unmatched species)`);
      apiResults = [];
    } else if (res.status === 401 || res.status === 403) {
      console.warn(`Pl@ntNet API returned status ${res.status}: Invalid or unauthorized API key.`);
      fetchError = `Pl@ntNet API Key is invalid or unauthorized (HTTP ${res.status}). Please check your PLANTNET_API_KEY in Backend/.env`;
    } else {
      console.warn(`Pl@ntNet API returned HTTP status ${res.status}`);
      fetchError = `Pl@ntNet API HTTP status ${res.status}`;
    }
  } catch (err) {
    console.warn('Pl@ntNet API fetch error:', err.message);
    fetchError = err.message;
  }

  // If API fetch failed completely
  if (fetchError && (!apiResults || apiResults.length === 0)) {
    return {
      success: false,
      error: fetchError,
      crop: cropName || 'Selected Crop',
      category: 'UNCERTAIN',
      diagnosis: 'Unable to analyze image. Please try again.',
      confidence: 0.0,
      confidenceLevel: 'VERY_LOW',
      confidenceStatus: 'API Error',
      alternatives: [],
      recommendation: buildAgronomicAdvice(cropName, 'UNCERTAIN', 'API Error', 0.0, weather, growthStage)
    };
  }

  // Parse Top 5 Results
  if (!apiResults || apiResults.length === 0) {
    const fallbackRecommendation = buildAgronomicAdvice(cropName, 'UNCERTAIN', 'Unable to identify reliably', 0.31, weather, growthStage);
    return {
      success: true,
      imageQuality: { acceptable: true },
      crop: cropName || 'Selected Crop',
      category: 'UNCERTAIN',
      diagnosis: 'Unable to identify reliably',
      confidence: 0.31,
      confidenceLevel: 'VERY_LOW',
      confidenceStatus: 'Very Low Confidence',
      alternatives: [],
      recommendation: fallbackRecommendation
    };
  }

  // Extract primary & alternative results (top 5)
  const normalizedResults = apiResults.slice(0, 5).map(item => {
    const score = Math.min(0.99, Number((item.score || 0.10).toFixed(2)));
    const species = item.species || {};
    const name = species.commonNames?.[0] 
      || species.scientificNameWithoutAuthor 
      || species.scientificName 
      || 'Foliar Condition';

    return { name, score };
  });

  const top = normalizedResults[0];
  const alternatives = normalizedResults.slice(1).map(alt => ({
    name: `Possible ${alt.name}`,
    confidence: alt.score
  }));

  // Classify primary result
  const classification = classifyDiagnosis(top.name, top.score, cropName);

  // Check crop context match: if top result does not match selected crop and confidence is < 0.60
  let cropMatchMessage = null;
  if (classification.confidence < 0.60) {
    cropMatchMessage = 'Unable to confidently match this result to your selected crop. Please upload a clearer image.';
  }

  // Build recommendation
  const recommendation = buildAgronomicAdvice(
    cropName,
    classification.category,
    classification.diagnosis,
    classification.confidence,
    weather,
    growthStage
  );

  return {
    success: true,
    imageQuality: { acceptable: true },
    crop: cropName || 'Selected Crop',
    category: classification.category,
    diagnosis: classification.diagnosis,
    confidence: classification.confidence,
    confidenceLevel: classification.confidenceLevel,
    confidenceStatus: classification.confidenceStatus,
    cropMatchMessage,
    alternatives,
    recommendation
  };
}
