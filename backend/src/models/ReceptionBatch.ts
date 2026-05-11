import mongoose, { Schema, Document } from 'mongoose'

export interface IReceptionBatch extends Document {
  batchCode: string
  tankerTrip: mongoose.Types.ObjectId
  fatPercentage: number
  somaticCellCount: number
  adulterationTest: boolean
  testDate: Date
  status: 'accepted' | 'rejected' | 'on-hold'
  qualityScore: number
  collectionCenters: mongoose.Types.ObjectId[]
  createdAt: Date
}

const receptionBatchSchema = new Schema<IReceptionBatch>(
  {
    batchCode: { type: String, required: true, unique: true },
    tankerTrip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TankerTrip',
      required: true,
    },
    fatPercentage: { type: Number, required: true, min: 0, max: 10 },
    somaticCellCount: { type: Number, required: true, min: 0 },
    adulterationTest: { type: Boolean, required: true },
    testDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['accepted', 'rejected', 'on-hold'],
      required: true,
    },
    qualityScore: { type: Number, required: true, min: 0, max: 100 },
    collectionCenters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CollectionCenter',
      },
    ],
  },
  { timestamps: true }
)

export const ReceptionBatch = mongoose.model<IReceptionBatch>(
  'ReceptionBatch',
  receptionBatchSchema
)
