import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Sprout, Phone, Lock, User, MapPin, Landmark, Globe, Loader2 } from 'lucide-react';

export default function Auth() {
  const { login, register, loading } = useApp();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  
  // Form fields
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [village, setVillage] = useState('');
  const [landArea, setLandArea] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('Telugu');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!phone || !password) {
      setError("Phone number and password are required.");
      return;
    }

    try {
      if (isLogin) {
        await login(phone, password);
      } else {
        if (!name) {
          setError("Name is required for registration.");
          return;
        }
        await register(
          name, 
          phone, 
          password, 
          preferredLanguage, 
          { state, district, village }, 
          landArea ? parseFloat(landArea) : 0
        );
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check inputs.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-farm-darkBg px-4 py-8">
      {/* Background radial highlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-farm-green/10 blur-[80px] pointer-events-none"></div>

      <div className="w-full max-w-md glass-panel p-6 md:p-8 rounded-3xl border border-farm-green/15 shadow-2xl relative overflow-hidden">
        {/* Branding header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-farm-green rounded-2xl flex items-center justify-center shadow-lg shadow-farm-green/20 mb-2">
            <Sprout className="w-7 h-7 text-farm-gold" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans">AgriTech</h1>
          <p className="text-xs text-slate-400">Voice-First Farm Advisory Portal</p>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-center text-slate-100">
          {isLogin ? 'Login to Portal' : 'Register New Farmer'}
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-2.5 rounded-xl mb-4 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Registration fields */}
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Farmer's Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-farm-green/50 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all duration-200"
                required
              />
            </div>
          )}

          {/* Core inputs */}
          <div className="relative">
            <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-farm-green/50 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all duration-200"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 focus:border-farm-green/50 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all duration-200"
              required
            />
          </div>

          {/* Language preference for Registration */}
          {!isLogin && (
            <>
              <div className="relative">
                <Globe className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full bg-farm-darkCard border border-white/10 focus:border-farm-green/50 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all duration-200 appearance-none"
                >
                  <option value="Telugu">Telugu (తెలుగు)</option>
                  <option value="Hindi">Hindi (हिन्दी)</option>
                  <option value="English">English</option>
                </select>
              </div>

              {/* Location inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-farm-green/50 text-white rounded-xl pl-8 pr-3 py-2.5 text-xs outline-none transition-all duration-200"
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="District"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-farm-green/50 text-white rounded-xl px-3 py-2.5 text-xs outline-none transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Village"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-farm-green/50 text-white rounded-xl px-3 py-2.5 text-xs outline-none transition-all duration-200"
                  />
                </div>
                <div className="relative">
                  <Landmark className="absolute left-2.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    placeholder="Area (Acres)"
                    value={landArea}
                    onChange={(e) => setLandArea(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-farm-green/50 text-white rounded-xl pl-8 pr-3 py-2.5 text-xs outline-none transition-all duration-200"
                    step="0.1"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-farm-green hover:bg-farm-green-dark disabled:bg-farm-green/50 text-white font-medium py-3 rounded-xl transition-all duration-300 mt-2 shadow-md shadow-farm-green/20 flex items-center justify-center space-x-2 text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{isLogin ? 'Login' : 'Create Account'}</span>
            )}
          </button>
        </form>

        {/* Toggle between login and registration */}
        <div className="mt-6 text-center text-xs text-slate-400">
          <span>{isLogin ? "New to AgriTech?" : "Already registered?"} </span>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-farm-gold hover:underline font-semibold"
          >
            {isLogin ? 'Register Here' : 'Login Here'}
          </button>
        </div>
      </div>
    </div>
  );
}
