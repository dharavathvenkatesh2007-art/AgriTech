import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { User, MapPin, Landmark, Globe, Save, ArrowLeft, LogOut, CheckCircle } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile, logout } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [village, setVillage] = useState('');
  const [landArea, setLandArea] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('Telugu');
  
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    setName(user.name || '');
    setState(user.location?.state || '');
    setDistrict(user.location?.district || '');
    setVillage(user.location?.village || '');
    setLandArea(user.landArea || '');
    setPreferredLanguage(user.preferredLanguage || 'Telugu');
  }, [user, navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);
    setSaving(true);

    try {
      await updateProfile({
        name,
        preferredLanguage,
        location: { state, district, village },
        landArea: landArea ? parseFloat(landArea) : 0
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-farm-darkBg py-6 px-4 md:px-8 max-w-md mx-auto flex flex-col justify-between">
      <div>
        {/* Header navigation bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-slate-300 hover:text-white transition-all duration-200"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-white tracking-tight">Farmer Profile</h1>
          <button
            onClick={handleLogout}
            className="p-2.5 bg-red-500/10 hover:bg-red-500/20 rounded-xl border border-red-500/10 text-red-400 hover:text-red-300 transition-all duration-200 flex items-center space-x-1.5 text-xs font-semibold"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Profile Card Form */}
        <div className="glass-panel p-6 rounded-3xl border border-farm-green/15 shadow-xl">
          {success && (
            <div className="bg-farm-green/10 border border-farm-green/20 text-farm-gold text-xs px-3 py-2.5 rounded-xl mb-4 flex items-center space-x-2 justify-center font-medium">
              <CheckCircle className="w-4.5 h-4.5 text-farm-gold" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-2.5 rounded-xl mb-4 text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            {/* Farmer Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Farmer's Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-farm-green/50 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Preferred Language selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Preferred Language</label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-400" />
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
            </div>

            {/* Farm Area in Acres */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Farm Land Area (Acres)</label>
              <div className="relative">
                <Landmark className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="number"
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-farm-green/50 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all duration-200"
                  step="0.1"
                  required
                />
              </div>
            </div>

            {/* Location (State/District/Village) */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Farm Location</label>
              
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-farm-green/50 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all duration-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="District"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-farm-green/50 text-white rounded-xl px-3 py-2.5 text-sm outline-none transition-all duration-200"
                  required
                />
                <input
                  type="text"
                  placeholder="Village"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-farm-green/50 text-white rounded-xl px-3 py-2.5 text-sm outline-none transition-all duration-200"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-farm-green hover:bg-farm-green-dark disabled:bg-farm-green/50 text-white font-medium py-3 rounded-xl transition-all duration-300 mt-4 shadow-md shadow-farm-green/20 flex items-center justify-center space-x-2 text-sm"
            >
              <Save className="w-4.5 h-4.5" />
              <span>{saving ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
