# 🌾 AgriSmart AI — Smart Agriculture & Precision Agronomy System

An end-to-end cyber-physical **AI-Powered Precision Agriculture Platform** unifying Machine Learning (ML), Computer Vision (CV), FAO-56 Evapotranspiration Water Modeling, Multi-Crop Acreage Allocation, and Multilingual Voice AI Assistance for smallholder and commercial farmers.

---

## 🌟 Key Features & Platform Modules

### 1. 🌾 Soil N-P-K & AI Yield Prediction Engine
- **Laboratory Soil Chemistry Matching**: Analyzes Nitrogen ($N$), Phosphorus ($P$), Potassium ($K$), and $pH$ lab report parameters.
- **Yield Tonnage Forecasting**: Predicts harvest yield per acre ($Quintals/Acre$) and expected net profit ($₹/Acre$) for Paddy, Cotton, Chilli, Maize, Groundnut, Sugarcane, and Wheat.
- **Single vs. Multi-Crop Land Parcel Allocation**: Choose **100% single crop** or split acreage across **custom multi-crop land parcels** (e.g. 1.5 Acres Paddy + 1.5 Acres Chilli) with real-time financial summary.

### 2. 📸 Computer Vision AI Leaf Scanner
- **Instant Pathogen Detection**: Smartphone camera scanning detecting Paddy Leaf Blast, Cotton Rust, Wheat Yellow Rust, Bacterial Blight, and Chlorosis.
- **Surface Area Damage Quantification**: Calculates affected leaf surface chlorosis percentage (%) and severity level (*Mild*, *Moderate*, *Severe*).
- **Targeted Treatment Advisories**: Provides chemical fungicide/bio-pesticide spray dosages and Pre-Harvest Interval (PHI) safety countdowns.

### 3. 💧 FAO-56 Smart Irrigation & Water Conservation
- **Penman-Monteith Evapotranspiration ($ET_0$ & $ET_c$)**: Calculates daily reference evapotranspiration and crop water requirements based on growth stages.
- **30% Water Usage Reduction**: Delivers exact daily irrigation depth ($mm$) and volume ($liters/acre$), avoiding waterlogging and root asphyxiation.

### 4. 🎙️ Multilingual RAG Voice AI Agronomist
- **Grounded Agricultural Knowledge**: Conversational AI assistant trained on ICAR (Indian Council of Agricultural Research), FAO, and IMD agronomic publications.
- **Native Speech Output**: Built-in Text-to-Speech (TTS) and Speech-to-Text (STT) voice synthesis in **Telugu (తెలుగు)**, **Hindi (हिन्दी)**, and **English**.

### 5. ☀️ Real-Time Agro-Weather & Telemetry
- **Hyper-Local Village Weather**: Live temperature, relative humidity, precipitation ($mm$), and wind speed tracking.
- **Canopy Vigor & NDVI Telemetry**: Satellite vegetation index and soil fertility monitoring.

---

## 📁 Repository Structure

```
AgriTech/
├── AI_Service/                 # Python Flask ML & Computer Vision Microservice (Port 5001)
│   ├── models/                 # Random Forest classifier & model pickle files
│   ├── app.py                  # Flask API server & RAG knowledge base endpoints
│   ├── train_model.py          # Machine learning model training script
│   ├── requirements.txt        # Python dependencies (Flask, Pillow, Flask-Cors)
│   └── .env.example            # AI Service environment variable template
│
├── Backend/                    # Express.js REST API & MongoDB Database (Port 5000)
│   ├── APIs/                   # API routes (auth, crops, weather, predict, chat)
│   ├── controllers/            # Controller business logic (diseaseController, etc.)
│   ├── middleware/             # JWT authentication & request validation
│   ├── models/                 # Mongoose database schemas (User, Crop, DiseasePrediction)
│   ├── services/               # Services pipeline (plantDiseaseService, voiceService)
│   ├── server.js               # Express application entry point & CORS configuration
│   └── .env.example            # Backend environment variable template
│
├── Frontend/                   # Vite + React 19 + Tailwind CSS Web Portal (Port 5173)
│   ├── public/                 # Static assets & generated feature showcase images
│   ├── src/
│   │   ├── components/         # Reusable UI components (Navbar, HeaderBar, Sidebar, AudioPlayer)
│   │   ├── context/            # Global React Context (AppContext) & state management
│   │   ├── pages/              # Platform pages (Home, Auth, Dashboard, CropPlanner, Scanner)
│   │   └── utils/              # Helper functions & location normalizers
│   └── .env.example            # Frontend environment variable template
│
├── PROJECT_REPORT.md           # Comprehensive Project Report & Technical Specification
└── README.md                   # Project Overview & Setup Guide
```

---

## 🚀 Getting Started & Local Setup Guide

### 📋 Prerequisites
- **Node.js** (v18.0 or higher)
- **Python** (v3.10 or higher)
- **MongoDB** (Local MongoDB Community Server running on `mongodb://localhost:27017` or MongoDB Atlas)

---

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/dharavathvenkatesh2007-art/AgriTech.git
cd AgriTech
```

---

### 2️⃣ Configure Environment Variables

#### Backend `.env` Setup
Create `Backend/.env` (or copy `Backend/.env.example`):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/agritech
JWT_SECRET=supersecretagritechkey123
PLANTNET_API_KEY=2b108KZSR1sT2ZFYpjSd2FgUxO
VITE_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173
CLIENT_URL=http://localhost:5173
AI_SERVICE_URL=http://127.0.0.1:5001
```

#### Frontend `.env` Setup
Create `Frontend/.env` (or copy `Frontend/.env.example`):
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_API_BASE_URL=http://localhost:5000/api
VITE_AI_SERVICE_URL=http://127.0.0.1:5001
```

#### AI Microservice `.env` Setup
Create `AI_Service/.env` (or copy `AI_Service/.env.example`):
```env
PORT=5001
```

---

### 3️⃣ Start the Backend REST API Server
```bash
cd Backend
npm install
npm run dev
```
*(Runs on `http://localhost:5000`)*

---

### 4️⃣ Start the Python AI/ML Microservice
Open a new terminal window:
```bash
cd AI_Service
pip install -r requirements.txt
py app.py
```
*(Runs on `http://127.0.0.1:5001`)*

---

### 5️⃣ Start the Frontend Web Application
Open a third terminal window:
```bash
cd Frontend
npm install
npm run dev
```
*(Access web application in your browser at `http://localhost:5173`)*

---

## 📡 Core API REST Endpoint Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new farmer account |
| `POST` | `/api/auth/login` | Authenticate farmer session & return JWT token |
| `GET` | `/api/crops/my-plan` | Get farmer active multi-crop parcel land plan |
| `POST` | `/api/crops/multi-plan` | Save multi-crop parcel allocation & soil data |
| `POST` | `/api/predict/yield` | AI crop yield prediction ($Quintals/Acre$) |
| `POST` | `/api/predict/irrigation` | FAO-56 Penman-Monteith irrigation water volume |
| `POST` | `/api/disease/detect` | Computer vision leaf pathogen scanner |
| `POST` | `/api/chat` | RAG AI Voice Agronomist interaction |
| `GET` | `/api/weather` | Live village weather & 7-day forecast telemetry |

---

## 📄 License & Technical Documentation
For complete mathematical models, data flow diagrams (DFDs), database entity-relationship (ER) schemas, and econometric benchmarks, refer to the full **[PROJECT_REPORT.md](file:///c:/AgriTech/PROJECT_REPORT.md)**.

© 2026 AgriSmart AI. Built for Sustainable & High-Yield Precision Agriculture.
