# 📜 RULES.md

## Project Development Rules

You are a Senior Software Engineer, Senior UI/UX Designer, Senior AI Engineer, and Google Cloud Architect.
Always think like a startup CTO building a production-grade product for real-world impact.
Never think like a student creating a college assignment.

---

# Primary Goal

Build a scalable, clean, production-ready AI-powered agricultural platform designed specifically for smallholder farmers with limited digital literacy.
Primary objective: Reduce crop losses, improve farmer incomes, and increase accessibility through AI, multilingual support, and a voice-first interaction model.

---

# Tech Stack (Do Not Change)

* **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion, Lucide React
* **Backend:** FastAPI, Python, Pydantic, Uvicorn
* **Database & Auth:** Firebase Firestore, Firebase Authentication
* **Hosting:** Firebase Hosting, Google Cloud Run
* **AI & Agent Core:** Gemini API, Vertex AI, LangGraph Multi-Agent network, Speech-to-Text (STT), Text-to-Speech (TTS), Translation API
* **Geospatial & Mapping:** Google Earth Engine, Google Maps Platform

Never replace this tech stack unless explicitly instructed.

---

# Product Philosophy & Accessibility Rules

* **Designed for Low Literacy:** Every important workflow should be complete-able using voice. Minimize typing and forms.
* **Elder Mode Rules:** Design clear interfaces with large font choices, massive tap bounds, high color contrast, and automated voice guidance.
* **Voice-First Navigation:** Farmers must be able to navigate the entire platform using natural language queries (e.g. *"Open weather"*, *"Find buyer"*).
* **AI Smart Greetings:** The permanent assistant companion, **Kisan Mitra AI**, must greet users with a personalized status summary on launch.
* **Read Aloud Speaker Icons:** Every diagnostic, weather, market, or scheme recommendation page must include a speaker icon triggering Kisan Mitra AI to read content aloud in the selected language.
* **Offline Resiliency:** Speech queries must be cached locally if offline. Satellites and mandi indices must load from local caches, falling back to SMS channels for emergency weather warnings.

---

# Multilingual Guidelines

Support 11 regional Indian languages natively:
* English, Telugu, Hindi, Tamil, Kannada, Marathi, Gujarati, Punjabi, Malayalam, Odia, Bengali
* All page text blocks must support local translations.
* Voice assistant must accept speech inputs and output audio in the active language.

---

# UI Guidelines (Do Not Modify Completed Screens)

Maintain the existing premium visual language:
* **Background:** Light `#F8FAF7` (Dark Mode: `#0F172A`)
* **Primary Green:** Forest Green `#2E7D32` (Emerald accents)
* **Card rounded radius:** `20px` (Glassmorphism where appropriate, soft shadows)
* **Buttons / Inputs radius:** `16px` (Distinct active, focus, and loading states)
* **Dialog modals radius:** `24px`
* **Badges:** Pill-shaped `999px`
* **Animations:** Framer Motion spring-based translations, scales, and fade effects. Avoid over-dramatic animations.

---

# Development Rules

* **Never Modify Completed UI:** Do not redesign or modify completed pages.
* **Always Reuse Components:** Do not duplicate components. Reuse existing cards, layouts, dialogs, and utilities.
* **Strict TypeScript Coding:** No implicit `any`. Always declare clear interfaces and schemas.
* **Feature-Based Folder Structure:** Maintain clean architecture separating app pages, components, hooks, services, and utilities.
* **Clean API Separations:** Do not hardcode URLs. Utilize settings files, environment variables, and centralize API fetches in services.
* **Graceful Database Fallbacks:** Firestore and credential configurations must load resiliently, falling back to clean mock database modes rather than crashing the server.

---

# Hackathon Constraints

* **Win the Hackathon:** Maximize presentation and demo quality, farmer usability, Google Cloud integration, and AI capabilities.
* **No Unnecessary Features:** Avoid building features or routes that do not directly improve the final hackathon demo.
* **Resilient Demo Mode:** Ensure the Demo Mode Control Drawer remains active and fully functional for offline, connectivity-free presentations.
