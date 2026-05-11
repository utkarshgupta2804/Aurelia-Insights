# Testing Guide - Amul Traceability System

## Pre-Test Setup

### 1. Start Backend
```bash
cd backend
pnpm install
cp .env.example .env
pnpm seed        # This creates 150 test bottles
pnpm dev         # Runs on http://localhost:5000
```

Wait for: `Server running on http://localhost:5000`

### 2. Start Frontend (new terminal)
```bash
cd frontend
pnpm install
pnpm dev         # Runs on http://localhost:3000
```

App opens in browser at http://localhost:3000

---

## Integration Tests

### Test 1: Dashboard Loads
**Expected**: Statistics displayed, chart renders
**Steps**:
1. Open http://localhost:3000
2. Verify 4 stat cards show numbers
3. Verify chart displays risk distribution

**Validation**: ✅ Pass if stats load without errors

---

### Test 2: QR Code Lookup
**Expected**: Full genealogy chain displays correctly
**Steps**:
1. Go to "QR Lookup" page
2. Paste any of these sample QR payloads:
   ```
   https://trace.aurelia.ai/amk/01/8901234567890/lot/AMUL-PKG-MUM-20260505-A-01/ser/000001
   https://trace.aurelia.ai/amk/01/8901234567890/lot/AMUL-PKG-MUM-20260505-B-01/ser/000010
   https://trace.aurelia.ai/amk/01/8901234567890/lot/AMUL-PKG-MUM-20260505-C-01/ser/000025
   ```
3. Click "Search"
4. Expand each section (Bottle, Packaging, Processing, etc.)
5. Verify all data displays correctly

**Validation**: 
- ✅ Bottle info shows serial and stage
- ✅ Packaging batch shows GTIN and batch code
- ✅ Processing batch shows blending info
- ✅ Reception batches show quality scores
- ✅ Tanker trips show temperature logs
- ✅ Collection centers show quality scores

---

### Test 3: Genealogy View
**Expected**: Can search by bottle ID and see upstream chain
**Steps**:
1. Go to "Genealogy" page
2. Get a bottle ID from MongoDB:
   ```bash
   # In another terminal:
   mongosh mongodb://localhost:27017/amul-traceability
   db.bottles.findOne()._id  # Copy this ID
   ```
3. Paste the ID in genealogy search
4. Click "Search"
5. View the chain visualization

**Validation**:
- ✅ Bottle displays at top
- ✅ Upstream chain shows correctly (Bottle → Packaging → Processing → Reception → Tanker → Collection)
- ✅ Quality events display if any exist
- ✅ Blended batches show multiple reception sources

---

### Test 4: Risk Monitoring
**Expected**: All batches display with risk scores and colors
**Steps**:
1. Go to "Risk Monitor" page
2. See Processing Batches tab (default)
3. Verify table shows batch codes and risk scores
4. Switch to "Packaging Batches" tab
5. Verify same functionality
6. Check summary cards at bottom (Green, Amber, Red counts)

**Validation**:
- ✅ Processing batches load (3 in seed data)
- ✅ Packaging batches load (3 in seed data)
- ✅ Risk badges show correct colors
- ✅ Summary totals match table counts
- ✅ Batches sorted by risk score (highest first)

---

### Test 5: Recall Simulation
**Expected**: Impact analysis shows affected bottles
**Steps**:
1. Go to "Recall" page
2. Get a processing batch ID:
   ```bash
   mongosh mongodb://localhost:27017/amul-traceability
   db.processingbatches.findOne()._id  # Copy this
   ```
3. Paste ID and keep "Processing Batch" selected
4. Click "Simulate Recall"
5. View impact metrics

**Validation**:
- ✅ Affected Bottles count shows > 0
- ✅ Affected Packaging Batches shows >= 1
- ✅ Affected Dispatch Pallets shows calculated number
- ✅ Severity shows (Low/Medium/High/None)
- ✅ List of affected bottles displays

**Test Edge Case - Reception Batch**:
1. Get a reception batch ID from MongoDB
2. Change "Batch Type" to "Reception Batch"
3. Click "Simulate Recall"
4. Verify it finds downstream processing batches

---

### Test 6: Live Tracking
**Expected**: Bottle journey displays with timeline
**Steps**:
1. Go to "Tracking" page
2. Get a bottle ID from MongoDB
3. Paste ID and click "Track"
4. View the tracking timeline

**Validation**:
- ✅ Progress bar shows current stage highlighted
- ✅ Timeline displays tracking logs
- ✅ Stages in correct order
- ✅ Temperatures display where logged
- ✅ Timestamps show correctly formatted
- ✅ Operator names display

---

## API Endpoint Tests

### Test Health Check
```bash
curl http://localhost:5000/api/health
# Expected: {"status":"ok"}
```

### Test Stats Endpoint
```bash
curl http://localhost:5000/api/stats
# Expected: JSON with totalBottles, riskDistribution, etc.
```

### Test Lookup
```bash
curl "http://localhost:5000/api/lookup?qrPayload=https://trace.aurelia.ai/amk/01/8901234567890/lot/AMUL-PKG-MUM-20260505-A-01/ser/000001"
# Expected: Complete genealogy object
```

### Test Batches
```bash
curl http://localhost:5000/api/batches/processing
# Expected: Array of processing batches

curl http://localhost:5000/api/batches/packaging
# Expected: Array of packaging batches
```

### Test Risk Score
```bash
# Replace {id} with actual processing batch ID
curl http://localhost:5000/api/risk-score/{id}
# Expected: {score: number, status: string, factors: {...}}
```

