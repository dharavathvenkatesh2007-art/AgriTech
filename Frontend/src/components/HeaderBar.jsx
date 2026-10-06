import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  CloudSun, 
  MapPin, 
  Bell, 
  User, 
  Search, 
  Sparkles, 
  RefreshCw, 
  Check, 
  ChevronDown,
  Navigation
} from 'lucide-react';

export default function HeaderBar({ title, subtitle }) {
  const { user, normalizedUserLocation, weather, weatherLoading, fetchRealTimeWeather, updateFarmerLocation } = useApp();
  const navigate = useNavigate();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [newCityInput, setNewCityInput] = useState('');
  const [locating, setLocating] = useState(false);

  const currentTemp = weather?.current?.temperature ?? weather?.temperature ?? 28;
  const currentCondition = weather?.current?.condition ?? weather?.condition ?? 'Partly Cloudy';
  const humidity = weather?.current?.humidity ?? weather?.humidity ?? 70;

  const handleUpdateLocationSubmit = async (e) => {
    e.preventDefault();
    if (!newCityInput.trim()) return;
    await updateFarmerLocation(newCityInput.trim());
    setNewCityInput('');
    setShowLocationModal(false);
  };

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        await fetchRealTimeWeather({ lat: latitude, lon: longitude, city: 'Current GPS Location' });
        setLocating(false);
        setShowLocationModal(false);
      },
      (err) => {
        console.warn('GPS location error:', err.message);
        setLocating(false);
        alert('Unable to access GPS location. Please type your city/district name.');
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Left Side: Page Title or Greeting */}
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            {title || `Welcome back, ${user?.name || 'Farmer'}`}
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {subtitle || 'AI Smart Precision Agriculture Dashboard'}
          </p>
        </div>

        {/* Right Side: Farm Name, Location Badge, Live Weather, Notifications, Profile */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Farm Name Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>AgriTech Farm ({user?.landArea || 3.0} Acres)</span>
          </div>

          {/* Location Badge (Normalized) */}
          <button
            onClick={() => setShowLocationModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl transition shadow-xs group"
            title="Click to change location"
          >
            <MapPin className="h-3.5 w-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
            <span className="truncate max-w-[150px]">{weather?.location?.name ? `${weather.location.name}${weather.location.state ? `, ${weather.location.state}` : ''}` : normalizedUserLocation.displayName}</span>
            <ChevronDown className="h-3 w-3 text-emerald-600" />
          </button>

          {/* Live Weather Quick Bar */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl text-xs font-medium shadow-xs">
            <CloudSun className="h-4 w-4 text-amber-300" />
            <span className="font-bold">{currentTemp}°C</span>
            <span className="hidden sm:inline text-blue-100">| {currentCondition} | {humidity}% RH</span>
            <button 
              onClick={() => fetchRealTimeWeather()}
              className="ml-1 p-0.5 hover:bg-white/20 rounded-md transition" 
              title="Refresh weather data"
            >
              <RefreshCw className={`h-3 w-3 ${weatherLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Notifications Button */}
          <button 
            onClick={() => navigate('/disease-detection')}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition relative border border-slate-200"
            title="Alerts & Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>

          {/* Profile Quick Pill */}
          <div 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-xl cursor-pointer transition border border-slate-200"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {user?.name ? user.name[0].toUpperCase() : 'F'}
            </div>
            <span className="hidden sm:inline text-xs font-bold text-slate-800 pr-1 truncate max-w-[90px]">
              {user?.name || 'Profile'}
            </span>
          </div>
        </div>
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-600" />
                Update Farm Location
              </h3>
              <button 
                onClick={() => setShowLocationModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Weather, crop recommendations, and irrigation algorithms run strictly on your farm's normalized coordinates.
            </p>

            <form onSubmit={handleUpdateLocationSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  City / District / Region
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={newCityInput}
                    onChange={(e) => setNewCityInput(e.target.value)}
                    placeholder="e.g. Mahabubabad, Telangana"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                >
                  Save & Normalize Location
                </button>
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  disabled={locating}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold rounded-xl border border-blue-200 transition"
                >
                  <Navigation className={`h-3.5 w-3.5 ${locating ? 'animate-spin' : ''}`} />
                  <span>{locating ? 'Detecting...' : 'Detect GPS'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
