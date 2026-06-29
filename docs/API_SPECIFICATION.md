# 🌐 API_SPECIFICATION.md

# Kisan Alert AI REST API Specification

## API Version

v1

Base URL

/api/v1

Backend

FastAPI

Response Format

JSON

Authentication

Firebase JWT Token

---

# Authentication APIs

## POST

/auth/register

Purpose

Register a new farmer.

---

## POST

/auth/login

Purpose

Login user.

---

## POST

/auth/google

Purpose

Google Sign In.

---

## POST

/auth/logout

Purpose

Logout.

---

## GET

/auth/profile

Purpose

Get logged in user.

---

# Farm APIs

## POST

/farms

Create Farm

---

## GET

/farms

List Farms

---

## GET

/farms/{id}

Farm Details

---

## PUT

/farms/{id}

Update Farm

---

## DELETE

/farms/{id}

Delete Farm

---

# Crop Recommendation

## POST

/crops/recommend

Purpose

Generate AI crop recommendation.

Request

District

Season

Soil

Water Source

Farm Size

Budget

Response

Recommended Crop

Confidence

Expected Yield

Profit

Risk

Explanation

---

# Disease Detection

## POST

/disease/analyze

Purpose

Analyze crop image.

Request

Image

Crop Name

Response

Disease

Confidence

Severity

Treatment

Recovery Plan

---

# Weather

## GET

/weather/current

Current Weather

---

## GET

/weather/forecast

7 Day Forecast

---

## GET

/weather/alerts

Weather Alerts

---

# Irrigation

## POST

/irrigation/advice

Purpose

AI irrigation guidance.

Response

Water Amount

Best Time

Reason

---

# Market

## GET

/market/prices

Current Prices

---

## GET

/market/predictions

Future Prices

---

## GET

/market/buyers

Verified Buyers

---

# Government Schemes

## GET

/schemes

All Schemes

---

## GET

/schemes/{id}

Scheme Details

---

## POST

/schemes/check

Eligibility Check

---

# Relief Hub

## POST

/relief/report

Report Disaster

---

## POST

/relief/assessment

AI Damage Assessment

---

## GET

/relief/support

Available NGO Support

---

## GET

/relief/marketplace

Relief Marketplace

---

# NGO APIs

## GET

/ngos

Nearby NGOs

---

## GET

/ngos/{id}

NGO Details

---

# Buyer APIs

## GET

/buyers

Verified Buyers

---

## GET

/buyers/{id}

Buyer Details

---

## POST

/buyers/request

Send Crop Selling Request

---

# AI Assistant

## POST

/chat

Chat with AI

Input

Text

Voice

Image

Output

AI Response

Suggested Actions

Voice Response

---

# Voice APIs

## POST

/voice/speech-to-text

Convert speech to text.

---

## POST

/voice/text-to-speech

Convert AI response into speech.

---

# Image APIs

## POST

/upload/image

Upload crop image.

---

## DELETE

/upload/image/{id}

Delete image.

---

# Notifications

## GET

/notifications

All notifications.

---

## POST

/notifications/read

Mark as read.

---

# User Profile

## GET

/profile

User Profile

---

## PUT

/profile

Update Profile

---

# Dashboard

## GET

/dashboard

Purpose

Return all dashboard widgets in one optimized API call.

Widgets

Weather

Alerts

Market

Recommendations

Disease

Quick Actions

---

# Analytics

## GET

/analytics

Usage analytics.

Admin only.

---

# Future APIs

Satellite Analysis

Insurance

Drone Images

IoT Sensors

Carbon Credits

Export Marketplace

Offline Sync

---

# API Standards

* Use REST principles.
* Return JSON only.
* Use proper HTTP status codes.
* Validate every request.
* Never expose internal errors.
* Return consistent response structures.
* Use pagination for large datasets.
* Version all APIs.

---

# Standard Success Response

{
"success": true,
"message": "Request completed successfully",
"data": {}
}

---

# Standard Error Response

{
"success": false,
"message": "Validation failed",
"errors": []
}

---

# Security

* Firebase JWT authentication.
* Input validation.
* Rate limiting.
* Secure file uploads.
* HTTPS only.
* No secrets in API responses.
