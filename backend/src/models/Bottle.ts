import mongoose, { Schema, Document } from 'mongoose'

export interface ITrackingLog {
  stage: 'collection' | 'in-transit' | 'reception' | 'processing' | 'packaging' | 'dispatch' | 'delivered'
  location: string
  temperature?: number
  updatedBy: string
  timestamp: Date
}

export interface IBottle extends Document {
  serial: string
  packageBatch: mongoose.Types.ObjectId
  qrPayload: string
  qrImage: string
  trackingLogs: ITrackingLog[]
  currentStage: string
  createdAt: Date
}

const trackingLogSchema = new Schema<ITrackingLog>(
  {
    stage: {
      type: String,
      enum: [
        'collection',
        'in-transit',
        'reception',
        'processing',
        'packaging',
        'dispatch',
        'delivered',
      ],
      required: true,
    },
    location: { type: String, required: true },
    temperature: { type: Number, min: -20, max: 50 },
    updatedBy: { type: String, required: true },
    timestamp: { type: Date, required: true },
  },
  { _id: false }
)

const bottleSchema = new Schema<IBottle>(
  {
    serial: { type: String, required: true },
    packageBatch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PackagingBatch',
      required: true,
    },
    qrPayload: { type: String, required: true },
    qrImage: { type: String, required: true },
    trackingLogs: [trackingLogSchema],
    currentStage: { type: String, default: 'collection' },
  },
  { timestamps: true }
)

// Compound unique index on packaging batch and serial
bottleSchema.index({ packageBatch: 1, serial: 1 }, { unique: true })

export const Bottle = mongoose.model<IBottle>('Bottle', bottleSchema)
