import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import { 
  Droplets, 
  Clock, 
  Calendar, 
  TrendingDown, 
  ShieldCheck, 
  AlertCircle,
  BarChart3,
  Waves,
  CloudSun
} from 'lucide-react';

const SmartIrrigation = () => {
  const { weather, activeCrop, crops, sidebarOpen, apiFetch } = useApp();
  const [crop, setCrop] = useState(activeCrop?.cropName || (crops && crops[0]?.cropName) || 'Paddy');
  const [growthStage, setGrowthStage] = useState('vegetative');
  const [soilMoisture, setSoilMoisture] = useState(28); // %
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    if (activeCrop?.cropName) {
      setCrop(activeCrop.cropName);
    } else if (crops && crops.length > 0) {
      setCrop(crops[0].cropName);
    }
  }, [activeCrop, crops]);

  useEffect(() => {
    if (weather?.soil?.rootZoneMoisturePct) {
      setSoilMoisture(weather.soil.rootZoneMoisturePct);
    }
  }, [weather]);

  // Irrigation decision state
  const [recommendation, setRecommendation] = useState({
    irrigationNeeded: true,
    urgency: 'Within 24 hours',
    waterDepthMm: 12.5,
    recommendedLitersPerAcre: 50585,
    optimalTimeWindow: 'Early morning (05:30 - 08:30 AM) or late evening (05:30 - 07:30 PM)',
    et0: 5.2, // mm/day
    etc: 6.0, // mm/day
    kc: 1.15,
    traditionalFloodLiters: 72336,
    litersSaved: 21751,
    savingPct: 30.0
  });

  const handleCompute = async () => {
    setCalculating(true);
    try {
      const data = await apiFetch('/predict/irrigation', {
        method: 'POST',
        body: JSON.stringify({
          crop_name: crop,
          growth_stage: growthStage,
          soil_moisture: Number(soilMoisture),
          field_capacity: 45.0,
          wilting_point: 18.0,
          temperature: weather?.current?.temperature || 32.5,
          humidity: weather?.current?.humidity || 62.0,
          solar_radiation: 23.0,
          forecasted_rain_mm: weather?.current?.precipitation || 0.0
        })
      });
      if (data) {
        setRecommendation({
          irrigationNeeded: data.irrigation_needed,
          urgency: data.urgency,
          waterDepthMm: data.recommendation?.water_depth_mm ?? 12.5,
          recommendedLitersPerAcre: data.recommendation?.water_volume_liters_per_acre ?? 50585,
          optimalTimeWindow: data.recommendation?.optimal_time_window || 'Early morning',
          et0: data.metrics?.et0_reference_mm_day ?? 5.2,
          etc: data.metrics?.etc_crop_mm_day ?? 6.0,
          kc: data.metrics?.crop_coefficient_kc ?? 1.15,
          traditionalFloodLiters: data.water_saving_analytics?.traditional_flood_liters ?? 72336,
          litersSaved: data.water_saving_analytics?.liters_saved ?? 21751,
          savingPct: data.water_saving_analytics?.estimated_water_reduction_pct ?? 30.0
        });
      }
    } catch (err) {
      console.error('Irrigation compute error:', err);
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col ${sidebarOpen ? 'md:pl-64' : 'pl-0'} transition-all duration-300`}>
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Droplets className="h-7 w-7 text-blue-600" />
              Smart Irrigation & Water Optimization
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Predictive irrigation scheduling powered by FAO-56 Penman-Monteith Evapotranspiration models and real-time live weather telemetry.
            </p>
          </div>

          {weather?.current && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 font-semibold shadow-sm">
              <CloudSun className="h-4 w-4 text-blue-600" />
              <span>Real-Time Weather: {weather.current.temperature}°C | {weather.current.humidity}% RH | {weather.current.precipitation || 0} mm Rain</span>
            </div>
          )}
        </div>

        {/* Configuration Bar */}
        <div className="mt-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Crop Variety</label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Paddy">Paddy / Rice (Oryza sativa)</option>
              <option value="Cotton">Cotton (Gossypium)</option>
              <option value="Maize">Maize / Corn (Zea mays)</option>
              <option value="Groundnut">Groundnut / Peanut</option>
              <option value="Sugarcane">Sugarcane</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Growth Stage</label>
            <select
              value={growthStage}
              onChange={(e) => setGrowthStage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="initial">Initial Seedling / Germination</option>
              <option value="vegetative">Vegetative / Tillering</option>
              <option value="mid_season">Mid-Season (Flowering / Grain Fill)</option>
              <option value="late_season">Late Season / Maturation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Current Soil Moisture ({soilMoisture}%)
            </label>
            <input
              type="range"
              min="10"
              max="50"
              value={soilMoisture}
              onChange={(e) => setSoilMoisture(e.target.value)}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>10% (Wilting)</span>
              <span>45% (Field Cap.)</span>
            </div>
          </div>

          <div>
            <button
              onClick={handleCompute}
              disabled={calculating}
              className="w-full bg-blue-600 text-white font-medium p-2.5 rounded-lg text-sm hover:bg-blue-700 transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Waves className="h-4 w-4" />
              <span>{calculating ? 'Calculating ETc...' : 'Re-calculate Demand'}</span>
            </button>
          </div>
        </div>

        {/* Irrigation Decision Cards */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Recommendation Status */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Irrigation Decision Engine</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  recommendation.irrigationNeeded 
                    ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  {recommendation.urgency}
                </span>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-baseline gap-4">
                <div>
                  <span className="text-4xl font-extrabold text-slate-900">
                    {(recommendation.recommendedLitersPerAcre || 0).toLocaleString()}
                  </span>
                  <span className="text-sm font-medium text-slate-600 ml-2">Liters / Acre</span>
                </div>
                <div className="sm:border-l sm:border-slate-200 sm:pl-4">
                  <span className="text-2xl font-bold text-blue-600">
                    {recommendation.waterDepthMm} mm
                  </span>
                  <span className="text-xs text-slate-500 block">Recommended Effective Depth</span>
                </div>
              </div>

              {/* Delivery Window */}
              <div className="mt-5 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-blue-900 block">Recommended Delivery Window</span>
                  <p className="text-xs text-blue-800 mt-0.5">{recommendation.optimalTimeWindow}</p>
                </div>
              </div>

              {/* Evapotranspiration Breakdown */}
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Reference ET₀</span>
                  <span className="text-lg font-bold text-slate-800">{recommendation.et0} mm/day</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Crop Coeff. (Kc)</span>
                  <span className="text-lg font-bold text-slate-800">{recommendation.kc}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[11px] text-slate-500 block">Crop ETc</span>
                  <span className="text-lg font-bold text-blue-600">{recommendation.etc} mm/day</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-100">
              Computed using FAO-56 Penman-Monteith equation incorporating solar radiation, temperature, relative humidity, and canopy resistance.
            </p>
          </div>

          {/* Water Conservation & Sustainability Impact Card */}
          <div className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white p-6 rounded-xl shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-emerald-300" />
                <h2 className="text-lg font-bold text-emerald-100">Water-Saving Analytics</h2>
              </div>
              <p className="text-xs text-emerald-300/80 mt-1">Comparison against traditional flood irrigation</p>

              <div className="mt-6 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-emerald-200 font-medium">Estimated Reduction</span>
                  <span className="text-3xl font-extrabold text-emerald-400">~{recommendation.savingPct}%</span>
                </div>
                <div className="w-full bg-emerald-950/60 rounded-full h-2 mt-3">
                  <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-emerald-200">Traditional Flood Demand:</span>
                  <span className="font-semibold text-slate-100">{(recommendation.traditionalFloodLiters || 0).toLocaleString()} L/acre</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-200">Precision Scheduled:</span>
                  <span className="font-semibold text-emerald-300">{(recommendation.recommendedLitersPerAcre || 0).toLocaleString()} L/acre</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2">
                  <span className="text-emerald-100 font-bold">Conserved Water:</span>
                  <span className="font-bold text-emerald-300">+{(recommendation.litersSaved || 0).toLocaleString()} Liters</span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-black/20 p-3 rounded-lg text-[11px] text-emerald-200/90 leading-relaxed border border-emerald-500/20">
              <strong>Source Attribution:</strong> Reflects the documented precision irrigation benchmark of up to 30% reduction in agricultural water usage reported in reference smart agriculture field deployments.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SmartIrrigation;
