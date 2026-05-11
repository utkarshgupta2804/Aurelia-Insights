import mongoose, { Schema, Document } from 'mongoose'

export interface IPackagingBatch extends Document {
  batchCode: string
  processingBatch: mongoose.Types.ObjectId
  gtin: string
  packSize: number
  packFormat: string
  packagingLine: string
  qcReleaseDate: Date
  packagingDate: Date
  riskScore: number
  riskStatus: 'green' | 'amber' | 'red'
  qrCodeImage: string
  createdAt: Date
}

const packagingBatchSchema = new Schema<IPackagingBatch>(
  {
    batchCode: { type: String, required: true, unique: true },
    processingBatch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProcessingBatch',
      required: true,
    },
    gtin: { type: String, required: true },
    packSize: { type: Number, required: true, min: 100, max: 10000 },
    packFormat: {
      type: String,
      enum: ['bottle', 'pouch', 'carton'],
      required: true,
    },
    packagingLine: { type: String, required: true },
    qcReleaseDate: { type: Date, required: true },
    packagingDate: { type: Date, required: true },
    riskScore: { type: Number, required: true, min: 0, max: 100, default: 0 },
    riskStatus: {
      type: String,
      enum: ['green', 'amber', 'red'],
      default: 'green',
    },
    qrCodeImage: { type: String, required: true },
  },
  { timestamps: true }
)

export const PackagingBatch = mongoose.model<IPackagingBatch>(
  'PackagingBatch',
  packagingBatchSchema
)
