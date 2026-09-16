import React from 'react';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import IntegratedYieldAndMultiCropPlanner from '../components/IntegratedYieldAndMultiCropPlanner';

const MultiCropPlanner = () => {
  const { sidebarOpen } = useApp();

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col ${sidebarOpen ? 'md:pl-64' : 'pl-0'} transition-all duration-300`}>
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <IntegratedYieldAndMultiCropPlanner />
      </main>
    </div>
  );
};

export default MultiCropPlanner;
