import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

const API_BASE = 'http://localhost:5000/api';

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
      setUser({
        id: data._id,
        name: data.name,
        phone: data.phone,
        location: data.location,
        landArea: data.landArea,
        preferredLanguage: data.preferredLanguage,
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
      const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, phone, password, preferredLanguage, location, landArea }),
      });
      setToken(data.token);
      setUser({
        id: data._id,
        name: data.name,
        phone: data.phone,
        location: data.location,
        landArea: data.landArea,
        preferredLanguage: data.preferredLanguage,
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
      const data = await apiFetch('/farmer/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
      let updatedUser = null;
      setUser(prev => {
        updatedUser = { ...prev, ...data };
        localStorage.setItem('agritech_user', JSON.stringify(updatedUser));
        return updatedUser;
      });
      if (data.location) {
        let farmerLocStr = '';
        if (typeof data.location === 'string') farmerLocStr = data.location.trim();
        else if (typeof data.location === 'object') {
          farmerLocStr = [data.location.village, data.location.district, data.location.state].filter(Boolean).join(', ');
        }
        if (farmerLocStr) {
          await fetchRealTimeWeather({ city: farmerLocStr });
        }
      }
    } catch (err) {
      console.error('Profile update failed:', err);
      throw err;
    }
  };

  const updateFarmerLocation = async (newLocation) => {
    try {
      const locObj = typeof newLocation === 'string'
        ? { state: 'Andhra Pradesh', district: newLocation, village: '' }
        : newLocation;
      await updateProfile({ location: locObj });
      const cityStr = typeof newLocation === 'string' 
        ? newLocation 
        : [newLocation.village, newLocation.district, newLocation.state].filter(Boolean).join(', ');
      await fetchRealTimeWeather({ city: cityStr });
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
        queryStr = `?city=${encodeURIComponent(params.city)}`;
      } else if (user?.location) {
        let farmerLocStr = '';
        if (typeof user.location === 'string') {
          farmerLocStr = user.location.trim();
        } else if (typeof user.location === 'object') {
          farmerLocStr = [user.location.village, user.location.district, user.location.state].filter(Boolean).join(', ');
        }
        if (farmerLocStr) {
          queryStr = `?city=${encodeURIComponent(farmerLocStr)}`;
        }
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

  const loadDashboard = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // 1. Get real-time weather
      await fetchRealTimeWeather();

      // 2. Get latest soil test
      try {
        const soilData = await apiFetch('/soil-tests/latest');
        setLatestSoilTest(soilData);
      } catch (e) {
        setLatestSoilTest(null);
      }

      // 3. Get crops
      const cropsList = await apiFetch('/crops');
      setCrops(cropsList);

      const active = cropsList.find(c => c.active);
      if (active) {
        setActiveCrop(active);
        // Get advisories for this crop
        const details = await apiFetch(`/crops/${active._id}`);
        setAdvisories(details.advisories);
      } else {
        setActiveCrop(null);
        setAdvisories([]);
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
      crops,
      activeCrop,
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
