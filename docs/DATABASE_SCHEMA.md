# 🗄️ DATABASE_SCHEMA.md

# Kisan Alert AI Database Schema

## Database

Firebase Firestore

Future compatible with PostgreSQL if required.

---

# Collections Overview

users

farms

crop_recommendations

crop_diagnosis

weather

market_prices

government_schemes

notifications

buyers

ngo_support

relief_requests

chat_history

feedback

analytics

settings

---

# users

Purpose

Store farmer profile information.

Fields

userId

fullName

phone

email

profileImage

language

state

district

village

createdAt

updatedAt

role

---

# farms

Purpose

Store registered farms.

Fields

farmId

userId

farmName

farmSize

unit

soilType

waterSource

latitude

longitude

cropHistory

createdAt

updatedAt

---

# crop_recommendations

Purpose

Store AI recommendations.

Fields

recommendationId

userId

farmId

season

recommendedCrop

confidenceScore

expectedYield

expectedProfit

waterRequirement

riskLevel

aiExplanation

createdAt

---

# crop_diagnosis

Purpose

Store disease analysis.

Fields

diagnosisId

userId

farmId

imageUrl

cropName

diseaseName

severity

confidence

recommendedTreatment

preventiveMeasures

recoveryPlan

createdAt

---

# weather

Purpose

Store weather information.

Fields

weatherId

district

temperature

humidity

rainfall

windSpeed

uvIndex

forecast

drySpellRisk

lastUpdated

---

# market_prices

Purpose

Store crop prices.

Fields

marketId

cropName

marketName

district

price

unit

trend

predictedPrice

updatedAt

---

# government_schemes

Purpose

Store agriculture schemes.

Fields

schemeId

schemeName

category

description

eligibility

requiredDocuments

applicationLink

lastUpdated

---

# notifications

Purpose

Store alerts.

Fields

notificationId

userId

title

message

type

priority

isRead

createdAt

---

# buyers

Purpose

Store verified buyers.

Fields

buyerId

companyName

contactPerson

phone

email

requiredCrop

quantity

offeredPrice

district

verified

createdAt

---

# ngo_support

Purpose

Store NGO information.

Fields

ngoId

ngoName

contactPerson

phone

email

services

district

verified

createdAt

---

# relief_requests

Purpose

Store disaster recovery requests.

Fields

requestId

userId

farmId

disasterType

damagePercentage

aiAssessment

requestedSupport

status

assignedNGO

createdAt

---

# chat_history

Purpose

Store AI conversations.

Fields

chatId

userId

role

message

attachments

language

timestamp

---

# feedback

Purpose

Collect user feedback.

Fields

feedbackId

userId

rating

category

message

createdAt

---

# analytics

Purpose

Store platform analytics.

Fields

analyticsId

activeUsers

totalRecommendations

totalDiagnoses

weatherAlertsSent

reliefRequests

updatedAt

---

# settings

Purpose

Store user preferences.

Fields

settingId

userId

theme

language

notifications

voiceEnabled

darkMode

updatedAt

---

# Relationships

User → Multiple Farms

Farm → Multiple Recommendations

Farm → Multiple Disease Reports

User → Multiple Notifications

User → Multiple Chats

User → Multiple Relief Requests

NGO → Multiple Relief Requests

Buyer → Multiple Crop Purchase Requests

---

# Future Collections

iot_sensor_data

satellite_analysis

insurance_claims

crop_yield_predictions

drone_images

export_marketplace

carbon_credit_records

---

# Database Principles

* Never duplicate user data.
* Store timestamps for every record.
* Use unique document IDs.
* Keep collections normalized where possible.
* Design for scalability to millions of users.
* Ensure compatibility with Firebase security rules.
