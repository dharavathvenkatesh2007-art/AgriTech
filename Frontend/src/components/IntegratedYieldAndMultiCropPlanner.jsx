import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Sprout, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Droplets, 
  Layers, 
  ShieldCheck, 
  Save, 
  Plus, 
  Trash2, 
  HelpCircle, 
  BarChart3, 
  DollarSign, 
  Volume2, 
  Loader2, 
  Check, 
  Sliders, 
  ArrowRight,
  ArrowLeft,
  Info,
  Calendar,
  Sun
} from 'lucide-react';

const CROP_CATALOG = {
  Paddy: {
    name: 'Paddy / Rice',
    optSoil: ['Clayey', 'Loamy', 'Alluvial', 'Deep Loam'],
    optPhRange: [6.0, 7.2],
    optN: 80, optP: 40, optK: 40,
    baseYieldPerAcre: 26.8,
    unit: 'Quintals',
    marketPricePerUnit: 2300,
    profitPerAcre: 45000,
    waterReq: 'High (Standing 3-5cm during tillering)',
    keyRisk: 'Paddy Blast & Stem Borer',
    fertilizerDose: 'Urea: 80 kg, DAP: 40 kg, MOP: 35 kg / acre',
    color: '#10b981', // emerald
    bgClass: 'bg-emerald-500',
    borderClass: 'border-emerald-500',
    textClass: 'text-emerald-600'
  },
  Cotton: {
    name: 'Cotton (Kapas)',
    optSoil: ['Black Cotton', 'Red Sandy Loam', 'Deep Loam'],
    optPhRange: [6.5, 7.8],
    optN: 100, optP: 50, optK: 50,
    baseYieldPerAcre: 12.5,
    unit: 'Quintals',
    marketPricePerUnit: 7200,
    profitPerAcre: 65000,
    waterReq: 'Medium (Critical at flowering & boll dev)',
    keyRisk: 'Pink Bollworm & Sucking Pests',
    fertilizerDose: 'Urea: 100 kg, DAP: 50 kg, MOP: 50 kg / acre',
    color: '#f59e0b', // amber
    bgClass: 'bg-amber-500',
    borderClass: 'border-amber-500',
    textClass: 'text-amber-600'
  },
  Chilli: {
    name: 'Chilli (Mirchi)',
    optSoil: ['Red Sandy Loam', 'Well-Drained Loam', 'Black Soil'],
    optPhRange: [6.0, 7.2],
    optN: 120, optP: 60, optK: 80,
    baseYieldPerAcre: 22.0,
    unit: 'Quintals (Dry)',
    marketPricePerUnit: 14500,
    profitPerAcre: 85000,
    waterReq: 'Light & Frequent (Sensitive to waterlogging)',
    keyRisk: 'Thrips, Mites & Anthracnose (Dieback)',
    fertilizerDose: 'Urea: 120 kg, DAP: 60 kg, MOP: 80 kg / acre',
    color: '#f43f5e', // rose
    bgClass: 'bg-rose-500',
    borderClass: 'border-rose-500',
    textClass: 'text-rose-600'
  },
  Maize: {
    name: 'Maize / Corn',
    optSoil: ['Loamy', 'Alluvial', 'Red Loam'],
    optPhRange: [6.2, 7.5],
    optN: 120, optP: 60, optK: 40,
    baseYieldPerAcre: 28.5,
    unit: 'Quintals',
    marketPricePerUnit: 2100,
    profitPerAcre: 35000,
    waterReq: 'Medium (Critical at silking & tasseling)',
    keyRisk: 'Fall Armyworm (Spodoptera)',
    fertilizerDose: 'Urea: 120 kg, DAP: 60 kg, MOP: 40 kg / acre',
    color: '#eab308', // yellow
    bgClass: 'bg-yellow-500',
    borderClass: 'border-yellow-500',
    textClass: 'text-yellow-600'
  },
  Groundnut: {
    name: 'Groundnut / Peanut',
    optSoil: ['Red Sandy Loam', 'Light Loam'],
    optPhRange: [6.0, 6.8],
    optN: 40, optP: 60, optK: 50,
    baseYieldPerAcre: 14.5,
    unit: 'Quintals',
    marketPricePerUnit: 6400,
    profitPerAcre: 40000,
    waterReq: 'Low to Medium (Critical at pegging)',
    keyRisk: 'Tikka Leaf Spot & Collar Rot',
    fertilizerDose: 'Urea: 40 kg, DAP: 60 kg, MOP: 50 kg / acre + Gypsum',
    color: '#f97316', // orange
    bgClass: 'bg-orange-500',
    borderClass: 'border-orange-500',
    textClass: 'text-orange-600'
  },
  Sugarcane: {
    name: 'Sugarcane',
    optSoil: ['Clay Loam', 'Heavy Black Soil', 'Alluvial'],
    optPhRange: [6.5, 7.5],
    optN: 150, optP: 80, optK: 120,
    baseYieldPerAcre: 360.0,
    unit: 'Quintals (36 Tons)',
    marketPricePerUnit: 350,
    profitPerAcre: 80000,
    waterReq: 'High (Frequent irrigation required)',
    keyRisk: 'Early Shoot Borer & Red Rot',
    fertilizerDose: 'Urea: 160 kg, DAP: 80 kg, MOP: 100 kg / acre',
    color: '#06b6d4', // cyan
    bgClass: 'bg-cyan-500',
    borderClass: 'border-cyan-500',
    textClass: 'text-cyan-600'
  },
  Wheat: {
    name: 'Wheat',
    optSoil: ['Clay Loam', 'Alluvial', 'Deep Loam'],
    optPhRange: [6.0, 7.5],
    optN: 100, optP: 50, optK: 40,
    baseYieldPerAcre: 21.0,
    unit: 'Quintals',
    marketPricePerUnit: 2275,
    profitPerAcre: 38000,
    waterReq: 'Medium (CRI & Flowering critical)',
    keyRisk: 'Yellow Rust & Loose Smut',
    fertilizerDose: 'Urea: 100 kg, DAP: 50 kg, MOP: 40 kg / acre',
    color: '#84cc16', // lime
    bgClass: 'bg-lime-500',
    borderClass: 'border-lime-500',
    textClass: 'text-lime-600'
  }
};

