import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { CollectionCenter } from '../models/CollectionCenter'
import { TankerTrip } from '../models/TankerTrip'
import { ReceptionBatch } from '../models/ReceptionBatch'
import { ProcessingBatch } from '../models/ProcessingBatch'
import { PackagingBatch } from '../models/PackagingBatch'
import { Bottle } from '../models/Bottle'
import { QualityEvent } from '../models/QualityEvent'
import { generateQRPayload, generateQRImage } from '../utils/qrGenerator'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/amul-traceability'

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    // Clear existing data
    console.log('Clearing existing data...')
    await Promise.all([
      CollectionCenter.deleteMany({}),
      TankerTrip.deleteMany({}),
      ReceptionBatch.deleteMany({}),
      ProcessingBatch.deleteMany({}),
      PackagingBatch.deleteMany({}),
      Bottle.deleteMany({}),
      QualityEvent.deleteMany({}),
    ])

    // Create Collection Centers
    console.log('Creating collection centers...')
    const collectionCenters = await CollectionCenter.insertMany([
      { name: 'Nashik Center', location: 'Nashik, Maharashtra', historicalQualityScore: 85 },
      { name: 'Pune Center', location: 'Pune, Maharashtra', historicalQualityScore: 92 },
      { name: 'Belgaum Center', location: 'Belgaum, Karnataka', historicalQualityScore: 78 },
      { name: 'Aurangabad Center', location: 'Aurangabad, Maharashtra', historicalQualityScore: 88 },
      { name: 'Kolhapur Center', location: 'Kolhapur, Maharashtra', historicalQualityScore: 90 },
    ])
    console.log(`Created ${collectionCenters.length} collection centers`)

    // Create Tanker Trips
    console.log('Creating tanker trips...')
    const tankerTrips = await TankerTrip.insertMany([
      {
        tankerName: 'Amul Express 1',
        registrationNumber: 'MH-01-AB-1234',
        route: 'Nashik to Mumbai',
        departureTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
        arrivalTime: new Date(Date.now() - 18 * 60 * 60 * 1000),
        temperatureLogs: [
          {
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            temperature: 4,
            location: 'Nashik Collection Point',
          },
          {
            timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000),
            temperature: 5,
            location: 'Highway',
          },
          {
            timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000),
            temperature: 4,
            location: 'Mumbai Reception',
          },
        ],
        collectionCenters: [collectionCenters[0]._id],
      },
      {
        tankerName: 'Amul Express 2',
        registrationNumber: 'MH-02-AB-5678',
        route: 'Pune to Mumbai',
        departureTime: new Date(Date.now() - 16 * 60 * 60 * 1000),
        arrivalTime: new Date(Date.now() - 12 * 60 * 60 * 1000),
        temperatureLogs: [
          {
            timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000),
            temperature: 3,
            location: 'Pune Collection Point',
          },
          {
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
            temperature: 4,
            location: 'Mumbai Reception',
          },
        ],
        collectionCenters: [collectionCenters[1]._id],
      },
      {
        tankerName: 'Amul Express 3',
        registrationNumber: 'KA-03-AB-9012',
        route: 'Belgaum to Mumbai',
        departureTime: new Date(Date.now() - 30 * 60 * 60 * 1000),
        arrivalTime: new Date(Date.now() - 20 * 60 * 60 * 1000),
        temperatureLogs: [
          {
            timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000),
            temperature: 4,
            location: 'Belgaum Collection Point',
          },
          {
            timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000),
            temperature: 7,
            location: 'Highway Rest Stop',
          },
          {
            timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000),
            temperature: 5,
            location: 'Mumbai Reception',
          },
        ],
        collectionCenters: [collectionCenters[2]._id],
      },
    ])
    console.log(`Created ${tankerTrips.length} tanker trips`)

    // Create Reception Batches
    console.log('Creating reception batches...')
    const receptionBatches = await ReceptionBatch.insertMany([
      {
        batchCode: 'RECV-2026-05-001',
        tankerTrip: tankerTrips[0]._id,
        fatPercentage: 4.5,
        somaticCellCount: 250000,
        adulterationTest: false,
        testDate: new Date(Date.now() - 18 * 60 * 60 * 1000),
        status: 'accepted',
        qualityScore: 92,
        collectionCenters: [collectionCenters[0]._id],
      },
      {
        batchCode: 'RECV-2026-05-002',
        tankerTrip: tankerTrips[1]._id,
        fatPercentage: 4.8,
        somaticCellCount: 200000,
        adulterationTest: false,
        testDate: new Date(Date.now() - 12 * 60 * 60 * 1000),
        status: 'accepted',
        qualityScore: 96,
        collectionCenters: [collectionCenters[1]._id],
      },
      {
        batchCode: 'RECV-2026-05-003',
        tankerTrip: tankerTrips[2]._id,
        fatPercentage: 4.2,
        somaticCellCount: 350000,
        adulterationTest: false,
        testDate: new Date(Date.now() - 20 * 60 * 60 * 1000),
        status: 'accepted',
        qualityScore: 80,
        collectionCenters: [collectionCenters[2]._id],
      },
    ])
    console.log(`Created ${receptionBatches.length} reception batches`)

    // Create Processing Batches (with blending)
    console.log('Creating processing batches...')
    const processingBatches = await ProcessingBatch.insertMany([
      {
        batchCode: 'PROC-2026-05-001',
        receptionBatches: [receptionBatches[0]._id, receptionBatches[1]._id],
        pasteurizationTemp: 72,
        pasteurizationDuration: 15,
        homogenizationPressure: 200,
        cipStatus: true,
        processingDate: new Date(Date.now() - 10 * 60 * 60 * 1000),
        riskScore: 0,
        riskStatus: 'green',
      },
      {
        batchCode: 'PROC-2026-05-002',
        receptionBatches: [receptionBatches[2]._id],
        pasteurizationTemp: 72,
        pasteurizationDuration: 15,
        homogenizationPressure: 200,
        cipStatus: true,
        processingDate: new Date(Date.now() - 8 * 60 * 60 * 1000),
        riskScore: 0,
        riskStatus: 'green',
      },
    ])
    console.log(`Created ${processingBatches.length} processing batches`)

    // Create Packaging Batches with QR codes
    console.log('Creating packaging batches...')
    const packagingBatches: any[] = []
    for (let i = 0; i < 3; i++) {
      const gtin = '8901234567890'
      const qrPayload = generateQRPayload(gtin, `AMUL-PKG-MUM-20260505-${String.fromCharCode(65 + i)}-01`, '000001')
      const qrImage = await generateQRImage(qrPayload)

      const batch = await PackagingBatch.create({
        batchCode: `AMUL-PKG-MUM-20260505-${String.fromCharCode(65 + i)}-01`,
        processingBatch: processingBatches[i % 2]._id,
        gtin,
        packSize: 1000,
        packFormat: 'bottle',
        packagingLine: 'Line A',
        qcReleaseDate: new Date(Date.now() - 6 * 60 * 60 * 1000),
        packagingDate: new Date(Date.now() - 7 * 60 * 60 * 1000),
        riskScore: 0,
        riskStatus: 'green',
        qrCodeImage: qrImage,
      })
      packagingBatches.push(batch)
    }
    console.log(`Created ${packagingBatches.length} packaging batches`)

    // Create Bottles
    console.log('Creating bottles...')
    let bottleCount = 0
    for (const packBatch of packagingBatches) {
      for (let serial = 1; serial <= 50; serial++) {
        const qrPayload = generateQRPayload(
          '8901234567890',
          packBatch.batchCode,
          serial.toString().padStart(6, '0')
        )
        const qrImage = await generateQRImage(qrPayload)

        await Bottle.create({
          serial: serial.toString().padStart(6, '0'),
          packageBatch: packBatch._id,
          qrPayload,
          qrImage,
          trackingLogs: [
            {
              stage: 'packaging',
              location: 'Packaging Line A',
              timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000),
              updatedBy: 'system',
            },
            {
              stage: 'dispatch',
              location: 'Warehouse',
              temperature: 4,
              timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
              updatedBy: 'warehouse',
            },
          ],
          currentStage: 'dispatch',
        })
        bottleCount++
      }
    }
    console.log(`Created ${bottleCount} bottles`)

    // Create Quality Events
    console.log('Creating quality events...')
    const qualityEvents = await QualityEvent.insertMany([
      {
        eventType: 'Temperature Deviation',
        entityType: 'TankerTrip',
        entityId: tankerTrips[2]._id,
        description: 'Temperature exceeded 6°C during transit',
        severity: 'medium',
        timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000),
      },
      {
        eventType: 'Extended Transit',
        entityType: 'TankerTrip',
        entityId: tankerTrips[2]._id,
        description: 'Transit duration exceeded 20 hours',
        severity: 'low',
        timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000),
      },
    ])
    console.log(`Created ${qualityEvents.length} quality events`)

    console.log('Seed completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Seed error:', error)
    process.exit(1)
  }
}

seedDatabase()
