import mongoose, { Schema, Document } from 'mongoose'

export interface IQualityEvent extends Document {
  eventType: string
  entityType: string
  entityId: mongoose.Types.ObjectId
  description: string
  severity: 'low' | 'medium' | 'high'
  timestamp: Date
  resolvedAt?: Date
  createdAt: Date
}

const qualityEventSchema = new Schema<IQualityEvent>(
  {
    eventType: { type: String, required: true },
    entityType: {
      type: String,
      enum: [
        'CollectionCenter',
        'TankerTrip',
        'ReceptionBatch',
        'ProcessingBatch',
        'PackagingBatch',
        'Bottle',
      ],
      required: true,
    },
    entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
    description: { type: String, required: true },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true,
    },
    timestamp: { type: Date, required: true },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
)

export const QualityEvent = mongoose.model<IQualityEvent>(
  'QualityEvent',
  qualityEventSchema
)
