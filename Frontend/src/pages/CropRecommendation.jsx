import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Sparkles, TrendingUp, AlertTriangle, ArrowRight, Loader2, Volume2, Check } from 'lucide-react';

export default function CropRecommendation() {
  const { latestSoilTest, user, apiFetch, loadDashboard } = useApp();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);
  
  const [selectedCrop, setSelectedCrop] = useState('');
  const [registering, setRegistering] = useState(false);
  const [cropAreas, setCropAreas] = useState({});

  useEffect(() => {
    if (recommendations.length > 0) {
      const initialAreas = {};
      recommendations.forEach(rec => {
        initialAreas[rec.crop] = user?.landArea || 1.0;
      });
      setCropAreas(initialAreas);
    }
  }, [recommendations, user]);
  
  const [ttsAudioUrl, setTtsAudioUrl] = useState(null);
  const [ttsLoading, setTtsLoading] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!latestSoilTest) {
      setError("No recent soil test found. Please enter soil test values first.");
      return;
    }
    fetchRecommendations();
  }, [latestSoilTest]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch recommendations directly from the Flask AI Service on port 5001
      const response = await fetch('http://127.0.0.1:5001/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          N: latestSoilTest.N,
          P: latestSoilTest.P,
          K: latestSoilTest.K,
          pH: latestSoilTest.pH,
          temperature: 28.5, // simulated regional temp
          rainfall: 1100, // simulated regional rainfall
          state: user?.location?.state || 'Andhra Pradesh'
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'AI service failed');
      }

      setRecommendations(data.recommendations || []);
      
      // Auto-speak the recommendations once loaded
      if (data.recommendations && data.recommendations.length > 0) {
        speakRecommendations(data.recommendations);
      }
    } catch (err) {
      console.error(err);
      setError('Could not query the AI recommendation model. Make sure Flask service is running.');
    } finally {
      setLoading(false);
    }
  };

  // Convert recommendations into spoken advice using backend TTS
  const speakRecommendations = async (cropsList) => {
    setTtsLoading(true);
    const lang = user?.preferredLanguage || 'Telugu';
    
    // Construct localized script to speak
    let speechText = '';
    const top2 = cropsList.slice(0, 2);

    if (lang === 'Telugu') {
      speechText = `మీ మట్టి పరీక్ష ఆధారంగా, మా కృత్రిమ మేధస్సు సిఫార్సులు ఇలా ఉన్నాయి: `;
      top2.forEach((rec, idx) => {
        speechText += `${idx === 0 ? 'మొదటిది' : ' మరియు రెండవది'}, ఎకరాకు ${rec.expected_profit_per_acre} రూపాయల లాభంతో ${rec.crop === 'Paddy' ? 'వరి' : rec.crop === 'Cotton' ? 'పత్తి' : rec.crop === 'Maize' ? 'మొక్కజొన్న' : rec.crop}. `;
      });
      speechText += `దయచేసి ఒక పంటను ఎంచుకోండి.`;
    } else if (lang === 'Hindi') {
      speechText = `आपकी मिट्टी की जांच के आधार पर, हमारी एआई सिफारिशें इस प्रकार हैं: `;
      top2.forEach((rec, idx) => {
        speechText += `${idx === 0 ? 'पहला' : ' और दूसरा'}, प्रति एकड़ ${rec.expected_profit_per_acre} रुपये के लाभ के साथ ${rec.crop === 'Paddy' ? 'धान' : rec.crop === 'Cotton' ? 'कपास' : rec.crop === 'Maize' ? 'मक्का' : rec.crop}. `;
      });
      speechText += `कृपया एक फसल का चयन करें।`;
    } else {
      speechText = `Based on your soil test, our AI recommends the following crops: `;
      top2.forEach((rec, idx) => {
        speechText += `${idx === 0 ? 'First' : ' and second'}, ${rec.crop}, with an expected profit of ${rec.expected_profit_per_acre} rupees per acre. `;
      });
      speechText += `Please select a crop to proceed.`;
    }

    try {
      const data = await apiFetch('/voice/tts', {
        method: 'POST',
        body: JSON.stringify({ text: speechText, language: lang })
      });
      
      if (data.audioUrl) {
        setTtsAudioUrl(data.audioUrl);
        // Play audio file
        const host = API_BASE.replace('/api', '');
        const fullAudioUrl = `${host}${data.audioUrl}`;
        
        if (audioRef.current) {
          audioRef.current.src = fullAudioUrl;
          audioRef.current.load();
          audioRef.current.play().catch(e => console.log('Speech autoplay blocked by browser'));
        }
      }
    } catch (err) {
      console.error('Speech synthesis warning:', err);
    } finally {
      setTtsLoading(false);
    }
  };

  const handleReplaySpeech = () => {
    if (audioRef.current && ttsAudioUrl) {
      audioRef.current.play();
    } else if (recommendations.length > 0) {
      speakRecommendations(recommendations);
    }
  };

  const handleSelectCrop = async (cropName) => {
    const areaVal = parseFloat(cropAreas[cropName]) || 1.0;
    setSelectedCrop(cropName);
    setRegistering(true);
    setError(null);
    try {
      await apiFetch('/crops', {
        method: 'POST',
        body: JSON.stringify({
          cropName,
          soilTestId: latestSoilTest?._id,
          area: areaVal,
          variety: 'High Yield Standard'
        })
      });
      
      // Stop speech audio if playing
      if (audioRef.current) {
        audioRef.current.pause();
      }

      await loadDashboard();
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to register selected crop');
      setRegistering(false);
    }
  };

  // Helper for matching background classes
  const getRiskColor = (risk) => {
    if (risk === 'Low') return 'text-green-400 bg-green-500/10 border-green-500/20';
    if (risk === 'Medium') return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  return (
    <div className="min-h-screen bg-farm-darkBg py-6 px-4 md:px-8 max-w-md mx-auto flex flex-col justify-between">
      <audio ref={audioRef} className="hidden" />
      
      <div>
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/soil-test')}
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-slate-300 hover:text-white transition-all duration-200"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-white tracking-tight">AI Crop Recommendations</h1>
          
          <button
            onClick={handleReplaySpeech}
            disabled={ttsLoading}
            className="p-2.5 bg-farm-gold/10 hover:bg-farm-gold/20 disabled:bg-white/5 text-farm-gold disabled:text-slate-500 rounded-xl border border-farm-gold/10 disabled:border-white/5 transition-all duration-200"
            title="Read recommendations aloud"
          >
            {ttsLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-3 py-2.5 rounded-xl mb-6 text-center font-medium">
            {error}
          </div>
        )}

        {/* Loading display */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-10 h-10 text-farm-green animate-spin" />
            <p className="text-sm text-slate-400">Querying Agronomic AI Engine...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header intro */}
            <div className="flex items-center space-x-2 text-farm-gold mb-1">
              <Sparkles className="w-4 h-4 fill-current animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider">Top Soil Matches</span>
            </div>

            {/* Recommendation Cards */}
            {recommendations.map((rec) => (
              <div 
                key={rec.crop}
                className="glass-panel p-5 rounded-3xl border border-farm-green/10 flex flex-col justify-between space-y-4 relative overflow-hidden transition-all duration-300 hover:border-farm-green/30"
              >
                {/* Confidence match tag */}
                <div className="absolute top-0 right-0 bg-farm-green/10 border-l border-b border-farm-green/20 px-3 py-1 rounded-bl-2xl text-[10px] font-bold text-farm-gold">
                  {Math.round(rec.confidence * 100)}% Match
                </div>

                <div className="flex flex-col">
                  <h2 className="text-xl font-bold text-white mb-1.5">{rec.crop === 'Paddy' ? 'Paddy (వరి)' : rec.crop === 'Cotton' ? 'Cotton (పత్తి)' : rec.crop === 'Maize' ? 'Maize (మొక్కజొన్న)' : rec.crop}</h2>
                  
                  {/* Stats list */}
                  <div className="flex items-center space-x-4 pt-1">
                    <div className="flex items-center space-x-1 text-xs text-slate-300">
                      <TrendingUp className="w-4 h-4 text-farm-gold" />
                      <span>Profit: <b>₹{rec.expected_profit_per_acre.toLocaleString()}/ac</b></span>
                    </div>

                    <div className={`flex items-center space-x-1 text-xs px-2 py-0.5 rounded border ${getRiskColor(rec.risk_level)}`}>
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{rec.risk_level} Risk</span>
                    </div>
                  </div>
                </div>

                {/* Crop Area Input */}
                <div className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/5">
                  <span className="text-xs text-slate-300">How much land for this crop?</span>
                  <div className="flex items-center space-x-1.5">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={cropAreas[rec.crop] || ''}
                      onChange={(e) => setCropAreas(prev => ({ ...prev, [rec.crop]: e.target.value }))}
                      className="w-16 bg-farm-darkBg border border-white/10 focus:border-farm-green/50 text-white rounded-lg px-2 py-1 text-xs text-center outline-none transition-all duration-200"
                      required
                    />
                    <span className="text-xs text-slate-400">Acres</span>
                  </div>
                </div>

                {/* Selection button */}
                <button
                  onClick={() => handleSelectCrop(rec.crop)}
                  disabled={registering}
                  className="w-full bg-farm-green hover:bg-farm-green-dark disabled:bg-farm-green/50 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 text-xs"
                >
                  {registering && selectedCrop === rec.crop ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Starting Schedule...</span>
                    </>
                  ) : (
                    <>
                      <span>Select Crop & Pre-Generate Advisories</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer hint & Multi-Crop Planner Link */}
      {!loading && (
        <div className="py-4 space-y-2">
          <button
            onClick={() => navigate('/multi-crop-planner')}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 px-4 rounded-xl border border-slate-700 transition flex items-center justify-center space-x-2 text-xs"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Open AI Yield & Multi-Crop Acreage Planner</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
          <div className="text-center text-[10px] text-slate-400 max-w-xs mx-auto">
            Or select a single crop above for automatic 110-day advisory timeline pre-generation.
          </div>
        </div>
      )}
    </div>
  );
}

// Get API_BASE globally
const API_BASE = 'http://localhost:5000/api';
