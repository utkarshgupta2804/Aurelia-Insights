import mongoose from "mongoose"
import QRCode from "qrcode"
import dotenv from "dotenv"

import { CollectionCenter } from "../models/CollectionCenter"
import { TankerTrip } from "../models/TankerTrip"
import { ReceptionBatch } from "../models/ReceptionBatch"
import { ProcessingBatch } from "../models/ProcessingBatch"
import { PackagingBatch } from "../models/PackagingBatch"
import { Bottle } from "../models/Bottle"
import { QualityEvent } from "../models/QualityEvent"

dotenv.config()

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/amul-traceability"

const getRiskStatus = (score: number): "green" | "amber" | "red" => {
  if (score <= 30) return "green"
  if (score <= 70) return "amber"
  return "red"
}

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("MongoDB connected")

    await Promise.all([
      CollectionCenter.deleteMany({}),
      TankerTrip.deleteMany({}),
      ReceptionBatch.deleteMany({}),
      ProcessingBatch.deleteMany({}),
      PackagingBatch.deleteMany({}),
      Bottle.deleteMany({}),
      QualityEvent.deleteMany({}),
    ])

    const centers = await CollectionCenter.insertMany([
      {
        name: "Anand Collection Center",
        location: "Anand, Gujarat",
        historicalQualityScore: 92,
      },
      {
        name: "Kheda Collection Center",
        location: "Kheda, Gujarat",
        historicalQualityScore: 86,
      },
      {
        name: "Mehsana Collection Center",
        location: "Mehsana, Gujarat",
        historicalQualityScore: 74,
      },
    ])

    const tankers = await TankerTrip.insertMany([
      {
        tankerName: "Tanker Alpha",
        registrationNumber: "GJ-05-AT-1021",
        route: "Anand to Mumbai Plant",
        departureTime: new Date("2026-05-05T04:30:00"),
        arrivalTime: new Date("2026-05-05T10:15:00"),
        collectionCenters: [centers[0]._id],
        temperatureLogs: [
          { timestamp: new Date("2026-05-05T05:00:00"), temperature: 4.2, location: "Anand" },
          { timestamp: new Date("2026-05-05T08:00:00"), temperature: 5.1, location: "Vadodara Highway" },
          { timestamp: new Date("2026-05-05T10:00:00"), temperature: 5.4, location: "Mumbai Plant Gate" },
        ],
      },
      {
        tankerName: "Tanker Beta",
        registrationNumber: "GJ-07-BT-2210",
        route: "Kheda to Mumbai Plant",
        departureTime: new Date("2026-05-05T05:15:00"),
        arrivalTime: new Date("2026-05-05T12:30:00"),
        collectionCenters: [centers[1]._id],
        temperatureLogs: [
          { timestamp: new Date("2026-05-05T06:00:00"), temperature: 5.0, location: "Kheda" },
          { timestamp: new Date("2026-05-05T09:30:00"), temperature: 7.4, location: "Surat Highway" },
          { timestamp: new Date("2026-05-05T12:20:00"), temperature: 7.8, location: "Mumbai Plant Gate" },
        ],
      },
      {
        tankerName: "Tanker Gamma",
        registrationNumber: "GJ-02-GT-9081",
        route: "Mehsana to Mumbai Plant",
        departureTime: new Date("2026-05-05T03:45:00"),
        arrivalTime: new Date("2026-05-05T13:10:00"),
        collectionCenters: [centers[2]._id],
        temperatureLogs: [
          { timestamp: new Date("2026-05-05T04:00:00"), temperature: 6.1, location: "Mehsana" },
          { timestamp: new Date("2026-05-05T09:00:00"), temperature: 8.9, location: "NH48" },
          { timestamp: new Date("2026-05-05T12:30:00"), temperature: 9.4, location: "Mumbai Outer Ring" },
        ],
      },
      {
        tankerName: "Tanker Delta",
        registrationNumber: "GJ-10-DT-3345",
        route: "Anand and Kheda to Mumbai Plant",
        departureTime: new Date("2026-05-06T04:10:00"),
        arrivalTime: new Date("2026-05-06T11:50:00"),
        collectionCenters: [centers[0]._id, centers[1]._id],
        temperatureLogs: [
          { timestamp: new Date("2026-05-06T05:00:00"), temperature: 4.8, location: "Anand" },
          { timestamp: new Date("2026-05-06T08:00:00"), temperature: 6.2, location: "Kheda Bypass" },
        ],
      },
      {
        tankerName: "Tanker Epsilon",
        registrationNumber: "GJ-12-ET-7782",
        route: "Mehsana to Mumbai Plant",
        departureTime: new Date("2026-05-06T06:00:00"),
        arrivalTime: new Date("2026-05-06T14:20:00"),
        collectionCenters: [centers[2]._id],
        temperatureLogs: [
          { timestamp: new Date("2026-05-06T07:00:00"), temperature: 5.7, location: "Mehsana" },
          { timestamp: new Date("2026-05-06T12:00:00"), temperature: 7.1, location: "Vapi" },
        ],
      },
    ])

    const receptions = await ReceptionBatch.insertMany([
      {
        batchCode: "MUM-REC-20260505-TK01-01",
        tankerTrip: tankers[0]._id,
        fatPercentage: 3.5,
        somaticCellCount: 180000,
        adulterationTest: false,
        testDate: new Date("2026-05-05T10:45:00"),
        status: "accepted",
        qualityScore: 93,
        collectionCenters: [centers[0]._id],
      },
      {
        batchCode: "MUM-REC-20260505-TK02-01",
        tankerTrip: tankers[1]._id,
        fatPercentage: 3.3,
        somaticCellCount: 240000,
        adulterationTest: false,
        testDate: new Date("2026-05-05T13:00:00"),
        status: "accepted",
        qualityScore: 84,
        collectionCenters: [centers[1]._id],
      },
      {
        batchCode: "MUM-REC-20260505-TK03-01",
        tankerTrip: tankers[2]._id,
        fatPercentage: 3.1,
        somaticCellCount: 410000,
        adulterationTest: false,
        testDate: new Date("2026-05-05T13:45:00"),
        status: "on-hold",
        qualityScore: 61,
        collectionCenters: [centers[2]._id],
      },
      {
        batchCode: "MUM-REC-20260506-TK04-01",
        tankerTrip: tankers[3]._id,
        fatPercentage: 3.6,
        somaticCellCount: 210000,
        adulterationTest: false,
        testDate: new Date("2026-05-06T12:10:00"),
        status: "accepted",
        qualityScore: 88,
        collectionCenters: [centers[0]._id, centers[1]._id],
      },
      {
        batchCode: "MUM-REC-20260506-TK05-01",
        tankerTrip: tankers[4]._id,
        fatPercentage: 3.2,
        somaticCellCount: 320000,
        adulterationTest: false,
        testDate: new Date("2026-05-06T14:45:00"),
        status: "accepted",
        qualityScore: 76,
        collectionCenters: [centers[2]._id],
      },
    ])

    const processing = await ProcessingBatch.insertMany([
      {
        batchCode: "AMUL-PB-MUM-20260505-001",
        receptionBatches: [receptions[0]._id],
        pasteurizationTemp: 72,
        pasteurizationDuration: 15,
        homogenizationPressure: 180,
        cipStatus: true,
        processingDate: new Date("2026-05-05T15:00:00"),
        riskScore: 22,
        riskStatus: getRiskStatus(22),
      },
      {
        batchCode: "AMUL-PB-MUM-20260505-002",
        receptionBatches: [receptions[1]._id, receptions[2]._id],
        pasteurizationTemp: 71,
        pasteurizationDuration: 15,
        homogenizationPressure: 175,
        cipStatus: true,
        processingDate: new Date("2026-05-05T17:00:00"),
        riskScore: 68,
        riskStatus: getRiskStatus(68),
      },
      {
        batchCode: "AMUL-PB-MUM-20260506-001",
        receptionBatches: [receptions[3]._id],
        pasteurizationTemp: 73,
        pasteurizationDuration: 16,
        homogenizationPressure: 182,
        cipStatus: true,
        processingDate: new Date("2026-05-06T15:30:00"),
        riskScore: 28,
        riskStatus: getRiskStatus(28),
      },
      {
        batchCode: "AMUL-PB-MUM-20260506-002",
        receptionBatches: [receptions[4]._id],
        pasteurizationTemp: 70,
        pasteurizationDuration: 14,
        homogenizationPressure: 168,
        cipStatus: false,
        processingDate: new Date("2026-05-06T18:20:00"),
        riskScore: 82,
        riskStatus: getRiskStatus(82),
      },
    ])

    const packaging = await PackagingBatch.insertMany([
      {
        batchCode: "AMUL-PKG-MUM-20260505-A-01",
        processingBatch: processing[0]._id,
        gtin: "8901234567890",
        packSize: 500,
        packFormat: "bottle",
        packagingLine: "A",
        qcReleaseDate: new Date("2026-05-05T19:00:00"),
        packagingDate: new Date("2026-05-05T18:00:00"),
        riskScore: 22,
        riskStatus: getRiskStatus(22),
        qrCodeImage: "generated-per-bottle",
      },
      {
        batchCode: "AMUL-PKG-MUM-20260505-A-02",
        processingBatch: processing[0]._id,
        gtin: "8901234567890",
        packSize: 500,
        packFormat: "bottle",
        packagingLine: "A",
        qcReleaseDate: new Date("2026-05-05T20:00:00"),
        packagingDate: new Date("2026-05-05T19:15:00"),
        riskScore: 24,
        riskStatus: getRiskStatus(24),
        qrCodeImage: "generated-per-bottle",
      },
      {
        batchCode: "AMUL-PKG-MUM-20260505-B-01",
        processingBatch: processing[1]._id,
        gtin: "8901234567890",
        packSize: 1000,
        packFormat: "bottle",
        packagingLine: "B",
        qcReleaseDate: new Date("2026-05-05T21:00:00"),
        packagingDate: new Date("2026-05-05T20:10:00"),
        riskScore: 68,
        riskStatus: getRiskStatus(68),
        qrCodeImage: "generated-per-bottle",
      },
      {
        batchCode: "AMUL-PKG-MUM-20260506-A-01",
        processingBatch: processing[2]._id,
        gtin: "8901234567890",
        packSize: 500,
        packFormat: "bottle",
        packagingLine: "A",
        qcReleaseDate: new Date("2026-05-06T18:00:00"),
        packagingDate: new Date("2026-05-06T17:10:00"),
        riskScore: 28,
        riskStatus: getRiskStatus(28),
        qrCodeImage: "generated-per-bottle",
      },
      {
        batchCode: "AMUL-PKG-MUM-20260506-B-01",
        processingBatch: processing[3]._id,
        gtin: "8901234567890",
        packSize: 1000,
        packFormat: "bottle",
        packagingLine: "B",
        qcReleaseDate: new Date("2026-05-06T22:00:00"),
        packagingDate: new Date("2026-05-06T21:00:00"),
        riskScore: 82,
        riskStatus: getRiskStatus(82),
        qrCodeImage: "generated-per-bottle",
      },
      {
        batchCode: "AMUL-PKG-MUM-20260506-C-01",
        processingBatch: processing[2]._id,
        gtin: "8901234567890",
        packSize: 250,
        packFormat: "bottle",
        packagingLine: "C",
        qcReleaseDate: new Date("2026-05-06T19:30:00"),
        packagingDate: new Date("2026-05-06T18:45:00"),
        riskScore: 30,
        riskStatus: getRiskStatus(30),
        qrCodeImage: "generated-per-bottle",
      },
    ])

    const bottles = []

    for (const pkg of packaging) {
      for (let i = 1; i <= 10; i++) {
        const serial = String(i).padStart(6, "0")
        const qrPayload = `https://trace.aurelia.ai/amk/01/${pkg.gtin}/lot/${pkg.batchCode}/ser/${serial}`
        const qrImage = await QRCode.toDataURL(qrPayload)

        bottles.push({
          serial,
          packageBatch: pkg._id,
          qrPayload,
          qrImage,
          currentStage: "dispatch",
          trackingLogs: [
            {
              stage: "collection",
              location: "Village Collection Center",
              temperature: 4.5,
              updatedBy: "operator-collection-01",
              timestamp: new Date("2026-05-05T04:30:00"),
            },
            {
              stage: "in-transit",
              location: "Tanker Route",
              temperature: 6.2,
              updatedBy: "driver-01",
              timestamp: new Date("2026-05-05T08:30:00"),
            },
            {
              stage: "reception",
              location: "Mumbai Plant Reception Dock",
              temperature: 6.5,
              updatedBy: "qc-operator-01",
              timestamp: new Date("2026-05-05T12:30:00"),
            },
            {
              stage: "processing",
              location: "Pasteurization Unit",
              temperature: 7.2,
              updatedBy: "plant-operator-02",
              timestamp: new Date("2026-05-05T16:00:00"),
            },
            {
              stage: "packaging",
              location: `Packaging Line ${pkg.packagingLine}`,
              updatedBy: "packaging-operator-01",
              timestamp: pkg.packagingDate,
            },
            {
              stage: "dispatch",
              location: "Mumbai Dispatch Bay",
              updatedBy: "dispatch-operator-01",
              timestamp: new Date("2026-05-06T06:00:00"),
            },
          ],
        })
      }
    }

    await Bottle.insertMany(bottles)

    await QualityEvent.insertMany([
      {
        eventType: "High Transport Temperature",
        entityType: "TankerTrip",
        entityId: tankers[2]._id,
        description: "Temperature exceeded 8°C during transport for Mehsana tanker.",
        severity: "high",
        timestamp: new Date("2026-05-05T12:30:00"),
      },
      {
        eventType: "High Somatic Cell Count",
        entityType: "ReceptionBatch",
        entityId: receptions[2]._id,
        description: "Somatic cell count crossed acceptable internal quality threshold.",
        severity: "medium",
        timestamp: new Date("2026-05-05T13:45:00"),
      },
      {
        eventType: "CIP Incomplete",
        entityType: "ProcessingBatch",
        entityId: processing[3]._id,
        description: "CIP status was false before processing batch start.",
        severity: "high",
        timestamp: new Date("2026-05-06T18:20:00"),
      },
    ])

    console.log("Seed completed successfully")
    console.log("Collection Centers:", centers.length)
    console.log("Tanker Trips:", tankers.length)
    console.log("Reception Batches:", receptions.length)
    console.log("Processing Batches:", processing.length)
    console.log("Packaging Batches:", packaging.length)
    console.log("Bottles:", bottles.length)
    console.log("Sample QR:")
    console.log(
      "https://trace.aurelia.ai/amk/01/8901234567890/lot/AMUL-PKG-MUM-20260505-A-01/ser/000001"
    )

    await mongoose.disconnect()
  } catch (error) {
    console.error("Seed error:", error)
    process.exit(1)
  }
}

seedDatabase()