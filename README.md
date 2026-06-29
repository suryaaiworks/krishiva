# 🌾 Kisan Alert AI

Kisan Alert AI is a production-grade, AI-powered digital farming companion designed to support smallholder and marginal farmers. It serves as a complete farming ecosystem helping farmers throughout the lifecycle—from crop selection and disease diagnosis to weather forecasting, government schemes coordination, and direct B2B buyer selling.

---

## 🚀 Features

* **Kisan Mitra AI:** Voice-first conversational AI companion (supporting 11 regional languages) that guides farmers, answers questions, reads screen details aloud, and navigates dashboards.
* **Smart Crop Advisor:** Guided stepper wizard that evaluates soil type, satellite mapping terrain parameters, and seasons to suggest optimal crops.
* **AI Crop Disease Scan:** Foliage image diagnostic scans that identify crop pests, rust, and blights, providing chemical and organic treatment instructions.
* **Weather Intelligence:** Expandable weekly forecasts with day-specific farming action advice and dry spell predictors.
* **Market Intelligence Center:** Mandi price indices, arbitrage calculators comparing nearby markets, and AI price forecasts.
* **Farmer Relief Hub:** Command center for natural disasters providing crop loss evaluations, NGO assistance lists, and alternative residue buyers.
* **Benefits Schemes Advisor:** personalized eligibility checklist that updates an application progress timeline as documents are checked off.
* **RSK Center Locator:** Vector block mapping with driving directions and QR-coded digital appointment booking token slips.
* **Buyer B2B Marketplace:** Direct negotiations simulator, vehicle logistics calculators, and verified commercial buyer directories.
* **Elder Mode & Accessibility:** Toggleable mode with large visual bounds, high-contrast layouts, and voice-assisted form filling.

---

## 📂 Folder Structure

```
KISAN-AGENT/
├── frontend/             # Next.js 15 App Router web application
│   ├── app/              # Routing pages and layout shells
│   ├── components/       # Reusable UI component modules (shadcn/ui)
│   ├── constants/        # Navigation configurations
│   ├── public/           # Vector illustrations and media
│   └── package.json      # NPM dependencies configuration
├── backend/              # FastAPI application server
│   ├── app/              # Router, database connection, config, and agents
│   ├── requirements.txt  # Python requirements configuration
│   └── README.md         # Backend setup details
├── docs/                 # Platform documentation
│   ├── ARCHITECTURE.md   # System architecture
│   ├── DATABASE_SCHEMA.md# Database schemas
│   ├── API_SPECIFICATION.md # Backend REST endpoints specification
│   ├── AI_AGENTS.md      # Multi-agent LangGraph flows
│   └── UI_GUIDELINES.md  # Styling guidelines and tokens
├── .gitignore            # Git exclusion lists
├── LICENSE               # MIT License details
└── README.md             # Project master overview
```

---

## 🛠️ Tech Stack

* **Frontend:** Next.js 15 (Turbopack), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion, Lucide React
* **Backend:** FastAPI, Python 3.14+, Pydantic v2, Uvicorn, LangGraph
* **Database & Auth:** Firebase Firestore, Firebase Authentication
* **Hosting:** Firebase Hosting, Google Cloud Run
* **Google Cloud APIs:** Vertex AI (Gemini Pro), Cloud Translation API, Cloud Speech-to-Text, Cloud Text-to-Speech, Earth Engine (Satellite biomass NDVI indexing), Google Maps Platform (driving routes)

---

## ⚡ Installation & Running Local Servers

### 1. Running the Frontend (Next.js)
Navigate into the `frontend/` directory, install package dependencies, and start the hot-reloading development server:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the onboarding flow preview.

### 2. Running the Backend (FastAPI)
Navigate into the `backend/` directory, initialize a Python virtual environment, install package dependencies, and run the Uvicorn server:
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --port 8001 --reload
```
The API server runs at [http://localhost:8001](http://localhost:8001) and Swagger docs load at [http://localhost:8001/docs](http://localhost:8001/docs).

---

## 🔒 Environment Variables

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL="http://localhost:8001/api/v1"
```

### Backend (`backend/.env`)
```env
APP_NAME="Kisan Alert AI Backend"
APP_ENV="development"
DEBUG=true
PORT=8001
HOST="0.0.0.0"
ALLOWED_ORIGINS="http://localhost:3000"
FIREBASE_PROJECT_ID="kisan-alert-ai-dev"
FIREBASE_CREDENTIALS_PATH="config/firebase-credentials.json"
GEMINI_API_KEY=""
GOOGLE_MAPS_API_KEY=""
```

---

## 🧠 AI Multi-Agent Architecture

The backend core runs a **LangGraph State Graph** orchestrated by a supervisor routing node:
* **Supervisor:** Routes conversational intent to specialized agents.
* **Weather Agent:** Evaluates rain cycles and alerts dry spells.
* **Crop Advisor Agent:** Calculates crop yield matches.
* **Disease Scan Agent:** Decodes foliage cell uploads.
* **Market Agent:** Runs APMC price forecasting.

---

## 👥 Contributors

* **Kisan Alert AI Dev Team**
  - Aura Build Team (3-Member Collaboration)

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
