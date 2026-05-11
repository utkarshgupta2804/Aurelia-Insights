export interface CollectionCenter {
  _id: string
  name: string
  location: string
  historicalQualityScore: number
  createdAt: string
}

export interface TankerTrip {
  _id: string
  tankerName: string
  registrationNumber: string
  route: string
  departureTime: string
  arrivalTime: string
  temperatureLogs: {
    timestamp: string
    temperature: number
    location: string
  }[]
  collectionCenters: string[]
  createdAt: string
}

export interface ReceptionBatch {
  _id: string
  batchCode: string
  tankerTrip: string
  fatPercentage: number
  somaticCellCount: number
  adulterationTest: boolean
  testDate: string
  status: 'accepted' | 'rejected' | 'on-hold'
  qualityScore: number
  collectionCenters: string[]
  createdAt: string
}

export interface ProcessingBatch {
  _id: string
  batchCode: string
  receptionBatches: string[]
  pasteurizationTemp: number
  pasteurizationDuration: number
  homogenizationPressure: number
  cipStatus: boolean
  processingDate: string
  riskScore: number
  riskStatus: 'green' | 'amber' | 'red'
  createdAt: string
}

export interface PackagingBatch {
  _id: string
  batchCode: string
  processingBatch: string
  gtin: string
  packSize: number
  packFormat: string
  packagingLine: string
  qcReleaseDate: string
  packagingDate: string
  riskScore: number
  riskStatus: 'green' | 'amber' | 'red'
  qrCodeImage: string
  createdAt: string
}

export interface Bottle {
  _id: string
  serial: string
  packageBatch: string
  qrPayload: string
  qrImage: string
  trackingLogs: {
    stage: 'collection' | 'in-transit' | 'reception' | 'processing' | 'packaging' | 'dispatch' | 'delivered'
    location: string
    temperature?: number
    updatedBy: string
    timestamp: string
  }[]
  currentStage: string
  createdAt: string
}

export interface QualityEvent {
  _id: string
  eventType: string
  entityType: string
  entityId: string
  description: string
  severity: 'low' | 'medium' | 'high'
  timestamp: string
  resolvedAt?: string
}

export interface GenealogySummary {
  bottle: Bottle
  packagingBatch: PackagingBatch
  processingBatch: ProcessingBatch
  receptionBatches: ReceptionBatch[]
  tankerTrips: TankerTrip[]
  collectionCenters: CollectionCenter[]
  qualityEvents: QualityEvent[]
}

export interface RiskScoreResult {
  score: number
  status: 'green' | 'amber' | 'red'
  factors: {
    temperatureDeviation: number
    transitDuration: number
    blendingComplexity: number
    collectionQualityScore: number
    anomaliesFactor: number
  }
}

export interface RecallResult {
  affectedBottleCount: number
  affectedPackagingBatches: number
  affectedDispatchPallets: number
  bottleDetails: Bottle[]
  severity: string
}
