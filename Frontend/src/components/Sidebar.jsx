import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { normalizeLocation } from '../utils/location';
import { 
  Sprout, 
  Activity, 
  Droplets, 
  Scan, 
  Bot, 
  FileText, 
  PieChart, 
  LogOut, 
  User, 
  Menu, 
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout, sidebarOpen, setSidebarOpen, toggleSidebar } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Grouped navigation structure (No separate Yield Predictor)
  const navSections = [
    {
      title: 'MAIN',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: Activity },
        { name: 'Crop Planner', path: '/crop-planner', icon: PieChart, altPaths: ['/multi-crop-planner', '/yield-prediction'] },
        { name: 'Crop Monitoring', path: '/monitoring', icon: Sprout, altPaths: ['/crop-monitoring'] },
        { name: 'Smart Irrigation', path: '/irrigation', icon: Droplets },
      ]
    },
    {
      title: 'FARM MANAGEMENT',
      items: [
        { name: 'Disease Detection', path: '/disease-detection', icon: Scan },
        { name: 'AI Agriculture Assistant', path: '/ai-assistant', icon: Bot },
        { name: 'Treatments', path: '/treatments', icon: FileText },
      ]
    },
    {
      title: 'SETTINGS',
      items: [
        { name: 'Farmer Profile', path: '/profile', icon: User },
      ]
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const NavContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 border-r border-slate-800 select-none">
      {/* Brand & Collapse Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div 
          onClick={() => { navigate('/dashboard'); if (isMobile) setMobileDrawerOpen(false); }} 
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="p-2 bg-emerald-600 rounded-xl group-hover:bg-emerald-500 transition shadow-md shrink-0">
            <Sprout className="h-6 w-6 text-white" />
          </div>
          <div className="overflow-hidden">
            <span className="font-extrabold text-base text-white tracking-wide block truncate">AgriSmart AI</span>
            <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider block truncate">
              Precision Agronomy
            </span>
          </div>
        </div>

        {isMobile ? (
          <button 
            onClick={() => setMobileDrawerOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        ) : (
          <button
            onClick={toggleSidebar}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Collapse Sidebar"
          >
            <PanelLeftClose className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-3 pb-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {section.title}
            </div>

            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.altPaths && item.altPaths.includes(location.pathname)) ||
                (item.path === '/dashboard' && location.pathname === '/');

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => { if (isMobile) setMobileDrawerOpen(false); }}
                  className={
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition border ${
                      isActive
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 font-bold shadow-xs'
                        : 'border-transparent text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-400'}`} />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></div>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Farmer Profile & Logout Bottom Bar */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/80">
        <div className="flex items-center justify-between mb-3">
          <div 
            onClick={() => { navigate('/profile'); if (isMobile) setMobileDrawerOpen(false); }}
            className="flex items-center space-x-2.5 cursor-pointer hover:opacity-90 transition"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-emerald-100 flex items-center justify-center font-bold text-xs shadow-inner shrink-0">
              {user?.name ? user.name[0].toUpperCase() : 'F'}
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-white block truncate max-w-[120px]">
                {user?.name || 'Farmer'}
              </span>
              <span className="text-[10px] text-emerald-400 block truncate">
                {user?.role === 'expert' ? 'Agronomist' : 'Active Farmer'}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-1 text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-medium truncate max-w-[130px]" title="Farmer Location">
              📍 {user?.normalizedLocation?.displayName || normalizeLocation(user?.location).displayName}
            </span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
            <span>Lang: {user?.preferredLanguage || 'Telugu'}</span>
            <span>Land: {user?.landArea || 3.0} Acres</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Fixed Left Sidebar */}
      <aside 
        className={`hidden md:flex md:w-64 md:flex-col md:fixed md:top-0 md:bottom-0 md:left-0 z-40 shadow-2xl transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <NavContent />
      </aside>

      {/* 2. Floating Toggle Button when Desktop Sidebar is CLOSED */}
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="hidden md:flex items-center gap-2 fixed top-4 left-4 z-50 bg-slate-900/90 hover:bg-slate-900 text-white px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-700 transition hover:scale-105 active:scale-95"
          title="Open Sidebar"
        >
          <PanelLeftOpen className="h-5 w-5 text-emerald-400" />
          <span className="text-xs font-bold tracking-wide">Menu</span>
        </button>
      )}

      {/* 3. Mobile Header Bar with Hamburger */}
      <header className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-slate-800 shadow-md">
        <div className="flex items-center space-x-2.5" onClick={() => navigate('/dashboard')}>
          <div className="p-1.5 bg-emerald-600 rounded-lg">
            <Sprout className="h-5 w-5 text-white" />
          </div>
          <span className="font-extrabold text-sm text-white tracking-wide">AgriSmart AI</span>
        </div>

        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="p-2 rounded-lg bg-slate-800 text-slate-200 hover:text-white transition"
          aria-label="Open Navigation Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* 4. Mobile Slide-out Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          ></div>

          <div className="relative w-72 max-w-[85%] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <NavContent isMobile={true} />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
