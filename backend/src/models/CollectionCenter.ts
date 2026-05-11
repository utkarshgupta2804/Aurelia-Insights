import mongoose, { Schema, Document } from 'mongoose'

export interface ICollectionCenter extends Document {
  name: string
  location: string
  historicalQualityScore: number
  createdAt: Date
}

const collectionCenterSchema = new Schema<ICollectionCenter>(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    historicalQualityScore: { type: Number, required: true, min: 0, max: 100 },
  },
  { timestamps: true }
)

export const CollectionCenter = mongoose.model<ICollectionCenter>(
  'CollectionCenter',
  collectionCenterSchema
)
