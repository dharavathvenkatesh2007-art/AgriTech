import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeaderBar from '../components/HeaderBar';
import { useApp } from '../context/AppContext';
import { normalizeLocation } from '../utils/location';
import { CROP_LIFECYCLE_DATA, getCropLifecycleData } from '../data/cropLifecycleData';
import { 
  Activity, 
  Droplets, 
  Thermometer, 
  Wind, 
  Sun, 
  Satellite, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  MapPin,
  Calendar,
  CloudRain,
  CloudSun,
  ShieldCheck,
  Sprout,
  CheckSquare,
  Clock,
  ArrowRight,
  TrendingUp,
  Bug,
  AlertCircle,
  FileText,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function SmartMonitoring() {
  const { weather, weatherLoading, fetchRealTimeWeather, sidebarOpen, user, crops, farmPlan, token, apiFetch } = useApp();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(user?.preferredLanguage || 'Telugu');

  // Planned crops from single source of truth (farmPlan or crops context for current logged-in farmer)
  const activeParcels = (farmPlan?.allocations && farmPlan.allocations.length > 0)
    ? farmPlan.allocations.map(a => ({
        cropKey: a.cropKey || a.cropName || 'Paddy',
        cropName: a.cropName || a.cropKey || 'Paddy',
        acres: parseFloat(a.acres || a.area) || 0,
        variety: a.variety || ''
      }))
    : (crops && crops.length > 0
      ? crops.filter(c => c.active !== false).map(c => ({
          cropKey: c.cropName,
          cropName: c.cropName,
          acres: parseFloat(c.area) || 0,
          variety: c.variety || ''
        }))
      : []);

  // Active crop detail panel selection
  const [activeCropKey, setActiveCropKey] = useState(activeParcels[0]?.cropKey || '');
  const [activeTab, setActiveTab] = useState('timeline'); // 'overview' | 'timeline' | 'tasks' | 'water' | 'nutrients' | 'pests' | 'weather' | 'yield'
  const [parcelDiseaseHistory, setParcelDiseaseHistory] = useState([]);

  useEffect(() => {
    if (activeParcels.length > 0 && !activeParcels.some(p => p.cropKey === activeCropKey || p.cropName === activeCropKey)) {
      setActiveCropKey(activeParcels[0].cropKey || activeParcels[0].cropName);
    }
  }, [farmPlan, crops]);

  // Fetch disease scan history for current active crop parcel
  useEffect(() => {
    const fetchParcelHistory = async () => {
      if (!token || !activeCropKey) return;
      try {
        const data = await apiFetch(`/disease/history?cropName=${encodeURIComponent(activeCropKey)}`);
        if (data && data.history) {
          setParcelDiseaseHistory(data.history);
        }
      } catch (err) {
        console.warn('Could not load parcel disease history:', err.message);
      }
    };
    fetchParcelHistory();
  }, [token, activeCropKey]);

  // Interactive Checklist completion state persisted in localStorage
  const [checkedTasks, setCheckedTasks] = useState(() => {
    const saved = localStorage.getItem('agritech_task_status');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {};
      }
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem('agritech_task_status', JSON.stringify(checkedTasks));
  }, [checkedTasks]);

  const toggleTask = (taskId) => {
    setCheckedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  // Get active crop parcel info and lifecycle data
  const currentParcel = activeParcels.find(p => p.cropKey === activeCropKey || p.cropName === activeCropKey) || activeParcels[0] || { cropKey: '', cropName: '', acres: 1.0 };
  const cropGuide = getCropLifecycleData(currentParcel?.cropKey || currentParcel?.cropName);

  // Current stage calculation (simulated Day 35 of crop cycle)
  const currentDay = 35;
  const currentStage = cropGuide.stages.find(s => currentDay >= s.startDay && currentDay <= s.endDay) || cropGuide.stages[2] || cropGuide.stages[0];

  // Checklist for active stage
  const currentChecklist = currentStage?.checklist || [];
  const completedCount = currentChecklist.filter(t => checkedTasks[t.id]).length;
  const totalCount = currentChecklist.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Real-time weather parameters
  const currentTemp = weather?.current?.temperature ?? 32;
  const currentHumidity = weather?.current?.humidity ?? 65;
  const currentPrecipitation = weather?.current?.precipitation ?? 0.0;
  const rootZoneMoisture = weather?.soil?.rootZoneMoisturePct ?? 34.8;
  const locationName = weather?.location?.name 
    ? `${weather.location.name}, ${weather.location.state || 'Telangana'}` 
    : normalizeLocation(user?.location).displayName;

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col ${sidebarOpen ? 'md:pl-64' : 'pl-0'} transition-all duration-300`}>
      <Navbar />
      <HeaderBar 
        title="Crop Lifecycle & Action Guide" 
        subtitle="Stage-by-stage agronomic instructions, daily checklists, and sensor integration" 
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {activeParcels.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm text-center max-w-2xl mx-auto my-12">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
              <span className="text-4xl">🌱</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">No Crop Selected Yet</h3>
            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
              Select a crop in Yield Prediction & Multi-Crop Acreage Planner before using Crop Monitoring.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/crop-planner')}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition transform hover:-translate-y-0.5 inline-flex items-center gap-2"
              >
                <Sprout className="h-4 w-4" />
                Choose Your Crop
              </button>
            </div>
          </div>
        ) : (
          <>
        {/* SECTION 1: MY CROPS OVERVIEW GRID */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Sprout className="h-5 w-5 text-emerald-600" />
                My Active Planned Crops ({activeParcels.length})
              </h2>
              <p className="text-xs text-slate-500">
                Select any crop below to view its complete day-by-day lifecycle guide and action checklist.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
              Single Source Synced
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {activeParcels.map((parcel, idx) => {
              const guide = getCropLifecycleData(parcel.cropKey || parcel.cropName);
              const isSelected = parcel.cropKey === activeCropKey || parcel.cropName === activeCropKey;
              const stage = guide.stages.find(s => currentDay >= s.startDay && currentDay <= s.endDay) || guide.stages[0];

              return (
                <div
                  key={idx}
                  onClick={() => setActiveCropKey(parcel.cropKey)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                      : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{guide.icon || '🌾'}</span>
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-sm">{parcel.cropKey}</h3>
                          <span className="text-[11px] text-slate-500 font-semibold">{parcel.acres} {parcel.acres === 1 ? 'Acre' : 'Acres'}</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Healthy
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Current Stage:</span>
                        <span className="font-bold text-slate-800">{stage.name}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Progress:</span>
                        <span className="font-bold text-emerald-700">Day {currentDay} / {guide.durationDays} ({Math.round((currentDay / guide.durationDays) * 100)}%)</span>
                      </div>

                      {/* Mini Progress Bar */}
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-1">
                        <div 
                          className="bg-emerald-500 h-full rounded-full transition-all" 
                          style={{ width: `${Math.round((currentDay / guide.durationDays) * 100)}%` }}
                        ></div>
                      </div>

                      <div className="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Next Task</span>
                        <span className="text-xs text-slate-700 font-medium truncate block mt-0.5">
                          {stage.checklist[0]?.task || 'Check soil moisture & inspect leaves'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveCropKey(parcel.cropKey);
                    }}
                    className={`mt-4 w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{isSelected ? 'Viewing Crop Guide' : 'View Crop Guide'}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: DETAILED CROP LIFECYCLE PANEL FOR SELECTED CROP */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Panel Header */}
          <div className="p-6 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-600/30 border border-emerald-500/40 rounded-2xl text-2xl shadow-inner">
                {cropGuide.icon || '🌾'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-white tracking-tight">{cropGuide.name}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {currentParcel.acres} {currentParcel.acres === 1 ? 'Acre' : 'Acres'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Current Stage: <strong className="text-emerald-400">{currentStage.name}</strong> • Total Duration: {cropGuide.durationDays} Days
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-300">
              <div className="bg-white/10 px-3 py-2 rounded-xl border border-white/10 text-center">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Soil Moisture</span>
                <span className="font-extrabold text-emerald-400 text-sm">{rootZoneMoisture}%</span>
              </div>
              <div className="bg-white/10 px-3 py-2 rounded-xl border border-white/10 text-center">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Health Status</span>
                <span className="font-extrabold text-white text-sm">Optimal</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-slate-200 bg-slate-50 px-4 flex overflow-x-auto">
            {[
              { id: 'timeline', label: 'Lifecycle Timeline', icon: Calendar },
              { id: 'tasks', label: `Today's Tasks (${completedCount}/${totalCount})`, icon: CheckSquare },
              { id: 'water', label: 'Water & Irrigation', icon: Droplets },
              { id: 'nutrients', label: 'Nutrients & Soil', icon: Activity },
              { id: 'pests', label: 'Pests & Diseases', icon: Bug },
              { id: 'weather', label: 'Weather Guide', icon: CloudSun },
              { id: 'yield', label: 'Yield Forecast', icon: TrendingUp },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3.5 text-xs font-bold transition border-b-2 whitespace-nowrap ${
                    isActive
                      ? 'border-emerald-600 text-emerald-700 bg-white shadow-xs'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB CONTENT AREAS */}
          <div className="p-6">
            
            {/* TAB 1: LIFECYCLE TIMELINE */}
            {activeTab === 'timeline' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-emerald-600" />
                      Stage-by-Stage Crop Growth Timeline
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Follow actionable agronomic recommendations customized for every developmental phase.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    Day {currentDay} of {cropGuide.durationDays}
                  </span>
                </div>

                {/* Vertical Timeline */}
                <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                  {cropGuide.stages.map((stage, sIdx) => {
                    const isCurrent = currentDay >= stage.startDay && currentDay <= stage.endDay;
                    const isPassed = currentDay > stage.endDay;

                    return (
                      <div key={stage.id} className="relative group">
                        {/* Timeline Node Icon */}
                        <div className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition ${
                          isCurrent
                            ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md'
                            : (isPassed ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-slate-100 text-slate-400 border border-slate-300')
                        }`}>
                          {isPassed ? '✓' : (sIdx + 1)}
                        </div>

                        {/* Stage Details Card */}
                        <div className={`p-5 rounded-2xl border transition ${
                          isCurrent
                            ? 'bg-emerald-50/50 border-emerald-300 shadow-sm ring-1 ring-emerald-200'
                            : (isPassed ? 'bg-slate-50/60 border-slate-200' : 'bg-white border-slate-200')
                        }`}>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-200/60">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-900 text-sm">{stage.name}</h4>
                                {isCurrent && (
                                  <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold">
                                    CURRENT STAGE
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-slate-500 font-semibold">{stage.dayRange}</span>
                            </div>
                          </div>

                          {/* Action Guidelines */}
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                              <span className="font-bold text-slate-900 block mb-1 text-xs">Recommended Actions</span>
                              <ul className="list-disc list-inside space-y-1 text-slate-700">
                                {stage.actions.map((act, aIdx) => (
                                  <li key={aIdx}>{act}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="space-y-3">
                              <div className="bg-blue-50/80 p-3 rounded-xl border border-blue-100">
                                <span className="font-bold text-blue-900 block text-xs">Water & Irrigation</span>
                                <p className="text-blue-800 text-xs mt-0.5">{stage.waterReq}</p>
                              </div>

                              <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-100">
                                <span className="font-bold text-amber-900 block text-xs">Nutrient & Fertilizer Schedule</span>
                                <p className="text-amber-800 text-xs mt-0.5">{stage.nutrientActions}</p>
                              </div>
                            </div>
                          </div>

                          {/* Pest/Disease Warnings */}
                          {(stage.pestMonitoring || stage.warnings) && (
                            <div className="mt-3 pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                              {stage.pestMonitoring && (
                                <span><strong className="text-rose-700">Pests to Monitor:</strong> {stage.pestMonitoring}</span>
                              )}
                              {stage.warnings && (
                                <span className="text-amber-800 font-semibold">⚠️ {stage.warnings}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: FARMER ACTION CHECKLIST */}
            {activeTab === 'tasks' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-3">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                      <CheckSquare className="h-5 w-5 text-emerald-600" />
                      Farmer Daily Action Checklist ({currentStage.name})
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Mark completed field activities to track agronomic compliance. Status is saved automatically.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
                    <span className="text-xs font-bold text-emerald-900">Completion: {completedCount} / {totalCount} ({progressPct}%)</span>
                    <div className="w-24 bg-emerald-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-600 h-2 rounded-full transition-all" style={{ width: `${progressPct}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {currentChecklist.map((item) => {
                    const isDone = !!checkedTasks[item.id];

                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleTask(item.id)}
                        className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between gap-4 ${
                          isDone
                            ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                            : 'bg-white border-slate-200 hover:border-emerald-300 shadow-xs'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isDone}
                            onChange={() => toggleTask(item.id)}
                            className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                          />
                          <span className={`text-sm font-semibold ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                            {item.task}
                          </span>
                        </div>

                        <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                          isDone ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {isDone ? 'Completed ✓' : 'Pending'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: WATER & IRRIGATION */}
            {activeTab === 'water' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                      <Droplets className="h-5 w-5 text-blue-600" />
                      Crop Irrigation & Moisture Requirements
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      FAO-56 Penman-Monteith evapotranspiration & soil moisture telemetry
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate('/irrigation')}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Open Smart Irrigation →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                    <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block">Stage Water Requirement</span>
                    <p className="text-sm font-semibold text-blue-900 mt-2">{currentStage.waterReq}</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Root-Zone Moisture</span>
                    <span className="text-3xl font-black text-slate-900 mt-2 block">{rootZoneMoisture}%</span>
                    <span className="text-xs text-emerald-600 font-bold">Optimal Range</span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Daily Evapotranspiration (ET₀)</span>
                    <span className="text-3xl font-black text-blue-600 mt-2 block">4.9 mm</span>
                    <span className="text-xs text-slate-400">Reference Penman-Monteith</span>
                  </div>
                </div>

                {currentPrecipitation > 0 && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2 font-medium">
                    <CloudRain className="h-5 w-5 text-blue-600" />
                    <span>Rain Forecast Alert: {currentPrecipitation} mm precipitation detected. Delay irrigation cycle.</span>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: NUTRIENTS */}
            {activeTab === 'nutrients' && (
              <div className="space-y-6">
                <div className="pb-3 border-b border-slate-100">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <Activity className="h-5 w-5 text-emerald-600" />
                    Stage Nutrient Schedule & Soil Fertility
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Custom NPK doses for {currentParcel.cropKey}</p>
                </div>

                <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900">
                  <span className="text-xs font-bold uppercase tracking-wider block">Current Stage Nutrient Schedule</span>
                  <p className="text-sm font-semibold mt-2">{currentStage.nutrientActions}</p>
                </div>
              </div>
            )}

            {/* TAB 5: PESTS & DISEASES */}
            {activeTab === 'pests' && (
              <div className="space-y-6">
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                      <Bug className="h-5 w-5 text-rose-600" />
                      Pest & Disease Scouting Guidelines
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Scouting targets for {currentStage.name}</p>
                  </div>
                  <button onClick={() => navigate('/disease-detection')} className="text-xs font-bold text-emerald-600 hover:underline">
                    Scan Leaf Image →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                  <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                    <span className="font-bold text-rose-900 block text-xs">Pests to Monitor</span>
                    <p className="text-rose-800 text-xs mt-1">{currentStage.pestMonitoring || 'Scout for aphids, thrips, and borers.'}</p>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <span className="font-bold text-amber-900 block text-xs">Disease Warnings</span>
                    <p className="text-amber-800 text-xs mt-1">{currentStage.diseaseMonitoring || 'Monitor for leaf spot and rot.'}</p>
                  </div>
                </div>

                {/* Disease Scan History for Active Crop Parcel */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-emerald-600" />
                      Disease Scan History for {currentParcel.cropKey}
                    </span>
                    <button 
                      onClick={() => navigate('/disease-detection')} 
                      className="text-[11px] font-bold text-emerald-600 hover:underline"
                    >
                      + New Pl@ntNet Scan
                    </button>
                  </div>

                  {parcelDiseaseHistory.length > 0 ? (
                    <div className="space-y-2">
                      {parcelDiseaseHistory.slice(0, 5).map((scan, i) => (
                        <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${
                                scan.category === 'PEST' || scan.category === 'INSECT_DAMAGE'
                                  ? 'bg-amber-100 text-amber-800'
                                  : (scan.category === 'HEALTHY' ? 'bg-emerald-100 text-emerald-800' : (scan.category === 'UNCERTAIN' ? 'bg-slate-200 text-slate-700' : 'bg-rose-100 text-rose-800'))
                              }`}>
                                {scan.category || 'DISEASE'}
                              </span>
                              <span className="font-bold text-slate-800">{scan.diagnosis || scan.disease}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 block mt-0.5">
                              Scanned on {new Date(scan.scannedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {(scan.confidence * 100).toFixed(0)}% Confidence
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
                      No Pl@ntNet disease scans recorded yet for {currentParcel.cropKey}.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 6: WEATHER */}
            {activeTab === 'weather' && (
              <div className="space-y-6">
                <div className="pb-3 border-b border-slate-100">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <CloudSun className="h-5 w-5 text-amber-500" />
                    Agro-Meteorological Guidance for {locationName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Saved farm location coordinates</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Temperature</span>
                    <span className="text-2xl font-black text-slate-900">{currentTemp}°C</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Humidity</span>
                    <span className="text-2xl font-black text-slate-900">{currentHumidity}%</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Precipitation</span>
                    <span className="text-2xl font-black text-slate-900">{currentPrecipitation} mm</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 block">Spray Window</span>
                    <span className="text-xs font-bold text-emerald-700 block mt-1">Optimal</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: YIELD FORECAST */}
            {activeTab === 'yield' && (
              <div className="space-y-6">
                <div className="pb-3 border-b border-slate-100">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    Yield Prediction & Production Forecast
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Calculated for {currentParcel.cropKey} ({currentParcel.acres} Acres)</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <span className="text-xs font-bold text-emerald-800 uppercase block">Yield / Acre</span>
                    <span className="text-3xl font-black text-emerald-900 mt-2 block">26.5 <span className="text-xs font-normal">Quintals</span></span>
                  </div>
                  <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
                    <span className="text-xs font-bold text-blue-800 uppercase block">Total Expected Production</span>
                    <span className="text-3xl font-black text-blue-900 mt-2 block">{(26.5 * currentParcel.acres).toFixed(1)} <span className="text-xs font-normal">Quintals</span></span>
                  </div>
                  <div className="p-5 bg-purple-50 rounded-2xl border border-purple-100">
                    <span className="text-xs font-bold text-purple-800 uppercase block">Model Confidence</span>
                    <span className="text-3xl font-black text-purple-900 mt-2 block">92%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        </>
        )}
      </main>
    </div>
  );
}
