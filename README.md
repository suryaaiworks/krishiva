# 🌾 Krishiva AI (Kisan Agent)

Krishiva AI is a production-grade, AI-powered digital farming companion designed to support smallholder and marginal farmers. It serves as a complete farming ecosystem helping farmers throughout the crop lifecycle—from crop selection and disease diagnosis to weather forecasting, government schemes eligibility, and direct B2B buyer selling.

---

## 🚀 Features

* **Vira AI Copilot:** Voice-first conversational AI companion (supporting Telugu, Hindi, and English) that guides farmers, answers questions, reads screen details aloud, and navigates dashboards.
* **Smart Crop Advisor:** dynamic matching evaluating soil profiles, water availability, and weather forecasts to recommend optimal crops.
* **AI Crop Disease Scan:** foliage diagnostic scans that identify crop pests, rust, and blights, providing treatment advice.
* **Weather Intelligence:** week forecasts with dry spell predictions and specific action advice.
* **Market Intelligence Center:** mandi price indices, arbitrage comparison tables, and price trends.
* **Benefits Schemes Advisor:** personalized eligibility checklist that updates an application progress timeline.
* **B2B Buyer Marketplace:** direct buyer connection, logistics price calculators, and verified commercial buyers.

---

## 📂 Folder Structure

```
KISAN-AGENT/
├── frontend/             # Next.js 15 App Router web application
│   ├── app/              # Page views and layouts (Dashboard, Weather, Market, Crops, Disease, etc.)
│   ├── components/       # Visual components and ViraVoiceWidget
│   ├── public/           # Static assets (logo, mic icon, vira.js widget, vira.css stylesheet)
│   ├── services/         # API client configurations (apiClient.ts)
│   └── package.json      # NPM dependencies configuration
├── backend/              # FastAPI application server
│   ├── app/              # Router, database schema, repositories, controllers, and agents
│   │   ├── ai_agents/    # Vira LangGraph AI decision agents
│   │   ├── controllers/  # Assistant, auth, crops, machinery, and market endpoints
│   │   ├── database/     # Supabase client and connection pools
│   │   ├── middleware/   # Authentication filter middleware
│   │   ├── models/       # SQLAlchemy models (User, Crop, MarketPrice, Machinery, Scheme, etc.)
│   │   ├── prompts/      # Gemini prompts for intent parsing, agronomist advice, and disease diagnosis
│   │   ├── repositories/ # Database query operations (users, farms, machinery, schemes, etc.)
│   │   └── services/     # Third-party integrations (Gemini, OpenWeather, Brevo, Storage)
│   ├── krishiva_fallback.db # SQLite seeded backup database
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

* **Frontend:** Next.js 15 (Turbopack), React 19, TypeScript, Tailwind CSS, Web Speech API (STT / TTS)
* **Backend:** FastAPI, Python 3.12+, SQLAlchemy, LangGraph
* **Database & Auth:** Supabase (PostgreSQL), Firebase Auth fallback
* **Local DB Fallback:** SQLite (seeded fallback DB)
* **API Integrations:** Gemini Pro (AI Agents), OpenWeather API, Brevo API (SMTP Notification Emails)

---

## ⚡ Installation & Running Local Servers

### 1. Running the Frontend (Next.js)
Navigate into the `frontend/` directory, install package dependencies, and start the development server:
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
# On Windows
.venv\Scripts\activate
# On macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --port 8001 --reload
```
The API server runs at [http://127.0.0.1:8001](http://127.0.0.1:8001) and Swagger docs load at [http://127.0.0.1:8001/docs](http://127.0.0.1:8001/docs).

---

## 🔒 Environment Variables

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL="http://127.0.0.1:8001/api/v1"
```

### Backend (`backend/.env`)
```env
APP_NAME="Krishiva AI Backend"
APP_ENV="development"
DEBUG=true
PORT=8001
HOST="127.0.0.1"
ALLOWED_ORIGINS="http://localhost:3000,http://127.0.0.1:3000"

# Supabase Configurations
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_KEY="your-anon-key"
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/postgres"

# Third Party Keys
GEMINI_API_KEY="your-gemini-key"
OPENWEATHER_API_KEY="your-weather-key"
BREVO_API_KEY="your-brevo-key"
```

---

## 👥 Contributors

* **Krishiva AI Development Team**
  - Aura Build Team (3-Member Collaboration)

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
