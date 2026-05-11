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

## 1. Clone Repository

```bash
git clone <your-repo-url>
cd <project-folder>
```

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

---
