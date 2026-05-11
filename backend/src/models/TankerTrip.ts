import mongoose, { Schema, Document } from 'mongoose'

export interface ITemperatureLog {
  timestamp: Date
  temperature: number
  location: string
}

export interface ITankerTrip extends Document {
  tankerName: string
  registrationNumber: string
  route: string
  departureTime: Date
  arrivalTime: Date
  temperatureLogs: ITemperatureLog[]
  collectionCenters: mongoose.Types.ObjectId[]
  createdAt: Date
}

const temperatureLogSchema = new Schema<ITemperatureLog>(
  {
    timestamp: { type: Date, required: true },
    temperature: { type: Number, required: true },
    location: { type: String, required: true },
  },
  { _id: false }
)

const tankerTripSchema = new Schema<ITankerTrip>(
  {
    tankerName: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique: true },
    route: { type: String, required: true },
    departureTime: { type: Date, required: true },
    arrivalTime: { type: Date, required: true },
    temperatureLogs: [temperatureLogSchema],
    collectionCenters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CollectionCenter',
      },
    ],
  },
  { timestamps: true }
)

export const TankerTrip = mongoose.model<ITankerTrip>(
  'TankerTrip',
  tankerTripSchema
)
