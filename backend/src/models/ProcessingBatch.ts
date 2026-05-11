import mongoose, { Schema, Document } from 'mongoose'

export interface IProcessingBatch extends Document {
  batchCode: string
  receptionBatches: mongoose.Types.ObjectId[]
  pasteurizationTemp: number
  pasteurizationDuration: number
  homogenizationPressure: number
  cipStatus: boolean
  processingDate: Date
  riskScore: number
  riskStatus: 'green' | 'amber' | 'red'
  createdAt: Date
}

const processingBatchSchema = new Schema<IProcessingBatch>(
  {
    batchCode: { type: String, required: true, unique: true },
    receptionBatches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ReceptionBatch',
        required: true,
      },
    ],
    pasteurizationTemp: { type: Number, required: true, min: 60, max: 100 },
    pasteurizationDuration: { type: Number, required: true, min: 1 },
    homogenizationPressure: { type: Number, required: true, min: 1 },
    cipStatus: { type: Boolean, required: true },
    processingDate: { type: Date, required: true },
    riskScore: { type: Number, required: true, min: 0, max: 100, default: 0 },
    riskStatus: {
      type: String,
      enum: ['green', 'amber', 'red'],
      default: 'green',
    },
  },
  { timestamps: true }
)

export const ProcessingBatch = mongoose.model<IProcessingBatch>(
  'ProcessingBatch',
  processingBatchSchema
)
