import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Sprout, 
  Phone, 
  Lock, 
  User, 
  MapPin, 
  Landmark, 
  Globe, 
  Loader2, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Scan,
  PieChart
} from 'lucide-react';

export default function Auth() {
  const { login, register, loading } = useApp();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
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
          setError("Farmer's name is required for registration.");
          return;
        }
        await register(
          name, 
          phone, 
          password, 
          preferredLanguage, 
          { state, district, village }, 
          landArea ? parseFloat(landArea) : 3.0
        );
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Radial Gradient Ambient Lights */}
      <div className="fixed top-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-10 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-5xl bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* Left Side Feature Hero Banner (Visible on Desktop) */}
        <div className="lg:col-span-5 relative bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950 p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
          <div className="absolute inset-0 bg-[url('/images/hero_banner.jpg')] bg-cover bg-center opacity-25 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-3 cursor-pointer mb-8" onClick={() => navigate('/')}>
              <div className="p-2.5 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Sprout className="h-6 w-6 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-black text-xl text-white tracking-tight block">AgriSmart AI</span>
                <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest">Precision Farmer Portal</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-4 border border-emerald-500/30">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Smart Farming Intelligence</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            An integrated ai farm management system for <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">sustainable agricultural</span>
            </h2>

            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Join thousands of farmers using precision soil chemistry modeling, crop yield forecasting, plant disease scanning, and multilingual voice advisory.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <PieChart className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-extrabold text-xs text-white block">Soil N-P-K Yield Engine</span>
                  <span className="text-[10px] text-slate-400">Single or Multi-Crop Parcel Allocation</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                  <Scan className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-extrabold text-xs text-white block">Computer Vision Leaf Scanner</span>
                  <span className="text-[10px] text-slate-400">Instant Pathogen & Disease Diagnostics</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-extrabold text-xs text-white block">Multilingual Voice Agronomist</span>
                  <span className="text-[10px] text-slate-400">Speech in Telugu, Hindi & English</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>© {new Date().getFullYear()} AgriSmart AI</span>
            <span className="text-emerald-400 font-extrabold cursor-pointer hover:underline" onClick={() => navigate('/')}>
              Back to Home
            </span>
          </div>
        </div>

        {/* Right Side Form Card */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
          
          <div>
            {/* Header Tabs Toggle */}
            <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 mb-8">
              <button
                type="button"
                onClick={() => { setIsLogin(true); setError(null); }}
                className={`flex-1 py-3 text-xs font-black rounded-xl transition ${
                  isLogin 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Login to Portal
              </button>
              <button
                type="button"
                onClick={() => { setIsLogin(false); setError(null); }}
                className={`flex-1 py-3 text-xs font-black rounded-xl transition ${
                  !isLogin 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Register New Farmer
              </button>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-black text-white">
                {isLogin ? 'Welcome Back, Farmer! 👋' : 'Create Farmer Account 🌾'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {isLogin ? 'Enter your registered phone number and password to access your dashboard.' : 'Fill in your details below to activate your AI agronomy portal.'}
              </p>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs px-4 py-3 rounded-2xl mb-6 font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Farmer Name (Registration Only) */}
              {!isLogin && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Farmer's Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-white rounded-xl pl-11 pr-4 py-3 text-xs outline-none transition font-medium"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Mobile Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-white rounded-xl pl-11 pr-4 py-3 text-xs outline-none transition font-medium"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-white rounded-xl pl-11 pr-11 py-3 text-xs outline-none transition font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Registration Extra Fields */}
              {!isLogin && (
                <>
                  {/* Preferred Language */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Preferred Advisory Language</label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <select
                        value={preferredLanguage}
                        onChange={(e) => setPreferredLanguage(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-white rounded-xl pl-11 pr-4 py-3 text-xs outline-none transition font-medium appearance-none cursor-pointer"
                      >
                        <option value="Telugu">Telugu (తెలుగు)</option>
                        <option value="Hindi">Hindi (हिन्दी)</option>
                        <option value="English">English</option>
                      </select>
                    </div>
                  </div>

                  {/* Location Inputs */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">State</label>
                      <input
                        type="text"
                        placeholder="State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-white rounded-xl px-3.5 py-2.5 text-xs outline-none transition font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">District</label>
                      <input
                        type="text"
                        placeholder="District"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-white rounded-xl px-3.5 py-2.5 text-xs outline-none transition font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Village / Town</label>
                      <input
                        type="text"
                        placeholder="Village"
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-white rounded-xl px-3.5 py-2.5 text-xs outline-none transition font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Total Farm Land (Acres)</label>
                      <input
                        type="number"
                        placeholder="3.0"
                        value={landArea}
                        onChange={(e) => setLandArea(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 text-white rounded-xl px-3.5 py-2.5 text-xs outline-none transition font-medium"
                        step="0.1"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-black py-3.5 rounded-xl transition duration-300 mt-4 shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 text-xs uppercase tracking-wider transform active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Processing Session...</span>
                  </>
                ) : (
                  <>
                    <span>{isLogin ? 'Login to Portal' : 'Register & Launch Portal'}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Toggle between login and registration */}
          <div className="mt-8 pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
            <span>{isLogin ? "Don't have an account yet?" : "Already registered with AgriSmart AI?"} </span>
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-emerald-400 hover:underline font-extrabold ml-1"
            >
              {isLogin ? 'Register New Account' : 'Login Here'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
