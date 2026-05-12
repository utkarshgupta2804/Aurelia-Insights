/// <reference types="vite/client" />
import axios from 'axios'
import {
  Bottle,
  GenealogySummary,
  RecallResult,
  RiskScoreResult,
  ProcessingBatch,
  PackagingBatch,
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const api = {
  // QR Lookup
  lookupQR: async (qrPayload: string): Promise<GenealogySummary> => {
    const response = await apiClient.get('/lookup', { params: { qrPayload } })
    return response.data
  },

  // Genealogy
  getGenealogy: async (bottleId: string): Promise<GenealogySummary> => {
    const response = await apiClient.get(`/genealogy/${bottleId}`)
    return response.data
  },

  // Recall Simulation
  simulateRecall: async (batchId: string, batchType: 'processing' | 'reception'): Promise<RecallResult> => {
    const response = await apiClient.post('/recall', { batchId, batchType })
    return response.data
  },

  // Risk Score
  getRiskScore: async (batchId: string): Promise<RiskScoreResult> => {
    const response = await apiClient.get(`/risk-score/${batchId}`)
    return response.data
  },

  // Batch Data
  getProcessingBatches: async (): Promise<ProcessingBatch[]> => {
    const response = await apiClient.get('/batches/processing')
    return response.data
  },

  getPackagingBatches: async (): Promise<PackagingBatch[]> => {
    const response = await apiClient.get('/batches/packaging')
    return response.data
  },

  // Tracking
  updateTracking: async (bottleId: string, stage: string, location: string, temperature?: number): Promise<Bottle> => {
    const response = await apiClient.post(`/tracking/update`, {
      bottleId,
      stage,
      location,
      temperature,
      updatedBy: 'system',
    })
    return response.data
  },

  getBottle: async (bottleId: string): Promise<Bottle> => {
    const response = await apiClient.get(`/bottles/${bottleId}`)
    return response.data
  },

  // Stats
  getStats: async () => {
    const response = await apiClient.get('/stats')
    return response.data
  },
}
