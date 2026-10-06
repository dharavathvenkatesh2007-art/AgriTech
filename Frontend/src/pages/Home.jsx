import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { normalizeLocation } from '../utils/location';
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
  Sparkles, 
  TestTube, 
  MapPin, 
  CloudSun, 
  Play, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  Award, 
  PieChart, 
  Compass, 
  ShieldAlert, 
  UserCheck, 
  Volume2
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { token, user, weather, crops, activeCrop, fetchRealTimeWeather } = useApp();
  const [activeFaq, setActiveFaq] = useState(null);
  const [selectedWorkflowStep, setSelectedWorkflowStep] = useState(1);

  useEffect(() => {
    if (!weather) {
      fetchRealTimeWeather();
    }
  }, []);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const workflowSteps = [
    {
      step: 1,
      number: '01',
      title: 'Register & Setup Location',
      subtitle: 'Instant Farmer Profile',
      description: 'Create your account with your phone number, set your village location (e.g. Mahabubabad, Telangana), total land acreage, and preferred native language (Telugu, Hindi, English).',
      badge: 'Step 1: Setup',
      icon: UserCheck,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/30',
      actionText: 'Create Free Account',
      actionPath: '/auth'
    },
    {
      step: 2,
      number: '02',
      title: 'Soil N-P-K & Yield Engine',
      subtitle: 'AI Crop Recommendation',
      description: 'Enter your soil lab test report values for Nitrogen (N), Phosphorus (P), Potassium (K), and pH. The AI model analyzes soil fertility to rank optimal crops with yield tonnage forecasts (quintals/acre).',
      badge: 'Step 2: AI Science',
      icon: TestTube,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/30',
      actionText: 'Launch Soil & Yield Planner',
      actionPath: '/crop-planner'
    },
    {
      step: 3,
      number: '03',
      title: 'Single vs. Multi-Crop Split',
      subtitle: 'Dynamic Parcel Allocation',
      description: 'Choose 100% single crop allocation or divide your total farm acreage across multiple crops (e.g. 1.5 Acres Paddy + 1.5 Acres Chilli) with real-time financial net profit calculations.',
      badge: 'Step 3: Land Allocation',
      icon: PieChart,
      color: 'from-blue-500 to-indigo-600',
      textColor: 'text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/30',
      actionText: 'Allocate Farm Parcels',
      actionPath: '/crop-planner'
    },
    {
      step: 4,
      number: '04',
      title: 'AI Leaf Scanner & Disease Detection',
      subtitle: 'Instant Computer Vision Scan',
      description: 'Take a photo of diseased or pest-infested leaves with your phone camera. Our AI leaf scanner identifies pathogens, calculates affected surface area percentage, and recommends exact chemical treatments.',
      badge: 'Step 4: Plant Protection',
      icon: Scan,
      color: 'from-rose-500 to-pink-600',
      textColor: 'text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-500/30',
      actionText: 'Scan Plant Leaf Now',
      actionPath: '/disease-detection'
    },
    {
      step: 5,
      number: '05',
      title: 'Precision Water & Voice Agronomist',
      subtitle: 'Daily Automated Guidance',
      description: 'Receive automated daily irrigation schedule alerts (liters per acre needed today using FAO-56 Penman-Monteith formulas) and ask any farming query to your AI Voice Agronomist in Telugu, Hindi, or English.',
      badge: 'Step 5: Voice & Advisory',
      icon: Bot,
      color: 'from-purple-500 to-violet-600',
      textColor: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/30',
      actionText: 'Talk to AI Agronomist',
      actionPath: '/ai-assistant'
    }
  ];

  const features = [
    {
      icon: PieChart,
      title: 'AI Yield & Multi-Crop Acreage Planner',
      description: 'Combines soil N-P-K chemistry data, AI yield forecasting, and land parcel allocation. Choose 100% single crop or split acreage across multiple crops with real-time yield tonnage and profit estimation.',
      badge: 'Yield & Acreage Engine',
      color: 'from-amber-500 to-orange-600',
      iconBg: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
      path: '/crop-planner'
    },
    {
      icon: Activity,
      title: 'Real-Time Agro-Weather & Telemetry',
      description: 'Live weather telemetry, 7-day agricultural forecasts, soil NPK fertility tracking, and satellite NDVI canopy vigor index tailored to your village location.',
      badge: 'Live Telemetry & Soil',
      color: 'from-emerald-500 to-teal-600',
      iconBg: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
      path: '/monitoring'
    },
    {
      icon: Droplets,
      title: 'Smart Irrigation & Water Conservation',
      description: 'Automated water balance modeling using the FAO-56 Penman-Monteith Evapotranspiration formula (ET₀ & ETc), delivering up to 30% water savings.',
      badge: 'FAO-56 Precision Water',
      color: 'from-cyan-500 to-blue-600',
      iconBg: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
      path: '/irrigation'
    },
    {
      icon: Scan,
      title: 'AI Leaf Disease & Pest Diagnostics',
      description: 'Computer vision scanner detecting foliar pathogens, quantifying leaf chlorosis percentage, and providing expert-backed chemical treatment advisories.',
      badge: 'Computer Vision',
      color: 'from-rose-500 to-pink-600',
      iconBg: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
      path: '/disease-detection'
    },
    {
      icon: Bot,
      title: 'Grounded AI Agronomist Assistant',
      description: 'Conversational agronomist agent drawing directly from ICAR, FAO, and IMD knowledge bases with multilingual voice speech output in Telugu, Hindi, and English.',
      badge: 'Voice AI Agronomist',
      color: 'from-purple-500 to-violet-600',
      iconBg: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
      path: '/ai-assistant'
    },
    {
      icon: FileText,
      title: 'Targeted Treatments & Harvest Safety',
      description: 'Log localized chemical application spot sprays, track Pre-Harvest Intervals (PHI) safety countdowns, and maintain food supply safety compliance.',
      badge: 'Harvest Traceability',
      color: 'from-teal-500 to-emerald-600',
      iconBg: 'bg-teal-500/20 text-teal-300 border border-teal-500/30',
      path: '/treatments'
    }
  ];

  const faqs = [
    {
      q: 'What is AgriSmart AI and how does it help Indian farmers?',
      a: 'AgriSmart AI is an end-to-end precision agronomy platform built specifically for Indian smallholder farmers. It converts soil test laboratory reports into data-driven crop recommendations, predicts crop yields in quintals per acre, optimizes multi-crop land allocation, diagnoses plant diseases using smartphone camera scans, and provides voice advisories in native Indian languages.'
    },
    {
      q: 'How does the Soil N-P-K Yield Prediction Engine work?',
      a: 'When you enter your soil test values (Nitrogen N, Phosphorus P, Potassium K, pH) and location data, our Machine Learning algorithms evaluate your soil fertility against standard crop growth profiles (Paddy, Cotton, Chilli, Maize, Groundnut, Sugarcane, Wheat). It predicts expected yield tonnage per acre and projected net profit.'
    },
    {
      q: 'Can I split my farm acreage between multiple crops?',
      a: 'Yes! Our Integrated Multi-Crop Acreage Planner allows you to choose 100% single crop cultivation or split your total farm land (e.g. 3 Acres) into customized parcels (e.g. 1.5 Acres Paddy + 1.5 Acres Chilli). It calculates combined total yield and grand net profit automatically.'
    },
    {
      q: 'How does the AI Leaf Disease Scanner work?',
      a: 'Simply upload or snap a photo of a diseased or damaged leaf from your smartphone. Our Computer Vision AI analyzes leaf discoloration, spots, and chlorosis percentage to identify diseases (e.g. Paddy Blast, Cotton Leaf Rust, Bacterial Blight) and provides exact chemical fungicide or bio-pesticide treatment recommendations.'
    },
    {
      q: 'Does AgriSmart AI support Telugu, Hindi, and English voice speech?',
      a: 'Yes! The AI Agronomist Assistant includes built-in Text-to-Speech (TTS) and Speech-to-Text (STT) capabilities in Telugu, Hindi, and English so farmers can listen to advisories hands-free directly in the field.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Header Navigation */}
      <header className="bg-slate-900/90 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-800/80 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="p-2.5 bg-gradient-to-tr from-emerald-600 via-teal-500 to-green-400 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sprout className="h-7 w-7 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-white flex items-center gap-1.5">
                AgriSmart <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">AI</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest">
                Precision Agronomy & Yield Intelligence
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6 text-xs font-bold text-slate-300">
            <a href="#overview" className="hover:text-emerald-400 transition">Overview</a>
            <a href="#how-to-use" className="hover:text-emerald-400 transition">How to Use</a>
            <a href="#modules" className="hover:text-emerald-400 transition">Features</a>
            <a href="#faq" className="hover:text-emerald-400 transition">FAQ</a>
          </nav>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/crop-planner')}
              className="hidden sm:flex items-center space-x-2 px-4 py-2.5 bg-slate-800/80 hover:bg-slate-800 text-emerald-300 rounded-xl text-xs font-bold border border-emerald-500/30 transition shadow-inner"
            >
              <PieChart className="h-4 w-4 text-emerald-400" />
              <span>Multi-Crop Planner</span>
            </button>
            
            {token ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl text-xs transition shadow-lg shadow-emerald-500/25 transform active:scale-95"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/auth')}
                className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl text-xs transition shadow-lg shadow-emerald-500/25 transform active:scale-95"
              >
                <span>Farmer Login / Register</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with Vibrant Banner & Telemetry Cards */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-emerald-950/40 to-slate-950 py-16 sm:py-24 border-b border-slate-800/60">
        <div className="absolute right-0 top-1/4 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute left-0 bottom-10 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-black mb-6 shadow-inner">
              <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
              <span className="uppercase tracking-wider">AI Precision Soil Science • Yield Engine • Disease Scanner</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]">
              Transforming Agriculture with <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                Precision AI & Yield Intelligence
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
              Empowering smallholder farmers with soil N-P-K chemistry modeling, AI multi-crop acreage allocation, computer vision plant leaf diagnostics, and voice advisories in native languages.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/crop-planner')}
                className="px-7 py-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black rounded-2xl text-sm shadow-xl shadow-emerald-500/20 transition flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                <PieChart className="h-5 w-5 text-slate-950" />
                <span>Launch Yield & Multi-Crop Planner</span>
                <ArrowRight className="h-5 w-5" />
              </button>

              <button
                onClick={() => navigate('/disease-detection')}
                className="px-7 py-4 bg-slate-900/90 hover:bg-slate-800 text-emerald-300 font-extrabold rounded-2xl text-sm border border-emerald-500/30 shadow-xl transition flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                <Scan className="h-5 w-5 text-emerald-400" />
                <span>Scan Plant Leaf Disease</span>
              </button>
            </div>
          </div>

          {/* Hero Banner Visual Showcase */}
          <div className="mt-14 relative rounded-3xl overflow-hidden border border-emerald-500/30 shadow-2xl bg-slate-900 group">
            <img 
              src="/images/hero_banner.jpg" 
              alt="AgriSmart AI Smart Agriculture Hero Banner"
              className="w-full h-80 sm:h-[450px] object-cover object-center group-hover:scale-105 transition duration-700 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4">
              <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-emerald-500/30 max-w-lg">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block mb-1">
                  Autonomous Precision Agronomy Engine
                </span>
                <h3 className="text-base sm:text-lg font-black text-white">
                  Smart Field Monitoring, Drone Telemetry & Yield Optimization
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-slate-900/90 backdrop-blur-md rounded-xl border border-emerald-500/30 text-center">
                  <span className="text-xl font-black text-emerald-400 block">+40%</span>
                  <span className="text-[10px] text-slate-300 font-bold uppercase">Yield Profit</span>
                </div>
                <div className="px-4 py-2 bg-slate-900/90 backdrop-blur-md rounded-xl border border-blue-500/30 text-center">
                  <span className="text-xl font-black text-blue-400 block">-30%</span>
                  <span className="text-[10px] text-slate-300 font-bold uppercase">Water Saved</span>
                </div>
                <div className="px-4 py-2 bg-slate-900/90 backdrop-blur-md rounded-xl border border-purple-500/30 text-center">
                  <span className="text-xl font-black text-purple-400 block">100%</span>
                  <span className="text-[10px] text-slate-300 font-bold uppercase">Voice AI</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Telemetry & Active Crop Widgets */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            {/* Live Weather Widget */}
            <div 
              onClick={() => navigate('/monitoring')}
              className="bg-slate-900/80 hover:bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/50 shadow-xl transition cursor-pointer flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <MapPin className="h-5 w-5 text-emerald-400 shrink-0" />
                  </div>
                  <div>
                    <span className="font-bold text-base text-white block">
                      {weather?.location?.name ? `${weather.location.name}${weather.location.state ? `, ${weather.location.state}` : ''}` : normalizeLocation(user?.location).displayName}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">Live Village Weather Station</span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live Telemetry
                </span>
              </div>

              <div className="mt-6 flex items-baseline justify-between">
                <div>
                  <span className="text-4xl font-black text-white">{weather?.current?.temperature || 32.5}°C</span>
                  <span className="text-xs text-slate-400 block mt-1 font-semibold">{weather?.current?.condition || 'Partly Cloudy'}</span>
                </div>
                <div className="text-right text-xs space-y-1 text-slate-300 font-bold">
                  <div>💧 Humidity: {weather?.current?.humidity || 62}%</div>
                  <div>🌧 Rain: {weather?.current?.precipitation || 0} mm</div>
                  <div>💨 Wind: {weather?.current?.windSpeed || 11} km/h</div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-extrabold text-emerald-400 group-hover:text-emerald-300">
                <span>Open Full Agro-Meteorological Monitoring</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
              </div>
            </div>

            {/* Active Chosen Crop Parcel Widget */}
            <div 
              onClick={() => navigate('/irrigation')}
              className="bg-slate-900/80 hover:bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-blue-500/50 shadow-xl transition cursor-pointer flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30">
                    <Sprout className="h-5 w-5 text-blue-400 shrink-0" />
                  </div>
                  <div>
                    <span className="font-bold text-base text-white block">
                      {activeCrop ? `Active Crop: ${activeCrop.cropName}` : (crops && crops.length > 0 ? `Registered Parcels` : 'AI Planned Crops')}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">Precision Irrigation Engine</span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {crops && crops.length > 0 ? `${crops.length} Parcels` : 'Planner Ready'}
                </span>
              </div>

              <div className="mt-6">
                {crops && crops.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {crops.map((c, idx) => (
                      <span key={idx} className="px-3.5 py-1.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 rounded-xl text-xs font-bold">
                        🌱 {c.cropName} ({c.area} Acres)
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    No active land plan saved yet. Launch the Yield & Multi-Crop Acreage Planner to allocate crops.
                  </p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-extrabold text-blue-400 group-hover:text-blue-300">
                <span>Calculate Precision Water & Irrigation Demand</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Detailed Project Explanation Section: What is AgriSmart AI? */}
      <section id="overview" className="py-20 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-black border border-emerald-500/30 uppercase tracking-widest">
              Project Architecture & Purpose
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mt-4 tracking-tight">
              What is <span className="text-emerald-400">AgriSmart AI</span>?
            </h2>
            <p className="text-base text-slate-300 mt-4 leading-relaxed font-normal">
              AgriSmart AI is an end-to-end precision agronomy portal designed to replace guess-work with machine learning. It bridges soil laboratory chemistry with real-time satellite weather, computer vision plant pathology, and multilingual voice interaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/40 transition shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-5 border border-amber-500/30">
                <TestTube className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-white mb-2">Soil N-P-K Science</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Inputs lab test parameters for Nitrogen, Phosphorus, Potassium, and pH to calculate exact soil nutrient adequacy and recommend crops with highest yield potential.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 hover:border-rose-500/40 transition shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-5 border border-rose-500/30">
                <Scan className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-white mb-2">Computer Vision AI</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Processes smartphone photos of affected plant leaves using neural models to detect foliar diseases, quantify chlorosis, and recommend targeted chemical treatments.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 hover:border-cyan-500/40 transition shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-5 border border-cyan-500/30">
                <Droplets className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-white mb-2">FAO-56 Water Model</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Computes daily Penman-Monteith reference evapotranspiration (ET₀ & ETc) to tell farmers exactly how many liters of water their crop parcel needs today.
              </p>
            </div>

            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 hover:border-purple-500/40 transition shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-5 border border-purple-500/30">
                <Volume2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-white mb-2">Voice AI Agronomist</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Grounded on ICAR, FAO, and IMD technical publications with natural Text-to-Speech audio advisories in Telugu (తెలుగు), Hindi (हिन्दी), and English.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Step-by-Step "How to Use" Guide */}
      <section id="how-to-use" className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-black border border-amber-500/30 uppercase tracking-widest">
              Farmer User Journey
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mt-4 tracking-tight">
              How to Use <span className="text-amber-400">AgriSmart AI</span>
            </h2>
            <p className="text-base text-slate-300 mt-4 leading-relaxed font-normal">
              Follow these 5 simple steps to get data-driven yield recommendations, land parcel plans, and leaf disease protection.
            </p>
          </div>

          {/* Workflow Step Selection Tabs */}
          <div className="flex overflow-x-auto gap-3 pb-4 mb-10 no-scrollbar justify-start md:justify-center">
            {workflowSteps.map((step) => {
              const Icon = step.icon;
              const isSelected = selectedWorkflowStep === step.step;
              return (
                <button
                  key={step.step}
                  onClick={() => setSelectedWorkflowStep(step.step)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-black text-xs transition shrink-0 border ${
                    isSelected 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20' 
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${isSelected ? 'bg-slate-950 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                    {step.number}
                  </span>
                  <span>{step.title.split(' ')[0]} {step.title.split(' ')[1]}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Workflow Detail Card */}
          {(() => {
            const current = workflowSteps.find(s => s.step === selectedWorkflowStep);
            const Icon = current.icon;
            return (
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl flex flex-col lg:flex-row items-center gap-10">
                <div className="flex-1">
                  <span className={`inline-block px-3.5 py-1 rounded-full text-xs font-extrabold ${current.bgColor} ${current.textColor} mb-4`}>
                    {current.badge}
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-black text-white">
                    {current.title}
                  </h3>
                  <span className="text-sm font-bold text-slate-400 block mt-1">
                    {current.subtitle}
                  </span>
                  <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
                    {current.description}
                  </p>

                  <div className="mt-8 flex items-center gap-4">
                    <button
                      onClick={() => navigate(current.actionPath)}
                      className="px-6 py-3.5 bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black rounded-xl text-xs shadow-lg transition flex items-center gap-2 hover:opacity-95"
                    >
                      <span>{current.actionText}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Step Visual Highlight */}
                <div className="w-full lg:w-96 shrink-0 bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center">
                  <div className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr ${current.color} flex items-center justify-center shadow-xl mb-4`}>
                    <Icon className="h-10 w-10 text-slate-950 stroke-[2.5]" />
                  </div>
                  <span className="text-3xl font-black text-white block">{current.number}</span>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mt-1">{current.subtitle}</span>
                </div>
              </div>
            );
          })()}

        </div>
      </section>

      {/* Disease Scanner Feature Image Showcase */}
      <section className="py-20 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="relative rounded-3xl overflow-hidden border border-rose-500/30 shadow-2xl bg-slate-950 group">
              <img 
                src="/images/disease_scanner.jpg" 
                alt="AI Plant Leaf Disease Camera Scanner"
                className="w-full h-80 sm:h-[420px] object-cover object-center group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-rose-500/30">
                <span className="text-xs font-black text-rose-400 uppercase tracking-wider block">Computer Vision Diagnostic Engine</span>
                <p className="text-xs text-slate-200 mt-1 font-medium">Real-time smartphone camera leaf disease scanning in field conditions.</p>
              </div>
            </div>

            <div>
              <span className="px-3.5 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-black border border-rose-500/30 uppercase tracking-widest">
                Computer Vision Plant Protection
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white mt-4 tracking-tight">
                Instant Leaf <span className="text-rose-400">Disease Detection</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
                Don't let fungal infections or pest outbreaks destroy your harvest! Our AI plant scanner analyzes leaf coloration, spots, and lesions to provide instant diagnostic confidence status and exact chemical dosage guidelines.
              </p>

              <div className="mt-6 space-y-3 text-xs font-bold text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-rose-400 shrink-0" />
                  <span>Detects Paddy Blast, Cotton Rust, Bacterial Blight & Yellow Rust</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-rose-400 shrink-0" />
                  <span>Calculates Affected Leaf Surface Area Percentage (%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-rose-400 shrink-0" />
                  <span>Provides Targeted Fungicide & Bio-pesticide Spray Dosages</span>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => navigate('/disease-detection')}
                  className="px-6 py-3.5 bg-rose-500 hover:bg-rose-400 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-rose-500/20 transition flex items-center gap-2"
                >
                  <Scan className="h-4 w-4" />
                  <span>Open Plant Leaf Scanner</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Platform Modules Grid */}
      <section id="modules" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-black border border-emerald-500/30 uppercase tracking-widest">
            Full Suite
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mt-4 tracking-tight">
            Platform Modules & Capabilities
          </h2>
          <p className="text-base text-slate-300 mt-4 leading-relaxed">
            Explore all precision agronomy modules built into AgriSmart AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                onClick={() => navigate(feat.path)}
                className="bg-slate-900 p-7 rounded-3xl border border-slate-800 hover:border-emerald-500/50 shadow-xl transition cursor-pointer flex flex-col justify-between group transform hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`p-3.5 rounded-2xl ${feat.iconBg}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-extrabold text-slate-400 bg-slate-800 px-3 py-1 rounded-full uppercase tracking-wider">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="font-black text-lg text-white group-hover:text-emerald-400 transition">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center text-xs font-extrabold text-emerald-400 group-hover:text-emerald-300">
                  <span>Open Module</span>
                  <ArrowRight className="h-4 w-4 ml-1.5 group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) Section */}
      <section id="faq" className="py-20 bg-slate-900 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="px-3.5 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-black border border-purple-500/30 uppercase tracking-widest">
              Help Center
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-4 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden transition"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-white hover:text-emerald-400 transition"
                >
                  <span>{faq.q}</span>
                  {activeFaq === idx ? (
                    <ChevronUp className="h-5 w-5 text-emerald-400 shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />
                  )}
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-10 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-xl">
              <Sprout className="h-5 w-5 text-slate-950 stroke-[2.5]" />
            </div>
            <span className="font-black text-white text-base tracking-tight">AgriSmart AI</span>
            <span className="text-slate-400">— Precision Agronomy Platform</span>
          </div>

          <div className="flex items-center space-x-6 text-slate-400 font-medium">
            <a href="#overview" className="hover:text-white transition">Overview</a>
            <a href="#how-to-use" className="hover:text-white transition">Guide</a>
            <a href="#modules" className="hover:text-white transition">Modules</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
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
