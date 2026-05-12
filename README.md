# Amul Milk Traceability System

A full-stack supply chain traceability platform for dairy products built with the MERN stack.  
The system enables QR-based product tracking, genealogy tracing, recall simulation, live tracking, and risk monitoring across the milk processing lifecycle.

---

# Tech Stack

## Frontend
- React
- TypeScript
- Tailwind CSS
- Vite

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

---

# Local Setup

---

# Backend Setup

## Install Dependencies

```bash
cd backend
npm install
```

## Configure Environment Variables

Create a `.env` file inside `backend/`

```env
MONGODB_URI=mongodb://127.0.0.1:27017/amul-traceability
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Seed Database

Run the following command to populate MongoDB with sample data:

```bash
npx tsx src/seeds/seed.ts
```

This will create:
- Collection Centers
- Tanker Trips
- Reception Batches
- Processing Batches
- Packaging Batches
- Bottles with QR Codes
- Quality Events

## Start Backend Server

```bash
npm run dev
```

Backend runs on:

```txt
http://localhost:5000
```

---

# Frontend Setup

## Install Dependencies

```bash
cd frontend
npm install
```

## Start Frontend

```bash
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

# Features

- QR Code Generation
- Bottle-Level Traceability
- Product Genealogy
- Recall Simulation
- Risk Monitoring
- Live Supply Chain Tracking
- Batch Management

---

# Sample QR Format

```txt
https://trace.aurelia.ai/amk/01/{GTIN}/lot/{PACKAGING_BATCH_CODE}/ser/{SERIAL}
```

Example:

```txt
https://trace.aurelia.ai/amk/01/8901234567890/lot/AMUL-PKG-MUM-20260505-A-01/ser/000001
```

# Test QR Payloads

Use the following QR payloads to test:

- QR Lookup
- Product Genealogy
- Recall Simulation
- Risk Monitoring
- Live Tracking

These payloads are pre-seeded in the database.

```json
[
  {
    "_id": "6a03190818cac9124e921369",
    "serial": "000001",
    "qrPayload": "https://trace.aurelia.ai/amk/01/8901234567890/lot/AMUL-PKG-MUM-20260505-A-01/ser/000001"
  },
  {
    "_id": "6a03190818cac9124e92136a",
    "serial": "000002",
    "qrPayload": "https://trace.aurelia.ai/amk/01/8901234567890/lot/AMUL-PKG-MUM-20260505-A-01/ser/000002"
  },
  {
    "_id": "6a03190818cac9124e92136b",
    "serial": "000003",
    "qrPayload": "https://trace.aurelia.ai/amk/01/8901234567890/lot/AMUL-PKG-MUM-20260505-A-01/ser/000003"
  },
  {
    "_id": "6a03190818cac9124e92136c",
    "serial": "000004",
    "qrPayload": "https://trace.aurelia.ai/amk/01/8901234567890/lot/AMUL-PKG-MUM-20260505-A-01/ser/000004"
  },
  {
    "_id": "6a03190818cac9124e92136d",
    "serial": "000005",
    "qrPayload": "https://trace.aurelia.ai/amk/01/8901234567890/lot/AMUL-PKG-MUM-20260505-A-01/ser/000005"
  },
  {
    "_id": "6a03190818cac9124e92136e",
    "serial": "000006",
    "qrPayload": "https://trace.aurelia.ai/amk/01/8901234567890/lot/AMUL-PKG-MUM-20260505-A-01/ser/000006"
  },
  {
    "_id": "6a03190818cac9124e92136f",
    "serial": "000007",
    "qrPayload": "https://trace.aurelia.ai/amk/01/8901234567890/lot/AMUL-PKG-MUM-20260505-A-01/ser/000007"
  },
  {
    "_id": "6a03190818cac9124e921370",
    "serial": "000008",
    "qrPayload": "https://trace.aurelia.ai/amk/01/8901234567890/lot/AMUL-PKG-MUM-20260505-A-01/ser/000008"
  },
  {
    "_id": "6a03190818cac9124e921371",
    "serial": "000009",
    "qrPayload": "https://trace.aurelia.ai/amk/01/8901234567890/lot/AMUL-PKG-MUM-20260505-A-01/ser/000009"
  },
  {
    "_id": "6a03190818cac9124e921372",
    "serial": "000010",
    "qrPayload": "https://trace.aurelia.ai/amk/01/8901234567890/lot/AMUL-PKG-MUM-20260505-A-01/ser/000010"
  }
]
```

You can directly paste any `qrPayload` value into the application to test the complete traceability flow.
---

