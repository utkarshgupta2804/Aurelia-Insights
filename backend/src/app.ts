import express, { Application, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Import routes
import lookupRoutes from './routes/lookup'
import genealogyRoutes from './routes/genealogy'
import recallRoutes from './routes/recall'
import batchRoutes from './routes/batches'
import trackingRoutes from './routes/tracking'
import statsRoutes from './routes/stats'
import riskScoreRoutes from './routes/riskScore'

const app: Application = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/amul-traceability'

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  })
})

// Routes
app.use('/api/lookup', lookupRoutes)
app.use('/api/genealogy', genealogyRoutes)
app.use('/api/recall', recallRoutes)
app.use('/api/batches', batchRoutes)
app.use('/api/tracking', trackingRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/risk-score', riskScoreRoutes)

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' })
})

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

// Start server
const startServer = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

startServer().catch(console.error)

export default app
