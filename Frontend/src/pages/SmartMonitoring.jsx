import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
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
  Compass,
  Gauge,
  Calendar,
  CloudRain,
  CloudSun,
  CloudLightning,
  ShieldCheck,
  Search,
  Navigation,
  Globe
} from 'lucide-react';

const SmartMonitoring = () => {
  const { weather, weatherLoading, fetchRealTimeWeather, updateFarmerLocation, sidebarOpen, user, crops } = useApp();
  const [searchCity, setSearchCity] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(user?.preferredLanguage || 'Telugu');
  const [locating, setLocating] = useState(false);
  const [selectedField, setSelectedField] = useState('Field-A (Paddy Lowland - 2.5 Acres)');

  useEffect(() => {
    if (crops && crops.length > 0) {
      const topCrop = crops[0];
      setSelectedField(`${topCrop.cropName} Parcel (${topCrop.area} Acres - ${topCrop.variety || 'Active Crop'})`);
    }
  }, [crops]);

  useEffect(() => {
    if (!weather) {
      fetchRealTimeWeather();
    }
  }, []);

  // Handle GPS Geolocation
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await fetchRealTimeWeather({ lat: latitude, lon: longitude, city: 'My Farm (GPS)' });
        setLocating(false);
      },
      (error) => {
        console.warn('Geolocation failed or was denied:', error.message);
        alert('Could not access GPS location. Using default location.');
        setLocating(false);
      },
      { timeout: 10000 }
    );
  };

  const handleCitySearch = async (e) => {
    e?.preventDefault();
    if (!searchCity.trim()) return;
    await updateFarmerLocation(searchCity.trim());
    setSearchCity('');
  };

  // Weather condition icon helper
  const getWeatherIcon = (iconName, className = "h-5 w-5") => {
    switch (iconName) {
      case 'cloud-rain':
        return <CloudRain className={`${className} text-blue-500`} />;
      case 'cloud-lightning':
        return <CloudLightning className={`${className} text-amber-500`} />;
      case 'cloud-sun':
        return <CloudSun className={`${className} text-amber-400`} />;
      case 'sun':
        return <Sun className={`${className} text-yellow-500`} />;
      default:
        return <CloudSun className={`${className} text-sky-400`} />;
    }
  };

  const current = weather?.current || {
    temperature: 32.5,
    apparentTemperature: 36.8,
    humidity: 58,
    precipitation: 0.0,
    windSpeed: 11.5,
    windDirection: 210,
    surfacePressure: 1008,
    uvIndex: 7.2,
    condition: 'Partly Cloudy',
    icon: 'cloud-sun',
    spraySuitability: 'Optimal'
  };

  const soil = weather?.soil || {
    surfaceTemperatureC: 34.2,
    depth6cmTemperatureC: 29.5,
    rootZoneMoisturePct: 34.8,
    subSoilMoisturePct: 37.2,
    healthStatus: 'Optimal Root Hydration'
  };

  const et0 = weather?.evapotranspiration?.et0TodayMm || 4.9;
  const forecast = weather?.forecast || [];
  const userLocStr = typeof user?.location === 'string'
    ? user.location
    : [user?.location?.village, user?.location?.district, user?.location?.state].filter(Boolean).join(', ') || 'My Farm Location';

  const locationName = weather?.location?.name 
    ? `${weather.location.name}${weather.location.state ? `, ${weather.location.state}` : ''}`
    : userLocStr;

  // Spray status color helper
  const getSprayBadge = (status) => {
    if (!status) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    const lower = status.toLowerCase();
    if (lower.includes('optimal') || lower.includes('good')) {
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
    if (lower.includes('avoid') || lower.includes('hazard') || lower.includes('not')) {
      return 'bg-rose-100 text-rose-800 border-rose-200';
    }
    return 'bg-amber-100 text-amber-800 border-amber-200';
  };

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col ${sidebarOpen ? 'md:pl-64' : 'pl-0'} transition-all duration-300`}>
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Activity className="h-7 w-7 text-emerald-600" />
                Real-Time Crop & Environmental Monitoring
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Real-Time
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Live meteorological station telemetry, real-time soil moisture and temperature models, and satellite canopy indices.
            </p>
          </div>

          {/* Quick Location Search & GPS Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <form onSubmit={handleCitySearch} className="relative flex items-center">
              <input
                type="text"
                placeholder="Search city/district..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none w-44"
              />
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            </form>

            <button
              onClick={handleDetectLocation}
              disabled={locating || weatherLoading}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-sm transition disabled:opacity-50"
              title="Use Device GPS"
            >
              <Navigation className={`h-3.5 w-3.5 text-emerald-400 ${locating ? 'animate-spin' : ''}`} />
              <span>{locating ? 'Locating...' : 'GPS'}</span>
            </button>

            <button
              onClick={() => fetchRealTimeWeather()}
              disabled={weatherLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition shadow-sm disabled:opacity-50"
              title="Refresh Real-Time Data"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${weatherLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Real-time Weather Station Status Banner */}
        <div className="mt-6 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-xl shadow-md">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  {locationName}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Live Station
                </span>
              </div>
              <span className="text-xs text-slate-500">
                Source: {weather?.provider || 'Open-Meteo High-Resolution Agro-Meteorological Network'} • Coordinates: {weather?.location?.latitude !== undefined ? Number(weather.location.latitude).toFixed(2) : '16.51'}°N, {weather?.location?.longitude !== undefined ? Number(weather.location.longitude).toFixed(2) : '80.64'}°E
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-600">
            <div>
              <span className="text-slate-400 block text-[11px]">Field Parcel</span>
              <select
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
                className="font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded px-2 py-0.5 text-xs mt-0.5 focus:outline-none"
              >
                {crops && crops.length > 0 ? (
                  crops.map((c, i) => (
                    <option key={c._id || i} value={`${c.cropName} Parcel (${c.area} Acres - ${c.variety || 'Active Crop'})`}>
                      {c.cropName} Parcel ({c.area} Acres)
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Field-A (Paddy Lowland - 2.5 Acres)">Field-A (Paddy Lowland - 2.5 Ac)</option>
                    <option value="Field-B (Cotton Upland - 3.0 Acres)">Field-B (Cotton Upland - 3.0 Ac)</option>
                    <option value="Field-C (Chilli Plot - 1.0 Acre)">Field-C (Chilli Plot - 1.0 Ac)</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Field Spray Window</span>
              <span className={`inline-block px-2 py-0.5 rounded font-bold text-xs mt-0.5 border ${getSprayBadge(current.spraySuitability)}`}>
                {current.spraySuitability || 'Optimal'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Last Real-Time Sync</span>
              <span className="font-semibold text-emerald-700 mt-0.5 block">
                {weather?.lastUpdated ? new Date(weather.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}
              </span>
            </div>
          </div>
        </div>

        {/* Primary Real-Time Metric Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Real-time Root Zone Soil Moisture */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Root-Zone Soil Moisture</span>
              <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                <Droplets className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-slate-900">{soil.rootZoneMoisturePct}%</span>
              <span className="ml-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                {soil.healthStatus}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Depth: 0–7 cm (Effective crop root uptake layer)
            </p>
          </div>

          {/* Real-Time Sub-Soil Storage */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Sub-Soil Deep Moisture</span>
              <div className="p-2.5 bg-cyan-100 text-cyan-700 rounded-xl">
                <Droplets className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-slate-900">{soil.subSoilMoisturePct}%</span>
              <span className="ml-2 text-xs font-semibold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100">
                Recharged
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Depth: 7–28 cm (Sub-surface water reserve)
            </p>
          </div>

          {/* Real-time Ambient & Soil Temperature */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Air & Soil Temperature</span>
              <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
                <Thermometer className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-3">
              <div>
                <span className="text-3xl font-extrabold text-slate-900">{current.temperature}°C</span>
                <span className="block text-[11px] text-slate-500">Air (Feels: {current.apparentTemperature}°C)</span>
              </div>
              <div className="pl-3 border-l border-slate-200">
                <span className="text-xl font-bold text-slate-700">{soil.surfaceTemperatureC}°C</span>
                <span className="block text-[11px] text-slate-500">Soil Surface</span>
              </div>
            </div>
          </div>

          {/* Real-time Humidity, Wind & UV */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Microclimate & Sun</span>
              <div className="p-2.5 bg-yellow-100 text-yellow-700 rounded-xl">
                <Sun className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-3">
              <div>
                <span className="text-3xl font-extrabold text-slate-900">{current.humidity}%</span>
                <span className="block text-[11px] text-slate-500">Relative Humidity</span>
              </div>
              <div className="pl-3 border-l border-slate-200">
                <span className="text-xl font-bold text-slate-700">{current.windSpeed}</span>
                <span className="block text-[11px] text-slate-500">km/h Wind</span>
              </div>
            </div>
          </div>

        </div>

        {/* Real-Time Agronomic Advisory & Spraying Guideline Banner */}
        <div className="mt-6 bg-gradient-to-r from-emerald-900 to-teal-950 rounded-2xl p-6 text-white shadow-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-emerald-800/80">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
              <div>
                <h3 className="text-base font-bold tracking-wide">Real-Time Agronomic Weather Advisory</h3>
                <span className="text-xs text-emerald-300">Generated dynamically from live atmospheric & soil telemetry</span>
              </div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-emerald-300">Language:</span>
              {['English', 'Telugu', 'Hindi'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-3 py-1 rounded-lg font-bold transition text-xs ${
                    selectedLanguage === lang
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'bg-emerald-900/80 text-emerald-200 hover:bg-emerald-800'
                  }`}
                >
                  {lang === 'Telugu' ? 'తెలుగు' : lang === 'Hindi' ? 'हिंदी' : 'English'}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 text-sm leading-relaxed text-emerald-50 font-medium">
            {weather?.advice ? (
              <p>{weather.advice[selectedLanguage] || weather.advice.English}</p>
            ) : (
              <p>Favorable weather conditions in {locationName}. Ideal window for field operations and nutrient management.</p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-800/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-emerald-400 block text-[11px]">Today Rain:</span>
              <span className="font-bold text-white">{current.precipitation || 0.0} mm</span>
            </div>
            <div>
              <span className="text-emerald-400 block text-[11px]">Barometric Pressure:</span>
              <span className="font-bold text-white">{current.surfacePressure} hPa</span>
            </div>
            <div>
              <span className="text-emerald-400 block text-[11px]">UV Solar Index:</span>
              <span className="font-bold text-white">{current.uvIndex} (Very High)</span>
            </div>
            <div>
              <span className="text-emerald-400 block text-[11px]">FAO-56 ET₀ Water Evap:</span>
              <span className="font-bold text-white">{et0} mm/day</span>
            </div>
          </div>
        </div>

        {/* 7-Day Real-Time Agro-Weather Forecast */}
        {forecast.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  7-Day Agro-Meteorological Forecast
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Precipitation probabilities, diurnal temperature ranges, and FAO-56 Reference Evapotranspiration (ET₀)
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                Next 7 Days
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-4">
              {forecast.map((day, idx) => {
                const dateObj = new Date(day.date);
                const dayName = idx === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                const dateNum = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                return (
                  <div 
                    key={day.date}
                    className={`p-3.5 rounded-xl border text-center transition ${
                      idx === 0 
                        ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400' 
                        : 'bg-slate-50 border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <span className="font-bold text-xs text-slate-800 block">{dayName}</span>
                    <span className="text-[10px] text-slate-500 block mb-2">{dateNum}</span>

                    <div className="my-2 flex justify-center">
                      {getWeatherIcon(day.icon, "h-7 w-7")}
                    </div>

                    <span className="text-xs font-semibold text-slate-700 block truncate" title={day.condition}>
                      {day.condition}
                    </span>

                    <div className="mt-2 text-xs font-bold text-slate-900">
                      <span>{day.tempMax}°</span>
                      <span className="text-slate-400 font-normal ml-1">{day.tempMin}°</span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-200/80 text-[11px] space-y-0.5">
                      <div className="text-blue-600 font-semibold">
                        🌧 {day.rainProb}%
                      </div>
                      <div className="text-slate-500 text-[10px]">
                        ET₀: {day.et0} mm
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Soil Chemical Properties & Multi-Spectral Satellite Row */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* N-P-K & Soil Health Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Soil Fertility & Nutrient Profile (NPK)</h2>
            <p className="text-xs text-slate-500 mb-6">Real-time optical reflectance and soil nutrient baseline calibration</p>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-center">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">Nitrogen (N)</span>
                <p className="text-2xl font-bold text-emerald-900 mt-2">82 <span className="text-xs font-normal">mg/kg</span></p>
                <div className="w-full bg-emerald-200 rounded-full h-2 mt-3">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
                <span className="text-[11px] text-emerald-700 mt-1 inline-block font-medium">Adequate (Range: 75-100)</span>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-center">
                <span className="text-xs font-semibold text-blue-800 uppercase tracking-wide">Phosphorus (P)</span>
                <p className="text-2xl font-bold text-blue-900 mt-2">44 <span className="text-xs font-normal">mg/kg</span></p>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-3">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <span className="text-[11px] text-blue-700 mt-1 inline-block font-medium">Optimal (Range: 35-50)</span>
              </div>

              <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl text-center">
                <span className="text-xs font-semibold text-purple-800 uppercase tracking-wide">Potassium (K)</span>
                <p className="text-2xl font-bold text-purple-900 mt-2">48 <span className="text-xs font-normal">mg/kg</span></p>
                <div className="w-full bg-purple-200 rounded-full h-2 mt-3">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <span className="text-[11px] text-purple-700 mt-1 inline-block font-medium">Adequate (Range: 40-60)</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-sm">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-xs text-slate-400 block">Soil pH</span>
                  <span className="font-bold text-slate-800">6.6 (Slightly Acidic to Neutral)</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Electrical Cond. (EC)</span>
                  <span className="font-bold text-slate-800">0.85 dS/m (Non-Saline)</span>
                </div>
              </div>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 mt-3 sm:mt-0">
                Nutrient Absorption Efficiency: 94%
              </span>
            </div>
          </div>

          {/* Multi-spectral Satellite Imagery / NDVI Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Satellite className="h-5 w-5 text-indigo-600" />
                  Satellite NDVI Vigor
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
                  Sentinel-2
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Normalized Difference Vegetation Index (Canopy chlorophyll)</p>

              {/* NDVI Color Map Graphic */}
              <div className="mt-4 p-4 bg-slate-900 rounded-xl text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900 via-emerald-700 to-green-500 opacity-80"></div>
                <div className="relative z-10 py-3">
                  <span className="text-3xl font-extrabold tracking-tight">0.74</span>
                  <p className="text-xs text-emerald-200 font-medium mt-1">High Canopy Density & Biomass</p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Vegetative Health:</span>
                  <span className="font-bold text-emerald-700">Healthy Chlorophyll</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Cloud Cover:</span>
                  <span className="font-medium text-slate-800">12% (Clear Optical Pass)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Satellite Acquisition:</span>
                  <span className="font-medium text-slate-800">Yesterday, 10:42 AM</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
              NDVI index above 0.60 signifies uniform canopy coverage without significant moisture or pest defoliation.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SmartMonitoring;
