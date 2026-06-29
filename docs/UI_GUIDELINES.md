# 🎨 UI_GUIDELINES.md

# Kisan Alert AI - Design System

## Design Philosophy

The application must feel like a premium AI platform built by Google, drawing inspiration from Google Gemini, Material Design 3, Apple Health, and Google Weather.
This is NOT a traditional agricultural web page. It is a modern, responsive, mobile-first product that immediately impresses judges.

---

# Color Palette

## Brand Tokens
* **Primary Forest Green:** `#2E7D32`
* **Secondary Green:** `#4CAF50`
* **Accent Light Green:** `#8BC34A`
* **Success:** `#16A34A`
* **Warning:** `#F59E0B`
* **Error:** `#EF4444`
* **Background Light:** `#F8FAF7` (Dark Mode: `#0F172A`)
* **Card Background:** `#FFFFFF` (Dark Mode: `#1E293B`)
* **Border:** `#E5E7EB` (Dark Mode: `#334155`)
* **Text Primary:** `#111827` (Dark Mode: `#F9FAFB`)
* **Text Secondary:** `#6B7280` (Dark Mode: `#9CA3AF`)

---

# Typography

* **Fonts:** Inter, Roboto, or Outfit (system default fallbacks).
* **Hierarchy:** Clear headers using bold font-headings and light body sizes. No decorative script fonts.
* **Localization Text wrapping:** Ensure all translated text labels (e.g. Marathi/Telugu) wrap gracefully without clipping bounds.

---

# Spacing System

Follow a strict `8px` spacing grid:
* `4px` / `8px` / `12px` / `16px` / `24px` / `32px` / `48px` / `64px`
* Never use ad-hoc random paddings.

---

# Border Radius Tokens

* **Cards:** `20px` (Provides a premium modern layout profile)
* **Buttons:** `16px`
* **Inputs:** `16px`
* **Dialog Modals:** `24px`
* **Badges:** Pill-shaped `999px`

---

# Shadows & Elevations

* Use soft, ambient drop-shadows.
* Avoid harsh color shadows or high-intensity glowing outlines.

---

# Accessibility & Elder Mode

A toggleable **Elder Mode** optimizes the application for senior or visually impaired farmers:
* **Large Text sizes:** Increase body text to `16px` or `18px`.
* **High Contrast ratios:** Ensure text readability against backgrounds.
* **Large Buttons:** Massive hit targets (minimum `48px` width/height).
* **Voice guidance:** Speaker icons must be placed next to major sections to read advice aloud.
* **Audio instructions:** Simple voice-prompts guiding form inputs.

---

# Animations

Use **Framer Motion** for micro-interactions:
* **Fades & Slides:** Smooth entrance transitions (`duration: 0.2s` or `0.3s`).
* **Hover Scale:** Cards lift slightly (`scale: 1.02`) on mouseover.
* **Staggered lists:** Stagger animations when displaying items sequentially.
* Avoid bounce, flash, or rapid spinning.

---

# Page-Specific Layout Guidelines

## 💬 1. Kisan Mitra AI (Chat Interface)
* Large voice microphone trigger with animated waveforms at the bottom.
* Render structured card widgets (e.g. WeatherCard, CropCard) inline within chat bubbles.

## 🌾 2. Smart Crop Advisor
* Stepper layout dividing fields into Location, Parameters, and Sowing Seasons.
* satellite terrain mapping overlay with a radar-locked pin.
* AI logic logs loading screen displaying a concentric glowing matcher circle.

## 🏥 3. Emergency Relief Hub
* Blinking radar scanner warning overlays for natural disaster alerts.
* Image uploader with scan log metrics.
* Cost analysis cards and alternative buyer rosters.

## 🏛️ 4. Government schemes benefits advisor
* Application progress bar that automatically fills as farmers check documents.

## 🎮 5. Demo Controller Drawer
* Emerald green glowing presentation trigger floating at the bottom right.
* Slides up a presentation dashboard containing scenario controllers.
