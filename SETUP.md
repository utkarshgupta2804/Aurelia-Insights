# Quick Start Guide - Amul Traceability System

## Installation & Running (5 minutes)

### Step 1: Backend Setup

```bash
cd backend

# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env

# Seed the database with mock data
pnpm seed

# Start backend server (runs on port 5000)
pnpm dev
```

Once you see `Server running on http://localhost:5000`, the backend is ready.

### Step 2: Frontend Setup (in a new terminal)

```bash
cd frontend

# Install dependencies
pnpm install

# Start frontend development server (runs on port 3000)
pnpm dev
```

Once compilation is complete, your browser should open `http://localhost:3000`.

---

## First Steps in the Application

### 1. Dashboard
The dashboard loads automatically showing:
- Total bottles in system
- Packaging and processing batches
- At-risk items count
- Risk distribution chart
- Recent quality events

### 2. QR Lookup (Test First Feature)
After seeding, you have 150 bottles with QR codes. To test:
1. Go to **QR Lookup** page
2. In the mock database, bottles have QR payloads like:
   ```
   https://trace.aurelia.ai/amk/01/8901234567890/lot/AMUL-PKG-MUM-20260505-A-01/ser/000001
   ```
3. Paste any QR payload and click Search
4. See the full genealogy chain from Bottle → Packaging → Processing → Reception → Tanker → Collection Center

### 3. Genealogy View
1. Go to **Genealogy** page
2. Copy a Bottle ID from the database (MongoDB ObjectId)
3. Paste and search
4. View complete upstream traceability

### 4. Risk Monitoring
1. Go to **Risk Monitor** page
2. Switch between Processing and Packaging batches
3. See all batches color-coded by risk (Green/Amber/Red)
4. Risk scores calculated based on temperature, transit time, blending, and quality

### 5. Recall Simulation
1. Go to **Recall** page
2. Enter any Processing Batch ID from the database
3. See impact: affected bottles, packaging batches, dispatch pallets
4. Understand recall severity

### 6. Live Tracking
1. Go to **Tracking** page
2. Enter a Bottle ID
3. See timeline of journey from Collection → Delivery
4. View temperatures logged at each stage

---

## Database Inspection (Optional)

To see what was seeded, connect MongoDB:

```bash
# If using local MongoDB
mongo mongodb://localhost:27017/amul-traceability

# List collections
show collections

# View sample data
db.bottles.findOne()
db.packagingbatches.findOne()
db.processingbatches.findOne()
db.receptionbatches.findOne()
db.tankertrips.findOne()
db.collectioncenters.findOne()
db.qualityevents.findOne()
```

---

## Architecture Overview

```
React Frontend (TypeScript)
    ↓
Vite Dev Server (Port 3000)
    ↓
API Calls via Axios
    ↓
Express Backend (Port 5000)
    ↓
Mongoose Models
    ↓
MongoDB Collections
```

---

## API Testing

### Using cURL

```bash
# Test health check
curl http://localhost:5000/api/health

# Get statistics
curl http://localhost:5000/api/stats

# Lookup QR (replace with real payload from DB)
curl "http://localhost:5000/api/lookup?qrPayload=https://trace.aurelia.ai/amk/01/8901234567890/lot/AMUL-PKG-MUM-20260505-A-01/ser/000001"

# Get all processing batches
curl http://localhost:5000/api/batches/processing

# Get risk score for a batch (replace with real ID)
curl http://localhost:5000/api/risk-score/{batchId}
```

---

## Common Issues & Solutions

### Issue: "Cannot find module" errors in frontend
**Solution**: Make sure you ran `pnpm install` in the frontend directory

### Issue: MongoDB connection refused
**Solution**: 
- Check if MongoDB is running: `mongod`
- Or use MongoDB Atlas (cloud): update `MONGODB_URI` in backend/.env

### Issue: Port 5000 already in use
**Solution**: 
- Change port in backend/.env: `PORT=5001`
- Update frontend vite.config.ts proxy: `'http://localhost:5001'`

### Issue: CORS errors
**Solution**: 
- Backend already has CORS configured
- Make sure frontend URL in backend/.env matches your frontend URL

### Issue: Slow seed operation
**Solution**: 
- QR image generation takes time (generates 150 images)
- Progress is logged to console
- This is normal and happens only once

---

## Development Tips

### Hot Reload
- Both frontend and backend have hot reload enabled
- Edit any file and changes appear instantly

### API Documentation
- Endpoints documented in main README.md
- See backend/src/routes/* for implementation details
- Test endpoints in browser or with curl

### Database Inspection
- MongoDB Compass (GUI tool) recommended for data exploration
- Connect to `mongodb://localhost:27017/amul-traceability`

### Debugging
- Frontend: Open browser DevTools (F12)
- Backend: Check terminal output for logs
- Database: Use `mongosh` or MongoDB Compass

---

## Next Steps

1. **Explore the application** - click through all pages
2. **Test APIs** - use cURL to understand data flow
3. **Modify seed data** - change collectioncenters or add scenarios
4. **Build custom features** - extend the application

---

## File Structure for Development

```
Frontend Key Files:
- src/App.tsx - Main component
- src/components/pages/* - Page implementations
- src/services/api.ts - API calls
- src/types/index.ts - TypeScript interfaces

Backend Key Files:
- src/app.ts - Express setup
- src/models/* - MongoDB schemas
- src/routes/* - API endpoints
- src/services/* - Business logic
- src/utils/* - QR and risk calculation
- src/seeds/seedData.ts - Mock data generator
```

---

## Troubleshooting Checklist

- [ ] Node.js v18+ installed
- [ ] MongoDB running or connection string set
- [ ] Backend server running on port 5000
- [ ] Frontend dev server running on port 3000
- [ ] Database seeded (check terminal output)
- [ ] No port conflicts

---

## Support

For detailed information:
- See main README.md for complete documentation
- Check backend/src for implementation details
- Review seed script for data structure examples
