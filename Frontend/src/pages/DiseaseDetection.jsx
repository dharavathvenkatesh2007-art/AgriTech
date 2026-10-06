import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeaderBar from '../components/HeaderBar';
import { useApp } from '../context/AppContext';
import { normalizeLocation } from '../utils/location';
import { 
  Scan, 
  UploadCloud, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Activity, 
  Info,
  Layers,
  Leaf,
  Bug,
  Sparkles,
  Loader2,
  Trash2,
  RefreshCw,
  Sprout,
  ArrowRight,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight,
  Eye,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export default function DiseaseDetection() {
  const { farmPlan, crops, user, token, sidebarOpen, weather, apiFetch, API_BASE } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('disease'); // 'disease' | 'pest'

  // Active crop parcels derived strictly from logged-in farmer's single source of truth
  const activeParcels = (farmPlan?.allocations && farmPlan.allocations.length > 0)
    ? farmPlan.allocations.map(a => ({
        id: a.id || a._id,
        cropKey: a.cropKey || a.cropName || '',
        cropName: a.cropName || a.cropKey || '',
        acres: parseFloat(a.acres || a.area) || 0,
        variety: a.variety || ''
      })).filter(p => p.cropName)
    : (crops && crops.length > 0
      ? crops.filter(c => c.active !== false).map(c => ({
          id: c._id,
          cropKey: c.cropName,
          cropName: c.cropName,
          acres: parseFloat(c.area) || 0,
          variety: c.variety || ''
        }))
      : []);

  // Selected crop parcel for disease scanning
  const [selectedCropKey, setSelectedCropKey] = useState(activeParcels[0]?.cropKey || '');

  useEffect(() => {
    if (activeParcels.length > 0 && !activeParcels.some(p => p.cropKey === selectedCropKey || p.cropName === selectedCropKey)) {
      setSelectedCropKey(activeParcels[0].cropKey || activeParcels[0].cropName);
    }
  }, [farmPlan, crops]);

  const currentParcel = activeParcels.find(p => p.cropKey === selectedCropKey || p.cropName === selectedCropKey) || activeParcels[0];

  // Up to 3 leaf images state
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStepIndex, setAnalysisStepIndex] = useState(0);
  const [scanError, setScanError] = useState(null);

  // Result state
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);

  const analysisSteps = [
    '1. Uploading leaf images to secure server...',
    '2. Running Pl@ntNet foliar analysis...',
    '3. Evaluating top 5 conditions & confidence thresholds...',
    '4. Generating targeted agronomic recommendations...'
  ];

  // Fetch scan history for active farmer
  const fetchScanHistory = async () => {
    if (!token) return;
    try {
      const data = await apiFetch('/disease/history');
      if (data && data.history) {
        setScanHistory(data.history);
      }
    } catch (err) {
      console.warn('Could not fetch scan history:', err.message);
    }
  };

  useEffect(() => {
    fetchScanHistory();
  }, [token]);

  // Image Upload Handlers
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    // Filter file size: minimum 10KB, maximum 10MB per file
    const validFiles = [];
    let rejectedCount = 0;

    for (const f of files) {
      if (f.size < 10 * 1024) {
        alert(`File "${f.name}" is too small (under 10 KB). Please select a clear photograph.`);
        rejectedCount++;
      } else if (f.size > 10 * 1024 * 1024) {
        alert(`File "${f.name}" exceeds the 10 MB size limit.`);
        rejectedCount++;
      } else {
        validFiles.push(f);
      }
    }

    const newFiles = [...imageFiles, ...validFiles].slice(0, 3);
    setImageFiles(newFiles);

    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(newPreviews);
    setScanError(null);
    setDiagnosisResult(null);
  };

  const removeImage = (index) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
    setDiagnosisResult(null);
  };

  const clearImages = () => {
    setImageFiles([]);
    setImagePreviews([]);
    setDiagnosisResult(null);
    setScanError(null);
  };

  // Run Pl@ntNet Disease Scan
  const handleScanDisease = async () => {
    if (imageFiles.length === 0) {
      setScanError('Please select or upload at least one plant leaf photo.');
      return;
    }

    if (!currentParcel) {
      setScanError('Please select a valid crop parcel from Crop Planner.');
      return;
    }

    setAnalyzing(true);
    setScanError(null);
    setAnalysisStepIndex(0);

    try {
      // Step-by-step UI visual feedback
      setAnalysisStepIndex(0);
      await new Promise(r => setTimeout(r, 350));
      setAnalysisStepIndex(1);
      await new Promise(r => setTimeout(r, 450));
      setAnalysisStepIndex(2);
      await new Promise(r => setTimeout(r, 400));
      setAnalysisStepIndex(3);

      const formData = new FormData();
      imageFiles.forEach(file => {
        formData.append('image', file);
      });
      formData.append('cropName', currentParcel.cropName || currentParcel.cropKey);
      if (currentParcel.id) {
        formData.append('cropId', currentParcel.id);
      }

      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE}/disease/detect`, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Unable to analyze image. Please try again.');
      }

      setDiagnosisResult(data.data);
      await fetchScanHistory();
    } catch (err) {
      console.error('Disease scan error:', err);
      setScanError(err.message || 'Unable to identify plant condition. Please upload a clearer image or try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  // Pest Diagnostic State
  const [pestCrop, setPestCrop] = useState(currentParcel?.cropName || 'Cotton');
  const [pestSymptoms, setPestSymptoms] = useState('Chewed leaf edges, larval frass, and yellowing observed on leaves.');
  const [pestAnalyzing, setPestAnalyzing] = useState(false);
  const [pestReport, setPestReport] = useState({
    detectedPest: 'Possible Pest Feeding Damage',
    threatLevel: 'Moderate Threat',
    recommendation: 'Inspect undersides of leaves for caterpillars or mites. Deploy yellow/blue sticky traps.',
    preHarvestIntervalDays: 14
  });

  const handleRunPestDiagnostic = async () => {
    setPestAnalyzing(true);
    try {
      const data = await apiFetch('/predict/pests', {
        method: 'POST',
        body: JSON.stringify({ crop: pestCrop, symptoms: pestSymptoms })
      });
      if (data) {
        setPestReport({
          detectedPest: data.pest || data.detected_pest || 'Possible Pest Damage',
          threatLevel: data.severity || data.threat_level || 'Moderate',
          recommendation: data.recommendedAction || data.recommendation || 'Inspect leaf undersides. Follow locally approved IPM guidance.',
          preHarvestIntervalDays: data.pre_harvest_interval_days || 14
        });
      }
    } catch (err) {
      console.error('Pest diagnostic error:', err);
    } finally {
      setPestAnalyzing(false);
    }
  };

  const farmerLocationDisplay = normalizeLocation(user?.location).displayName;

  // Category Styling Helper
  const getCategoryStyles = (category) => {
    switch (category) {
      case 'DISEASE':
        return {
          bg: 'bg-rose-50 border-rose-200',
          badge: 'bg-rose-100 text-rose-800 border-rose-300',
          title: 'Possible Disease',
          icon: ShieldAlert,
          iconColor: 'text-rose-600'
        };
      case 'PEST':
        return {
          bg: 'bg-orange-50 border-orange-200',
          badge: 'bg-orange-100 text-orange-800 border-orange-300',
          title: 'Possible Pest / Insect Problem',
          icon: Bug,
          iconColor: 'text-orange-600'
        };
      case 'INSECT_DAMAGE':
        return {
          bg: 'bg-amber-50 border-amber-200',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
          title: 'Possible Insect Feeding Damage',
          icon: Bug,
          iconColor: 'text-amber-600'
        };
      case 'HEALTHY':
        return {
          bg: 'bg-emerald-50 border-emerald-200',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          title: 'No Obvious Disease Detected',
          icon: ShieldCheck,
          iconColor: 'text-emerald-600'
        };
      case 'UNCERTAIN':
      default:
        return {
          bg: 'bg-slate-100 border-slate-300',
          badge: 'bg-slate-200 text-slate-800 border-slate-400',
          title: 'Unable to Identify Reliably',
          icon: HelpCircle,
          iconColor: 'text-slate-600'
        };
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col ${sidebarOpen ? 'md:pl-64' : 'pl-0'} transition-all duration-300`}>
      <Navbar />
      <HeaderBar 
        title="Plant Health & Disease Scanner" 
        subtitle="Pl@ntNet API Integration, Category Classification & Crop Agronomic Guidance" 
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* SECTION 1: EMPTY STATE CHECK (No crops selected by farmer) */}
        {activeParcels.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center max-w-2xl mx-auto my-12">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
              <span className="text-4xl">🌱</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">No Crop Selected</h3>
            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
              You have not selected any crops yet. Please select your crop in Yield Prediction & Crop Planner before using Disease Detection.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/crop-planner')}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition transform hover:-translate-y-0.5 inline-flex items-center gap-2"
              >
                <Sprout className="h-4 w-4" />
                Go to Crop Planner
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header Controls & Mode Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200 gap-4">
              <div>
                <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Scan className="h-6 w-6 text-emerald-600" />
                  Plant Health & Pathogen Scanner
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Location: <strong className="text-slate-800">{farmerLocationDisplay}</strong> • Active Parcel: <strong className="text-emerald-700">{currentParcel?.cropName} ({currentParcel?.acres} Acres)</strong>
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-200/80 p-1.5 rounded-xl self-start sm:self-auto">
                <button
                  onClick={() => setActiveTab('disease')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'disease'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <Leaf className="h-3.5 w-3.5" />
                  Pl@ntNet Scanner
                </button>

                <button
                  onClick={() => setActiveTab('pest')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'pest'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <Bug className="h-3.5 w-3.5" />
                  Pest IPM Diagnostics
                </button>
              </div>
            </div>

            {/* TAB 1: DISEASE & PEST DETECTION SCANNER */}
            {activeTab === 'disease' && (
              <div className="space-y-6">

                {/* Farmer-Selected Crop Parcel Selector Bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Sprout className="h-5 w-5 text-emerald-600" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Selected Crop: {currentParcel?.cropName}</span>
                      <span className="text-[11px] text-slate-500">Selected from your Crop Planner ({currentParcel?.acres} Acres)</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {activeParcels.map((parcel, idx) => {
                      const isSelected = parcel.cropKey === selectedCropKey || parcel.cropName === selectedCropKey;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedCropKey(parcel.cropKey || parcel.cropName);
                            setDiagnosisResult(null);
                            setScanError(null);
                          }}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span>{parcel.cropName || parcel.cropKey}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                            {parcel.acres} {parcel.acres === 1 ? 'Acre' : 'Acres'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Scanning Interface Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                  {/* Left Column: Multi-Image Upload & Scanner Controls (5 cols) */}
                  <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-extrabold text-slate-900">Upload Leaf Photos (Up to 3)</h3>
                        <span className="text-[11px] font-semibold text-slate-500">{imageFiles.length} / 3 Selected</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-4">
                        Upload up to 3 photos of the <strong>SAME</strong> plant: 1) Full plant, 2) Affected leaf, 3) Close-up of damaged area.
                      </p>

                      {/* Dropzone */}
                      <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-5 text-center bg-slate-50/80 transition cursor-pointer relative">
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/jpg"
                          multiple
                          onChange={handleFileSelect}
                          disabled={imageFiles.length >= 3 || analyzing}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full disabled:cursor-not-allowed"
                        />
                        <UploadCloud className="h-9 w-9 text-emerald-600 mx-auto mb-2" />
                        <span className="text-xs font-bold text-slate-800 block">Click to upload or drag leaf photos</span>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">JPG, JPEG, PNG (10 KB to 10 MB per file)</span>
                      </div>

                      {/* Image Preview Grid */}
                      {imagePreviews.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700">Selected Photos:</span>
                            <button
                              onClick={clearImages}
                              className="text-[11px] text-rose-600 font-bold hover:underline flex items-center gap-1"
                            >
                              <Trash2 className="h-3 w-3" />
                              Remove All
                            </button>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            {imagePreviews.map((preview, idx) => (
                              <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-100">
                                <img src={preview} alt={`Leaf ${idx + 1}`} className="w-full h-full object-cover" />
                                <button
                                  onClick={() => removeImage(idx)}
                                  className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-rose-600 text-white rounded-full transition"
                                  title="Remove image"
                                >
                                  ✕
                                </button>
                                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 rounded font-bold">
                                  {idx === 0 ? 'Photo 1' : (idx === 1 ? 'Photo 2' : 'Photo 3')}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Scan Error Alert */}
                      {scanError && (
                        <div className="mt-4 bg-rose-50 border border-rose-200 p-3.5 rounded-xl text-xs font-semibold text-rose-700 flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-extrabold block">Scan Alert</span>
                            <p className="mt-0.5 font-normal">{scanError}</p>
                          </div>
                        </div>
                      )}

                      {/* Multi-Step Analysis Indicator */}
                      {analyzing && (
                        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                          <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-900">
                            <Loader2 className="h-4 w-4 text-emerald-600 animate-spin" />
                            <span>Analyzing Plant Health...</span>
                          </div>
                          <p className="text-xs text-emerald-800 font-medium">{analysisSteps[analysisStepIndex]}</p>
                          <div className="w-full bg-emerald-200 rounded-full h-1.5 overflow-hidden mt-1">
                            <div 
                              className="bg-emerald-600 h-full transition-all duration-300"
                              style={{ width: `${((analysisStepIndex + 1) / 4) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleScanDisease}
                      disabled={analyzing || imageFiles.length === 0}
                      className="mt-6 w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Scan className="h-4 w-4" />}
                      <span>{analyzing ? 'Analyzing Plant Tissue...' : `Analyze ${currentParcel?.cropName} Plant`}</span>
                    </button>
                  </div>

                  {/* Right Column: Category-Specific Diagnostic Output (7 cols) */}
                  <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    {diagnosisResult ? (
                      <div className="space-y-6">

                        {/* Image Quality Warning if poor */}
                        {diagnosisResult.imageQuality && !diagnosisResult.imageQuality.acceptable && (
                          <div className="p-4 bg-rose-50 border border-rose-300 rounded-2xl flex items-start gap-3 text-xs text-rose-900">
                            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="font-extrabold text-sm block text-rose-900">Image Quality is Too Low</strong>
                              <p className="mt-1 leading-relaxed">
                                {diagnosisResult.reason || 'Please take a clear photograph of the affected leaf in good natural lighting.'}
                              </p>
                              <button
                                onClick={clearImages}
                                className="mt-3 px-4 py-2 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 transition"
                              >
                                Scan Another Image
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Category Banner & Header */}
                        {(!diagnosisResult.imageQuality || diagnosisResult.imageQuality.acceptable) && (
                          <>
                            {(() => {
                              const catStyle = getCategoryStyles(diagnosisResult.category);
                              const CategoryIcon = catStyle.icon;

                              return (
                                <div className={`p-5 rounded-2xl border ${catStyle.bg} space-y-3`}>
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/10 pb-3">
                                    <div className="flex items-center gap-2.5">
                                      <CategoryIcon className={`h-6 w-6 ${catStyle.iconColor}`} />
                                      <div>
                                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                                          {catStyle.title}
                                        </span>
                                        <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                                          {diagnosisResult.diagnosis || diagnosisResult.disease}
                                        </h3>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${catStyle.badge}`}>
                                        Confidence: {(diagnosisResult.confidence * 100).toFixed(0)}%
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                                    <span>Target Crop: <strong className="text-emerald-700">{diagnosisResult.crop}</strong></span>
                                    <span>Classification: <strong className="text-slate-800">{diagnosisResult.category}</strong></span>
                                  </div>
                                </div>
                              );
                            })()}

                            {/* Crop Match Conflict Warning */}
                            {diagnosisResult.cropMatchMessage && (
                              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900 font-medium">
                                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                <span>{diagnosisResult.cropMatchMessage}</span>
                              </div>
                            )}

                            {/* Low Confidence / Uncertain Alert */}
                            {(diagnosisResult.confidence < 0.50 || diagnosisResult.category === 'UNCERTAIN') && (
                              <div className="p-4 bg-slate-100 border border-slate-300 rounded-2xl space-y-3 text-xs text-slate-800">
                                <div className="flex items-start gap-2">
                                  <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                  <div>
                                    <strong className="font-extrabold text-slate-900 block text-sm">⚠ Low Confidence Result</strong>
                                    <p className="mt-0.5 text-slate-600 leading-relaxed">
                                      The image does not provide enough evidence for a reliable diagnosis. Try taking a closer photo of the affected area in good lighting.
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={clearImages}
                                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                                >
                                  <RefreshCw className="h-3.5 w-3.5" />
                                  <span>Scan Another Image</span>
                                </button>
                              </div>
                            )}

                            {/* Other Possible Conditions (Top 5 Normalized Results) */}
                            {diagnosisResult.alternatives && diagnosisResult.alternatives.length > 0 && (
                              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                                <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
                                  Other Possible Conditions
                                </span>
                                <div className="space-y-2">
                                  {diagnosisResult.alternatives.map((alt, i) => {
                                    const pct = Math.round(alt.confidence * 100);
                                    return (
                                      <div key={i} className="space-y-1">
                                        <div className="flex justify-between text-xs text-slate-700 font-semibold">
                                          <span>{i + 2}. {alt.name}</span>
                                          <span className="font-bold text-slate-900">{pct}%</span>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                          <div className="bg-slate-600 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Agronomic Recommendation */}
                            {diagnosisResult.recommendation && (
                              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                                  <Leaf className="h-5 w-5 text-emerald-600" />
                                  <h4 className="text-sm font-extrabold text-slate-900">
                                    Agronomic Guidance for {diagnosisResult.crop}
                                  </h4>
                                </div>

                                <div className="space-y-3.5 text-xs">
                                  <div>
                                    <span className="font-bold text-slate-900 block">What Was Detected:</span>
                                    <p className="text-slate-700 mt-0.5 leading-relaxed">{diagnosisResult.recommendation.whatWasDetected}</p>
                                  </div>

                                  <div>
                                    <span className="font-bold text-slate-900 block">Observed Symptoms:</span>
                                    <p className="text-slate-700 mt-0.5 leading-relaxed">{diagnosisResult.recommendation.symptoms}</p>
                                  </div>

                                  <div>
                                    <span className="font-bold text-slate-900 block">Immediate Actions:</span>
                                    <ul className="list-disc pl-4 space-y-1 text-slate-700 mt-1">
                                      {diagnosisResult.recommendation.immediateActions?.map((act, i) => (
                                        <li key={i}>{act}</li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                                      <span className="font-bold text-emerald-800 block">Monitoring Schedule</span>
                                      <p className="text-slate-600 mt-0.5">{diagnosisResult.recommendation.monitoring}</p>
                                    </div>
                                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                                      <span className="font-bold text-blue-800 block">Prevention Protocol</span>
                                      <p className="text-slate-600 mt-0.5">{diagnosisResult.recommendation.prevention}</p>
                                    </div>
                                  </div>

                                  <div className="bg-emerald-50/90 p-4 rounded-xl border border-emerald-200">
                                    <span className="font-bold text-emerald-900 block">Treatment Guidance</span>
                                    <p className="text-emerald-800 mt-1 leading-relaxed">{diagnosisResult.recommendation.treatmentGuidance}</p>
                                  </div>

                                  {diagnosisResult.recommendation.whenToSeekHelp && (
                                    <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-200 text-rose-900">
                                      <span className="font-bold block">When to Seek Extension Guidance:</span>
                                      <p className="mt-0.5">{diagnosisResult.recommendation.whenToSeekHelp}</p>
                                    </div>
                                  )}

                                  {/* Chemical Safety Disclaimer */}
                                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-snug">
                                    <strong>Safety Notice:</strong> {diagnosisResult.recommendation.chemicalSafetyDisclaimer}
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center my-auto py-12 text-center space-y-3">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                          <Scan className="h-8 w-8 text-slate-400" />
                        </div>
                        <h4 className="text-base font-bold text-slate-800">No Leaf Scan Performed Yet</h4>
                        <p className="text-xs text-slate-500 max-w-sm">
                          Select leaf photos of <strong>{currentParcel?.cropName}</strong> on the left and click "Analyze Plant" to run diagnosis.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* SECTION 2: FARMER DISEASE SCAN HISTORY */}
                {scanHistory.length > 0 && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-8">
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 mb-4">
                      <Clock className="h-5 w-5 text-emerald-600" />
                      Disease & Pest History for {user?.name || 'Farmer'}
                    </h3>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold">
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4">Crop</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">Diagnosis</th>
                            <th className="py-3 px-4">Confidence</th>
                            <th className="py-3 px-4">Treatment Guidance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {scanHistory.slice(0, 10).map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="py-3 px-4 font-medium text-slate-600">
                                {new Date(item.scannedAt).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4 font-bold text-slate-900">{item.cropName}</td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  item.category === 'PEST' || item.category === 'INSECT_DAMAGE'
                                    ? 'bg-amber-100 text-amber-800'
                                    : (item.category === 'HEALTHY' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800')
                                }`}>
                                  {item.category || 'DISEASE'}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-semibold text-slate-800">{item.diagnosis || item.disease}</td>
                              <td className="py-3 px-4 font-bold text-emerald-600">{(item.confidence * 100).toFixed(0)}%</td>
                              <td className="py-3 px-4 text-slate-600 truncate max-w-xs">{item.treatment}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PEST DIAGNOSTICS */}
            {activeTab === 'pest' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-base font-extrabold text-slate-900">Pest Observation Diagnostic</h3>
                  <p className="text-xs text-slate-500">Describe pest damage symptoms on your crop parcel to generate IPM recommendations.</p>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Target Crop</label>
                    <select
                      value={pestCrop}
                      onChange={(e) => setPestCrop(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none"
                    >
                      {activeParcels.map((p, i) => (
                        <option key={i} value={p.cropName || p.cropKey}>
                          {p.cropName || p.cropKey} ({p.acres} Acres)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Observed Field Symptoms</label>
                    <textarea
                      rows="4"
                      value={pestSymptoms}
                      onChange={(e) => setPestSymptoms(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    ></textarea>
                  </div>

                  <button
                    onClick={handleRunPestDiagnostic}
                    disabled={pestAnalyzing}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                  >
                    {pestAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bug className="h-4 w-4" />}
                    <span>Run Pest IPM Diagnostic</span>
                  </button>
                </div>

                <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pest Diagnosis</span>
                      <h3 className="text-xl font-bold text-slate-900 mt-0.5">{pestReport.detectedPest}</h3>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      {pestReport.threatLevel}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      Integrated Pest Management (IPM) Strategy
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {pestReport.recommendation}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                      <span className="text-[11px] font-bold text-emerald-800 block">Pre-Harvest Interval (PHI)</span>
                      <span className="text-2xl font-extrabold text-emerald-900 mt-1 block">
                        {pestReport.preHarvestIntervalDays} <span className="text-xs font-semibold text-emerald-700">Days</span>
                      </span>
                      <span className="text-[10px] text-emerald-700 block mt-0.5">Safe waiting period before harvesting</span>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <span className="text-[11px] font-bold text-blue-800 block">Economic Threshold Level (ETL)</span>
                      <span className="text-base font-bold text-blue-900 mt-1 block">
                        8 Moths / Trap / Night
                      </span>
                      <span className="text-[10px] text-blue-700 block mt-0.5">Spray only when ETL threshold crossed</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
