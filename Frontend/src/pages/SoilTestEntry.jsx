import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Save, FileSpreadsheet, Loader2, Sparkles, CheckCircle } from 'lucide-react';
import VoiceRecorder from '../components/VoiceRecorder';

export default function SoilTestEntry() {
  const { apiFetch, loadDashboard } = useApp();
  const navigate = useNavigate();

  const [N, setN] = useState('');
  const [P, setP] = useState('');
  const [K, setK] = useState('');
  const [pH, setpH] = useState('');
  const [soilType, setSoilType] = useState('Alluvial');
  const [labName, setLabName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [parsedFeedback, setParsedFeedback] = useState(null);

  // Multilingual voice input parser for N, P, K, and pH
  const parseSoilSpokenText = (text) => {
    const normalized = text.toLowerCase();
    const parsed = {};
    
    // Helper to find the first number following any list of keyword triggers
    const extractNumber = (keywords, string) => {
      for (const kw of keywords) {
        const index = string.indexOf(kw);
        if (index !== -1) {
          const slice = string.substring(index + kw.length);
          const match = slice.match(/\d+(\.\d+)?/); // matches digits or decimals
          if (match) {
            return parseFloat(match[0]);
          }
        }
      }
      return null;
    };

    // Trigger lists in English, Telugu, and Hindi
    const nTriggers = ['nitrogen', 'nైట్రోజన్', 'నత్రజని', 'नाइट्रोजन', ' n '];
    const pTriggers = ['phosphorus', 'phosphate', 'ఫాస్ఫరస్', 'భాస్వరం', 'फास्फोरस', ' p '];
    const kTriggers = ['potassium', 'potash', 'పొటాషియం', 'పొటాష్', 'पोटेशियम', 'पोटाश', ' k '];
    const phTriggers = ['ph', 'పిహెచ్', 'पीएच', 'సార సూచిక'];

    const nVal = extractNumber(nTriggers, normalized);
    const pVal = extractNumber(pTriggers, normalized);
    const kVal = extractNumber(kTriggers, normalized);
    const phVal = extractNumber(phTriggers, normalized);

    if (nVal !== null) parsed.N = nVal;
    if (pVal !== null) parsed.P = pVal;
    if (kVal !== null) parsed.K = kVal;
    if (phVal !== null) parsed.pH = phVal;

    return parsed;
  };

  const handleTranscript = (transcriptText) => {
    setSpeechTranscript(transcriptText);
    const parsed = parseSoilSpokenText(transcriptText);
    
    if (Object.keys(parsed).length > 0) {
      setParsedFeedback(parsed);
      if (parsed.N !== undefined) setN(parsed.N.toString());
      if (parsed.P !== undefined) setP(parsed.P.toString());
      if (parsed.K !== undefined) setK(parsed.K.toString());
      if (parsed.pH !== undefined) setpH(parsed.pH.toString());
    } else {
      setParsedFeedback(null);
      setError("Speech recognized, but could not parse N, P, K, or pH values. Try saying: 'Nitrogen 80, Phosphorus 40, Potassium 50, pH 6.5'");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (N === '' || P === '' || K === '' || pH === '') {
      setError('Please provide N, P, K, and pH values.');
      return;
    }

    setLoading(true);
    try {
      await apiFetch('/soil-tests', {
        method: 'POST',
        body: JSON.stringify({
          N: parseFloat(N),
          P: parseFloat(P),
          K: parseFloat(K),
          pH: parseFloat(pH),
          soilType,
          labName
        })
      });
      setSuccess(true);
      await loadDashboard(); // refresh data
      setTimeout(() => {
        // Navigate to crop recommendation page after saving
        navigate('/crop-recommendation');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to submit soil test report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-farm-darkBg py-6 px-4 md:px-8 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <button
          onClick={() => navigate('/')}
          className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-slate-300 hover:text-white transition-all duration-200"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-white tracking-tight">Soil Test Entry</h1>
      </div>

      <div className="space-y-5">
        {/* Voice Input Panel */}
        <div className="glass-card-green p-5 rounded-3xl border border-farm-green/15 flex flex-col space-y-4">
          <div className="flex items-center space-x-2 text-farm-gold">
            <Sparkles className="w-5 h-5 fill-current" />
            <h2 className="text-sm font-bold uppercase tracking-wider">Voice-First entry</h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Click the microphone and speak your values. E.g. <i>"Nitrogen eighty, phosphorus forty five, potassium fifty, pH six point eight"</i>
          </p>
          
          <VoiceRecorder 
            onTranscript={handleTranscript} 
            placeholder="Record soil values..."
          />

          {speechTranscript && (
            <div className="bg-black/20 p-3 rounded-2xl border border-white/5 text-xs text-slate-400">
              <span className="font-semibold block text-slate-300 mb-1">Transcript:</span>
              "{speechTranscript}"
            </div>
          )}

          {parsedFeedback && (
            <div className="bg-farm-green/5 p-3 rounded-2xl border border-farm-green/20 text-xs flex flex-wrap gap-2 text-farm-gold font-semibold">
              <span className="text-slate-300 mr-1 block w-full mb-1">Detected Values:</span>
              {parsedFeedback.N !== undefined && <span className="bg-farm-green/10 border border-farm-green/20 px-2 py-1 rounded">N: {parsedFeedback.N}</span>}
              {parsedFeedback.P !== undefined && <span className="bg-farm-green/10 border border-farm-green/20 px-2 py-1 rounded">P: {parsedFeedback.P}</span>}
              {parsedFeedback.K !== undefined && <span className="bg-farm-green/10 border border-farm-green/20 px-2 py-1 rounded">K: {parsedFeedback.K}</span>}
              {parsedFeedback.pH !== undefined && <span className="bg-farm-green/10 border border-farm-green/20 px-2 py-1 rounded">pH: {parsedFeedback.pH}</span>}
            </div>
          )}
        </div>

        {/* Manual numeric forms */}
        <div className="glass-panel p-6 rounded-3xl border border-farm-green/15 shadow-xl">
          {success && (
            <div className="bg-farm-green/10 border border-farm-green/20 text-farm-gold text-xs px-3 py-2.5 rounded-xl mb-4 flex items-center space-x-2 justify-center font-medium">
              <CheckCircle className="w-4.5 h-4.5 text-farm-gold" />
              <span>Soil test saved. Getting recommendations...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-2.5 rounded-xl mb-4 text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-white/5 pb-2 mb-2 flex items-center space-x-2">
              <FileSpreadsheet className="w-4 h-4 text-farm-green" />
              <span>Verify & Save</span>
            </h3>

            {/* N, P, K parameters */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nitrogen (N)</label>
                <input
                  type="number"
                  value={N}
                  onChange={(e) => setN(e.target.value)}
                  placeholder="kg/ac"
                  className="w-full bg-white/5 border border-white/10 focus:border-farm-green/50 text-white rounded-xl px-3 py-2 text-center text-sm outline-none transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phosp. (P)</label>
                <input
                  type="number"
                  value={P}
                  onChange={(e) => setP(e.target.value)}
                  placeholder="kg/ac"
                  className="w-full bg-white/5 border border-white/10 focus:border-farm-green/50 text-white rounded-xl px-3 py-2 text-center text-sm outline-none transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Potas. (K)</label>
                <input
                  type="number"
                  value={K}
                  onChange={(e) => setK(e.target.value)}
                  placeholder="kg/ac"
                  className="w-full bg-white/5 border border-white/10 focus:border-farm-green/50 text-white rounded-xl px-3 py-2 text-center text-sm outline-none transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* pH value */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Soil pH Value</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="14"
                value={pH}
                onChange={(e) => setpH(e.target.value)}
                placeholder="E.g., 6.5 (Neutral)"
                className="w-full bg-white/5 border border-white/10 focus:border-farm-green/50 text-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-200"
                required
              />
            </div>

            {/* Soil Type Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Soil Type</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full bg-farm-darkCard border border-white/10 focus:border-farm-green/50 text-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-200"
              >
                <option value="Alluvial">Alluvial (ఒండ్రు మట్టి)</option>
                <option value="Red Soil">Red Soil (ఎర్ర నేలలు)</option>
                <option value="Black Cotton">Black Cotton (నల్ల రేగడి)</option>
                <option value="Sandy/Loam">Sandy / Loam (ఇసుక / బంకమట్టి)</option>
                <option value="Laterite">Laterite (లాటరైట్ నేలలు)</option>
              </select>
            </div>

            {/* Testing Lab */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Testing Laboratory Name</label>
              <input
                type="text"
                value={labName}
                onChange={(e) => setLabName(e.target.value)}
                placeholder="E.g., Govt Agri Lab, Tenali"
                className="w-full bg-white/5 border border-white/10 focus:border-farm-green/50 text-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-farm-green hover:bg-farm-green-dark disabled:bg-farm-green/50 text-white font-medium py-3 rounded-xl transition-all duration-300 mt-4 shadow-md shadow-farm-green/20 flex items-center justify-center space-x-2 text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving Record...</span>
                </>
              ) : (
                <>
                  <Save className="w-4.5 h-4.5" />
                  <span>Save and Get Crops</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
