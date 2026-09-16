import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Farmer from './models/Farmer.js';
import SoilTest from './models/SoilTest.js';
import Crop from './models/Crop.js';
import Advisory from './models/Advisory.js';

dotenv.config();

const BASE_URL = 'http://127.0.0.1:5000/api';
const TEST_PHONE = '9999988888';

async function runTests() {
  console.log('--- STARTING AGRIITECH BACKEND E2E TEST FLOW ---');
  
  // 1. Connect to DB directly to clean up and verify state
  console.log('Connecting to database for cleanup...');
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agritech');
  
  // Find and clean up test farmer
  const existingFarmer = await Farmer.findOne({ phone: TEST_PHONE });
  if (existingFarmer) {
    console.log(`Cleaning up existing test farmer: ${existingFarmer._id}`);
    await Advisory.deleteMany({ farmer: existingFarmer._id });
    await Crop.deleteMany({ farmer: existingFarmer._id });
    await SoilTest.deleteMany({ farmer: existingFarmer._id });
    await Farmer.deleteOne({ _id: existingFarmer._id });
  }
  
  await mongoose.disconnect();
  console.log('Direct DB connection closed. Starting API checks.');

  // Helper for requests
  const apiCall = async (url, options = {}) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    const status = res.status;
    const data = await res.json();
    if (status >= 400) {
      throw new Error(`API Error: ${url} (${status}) - ${JSON.stringify(data)}`);
    }
    return data;
  };

  // 2. Health check
  console.log('Checking health endpoint...');
  const health = await apiCall('/health');
  console.log('Health check response:', health);

  // 3. Register Farmer
  console.log('Registering test farmer...');
  const regResponse = await apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Ramesh Kumar',
      phone: TEST_PHONE,
      password: 'password123',
      location: {
        state: 'Andhra Pradesh',
        district: 'Guntur',
        village: 'Tenali'
      },
      landArea: 4.5,
      preferredLanguage: 'Telugu'
    })
  });
  console.log('Register response token:', regResponse.token ? 'Success (received)' : 'Failed');
  let token = regResponse.token;

  // 4. Login Farmer
  console.log('Logging in test farmer...');
  const loginResponse = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      phone: TEST_PHONE,
      password: 'password123'
    })
  });
  console.log('Login response token:', loginResponse.token ? 'Success (received)' : 'Failed');
  token = loginResponse.token;
  const authHeaders = { Authorization: `Bearer ${token}` };

  // 5. Get current profile (Me)
  console.log('Fetching current profile (auth/me)...');
  const me = await apiCall('/auth/me', { headers: authHeaders });
  console.log(`Me profile fetched for name: ${me.name}, language: ${me.preferredLanguage}`);

  // 6. Update profile
  console.log('Updating farmer profile language to Hindi...');
  const updatedProfile = await apiCall('/farmer/profile', {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      preferredLanguage: 'Hindi',
      landArea: 5.0
    })
  });
  console.log(`Profile updated: language is now ${updatedProfile.preferredLanguage}, land area is ${updatedProfile.landArea}`);

  // 6.5. Get weather report
  console.log('Fetching weather report for the farmer...');
  const weather = await apiCall('/weather', { headers: authHeaders });
  console.log('Weather report received:', weather);
  if (!weather.location || !weather.temperature || !weather.advice || !weather.advice.English) {
    throw new Error('Weather report response format is invalid');
  }

  // 7. Create Soil Test
  console.log('Creating soil test record...');
  const soilTest = await apiCall('/soil-tests', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      N: 45,
      P: 20,
      K: 35,
      pH: 6.8,
      soilType: 'Alluvial',
      labName: 'Guntur Agri Labs'
    })
  });
  console.log(`Soil test created with ID: ${soilTest._id}, pH: ${soilTest.pH}`);

  // 8. Get Latest Soil Test
  console.log('Fetching latest soil test...');
  const latestSoil = await apiCall('/soil-tests/latest', { headers: authHeaders });
  console.log(`Latest soil test ID: ${latestSoil._id}, lab name: ${latestSoil.labName}`);

  // 9. Register a Crop (Paddy) linked to the Soil Test
  console.log('Registering Paddy crop...');
  const cropRegistration = await apiCall('/crops', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      cropName: 'Paddy',
      variety: 'BPT 5204',
      area: 3.5,
      soilTestId: soilTest._id
    })
  });
  console.log('Crop registration message:', cropRegistration.message);
  const crop = cropRegistration.crop;
  console.log(`Crop registered: ID: ${crop._id}, cropName: ${crop.cropName}`);

  // 10. Fetch advisories for crop and assert they were pre-generated
  console.log('Fetching all advisories for the registered crop...');
  const advisories = await apiCall(`/advisories/crop/${crop._id}`, { headers: authHeaders });
  console.log(`Advisories found: ${advisories.length}`);
  if (advisories.length !== 7) {
    throw new Error(`Expected 7 advisories for Paddy, but found ${advisories.length}`);
  }
  advisories.forEach(adv => {
    console.log(` - Day ${adv.dayNumber} [${adv.type}]: ${adv.title} (Status: ${adv.status})`);
    console.log(`   Audio URLs: ${JSON.stringify(adv.audioUrl)}`);
    if (!adv.audioUrl || !adv.audioUrl.Hindi) {
      throw new Error(`Expected Hindi audio URL to be pre-generated for advisory Day ${adv.dayNumber}`);
    }
  });

  // 11. Fetch today's advisory (simulating Day 0)
  console.log('Fetching today\'s advisory (overriding to Day 0)...');
  const todayAdvisoryResponse0 = await apiCall(`/advisories/crop/${crop._id}/today?day=0`, { headers: authHeaders });
  console.log(`Day 0 Advisory: Title: "${todayAdvisoryResponse0.advisory.title}", Status: ${todayAdvisoryResponse0.advisory.status}`);
  if (todayAdvisoryResponse0.advisory.status !== 'delivered') {
    throw new Error('Day 0 Advisory status should have changed to delivered');
  }

  // 12. Fetch today's advisory (simulating Day 20 - should return Day 15 advisory as it is the most recent active one)
  console.log('Fetching today\'s advisory (overriding to Day 20)...');
  const todayAdvisoryResponse20 = await apiCall(`/advisories/crop/${crop._id}/today?day=20`, { headers: authHeaders });
  console.log(`Day 20 Advisory: DayNumber: ${todayAdvisoryResponse20.advisory.dayNumber}, Title: "${todayAdvisoryResponse20.advisory.title}", Status: ${todayAdvisoryResponse20.advisory.status}`);
  if (todayAdvisoryResponse20.advisory.dayNumber !== 15) {
    throw new Error(`Expected Day 15 advisory when overriding to Day 20, but got Day ${todayAdvisoryResponse20.advisory.dayNumber}`);
  }

  // 13. Mark advisory as listened
  const advisoryToListen = todayAdvisoryResponse20.advisory;
  console.log(`Marking Day ${advisoryToListen.dayNumber} advisory as listened...`);
  const listenedAdvisory = await apiCall(`/advisories/${advisoryToListen._id}/listen`, {
    method: 'PUT',
    headers: authHeaders
  });
  console.log(`Advisory status updated to: ${listenedAdvisory.status}, listenedDate: ${listenedAdvisory.listenedDate}`);
  if (listenedAdvisory.status !== 'listened') {
    throw new Error('Advisory status should be listened');
  }

  // 14. Mark Crop as Harvested
  console.log('Marking crop as harvested...');
  const harvestInfo = await apiCall(`/crops/${crop._id}/harvest`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      actualHarvest: new Date(),
      yield: 25.5,
      profit: 45000
    })
  });
  console.log(`Crop harvest saved. Active: ${harvestInfo.active}, Yield: ${harvestInfo.yield}, Profit: ${harvestInfo.profit}`);
  if (harvestInfo.active !== false) {
    throw new Error('Crop should be marked as inactive after harvest');
  }

  // 15. Voice TTS Endpoint Test
  console.log('Testing Voice TTS endpoint (generating Hindi speech)...');
  const ttsResponse = await apiCall('/voice/tts', {
    method: 'POST',
    body: JSON.stringify({
      text: 'आपका एग्रीटेक में स्वागत है',
      language: 'Hindi'
    })
  });
  console.log('TTS response received:', ttsResponse);
  if (!ttsResponse.audioUrl || !ttsResponse.audioUrl.startsWith('/audio/')) {
    throw new Error('TTS response did not return a valid audio URL path');
  }

  // 16. Voice STT Endpoint Test
  console.log('Testing Voice STT endpoint (transcribing simulated audio)...');
  const formData = new FormData();
  const blob = new Blob([Buffer.from('mock audio content of even size!')], { type: 'audio/wav' });
  formData.append('audio', blob, 'mock_voice.wav');

  const sttRes = await fetch(`${BASE_URL}/voice/stt`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });
  const sttData = await sttRes.json();
  console.log('STT response transcript:', sttData.transcript);
  if (sttData.transcript !== 'ఈ రోజు వాతావరణం ఎలా ఉంది') {
    throw new Error(`Expected STT to return simulated Telugu transcript, but got: ${sttData.transcript}`);
  }

  console.log('\n==============================================');
  console.log('🎉 ALL BACKEND E2E TESTS COMPLETED SUCCESSFULLY!');
  console.log('==============================================');
}

runTests().catch(err => {
  console.error('❌ TEST RUN FAILED:', err);
  process.exit(1);
});
