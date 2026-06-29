# 🗺️ Kisan Alert AI - Development Roadmap

## Project Objective

Build a production-ready AI-powered agricultural intelligence platform for the Google AI Hackathon.
The development follows a structured, phase-by-phase approach where frontend visual quality, user accessibility, backend foundation, and agent intelligence are progressively integrated.

---

# Completed Phases

### Phase 1 — UI & Design System Foundation
* [x] Mobile-first premium white theme layout with forest green branding.
* [x] Tailwind CSS v4 design tokens and utility configurations.
* [x] Dark mode support integrated with `next-themes` and `ThemeProvider`.

### Phase 2 — Onboarding & Splash Experience
* [x] Animated splash screen with progress loader.
* [x] 4-slide onboarding carousel detailing features with vector illustrations.
* [x] Refactored **Proceed to Platform** button routing to `/login`.

### Phase 3 — Authentication Experience
* [x] Zod-validated phone login page with Indian number formatting checks.
* [x] Mock Google login and Guest login redirection flows.
* [x] Integrated offline status indicator banners.

### Phase 4 — Core AI Dashboard
* [x] Welcome banner and metric statistic cards.
* [x] Modular widgets for weather warnings, alerts, and APMC market indexes.
* [x] Voice query assistant widget.

### Phase 5 — AI Conversational Assistant
* [x] Clean chat stream with avatars.
* [x] Pulsing mic button and spring-pulsing audio waveforms.
* [x] Structured return cards (rendering crop cards, weather summaries, government scheme detail cards, and treatment plans directly in chat).

### Phase 6 — Crop Disease Detection Scan
* [x] Foliage camera image uploader widget (`UploadImageCard`).
* [x] Visual scanning laser animation and progressive cell analysis logs.
* [x] Diagnosis dashboard detailing infection severity, pesticide schedules, and escalation links.

### Phase 7 — Smart Crop Recommendation Wizard
* [x] Guided stepper wizard (Location -> Farm Size & Soil -> Seasons -> Analysis -> Results).
* [x] Auto GPS coordinates retrieval and high-fidelity satellite terrain mapping overlay.
* [x] Suggested crop cards and soil nitrogen restoration insights.

### Phase 8 — Weather Intelligence
* [x] SVG weather animations (rotating sun and drifting clouds).
* [x] Hourly forecast scroll list and expandable 7-day agricultural advisories.
* [x] Dry spell risk predictors and watering calculators.

### Phase 9 — Market Intelligence Center
* [x] Dynamic SVG market trend index charts drawing on page load.
* [x] Commodity details selector updating live buyer quotes and mandi spot prices.
* [x] MSP comparisons and Mandi shipping cost calculators.

### Phase 10 — Emergency Relief Hub
* [x] Radar warning animation for floods, cyclones, and pests.
* [x] Loss assessor panel evaluating financial damages.
* [x] NGO coordination directories and alternative buyer markets (biofuel/feed mills).

### Phase 11 — Government Schemes Benefits Advisor
* [x] Personalized eligibility questionnaire step-wizard.
* [x] Checked required documents checklist.
* [x] Dynamic application timeline linking progress directly to document checkboxes.

### Phase 12 — RSK Office Locator & Appointment Booking
* [x] Shirur-zone vector road mapping with distance coordinate calculations.
* [x] Slot booking calendar and specialist selections.
* [x] QR-coded digital appointment token queue receipts.

### Phase 13 — Premium B2B Buyer Marketplace
* [x] Spot comparison price sheets for buyers vs local mandis.
* [x] Vehicle logistics planner calculating net profits based on transport fuel costs.
* [x] Bid negotiation modal simulating counter-offers and buyer acceptances.

### Phase 14 — Profile & settings
* [x] Multi-farm layout registering land sizes and crop parameters.
* [x] Timeline crop logs and milestones achievements.
* [x] Accessibility settings for 11 regional languages, Elder Mode, and Text size.

### Phase 15 — Demo Mode Control Drawer
* [x] Floating presentation play button globally active.
* [x] 5 preset scenario triggers (Healthy, Disease, Flood, Market Arbitrage, Schemes).
* [x] Kiosk auto-play mode cycling navigations every 7 seconds.

### Phase 16 — Navigation Refactoring
* [x] Removed all mock alert popups and raw location redirects in the frontend.
* [x] Refactored all buttons to use Next.js App Router `router.push()` for transitions.

### Phase 17 — Backend Foundation
* [x] Configured FastAPI server with Uvicorn, logging, and error handling.
* [x] Integrated resilient Firestore connection fallbacks to skip GCP metadata delays.
* [x] Base health, version, and status endpoints returning HTTP 200 OK.
* [x] Initialized LangGraph state graph skeleton.

---

# Future Integration Roadmap

## Phase 18 — Firebase Integration & Database Caching
* [ ] Integrate Firebase Authentication for OTP validation.
* [ ] Set up Firestore database schemas to persist farmer profiles and farm parameters.
* [ ] Configure offline persistence and sync queues for remote field use.

## Phase 19 — Google Cloud Speech & Language Integration
* [ ] Connect Google Cloud Speech-to-Text (STT) for natural voice queries.
* [ ] Connect Google Cloud Text-to-Speech (TTS) for vocalized agronomist advice.
* [ ] Deploy Translation API for dynamic interface translations.
* [ ] Implement "Elder Mode" accessibility voice guidance.

## Phase 20 — Advanced AI Core (LangGraph Multi-Agent Stack)
* [ ] Connect Vertex AI Gemini Pro to process multi-turn conversations.
* [ ] Build sub-agent graph modules:
  - **Weather Agent:** Processes climate feeds and schedules warnings.
  - **Disease Detection Agent:** Employs Gemini Vision to classify foliage uploads.
  - **Market Agent:** Predicts mandi trends and analyzes buyer contracts.
  - **Schemes Agent:** Cross-references government scheme guidelines.
  - **Relief Agent:** Coordinates emergency damage plans.
* [ ] Implement **Kisan Mitra AI** voice-routing handler to map queries to correct agents.

## Phase 21 — Satellite Earth Engine & Maps Platform
* [ ] Integrate Google Earth Engine APIs to map vegetative index (NDVI) boundaries.
* [ ] Connect Google Maps API to map real block-level RSK centers and plot driving routes.

## Phase 22 — Production Deployment & Hackathon Demo Package
* [ ] Deploy frontend to Firebase Hosting.
* [ ] Deploy FastAPI to Google Cloud Run.
* [ ] Package demonstration script, kiosk autoplay walkthrough, and presentation slides.