### Test Recall
```bash
curl -X POST http://localhost:5000/api/recall \
  -H "Content-Type: application/json" \
  -d '{"batchId":"{id}","batchType":"processing"}'
# Expected: {affectedBottleCount: number, severity: string, ...}
```

---

## Data Integrity Tests

### Test 1: Blending Validation
**Purpose**: Verify processing batch can reference multiple reception batches
**Steps**:
1. In MongoDB:
   ```bash
   db.processingbatches.findOne()
   # Check receptionBatches array - should have 1+ entries
   ```
2. Genealogy page → Enter bottle ID from blended batch
3. Verify "Sources: 2 reception batch(es)" shows

**Validation**: ✅ Blending support works correctly

### Test 2: Temperature Tracking
**Purpose**: Verify temperature logs flow through system
**Steps**:
1. Check tracking timeline for a bottle
2. Find entries with temperature > 0
3. Verify temperature values make sense (typically 3-7°C for milk)

**Validation**: ✅ Temperature data persists correctly

### Test 3: Quality Events
**Purpose**: Verify quality anomalies are tracked
**Steps**:
1. Dashboard → Check "Recent Quality Events" section
2. Should show at least 2 events (from seed)
3. Click genealogy on affected bottles
4. Verify event appears in results

**Validation**: ✅ Quality events linked properly

---

## Error Handling Tests

### Test 1: Invalid QR Payload
**Steps**:
1. QR Lookup page
2. Enter: `invalid-url`
3. Click Search

**Expected**: Error message appears

### Test 2: Non-existent Bottle ID
**Steps**:
1. Genealogy page
2. Enter: `000000000000000000000000`
3. Click Search

**Expected**: Error message "Bottle not found"

### Test 3: Invalid Batch ID for Recall
**Steps**:
1. Recall page
2. Enter: `invalid-id`
3. Click Simulate Recall

**Expected**: Error message appears

### Test 4: Empty Search Fields
**Steps**:
1. Any search page
2. Leave input empty
3. Click Search/Track

**Expected**: "Please enter..." message

---

## Performance Tests

### Test 1: Dashboard Load Time
**Purpose**: Verify stats endpoint responds quickly
**Steps**:
1. Open DevTools (F12)
2. Go to Network tab
3. Navigate to Dashboard
4. Check `/stats` request

**Expected**: Response time < 200ms

### Test 2: QR Lookup Speed
**Purpose**: Verify genealogy traversal is fast
**Steps**:
1. DevTools Network tab
2. QR Lookup page
3. Search with valid QR

**Expected**: `/lookup` request < 300ms

### Test 3: Batch List Load
**Purpose**: Verify batch queries handle data well
**Steps**:
1. DevTools Network tab
2. Risk Monitor page
3. Check `/batches/processing` request

**Expected**: Response time < 150ms

---

## User Acceptance Tests

### Test 1: Can user find a bottle's origin?
**Flow**:
1. Start at Dashboard
2. Go to QR Lookup
3. Paste a QR code
4. Click through sections to trace origin
5. Should find collection center

**Expected**: ✅ Complete traceability visible

### Test 2: Can user assess recall impact?
**Flow**:
1. Start at Dashboard
2. Go to Risk Monitor
3. Find a batch
4. Navigate to Recall Simulation
5. See affected bottles count

**Expected**: ✅ Clear impact metrics

### Test 3: Can user track a bottle in supply chain?
**Flow**:
1. Start at Dashboard
2. Go to Tracking
3. Enter bottle ID
4. See journey from collection to delivery

**Expected**: ✅ Clear timeline with stages

---

## Database Integrity Tests

### Test 1: Check Relationships
```bash
mongosh mongodb://localhost:27017/amul-traceability

# Processing batch should reference reception batches
db.processingbatches.findOne()

# Packaging batch should reference processing batch
db.packagingbatches.findOne()

# Bottles should reference packaging batch
db.bottles.findOne()
```

**Expected**: All references contain valid ObjectIds

### Test 2: Verify QR Uniqueness
```bash
# Count bottles with same packaging batch
db.bottles.find({packageBatch: ObjectId("...")}).count()
# Should match pack size (1000)
```

### Test 3: Check Timestamps
```bash
# All documents should have createdAt and updatedAt
db.bottles.findOne()
# Verify timestamps are ISO 8601 format
```

---

## Troubleshooting During Testing

### Issue: "Cannot GET /api/lookup"
**Cause**: Backend not running
**Fix**: Check backend terminal, restart with `pnpm dev`

### Issue: QR payload shows "Invalid format"
**Cause**: URL-encoded or malformed
**Fix**: Use examples from this guide

### Issue: Database error "connection refused"
**Cause**: MongoDB not running
**Fix**: Start MongoDB with `mongod` or use cloud connection

### Issue: CORS error in console
**Cause**: Frontend port mismatch
**Fix**: Check vite.config.ts proxy settings

### Issue: Empty pages/no data loading
**Cause**: Backend not seeded
**Fix**: Run `pnpm seed` in backend directory

---

## Final Validation Checklist

- [ ] Dashboard loads with stats
- [ ] QR Lookup finds bottles and shows genealogy
- [ ] Genealogy view shows upstream chain
- [ ] Risk Monitor displays all batches
- [ ] Recall Simulation calculates impacts
- [ ] Tracking shows timeline
- [ ] APIs respond < 300ms
- [ ] No JavaScript errors in console
- [ ] No network errors
- [ ] Database has 150+ bottles
- [ ] Blending scenario works
- [ ] Error handling works
- [ ] Responsive on mobile

**Status**: ✅ **SYSTEM READY FOR PRODUCTION TESTING**