export default function IntegratedYieldAndMultiCropPlanner() {
  const navigate = useNavigate();
  const { user, token, latestSoilTest, apiFetch, loadDashboard } = useApp();

  // Workflow Steps: 1: Soil Data Input -> 2: AI Yield Predictions -> 3: Selection & Acreage -> 4: Master Summary
  const [activeStep, setActiveStep] = useState(1);
  const [plannerMode, setPlannerMode] = useState('multi'); // 'single' | 'multi'

  // Step 1 Inputs
  const [totalLandArea, setTotalLandArea] = useState(user?.landArea || 3.0);
  const [soilData, setSoilData] = useState({
    N: 80,
    P: 45,
    K: 40,
    pH: 6.5,
    soilType: 'Red Sandy Loam',
    drainage: 'Good (Well-Drained)',
    irrigationSource: 'Borewell with Drip',
    temperature: 28.5,
    rainfall: 1100,
    ndvi: 0.70
  });

  // Step 2 AI Predictions State
  const [predicting, setPredicting] = useState(false);
  const [predictedCrops, setPredictedCrops] = useState([]);
  const [singleSelectedCrop, setSingleSelectedCrop] = useState('Paddy');

  // Step 3 Allocations State
  const [allocations, setAllocations] = useState([
    { cropKey: 'Paddy', acres: 1.0 },
    { cropKey: 'Cotton', acres: 1.0 },
    { cropKey: 'Chilli', acres: 1.0 }
  ]);

  // Saving State
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [ttsLoading, setTtsLoading] = useState(false);
  const audioRef = useRef(null);

  // Pre-fill from soil test on mount or when requested
  useEffect(() => {
    if (latestSoilTest) {
      setSoilData(prev => ({
        ...prev,
        N: latestSoilTest.N ?? prev.N,
        P: latestSoilTest.P ?? prev.P,
        K: latestSoilTest.K ?? prev.K,
        pH: latestSoilTest.pH ?? prev.pH,
        soilType: latestSoilTest.soilType || prev.soilType
      }));
    }
  }, [latestSoilTest]);

  const handleAutoFillSoil = () => {
    if (latestSoilTest) {
      setSoilData(prev => ({
        ...prev,
        N: latestSoilTest.N || 85,
        P: latestSoilTest.P || 42,
        K: latestSoilTest.K || 48,
        pH: latestSoilTest.pH || 6.6,
        soilType: latestSoilTest.soilType || 'Red Sandy Loam'
      }));
    } else {
      // Default high fertility preset
      setSoilData(prev => ({
        ...prev,
        N: 85,
        P: 42,
        K: 48,
        pH: 6.6,
        soilType: 'Red Sandy Loam'
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSoilData(prev => ({ ...prev, [name]: value }));
  };

  // Run AI Yield & Crop Recommendations
  const runAiYieldPredictions = async () => {
    setPredicting(true);
    try {
      // Attempt call to Flask AI Service
      let aiRecommendations = [];
      try {
        const res = await fetch('http://127.0.0.1:5001/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            N: Number(soilData.N),
            P: Number(soilData.P),
            K: Number(soilData.K),
            pH: Number(soilData.pH),
            temperature: Number(soilData.temperature),
            rainfall: Number(soilData.rainfall),
            state: user?.location?.state || 'Andhra Pradesh'
          })
        });

        if (res.ok) {
          const data = await res.json();
          aiRecommendations = data.recommendations || [];
        }
      } catch (err) {
        console.warn('Flask AI direct call skipped, using precision heuristic engine:', err);
      }

      // Build comprehensive crop list enriched with yield calculations
      const cropsList = Object.keys(CROP_CATALOG).map(key => {
        const info = CROP_CATALOG[key];
        
        // Calculate Suitability Score based on soil parameters
        let suitabilityScore = 82;
        if (info.optSoil.includes(soilData.soilType)) suitabilityScore += 8;
        if (soilData.pH >= info.optPhRange[0] && soilData.pH <= info.optPhRange[1]) suitabilityScore += 5;
        
        const nRatio = Math.min(Number(soilData.N) / info.optN, 1.2);
        const pRatio = Math.min(Number(soilData.P) / info.optP, 1.2);
        const kRatio = Math.min(Number(soilData.K) / info.optK, 1.2);
        const nutrientFactor = 0.4 * nRatio + 0.3 * pRatio + 0.3 * kRatio;
        
        suitabilityScore = Math.min(Math.round(suitabilityScore * nutrientFactor), 98);

        // Check if Flask recommend output matches
        const flaskMatch = aiRecommendations.find(r => r.crop.toLowerCase() === key.toLowerCase());
        const finalConfidence = flaskMatch ? Math.round(flaskMatch.confidence * 100) : suitabilityScore;

        // Yield Prediction per acre
        const predictedYieldPerAcre = Number((info.baseYieldPerAcre * (finalConfidence / 90)).toFixed(1));
        const totalYieldFullLand = Number((predictedYieldPerAcre * totalLandArea).toFixed(1));

        // Financials
        const expectedProfitPerAcre = Math.round(info.profitPerAcre * (finalConfidence / 90));
        const totalProfitFullLand = Math.round(expectedProfitPerAcre * totalLandArea);
        const grossRevenuePerAcre = Math.round(predictedYieldPerAcre * info.marketPricePerUnit);
        const totalRevenueFullLand = Math.round(grossRevenuePerAcre * totalLandArea);

        return {
          cropKey: key,
          name: info.name,
          confidence: finalConfidence,
          predictedYieldPerAcre,
          totalYieldFullLand,
          unit: info.unit,
          expectedProfitPerAcre,
          totalProfitFullLand,
          grossRevenuePerAcre,
          totalRevenueFullLand,
          marketPricePerUnit: info.marketPricePerUnit,
          waterReq: info.waterReq,
          keyRisk: info.keyRisk,
          fertilizerDose: info.fertilizerDose,
          color: info.color,
          bgClass: info.bgClass,
          borderClass: info.borderClass,
          textClass: info.textClass
        };
      });

      // Sort by AI confidence match descending
      cropsList.sort((a, b) => b.confidence - a.confidence);
      setPredictedCrops(cropsList);

      // Pre-select top crop for single crop mode
      if (cropsList.length > 0) {
        setSingleSelectedCrop(cropsList[0].cropKey);
      }

      setActiveStep(2);
    } catch (error) {
      console.error('Yield prediction error:', error);
    } finally {
      setPredicting(false);
    }
  };

  // Calculation for Multi-Crop Allocation Acreage
  const totalAllocated = Number(
    allocations.reduce((sum, item) => sum + (parseFloat(item.acres) || 0), 0).toFixed(2)
  );
  const remainingAcres = Number((totalLandArea - totalAllocated).toFixed(2));
  const isOverAllocated = totalAllocated > totalLandArea;

  const handleAllocationChange = (index, field, value) => {
    setAllocations(prev => {
      const updated = [...prev];
      updated[index][field] = field === 'acres' ? parseFloat(value) || 0 : value;
      return updated;
    });
  };

  const addCropParcel = (cropKeyToAdd) => {
    const existing = allocations.find(a => a.cropKey === cropKeyToAdd);
    if (existing) return;
    const suggested = remainingAcres > 0 ? remainingAcres : 0.5;
    setAllocations(prev => [...prev, { cropKey: cropKeyToAdd, acres: suggested }]);
  };

  const removeCropParcel = (index) => {
    setAllocations(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSelectSingleCrop = (cropKey) => {
    setSingleSelectedCrop(cropKey);
    setPlannerMode('single');
    setActiveStep(3);
  };

  const handleProceedToMultiCrop = () => {
    setPlannerMode('multi');
    // Ensure allocations have top 3 predicted crops if empty
    if (allocations.length === 0 && predictedCrops.length >= 3) {
      const perCrop = Number((totalLandArea / 3).toFixed(1));
      setAllocations([
        { cropKey: predictedCrops[0].cropKey, acres: perCrop },
        { cropKey: predictedCrops[1].cropKey, acres: perCrop },
        { cropKey: predictedCrops[2].cropKey, acres: perCrop }
      ]);
    }
    setActiveStep(3);
  };

  // Compute Active Master Plan Summary Data
  const getActivePlanSummary = () => {
    if (plannerMode === 'single') {
      const cropInfo = predictedCrops.find(c => c.cropKey === singleSelectedCrop) || predictedCrops[0];
      if (!cropInfo) return null;

      return {
        mode: 'Single Crop (100% Allocation)',
        totalAcres: totalLandArea,
        parcels: [
          {
            cropKey: cropInfo.cropKey,
            name: cropInfo.name,
            acres: totalLandArea,
            pct: 100,
            yieldPerAcre: cropInfo.predictedYieldPerAcre,
            totalYield: cropInfo.totalYieldFullLand,
            unit: cropInfo.unit,
            profitPerAcre: cropInfo.expectedProfitPerAcre,
            totalProfit: cropInfo.totalProfitFullLand,
            totalRevenue: cropInfo.totalRevenueFullLand,
            waterReq: cropInfo.waterReq,
            fertilizerDose: cropInfo.fertilizerDose,
            keyRisk: cropInfo.keyRisk,
            color: cropInfo.color
          }
        ],
        grandTotalYield: cropInfo.totalYieldFullLand,
        grandTotalProfit: cropInfo.totalProfitFullLand,
        grandTotalRevenue: cropInfo.totalRevenueFullLand
      };
    } else {
      let grandTotalYield = 0;
      let grandTotalProfit = 0;
      let grandTotalRevenue = 0;

      const parcels = allocations.map(item => {
        const cropInfo = predictedCrops.find(c => c.cropKey === item.cropKey) || CROP_CATALOG[item.cropKey];
        const acres = parseFloat(item.acres) || 0;
        const pct = totalLandArea > 0 ? Number(((acres / totalLandArea) * 100).toFixed(1)) : 0;
        
        const yieldPerAcre = cropInfo?.predictedYieldPerAcre || cropInfo?.baseYieldPerAcre || 20;
        const totalYield = Number((yieldPerAcre * acres).toFixed(1));
        
        const profitPerAcre = cropInfo?.expectedProfitPerAcre || cropInfo?.profitPerAcre || 40000;
        const totalProfit = Math.round(profitPerAcre * acres);
        
        const grossRevenuePerAcre = cropInfo?.grossRevenuePerAcre || Math.round((cropInfo?.marketPricePerUnit || 2000) * yieldPerAcre);
        const totalRevenue = Math.round(grossRevenuePerAcre * acres);

        grandTotalYield += totalYield;
        grandTotalProfit += totalProfit;
        grandTotalRevenue += totalRevenue;

        return {
          cropKey: item.cropKey,
          name: cropInfo?.name || item.cropKey,
          acres,
          pct,
          yieldPerAcre,
          totalYield,
          unit: cropInfo?.unit || 'Quintals',
          profitPerAcre,
          totalProfit,
          totalRevenue,
          waterReq: cropInfo?.waterReq || 'Medium',
          fertilizerDose: cropInfo?.fertilizerDose || 'Balanced N-P-K',
          keyRisk: cropInfo?.keyRisk || 'General Pests',
          color: CROP_CATALOG[item.cropKey]?.color || '#10b981'
        };
      });

      return {
        mode: 'Multi-Crop Allocation Planner',
        totalAcres: totalLandArea,
        parcels,
        grandTotalYield: Number(grandTotalYield.toFixed(1)),
        grandTotalProfit,
        grandTotalRevenue
      };
    }
  };

  const planSummary = getActivePlanSummary();

  // Voice Speech synthesis for summary
  const speakPlanSummary = async () => {
    if (!planSummary) return;
    setTtsLoading(true);
    const lang = user?.preferredLanguage || 'Telugu';

    let textToSpeak = '';
    if (lang === 'Telugu') {
      textToSpeak = `మీ భూమి ప్రణాళిక పూర్తయింది. మొత్తం ${planSummary.totalAcres} ఎకరాలలో అంచనా వేసిన రాబడి ${planSummary.grandTotalProfit.toLocaleString()} రూపాయిలు. `;
      planSummary.parcels.forEach(p => {
        textToSpeak += `${p.name} పంట ${p.acres} ఎకరాలలో సాగుచేస్తే ${p.totalYield} క్వింటాళ్ల దిగుబడి వస్తుంది. `;
      });
    } else if (lang === 'Hindi') {
      textToSpeak = `आपकी फसल योजना तैयार है। कुल ${planSummary.totalAcres} एकड़ में अनुमानित शुद्ध लाभ ${planSummary.grandTotalProfit.toLocaleString()} रुपये है। `;
      planSummary.parcels.forEach(p => {
        textToSpeak += `${p.name} ${p.acres} एकड़ में ${p.totalYield} क्विंटल उपज देगा। `;
      });
    } else {
      textToSpeak = `Your farm land allocation plan is ready. On ${planSummary.totalAcres} acres, total projected net profit is ${planSummary.grandTotalProfit.toLocaleString()} rupees. `;
      planSummary.parcels.forEach(p => {
        textToSpeak += `${p.name} on ${p.acres} acres yields ${p.totalYield} ${p.unit}. `;
      });
    }

    try {
      const data = await apiFetch('/voice/tts', {
        method: 'POST',
        body: JSON.stringify({ text: textToSpeak, language: lang })
      });
      if (data.audioUrl) {
        if (audioRef.current) {
          audioRef.current.src = `http://localhost:5000${data.audioUrl}`;
          audioRef.current.play().catch(e => console.log('Audio autoplay blocked'));
        }
      }
    } catch (err) {
      console.warn('TTS speech warning:', err);
    } finally {
      setTtsLoading(false);
    }
  };

  // Save Plan to Backend API
  const handleSavePlan = async () => {
    if (isOverAllocated && plannerMode === 'multi') {
      alert('Cannot save: Total allocated acres exceed total land area!');
      return;
    }
    if (!token) {
      navigate('/auth');
      return;
    }

    setSaving(true);
    setSaveSuccess(false);

    try {
      const payloadParcels = planSummary.parcels.map(p => ({
        cropKey: p.cropKey,
        cropName: p.name,
        acres: p.acres,
        yieldPerAcre: p.yieldPerAcre,
        totalYield: p.totalYield,
        unit: p.unit
      }));

      const res = await apiFetch('/crops/multi-plan', {
        method: 'POST',
        body: JSON.stringify({
          totalLandArea,
          allocations: payloadParcels,
          soilData
        })
      });

      setSaveSuccess(true);
      if (loadDashboard) loadDashboard();
      setTimeout(() => setSaveSuccess(false), 5000);
    } catch (err) {
      console.error('Error saving plan:', err);
      alert('Failed to save plan: ' + (err.message || 'Server error'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <audio ref={audioRef} className="hidden" />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 md:p-8 rounded-2xl border border-emerald-800/40 shadow-xl text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Integrated Agronomic Intelligence
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              AI Crop Yield & Multi-Crop Acreage Planner
            </h1>
            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl">
              Input soil NPK test data to predict high-yield candidate crops, compare projected harvest tonnage, and customize single or multi-crop land parcel allocations.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700 shrink-0">
            <button
              onClick={() => setPlannerMode('single')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                plannerMode === 'single'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Single Crop Choice
            </button>
            <button
              onClick={() => setPlannerMode('multi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                plannerMode === 'multi'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Multi-Crop Planner
            </button>
          </div>
        </div>

        {/* Workflow Stepper Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveStep(1)}
            className={`p-3 rounded-xl border text-left transition flex items-center gap-3 ${
              activeStep === 1
                ? 'bg-emerald-600/20 border-emerald-500 text-white'
                : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${activeStep === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
              1
            </div>
            <div>
              <div className="text-xs font-bold block">1. Soil & Field Input</div>
              <div className="text-[10px] text-slate-400 block truncate">NPK, pH & Area</div>
            </div>
          </button>

          <button
            onClick={() => { if (predictedCrops.length > 0) setActiveStep(2); }}
            disabled={predictedCrops.length === 0}
            className={`p-3 rounded-xl border text-left transition flex items-center gap-3 ${
              activeStep === 2
                ? 'bg-emerald-600/20 border-emerald-500 text-white'
                : 'bg-slate-800/40 border-slate-800 text-slate-400 disabled:opacity-50'
            }`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${activeStep === 2 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
              2
            </div>
            <div>
              <div className="text-xs font-bold block">2. AI Predictions</div>
              <div className="text-[10px] text-slate-400 block truncate">Yield & Suitability</div>
            </div>
          </button>

          <button
            onClick={() => { if (predictedCrops.length > 0) setActiveStep(3); }}
            disabled={predictedCrops.length === 0}
            className={`p-3 rounded-xl border text-left transition flex items-center gap-3 ${
              activeStep === 3
                ? 'bg-emerald-600/20 border-emerald-500 text-white'
                : 'bg-slate-800/40 border-slate-800 text-slate-400 disabled:opacity-50'
            }`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${activeStep === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
              3
            </div>
            <div>
              <div className="text-xs font-bold block">3. Acreage Planner</div>
              <div className="text-[10px] text-slate-400 block truncate">Single or Split Parcels</div>
            </div>
          </button>

          <button
            onClick={() => { if (predictedCrops.length > 0) setActiveStep(4); }}
            disabled={predictedCrops.length === 0}
            className={`p-3 rounded-xl border text-left transition flex items-center gap-3 ${
              activeStep === 4
                ? 'bg-emerald-600/20 border-emerald-500 text-white'
                : 'bg-slate-800/40 border-slate-800 text-slate-400 disabled:opacity-50'
            }`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${activeStep === 4 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
              4
            </div>
            <div>
              <div className="text-xs font-bold block">4. Farm Master Plan</div>
              <div className="text-[10px] text-slate-400 block truncate">Yield, Profit & Save</div>
            </div>
          </button>
        </div>
      </div>

      {/* STEP 1: SOIL & FIELD CONFIGURATION FORM */}
      {activeStep === 1 && (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="h-5 w-5 text-emerald-600" />
                Step 1: Soil Test Data & Land Area Inputs
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your farm's soil nutrient values and total land capacity to generate tailored yield predictions.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAutoFillSoil}
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-200 transition flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {latestSoilTest ? 'Auto-Fill Saved Soil Test' : 'Fill Sample Soil Profile'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Land Area */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Total Cultivated Land Area (Acres)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                value={totalLandArea}
                onChange={(e) => setTotalLandArea(parseFloat(e.target.value) || 1.0)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Total land area to allocate crops across.
              </span>
            </div>

            {/* Soil Type */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Soil Classification
              </label>
              <select
                name="soilType"
                value={soilData.soilType}
                onChange={handleInputChange}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Red Sandy Loam">Red Sandy Loam</option>
                <option value="Black Cotton">Black Cotton Soil</option>
                <option value="Clayey">Clayey Soil</option>
                <option value="Loamy">Loamy Soil</option>
                <option value="Alluvial">Alluvial Soil</option>
              </select>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Affects root aeration & moisture holding capacity.
              </span>
            </div>

            {/* Soil pH */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Soil pH Level ({soilData.pH})
              </label>
              <input
                type="range"
                min="5.0"
                max="8.5"
                step="0.1"
                name="pH"
                value={soilData.pH}
                onChange={handleInputChange}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-semibold">
                <span>Acidic (5.0)</span>
                <span className="text-emerald-700 font-bold">Neutral (6.5-7.2)</span>
                <span>Alkaline (8.5)</span>
              </div>
            </div>
          </div>

          {/* NPK Values Grid */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Soil Macronutrients (N - P - K in kg/ha)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nitrogen (N)</label>
                <input
                  type="number"
                  name="N"
                  value={soilData.N}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phosphorus (P)</label>
                <input
                  type="number"
                  name="P"
                  value={soilData.P}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Potassium (K)</label>
                <input
                  type="number"
                  name="K"
                  value={soilData.K}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Climate & Sensor Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mean Temperature (°C)</label>
              <input
                type="number"
                step="0.5"
                name="temperature"
                value={soilData.temperature}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Seasonal Rainfall (mm)</label>
              <input
                type="number"
                name="rainfall"
                value={soilData.rainfall}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Canopy Vigor Index (NDVI)</label>
              <input
                type="number"
                step="0.05"
                min="0.1"
                max="1.0"
                name="ndvi"
                value={soilData.ndvi}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={runAiYieldPredictions}
              disabled={predicting}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center gap-2"
            >
              {predicting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing Soil & Computing Yields...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze Soil & Predict Crop Yields
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: AI CROP RECOMMENDATIONS & PREDICTED YIELDS */}
      {activeStep === 2 && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                Step 2: AI Predicted Crop Yields & Suitability
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Yield predictions computed for {totalLandArea} acres based on N={soilData.N}, P={soilData.P}, K={soilData.K}, pH={soilData.pH} on {soilData.soilType}.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveStep(1)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Edit Soil Inputs
              </button>
              <button
                onClick={handleProceedToMultiCrop}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5"
              >
                Proceed to Multi-Crop Planner
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Predicted Crops Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {predictedCrops.map((crop) => (
              <div 
                key={crop.cropKey}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Card Top Header */}
                  <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${crop.bgClass}`}></span>
                        <h3 className="font-bold text-base text-slate-900">{crop.name}</h3>
                      </div>
                      <span className="text-xs text-slate-500 mt-0.5 block">
                        Market: ₹{crop.marketPricePerUnit.toLocaleString()} / {crop.unit}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                        {crop.confidence}% Match
                      </span>
                    </div>
                  </div>

                  {/* Card Body - Yield & Profit Stats */}
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                          Predicted Yield / Acre
                        </span>
                        <span className="text-base font-extrabold text-emerald-900 block">
                          {crop.predictedYieldPerAcre} <span className="text-xs font-normal text-emerald-700">{crop.unit}</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                          Full Land Yield ({totalLandArea}A)
                        </span>
                        <span className="text-base font-extrabold text-emerald-900 block">
                          {crop.totalYieldFullLand} <span className="text-xs font-normal text-emerald-700">{crop.unit}</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[11px] text-slate-500 block">Net Profit / Acre</span>
                        <span className="font-bold text-slate-800 block text-sm">
                          ₹{crop.expectedProfitPerAcre.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-500 block">Total Profit ({totalLandArea}A)</span>
                        <span className="font-bold text-emerald-700 block text-sm">
                          ₹{crop.totalProfitFullLand.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg space-y-1">
                      <div><strong className="text-slate-800">Water:</strong> {crop.waterReq}</div>
                      <div><strong className="text-slate-800">Dose:</strong> {crop.fertilizerDose}</div>
                      <div><strong className="text-slate-800">Key Risk:</strong> {crop.keyRisk}</div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => handleSelectSingleCrop(crop.cropKey)}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
                  >
                    Select 100% Land (Single)
                  </button>
                  <button
                    onClick={() => {
                      addCropParcel(crop.cropKey);
                      handleProceedToMultiCrop();
                    }}
                    className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1"
                    title="Add to Multi-Crop Planner"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-600" />
                    Multi
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: CROP SELECTION & ACREAGE PLANNER */}
      {activeStep === 3 && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-emerald-600" />
                Step 3: Crop Selection & Acreage Planner
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Choose either a single crop for 100% of your land or split acreage across multiple crops.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setPlannerMode('single')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  plannerMode === 'single'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Single Crop Choice
              </button>
              <button
                onClick={() => setPlannerMode('multi')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  plannerMode === 'multi'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Multi-Crop Acreage Planner
              </button>
            </div>
          </div>

          {/* SINGLE CROP MODE */}
          {plannerMode === 'single' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-emerald-900 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm">Single Crop 100% Allocation Selected</h3>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Your full {totalLandArea} acres land will be dedicated entirely to one crop.
                  </p>
                </div>
                <span className="text-xs font-bold bg-emerald-600 text-white px-3 py-1 rounded-full">
                  100% Single Crop
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Select Chosen Crop from AI Recommendations:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {predictedCrops.map(crop => (
                    <div
                      key={crop.cropKey}
                      onClick={() => setSingleSelectedCrop(crop.cropKey)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition flex items-center justify-between ${
                        singleSelectedCrop === crop.cropKey
                          ? 'border-emerald-600 bg-emerald-50/40 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-sm text-slate-900 block">{crop.name}</span>
                        <span className="text-xs text-emerald-600 font-semibold block">
                          Yield: {crop.totalYieldFullLand} {crop.unit}
                        </span>
                      </div>
                      {singleSelectedCrop === crop.cropKey && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setActiveStep(4)}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow transition flex items-center gap-1.5"
                >
                  Generate Master Farm Plan
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* MULTI-CROP PLANNER MODE */}
          {plannerMode === 'multi' && (
            <div className="space-y-6">
              {/* Land Allocation Gauge Bar */}
              <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-sm flex items-center gap-2">
                      <Layers className="h-4 w-4 text-emerald-400" />
                      Land Acreage Allocation Bar
                    </h3>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      Total Farm Land: <strong className="text-white">{totalLandArea} Acres</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <span className="text-emerald-400">Allocated: {totalAllocated} A</span>
                    <span className={remainingAcres < 0 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                      Remaining: {remainingAcres} A
                    </span>
                  </div>
                </div>

                {/* Donut / Stacked Progress Bar */}
                <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  {allocations.map((item, idx) => {
                    const acres = parseFloat(item.acres) || 0;
                    const pct = totalLandArea > 0 ? (acres / totalLandArea) * 100 : 0;
                    const cropInfo = CROP_CATALOG[item.cropKey];
                    return (
                      <div
                        key={idx}
                        style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: cropInfo?.color || '#10b981' }}
                        className="h-full transition-all duration-300"
                        title={`${cropInfo?.name || item.cropKey}: ${acres} Acres (${pct.toFixed(1)}%)`}
                      ></div>
                    );
                  })}
                </div>

                {isOverAllocated && (
                  <div className="bg-rose-500/20 border border-rose-500/40 p-3 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                    Warning: Allocated acres ({totalAllocated}) exceed total land area ({totalLandArea})! Reduce parcel sizes.
                  </div>
                )}
              </div>

              {/* Allocation Parcels List */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-slate-900">Configured Multi-Crop Parcels</h3>
                  
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-500">Add Candidate Crop:</label>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          addCropParcel(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="bg-slate-50 border border-slate-300 rounded-lg text-xs p-1.5 font-semibold text-slate-800 focus:outline-none"
                    >
                      <option value="">+ Choose Crop</option>
                      {Object.keys(CROP_CATALOG).map(k => (
                        <option key={k} value={k}>{CROP_CATALOG[k].name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {allocations.map((item, index) => {
                    const cropInfo = CROP_CATALOG[item.cropKey] || {};
                    const acres = parseFloat(item.acres) || 0;
                    const pct = totalLandArea > 0 ? ((acres / totalLandArea) * 100).toFixed(1) : 0;
                    const predictedYieldPerAcre = cropInfo.baseYieldPerAcre || 20;
                    const parcelYield = (predictedYieldPerAcre * acres).toFixed(1);
                    const parcelProfit = Math.round((cropInfo.profitPerAcre || 40000) * acres);

                    return (
                      <div
                        key={index}
                        className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <span 
                            className="w-4 h-4 rounded-full shrink-0" 
                            style={{ backgroundColor: cropInfo.color || '#10b981' }}
                          ></span>
                          <div>
                            <select
                              value={item.cropKey}
                              onChange={(e) => handleAllocationChange(index, 'cropKey', e.target.value)}
                              className="bg-white border border-slate-300 rounded-lg p-1.5 text-xs font-bold text-slate-900 focus:outline-none"
                            >
                              {Object.keys(CROP_CATALOG).map(k => (
                                <option key={k} value={k}>{CROP_CATALOG[k].name}</option>
                              ))}
                            </select>
                            <span className="text-[11px] text-slate-500 block mt-0.5">
                              Est. Yield: <strong className="text-slate-800">{parcelYield} {cropInfo.unit}</strong> | Profit: <strong className="text-emerald-700">₹{parcelProfit.toLocaleString()}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Interactive Acreage Slider + Number Input */}
                        <div className="flex items-center gap-4 w-full md:w-auto">
                          <div className="flex items-center gap-2 flex-1 md:flex-initial">
                            <input
                              type="range"
                              min="0.1"
                              max={totalLandArea}
                              step="0.1"
                              value={item.acres}
                              onChange={(e) => handleAllocationChange(index, 'acres', e.target.value)}
                              className="w-32 accent-emerald-600"
                            />
                            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-300">
                              <input
                                type="number"
                                step="0.1"
                                min="0.1"
                                value={item.acres}
                                onChange={(e) => handleAllocationChange(index, 'acres', e.target.value)}
                                className="w-14 text-xs font-bold text-slate-900 text-center focus:outline-none"
                              />
                              <span className="text-[10px] text-slate-500 font-bold">Acres</span>
                            </div>
                            <span className="text-xs font-bold text-slate-600 w-12 text-right">
                              ({pct}%)
                            </span>
                          </div>

                          <button
                            onClick={() => removeCropParcel(index)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Remove Crop Parcel"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setActiveStep(4)}
                    disabled={isOverAllocated}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow transition flex items-center gap-1.5 disabled:opacity-50"
                  >
                    View Master Farm Plan
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 4: MASTER FARM YIELD & FINANCIAL PLAN SUMMARY */}
      {activeStep === 4 && planSummary && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                Step 4: Integrated Master Farm Yield & Financial Plan
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Mode: <strong className="text-slate-800">{planSummary.mode}</strong> across {planSummary.totalAcres} Acres.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={speakPlanSummary}
                disabled={ttsLoading}
                className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-200 transition flex items-center gap-1.5"
              >
                {ttsLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Volume2 className="w-3.5 h-3.5" />}
                Read Summary Aloud
              </button>
              
              <button
                onClick={handleSavePlan}
                disabled={saving}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save & Activate Farm Plan
                  </>
                )}
              </button>
            </div>
          </div>

          {saveSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Master Farm Plan saved successfully! Crops and advisories registered in your account.
            </div>
          )}

          {/* Master Stats Highlighting */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white p-5 rounded-2xl shadow-md">
              <span className="text-xs font-semibold text-emerald-100 uppercase tracking-wider block">
                Total Projected Net Profit
              </span>
              <span className="text-2xl md:text-3xl font-extrabold block mt-1">
                ₹{planSummary.grandTotalProfit.toLocaleString()}
              </span>
              <span className="text-[11px] text-emerald-100/90 mt-1 block">
                Avg ₹{Math.round(planSummary.grandTotalProfit / planSummary.totalAcres).toLocaleString()} / Acre
              </span>
            </div>

            <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-md">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Total Combined Yield Output
              </span>
              <span className="text-2xl md:text-3xl font-extrabold text-emerald-400 block mt-1">
                {planSummary.grandTotalYield} <span className="text-sm text-slate-300">Quintals</span>
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Across {planSummary.parcels.length} Allocated Parcels
              </span>
            </div>

            <div className="bg-slate-800 text-white p-5 rounded-2xl shadow-md">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Gross Expected Revenue
              </span>
              <span className="text-2xl md:text-3xl font-extrabold text-amber-400 block mt-1">
                ₹{planSummary.grandTotalRevenue.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Based on current market MSP/APMC rates
              </span>
            </div>
          </div>

          {/* Detailed Parcel Breakdown Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Detailed Crop Allocation Breakdown</h3>
              <span className="text-xs text-slate-500">Land Area: {planSummary.totalAcres} Acres</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3">Crop Name</th>
                    <th className="p-3">Land Area</th>
                    <th className="p-3">Est. Yield / Acre</th>
                    <th className="p-3">Total Yield</th>
                    <th className="p-3">Net Profit</th>
                    <th className="p-3">Water Requirement</th>
                    <th className="p-3">Fertilizer Dose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 font-semibold">
                  {planSummary.parcels.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="p-3 flex items-center gap-2 font-bold text-slate-900">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }}></span>
                        {p.name}
                      </td>
                      <td className="p-3 font-bold text-slate-900">
                        {p.acres} Acres <span className="text-[10px] text-slate-500 font-normal">({p.pct}%)</span>
                      </td>
                      <td className="p-3">{p.yieldPerAcre} {p.unit}</td>
                      <td className="p-3 font-bold text-emerald-700">{p.totalYield} {p.unit}</td>
                      <td className="p-3 font-bold text-slate-900">₹{p.totalProfit.toLocaleString()}</td>
                      <td className="p-3 text-slate-600 max-w-[150px] truncate">{p.waterReq}</td>
                      <td className="p-3 text-slate-600 max-w-[200px] truncate">{p.fertilizerDose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
