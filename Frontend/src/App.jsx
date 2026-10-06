import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import MultiCropPlanner from './pages/MultiCropPlanner';
import Profile from './pages/Profile';
import SoilTestEntry from './pages/SoilTestEntry';
import CropRecommendation from './pages/CropRecommendation';
import SmartMonitoring from './pages/SmartMonitoring';
import SmartIrrigation from './pages/SmartIrrigation';
import DiseaseDetection from './pages/DiseaseDetection';
import AIAssistant from './pages/AIAssistant';
import Treatments from './pages/Treatments';

// Route protection component
const ProtectedRoute = ({ children }) => {
  const { token } = useApp();
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Home Landing Page */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Central AI Crop Planner & Land Allocation Module */}
          <Route 
            path="/crop-planner" 
            element={
              <ProtectedRoute>
                <MultiCropPlanner />
              </ProtectedRoute>
            } 
          />
          <Route path="/multi-crop-planner" element={<Navigate to="/crop-planner" replace />} />
          <Route path="/yield-prediction" element={<Navigate to="/crop-planner" replace />} />
          <Route path="/yield-predictor" element={<Navigate to="/crop-planner" replace />} />
          
          {/* Dashboard & Autonomous Agronomic Modules */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/monitoring" 
            element={
              <ProtectedRoute>
                <SmartMonitoring />
              </ProtectedRoute>
            } 
          />
          <Route path="/crop-monitoring" element={<Navigate to="/monitoring" replace />} />
          <Route 
            path="/irrigation" 
            element={
              <ProtectedRoute>
                <SmartIrrigation />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/disease-detection" 
            element={
              <ProtectedRoute>
                <DiseaseDetection />
              </ProtectedRoute>
            } 
          />
          <Route path="/disease" element={<Navigate to="/disease-detection" replace />} />
          <Route 
            path="/ai-assistant" 
            element={
              <ProtectedRoute>
                <AIAssistant />
              </ProtectedRoute>
            } 
          />
          <Route path="/assistant" element={<Navigate to="/ai-assistant" replace />} />
          <Route 
            path="/treatments" 
            element={
              <ProtectedRoute>
                <Treatments />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route path="/settings" element={<Navigate to="/profile" replace />} />
          <Route 
            path="/soil-test" 
            element={
              <ProtectedRoute>
                <SoilTestEntry />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/crop-recommendation" 
            element={
              <ProtectedRoute>
                <CropRecommendation />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
