import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Sprout, 
  Activity, 
  Droplets, 
  Scan, 
  TrendingUp, 
  Bot, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Satellite, 
  BarChart3,
  PieChart,
  Sparkles,
  Users,
  TestTube,
  MapPin,
  CloudSun,
  Bug
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { token, user, weather, crops, activeCrop, fetchRealTimeWeather } = useApp();

  useEffect(() => {
    if (!weather) {
      fetchRealTimeWeather();
    }
  }, []);

  const features = [
    {
      icon: PieChart,
      title: 'AI Yield & Multi-Crop Acreage Planner',
      description: 'Combines soil N-P-K test data, AI yield forecasting, and parcel allocation. Choose 100% single crop or split acreage across multiple crops with real-time yield tonnage and profit estimation.',
      badge: 'Yield & Acreage Engine',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      path: '/multi-crop-planner'
    },
    {
      icon: Activity,
      title: 'Real-Time Agro-Weather & Soil Analytics',
      description: 'Live weather telemetry, 7-day agricultural forecasts, soil NPK fertility tracking, and satellite NDVI canopy vigor index.',
      badge: 'Live Telemetry & Soil',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      path: '/monitoring'
    },
    {
      icon: Droplets,
      title: 'Smart Irrigation & Water Conservation',
      description: 'Automated water balance modeling using the FAO-56 Penman-Monteith Evapotranspiration formula (ET₀ & ETc), delivering up to 30% water savings.',
      badge: 'FAO-56 Precision Water',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      path: '/irrigation'
    },
    {
      icon: Scan,
      title: 'AI Leaf Disease & Pest Diagnostics',
      description: 'Computer vision scanner detecting foliar pathogens, quantifying leaf chlorosis percentage, and providing expert-backed treatment advisories.',
      badge: 'Computer Vision',
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      path: '/disease-detection'
    },
    {
      icon: Bot,
      title: 'Grounded AI Agronomist Assistant',
      description: 'Conversational agronomist agent drawing directly from ICAR, FAO, and IMD knowledge bases with multilingual voice speech output in Telugu, Hindi, and English.',
      badge: 'Voice AI Agronomist',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      path: '/ai-assistant'
    },
    {
      icon: FileText,
      title: 'Targeted Treatments & Harvest Safety',
      description: 'Log localized chemical application spot sprays, track Pre-Harvest Intervals (PHI) safety countdowns, and maintain food supply safety compliance.',
      badge: 'Harvest Traceability',
      color: 'text-teal-600',
      bg: 'bg-teal-50',
      path: '/treatments'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header Navbar */}
      <header className="bg-slate-900 text-white sticky top-0 z-50 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="p-2 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-wide text-white block">AgriSmart AI</span>
              <span className="hidden sm:inline-block text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                Precision Agriculture & Yield Intelligence
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/multi-crop-planner')}
              className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-xl text-xs font-bold border border-slate-700 transition"
            >
              <PieChart className="h-4 w-4 text-emerald-400" />
              <span>Yield & Multi-Crop Planner</span>
            </button>
            {token ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow-md"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/auth')}
                className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow-md"
              >
                <span>Login / Register</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 text-white py-16 sm:py-24 border-b border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-0 bottom-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-6">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>AI Soil Test Analytics • Yield Prediction • Multi-Crop Acreage Planner</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Data-Driven Intelligence for <span className="text-emerald-400">Maximum Crop Yield</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Enter your soil N-P-K data to predict candidate crop suitability, forecast harvest yields (quintals/acre), and allocate single or multi-crop land parcels with precision financial projections.
          </p>

          {/* Live Farmer Location Weather Telemetry & Active Crop Card */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            {/* Live Weather Widget */}
            <div 
              onClick={() => navigate('/monitoring')}
              className="bg-slate-800/80 hover:bg-slate-800 p-5 rounded-2xl border border-slate-700/80 shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="font-bold text-sm text-white truncate">
                    {weather?.location?.name ? `${weather.location.name}, ${weather.location.state || ''}` : `${user?.location?.district || 'Your Farm Location'}, ${user?.location?.state || 'India'}`}
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live Weather
                </span>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-black text-white">{weather?.current?.temperature || 32.5}°C</span>
                  <span className="text-xs text-slate-400 block mt-0.5">{weather?.current?.condition || 'Partly Cloudy'}</span>
                </div>
                <div className="text-right text-xs space-y-1 text-slate-300 font-semibold">
                  <div>💧 Humidity: {weather?.current?.humidity || 62}%</div>
                  <div>🌧 Rain: {weather?.current?.precipitation || 0} mm</div>
                  <div>💨 Wind: {weather?.current?.windSpeed || 11} km/h</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                <span>View Full Agro-Meteorological Telemetry</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
              </div>
            </div>

            {/* Active Chosen Crop Parcel Widget */}
            <div 
              onClick={() => navigate('/irrigation')}
              className="bg-slate-800/80 hover:bg-slate-800 p-5 rounded-2xl border border-slate-700/80 shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sprout className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="font-bold text-sm text-white">
                    {activeCrop ? `Active Crop: ${activeCrop.cropName}` : (crops && crops.length > 0 ? `Registered Parcels: ${crops.map(c=>c.cropName).join(', ')}` : 'AI Planned Crops')}
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {crops && crops.length > 0 ? `${crops.length} Parcels` : 'Planner Ready'}
                </span>
              </div>

              <div className="mt-4">
                {crops && crops.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {crops.map((c, idx) => (
                      <span key={idx} className="px-3 py-1 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 rounded-lg text-xs font-bold">
                        {c.cropName} ({c.area} Acres)
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-300 font-medium">
                    No active land plan saved yet. Launch the Yield & Multi-Crop Acreage Planner to allocate crops.
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs font-bold text-blue-400 group-hover:text-blue-300">
                <span>Calculate Precision Water Demand</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
              </div>
            </div>
          </div>

          {/* Benchmark Impact Cards */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-slate-800 text-left">
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 backdrop-blur-sm">
              <span className="text-3xl font-black text-emerald-400">+40%</span>
              <span className="block text-xs font-bold text-white mt-1">Yield & Profit Maximization</span>
              <p className="text-[11px] text-slate-400 mt-1">Optimized crop selection and N-P-K nutrient schedules per land parcel.</p>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 backdrop-blur-sm">
              <span className="text-3xl font-black text-blue-400">-30%</span>
              <span className="block text-xs font-bold text-white mt-1">Water Savings</span>
              <p className="text-[11px] text-slate-400 mt-1">Precision irrigation using FAO-56 Penman-Monteith Evapotranspiration models.</p>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 backdrop-blur-sm">
              <span className="text-3xl font-black text-purple-400">100%</span>
              <span className="block text-xs font-bold text-white mt-1">Voice & Multilingual AI</span>
              <p className="text-[11px] text-slate-400 mt-1">Daily advisory timeline voice alerts in Telugu, Hindi, and English.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Spotlight: Combined Yield & Multi-Crop Planner */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-800/40 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:max-w-2xl">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                Combined AI Feature Highlight
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-3">
                AI Crop Yield Prediction & Multi-Crop Acreage Allocation
              </h2>
              <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                Input your soil test data (Nitrogen, Phosphorus, Potassium, pH) and total land area (e.g. 3 Acres). The AI engine recommends suitable crops with predicted yield per acre, total yield tonnage, and net profit. Choose <strong>100% single crop</strong> or custom <strong>multi-crop split parcels</strong> (e.g., 1 Acre Paddy + 1 Acre Cotton + 1 Acre Chilli)!
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-xs font-bold text-emerald-300">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Soil NPK Driven Match %</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Single or Multi-Crop Choice</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Yield Tonnage & Net Profit Summary</span>
              </div>
            </div>

            <div className="shrink-0">
              <button
                onClick={() => navigate('/multi-crop-planner')}
                className="px-6 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-2xl text-sm shadow-lg transition flex items-center gap-2"
              >
                <span>Open Yield & Multi-Crop Planner</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Active Platform Modules Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Platform Capabilities & Modules
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Integrated tools designed to maximize farm yield, optimize input costs, and protect crops.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                onClick={() => navigate(feat.path)}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${feat.bg} ${feat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-emerald-600 group-hover:text-emerald-700">
                  <span>Explore Feature</span>
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Sprout className="h-5 w-5 text-emerald-400" />
            <span className="font-bold text-white text-sm">AgriSmart AI</span>
            <span>— Precision Agronomy & Yield Platform</span>
          </div>

          <div>
            <span>© {new Date().getFullYear()} AgriSmart AI. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
