import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Import routes
import authRoutes from './APIs/auth.js';
import farmerRoutes from './APIs/farmer.js';
import soilTestRoutes from './APIs/soilTest.js';
import cropRoutes from './APIs/crop.js';
import advisoryRoutes from './APIs/advisory.js';
import weatherRoutes from './APIs/weather.js';
import voiceRoutes from './APIs/voice.js';
import farmRoutes from './APIs/farm.js';
import predictRoutes from './APIs/predict.js';
import analyticsRoutes from './APIs/analytics.js';
import alertRoutes from './APIs/alert.js';
import chatRoutes from './APIs/chat.js';
import treatmentRoutes from './APIs/treatment.js';
import diseaseRoutes from './routes/diseaseRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
const allowedOrigins = [
  process.env.VITE_URL,
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

// Serve static audio files
app.use('/audio', express.static('public/audio'));

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/soil-tests', soilTestRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/advisories', advisoryRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/predict', predictRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/treatments', treatmentRoutes);
app.use('/api/disease', diseaseRoutes);


// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AgriTech Backend API is running successfully' });
});

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Welcome to AgriTech Backend API');
});

// Fallback for Page Not Found
app.use((req, res) => {
  res.status(404).json({ message: 'API Route Not Found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});
