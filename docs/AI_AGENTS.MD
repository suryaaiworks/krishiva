# 🤖 AI_AGENTS.md

# Kisan Alert AI Multi-Agent System

## Vision

Kisan Alert AI uses a LangGraph Multi-Agent architecture instead of a single chatbot.

Each AI agent has one responsibility.

The Supervisor Agent coordinates all other agents to generate the final response.

---

# AI Architecture

User

↓

Supervisor Agent

↓

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Voice Agent

Crop Recommendation Agent

Disease Detection Agent

Weather Intelligence Agent

Irrigation Advisor Agent

Market Intelligence Agent

Government Scheme Agent

Relief & Recovery Agent

Buyer Marketplace Agent

NGO Support Agent

Satellite Analysis Agent

Notification Agent

Translation Agent

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

↓

Gemini API

↓

Final Response

---

# Supervisor Agent

Purpose

Central coordinator.

Responsibilities

* Understand user intent
* Route requests
* Call required agents
* Merge outputs
* Generate final response

The Supervisor never performs domain-specific analysis.

---

# Voice Agent

Purpose

Handle multilingual communication.

Responsibilities

* Speech-to-Text
* Text-to-Speech
* Language detection
* Voice response generation

Supported Languages

English

Hindi

Telugu

Tamil

Kannada

Malayalam

Future

All Indic Languages

---

# Crop Recommendation Agent

Purpose

Recommend the best crop.

Inputs

District

Season

Soil

Water Source

Weather

Satellite Insights

Outputs

Best Crop

Expected Yield

Expected Profit

Water Requirement

Risk Level

AI Explanation

---

# Disease Detection Agent

Purpose

Analyze crop health.

Inputs

Leaf Image

Crop Name

Outputs

Disease

Confidence

Severity

Treatment

Prevention

Recovery Plan

---

# Weather Intelligence Agent

Purpose

Interpret weather data.

Responsibilities

Rainfall

Humidity

Wind

Temperature

Dry Spell Prediction

Flood Warning

Heat Wave Alerts

Outputs

Weather Advisory

Irrigation Advice

Risk Alerts

---

# Irrigation Advisor Agent

Purpose

Optimize water usage.

Outputs

Water Quantity

Best Time

Frequency

Water Saving Tips

Reasoning

---

# Market Intelligence Agent

Purpose

Support selling decisions.

Responsibilities

Current Prices

Historical Trends

Future Prediction

Nearby Markets

Selling Advice

---

# Government Scheme Agent

Purpose

Recommend government assistance.

Responsibilities

Scheme Search

Eligibility

Required Documents

Application Process

Deadlines

Subsidies

Insurance

---

# Relief & Recovery Agent

Purpose

Support farmers after disasters.

Responsibilities

Damage Assessment

Recovery Plan

Government Relief

Insurance

Emergency Support

Alternative Crops

Financial Guidance

---

# Buyer Marketplace Agent

Purpose

Connect farmers with verified buyers.

Responsibilities

Buyer Search

Crop Matching

Price Comparison

Nearby Buyers

Purchase Requests

---

# NGO Support Agent

Purpose

Connect NGOs with farmers.

Responsibilities

Seed Distribution

Fertilizer Support

Water Support

Equipment Support

Volunteer Programs

Donation Campaigns

Emergency Relief

---

# Satellite Analysis Agent

Purpose

Analyze satellite imagery.

Responsibilities

Vegetation Health

NDVI

Water Stress

Crop Monitoring

Land Analysis

---

# Notification Agent

Purpose

Notify farmers.

Types

SMS

Push Notifications

Weather Alerts

Disease Alerts

Market Alerts

Government Alerts

Relief Alerts

---

# Translation Agent

Purpose

Translate AI responses.

Supported Languages

English

Hindi

Telugu

Tamil

Kannada

Malayalam

Future

All Indian Languages

---

# Agent Collaboration Examples

Scenario 1

User asks:

"What crop should I grow?"

Supervisor

↓

Crop Recommendation Agent

↓

Weather Agent

↓

Market Agent

↓

Government Scheme Agent

↓

Gemini

↓

Final Recommendation

---

Scenario 2

User uploads crop image.

Supervisor

↓

Disease Detection Agent

↓

Weather Agent

↓

Irrigation Agent

↓

Relief Agent (if severe)

↓

Gemini

↓

Diagnosis

---

Scenario 3

Heavy rainfall predicted.

Supervisor

↓

Weather Agent

↓

Notification Agent

↓

SMS Alert

↓

Voice Alert

---

Scenario 4

Farmer reports flood damage.

Supervisor

↓

Relief Agent

↓

NGO Agent

↓

Government Scheme Agent

↓

Buyer Agent

↓

Recovery Plan

---

# AI Principles

Every agent must:

* Have one responsibility
* Produce structured output
* Be reusable
* Be independent
* Return confidence scores
* Explain recommendations

---

# Prompt Engineering Rules

* Use clear prompts
* Keep prompts modular
* Avoid hardcoded assumptions
* Support multilingual responses
* Always explain AI decisions

---

# Future Agents

Yield Prediction Agent

Insurance Agent

Drone Analysis Agent

Carbon Credit Agent

Export Advisor Agent

Financial Advisor Agent

Pest Prediction Agent

IoT Sensor Agent

Offline AI Agent

---

# Final Principle

The Multi-Agent System should behave like a team of agricultural experts working together rather than a single chatbot.

Every response should combine expertise from the relevant agents to provide accurate, actionable, and easy-to-understand advice for farmers.
