import React, { createContext, useState, useEffect, useContext } from 'react';
import { normalizeLocation } from '../utils/location';

const AppContext = createContext();

const API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '')}/api` : 'http://localhost:5000/api');

const DEFAULT_FARM_PLAN = {
  totalLandArea: 3.0,
  allocations: [],
  soilData: {
    soilType: 'Red Sandy Loam',
    pH: 6.5,
    N: 80,
    P: 45,
    K: 40,
    irrigationSource: 'Borewell with Drip',
    season: 'Kharif',
    availableWater: 'High'
  },
  lastUpdated: new Date().toISOString()
};

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('agritech_token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('agritech_user')) || null);
  const [crops, setCrops] = useState([]);
  const [activeCrop, setActiveCrop] = useState(null);
  const [advisories, setAdvisories] = useState([]);
  const [weather, setWeather] = useState(null);
  const [latestSoilTest, setLatestSoilTest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Global Multi-Crop Farm Plan State (Single Source of Truth)
  const [farmPlan, setFarmPlan] = useState(() => {
    const userObj = JSON.parse(localStorage.getItem('agritech_user') || 'null');
    const storageKey = userObj?.id ? `agritech_farm_plan_${userObj.id}` : 'agritech_farm_plan';
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_FARM_PLAN;
      }
    }
    return DEFAULT_FARM_PLAN;
  });

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  useEffect(() => {
    if (token) {
      localStorage.setItem('agritech_token', token);
    } else {
      localStorage.removeItem('agritech_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('agritech_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('agritech_user');
    }
  }, [user]);

  useEffect(() => {
    if (farmPlan) {
      localStorage.setItem('agritech_farm_plan', JSON.stringify(farmPlan));
    }
  }, [farmPlan]);

  // Derived normalized location object
  const normalizedUserLocation = normalizeLocation(user?.location || 'Mahabubabad, Telangana');

  const apiFetch = async (endpoint, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'API request failed');
    }
    return data;
  };

  const login = async (phone, password) => {
    setLoading(true);
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ phone, password }),
      });
      setToken(data.token);
      const normalizedLoc = normalizeLocation(data.location || 'Mahabubabad, Telangana');
      setUser({
        id: data._id,
        name: data.name,
        phone: data.phone,
        location: normalizedLoc.displayName,
        normalizedLocation: normalizedLoc,
        landArea: data.landArea || 3.0,
        preferredLanguage: data.preferredLanguage || 'Telugu',
      });
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, phone, password, preferredLanguage, location, landArea) => {
    setLoading(true);
    try {
      const normalizedLoc = normalizeLocation(location || 'Mahabubabad, Telangana');
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ 
          name, 
          phone, 
          password, 
          preferredLanguage: preferredLanguage || 'Telugu', 
          location: normalizedLoc.displayName, 
          landArea: landArea || 3.0 
        }),
      });
      setToken(data.token);
      setUser({
        id: data._id,
        name: data.name,
        phone: data.phone,
        location: normalizedLoc.displayName,
        normalizedLocation: normalizedLoc,
        landArea: data.landArea || 3.0,
        preferredLanguage: data.preferredLanguage || 'Telugu',
      });
      return true;
    } catch (err) {
      console.error('Registration failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setCrops([]);
    setActiveCrop(null);
    setAdvisories([]);
    setWeather(null);
    setLatestSoilTest(null);
  };

  const updateProfile = async (profileData) => {
    try {
      let locVal = profileData.location;
      if (locVal) {
        const norm = normalizeLocation(locVal);
        profileData.location = norm.displayName;
      }
      const data = await apiFetch('/farmer/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
      let updatedUser = null;
      setUser(prev => {
        const normLoc = normalizeLocation(data.location || prev?.location || 'Mahabubabad, Telangana');
        updatedUser = { 
          ...prev, 
          ...data,
          location: normLoc.displayName,
          normalizedLocation: normLoc
        };
        localStorage.setItem('agritech_user', JSON.stringify(updatedUser));
        return updatedUser;
      });
      if (data.location) {
        const normLoc = normalizeLocation(data.location);
        await fetchRealTimeWeather({ lat: normLoc.latitude, lon: normLoc.longitude, city: normLoc.displayName });
      }
    } catch (err) {
      console.error('Profile update failed:', err);
      throw err;
    }
  };

  const updateFarmerLocation = async (newLocation) => {
    try {
      const normLoc = normalizeLocation(newLocation);
      await updateProfile({ location: normLoc.displayName });
      await fetchRealTimeWeather({ lat: normLoc.latitude, lon: normLoc.longitude, city: normLoc.displayName });
    } catch (err) {
      console.error('Failed to update location:', err);
    }
  };

  const [weatherLoading, setWeatherLoading] = useState(false);

  const fetchRealTimeWeather = async (params = {}) => {
    setWeatherLoading(true);
    try {
      let queryStr = '';
      if (params?.lat && params?.lon) {
        queryStr = `?lat=${params.lat}&lon=${params.lon}${params.city ? `&city=${encodeURIComponent(params.city)}` : ''}`;
      } else if (params?.city) {
        const norm = normalizeLocation(params.city);
        queryStr = `?lat=${norm.latitude}&lon=${norm.longitude}&city=${encodeURIComponent(norm.displayName)}`;
      } else {
        const norm = normalizedUserLocation;
        queryStr = `?lat=${norm.latitude}&lon=${norm.longitude}&city=${encodeURIComponent(norm.displayName)}`;
      }
      const data = await apiFetch(`/weather${queryStr}`);
      setWeather(data);
      return data;
    } catch (err) {
      console.error('Failed to fetch real-time weather:', err);
    } finally {
      setWeatherLoading(false);
    }
  };

  // Save Crop Allocation Plan & Sync with Backend DB
  const saveFarmPlan = async (newPlan) => {
    setLoading(true);
    try {
      setFarmPlan(newPlan);
      const storageKey = user?.id ? `agritech_farm_plan_${user.id}` : 'agritech_farm_plan';
      localStorage.setItem(storageKey, JSON.stringify(newPlan));

      if (token) {
        try {
          await apiFetch('/crops/multi-plan', {
            method: 'POST',
            body: JSON.stringify({
              totalLandArea: newPlan.totalLandArea,
              allocations: newPlan.allocations,
              soilData: newPlan.soilData,
            }),
          });

          // Reload backend crops list to stay synced
          const updatedCrops = await apiFetch('/crops');
          if (Array.isArray(updatedCrops)) {
            setCrops(updatedCrops);
          }
        } catch (apiErr) {
          console.warn('Backend multi-plan sync warning:', apiErr.message);
        }
      }
      return true;
    } catch (err) {
      console.error('Error saving farm plan:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadDashboard = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // 1. Get real-time weather using coordinates
      await fetchRealTimeWeather();

      // 2. Get latest soil test
      try {
        const soilData = await apiFetch('/soil-tests/latest');
        setLatestSoilTest(soilData);
      } catch (e) {
        setLatestSoilTest(null);
      }

      // 3. Get active farmer crop plan from backend (/api/crops/my-plan)
      try {
        const myPlanData = await apiFetch('/crops/my-plan');
        if (myPlanData && Array.isArray(myPlanData.allocations)) {
          const fetchedPlan = {
            totalLandArea: myPlanData.totalLandArea || user?.landArea || 3.0,
            allocations: myPlanData.allocations,
            soilData: farmPlan?.soilData || DEFAULT_FARM_PLAN.soilData,
            lastUpdated: myPlanData.lastUpdated || new Date().toISOString()
          };
          setFarmPlan(fetchedPlan);
          const storageKey = user?.id ? `agritech_farm_plan_${user.id}` : 'agritech_farm_plan';
          localStorage.setItem(storageKey, JSON.stringify(fetchedPlan));
        }
      } catch (planErr) {
        console.warn('Could not load my-plan from backend:', planErr.message);
      }

      // 4. Get active crops list
      try {
        const cropsList = await apiFetch('/crops');
        if (Array.isArray(cropsList)) {
          setCrops(cropsList);
          const active = cropsList.find(c => c.active) || cropsList[0];
          if (active) {
            setActiveCrop(active);
            try {
              const details = await apiFetch(`/crops/${active._id}`);
              setAdvisories(details.advisories || []);
            } catch (e) {
              setAdvisories([]);
            }
          }
        }
      } catch (cropErr) {
        console.warn('Could not load crops list from backend:', cropErr.message);
      }
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider value={{
      token,
      user,
      normalizedUserLocation,
      crops,
      activeCrop,
      farmPlan,
      saveFarmPlan,
      advisories,
      weather,
      weatherLoading,
      fetchRealTimeWeather,
      latestSoilTest,
      loading,
      login,
      register,
      logout,
      updateProfile,
      updateFarmerLocation,
      loadDashboard,
      apiFetch,
      API_BASE,
      setAdvisories,
      setActiveCrop,
      sidebarOpen,
      setSidebarOpen,
      toggleSidebar
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
