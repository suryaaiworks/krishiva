# Krishiva

> Empowering Farmers with AI

Krishiva is a comprehensive agricultural assistant platform featuring direct B2B buyer sourcing marketplaces, heavy machinery rental portals, soil advisory indices, crop diagnostic camera utilities, and the Vira AI voice assistant.

---

## Project Overview

This repository contains the Next.js frontend code for the Krishiva platform. It serves three role-based dashboards:
1. **Farmer Dashboard**: Agri-advisories, weather feeds, crop pricing indexes, disease diagnostic cameras, machinery rentals, and buyer marketplace listings.
2. **Machinery Owner Portal**: Fleet management listings, booking calendars, accept/reject booking workflows, earnings ledgers, and usage analytics.
3. **Buyer Portal**: Direct crop sourcing requests, farmer directories, active orders ledgers, market procurement insights, and payments.

---

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (version 15, App Router)
- **Styling**: Vanilla CSS, [TailwindCSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Platform Base**: TypeScript, React 19

---

## Frontend Setup

To start the development server or compile the production bundle, navigate to the frontend directory and run:

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Compile optimized production build
npm run build

# 4. Start the production build locally
npm run start
```

---

## Environment Variables Required

Create a `.env.local` file by copying the template file:
```bash
cp .env.example .env.local
```

### Configured Variables
- `NEXT_PUBLIC_APP_ENV`: Session environment descriptor (`development` or `production`)
- `NEXT_PUBLIC_GEMINI_API_KEY`: Google Gemini API credentials for AI diagnostic predictions

---

## Folder Structure

```text
frontend/
├── app/                  # Next.js App Router page routes & page components
├── assets/               # Branding graphics and local media files
├── components/           # Reusable UI cards, forms, sidebars, and layouts
├── hooks/                # Custom React hook utilities (stateful triggers)
├── lib/                  # Library bindings (cn utility wrappers)
├── public/               # Static assets (fonts, icons, and background SVGs)
├── services/             # API request structures & external interfaces
├── styles/               # Styling configurations and global CSS variables
├── types/                # TypeScript type declarations
└── utils/                # Shared helper functions
```

---

## Instructions for Backend Integration

This project is a standalone **frontend only** application featuring complete user interface configurations, dashboards, sidebars, modals, routing, and form mockups. 

### Integration Protocol
- **REST APIs**: All pages, forms, and mock states are prepared to connect to a FastAPI + Supabase backend using standard REST API integration.
- **RBAC**: User views can be bound to Role-Based Access Control (RBAC) scopes.
- **UI Preservation**: Integration must be conducted purely on the API/service layers (`frontend/services`) using fetch calls and React Context state bindings, without altering the premium Krishiva styling, branding, layout patterns, or UI theme.
