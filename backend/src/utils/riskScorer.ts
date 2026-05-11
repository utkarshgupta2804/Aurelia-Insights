export interface RiskFactors {
  temperatureDeviation: number
  transitDuration: number
  blendingComplexity: number
  collectionQualityScore: number
  anomaliesFactor: number
}

export interface RiskScoreResult {
  score: number
  status: 'green' | 'amber' | 'red'
  factors: RiskFactors
}

const FACTOR_WEIGHTS = {
  temperatureDeviation: 0.25,
  transitDuration: 0.2,
  blendingComplexity: 0.2,
  collectionQualityScore: 0.2,
  anomaliesFactor: 0.15,
}

export const calculateRiskScore = (factors: RiskFactors): RiskScoreResult => {
  const weightedScore =
    factors.temperatureDeviation * FACTOR_WEIGHTS.temperatureDeviation +
    factors.transitDuration * FACTOR_WEIGHTS.transitDuration +
    factors.blendingComplexity * FACTOR_WEIGHTS.blendingComplexity +
    factors.collectionQualityScore * FACTOR_WEIGHTS.collectionQualityScore +
    factors.anomaliesFactor * FACTOR_WEIGHTS.anomaliesFactor

  const score = Math.min(100, Math.max(0, weightedScore))

  let status: 'green' | 'amber' | 'red'
  if (score <= 30) {
    status = 'green'
  } else if (score <= 70) {
    status = 'amber'
  } else {
    status = 'red'
  }

  return {
    score,
    status,
    factors,
  }
}

export const calculateTemperatureDeviation = (
  logs: Array<{ temperature: number; timestamp: Date }>
): number => {
  if (logs.length === 0) return 0

  const optimalTemp = 4 // °C for milk
  const deviations = logs.map((log) => Math.abs(log.temperature - optimalTemp))
  const avgDeviation = deviations.reduce((a, b) => a + b, 0) / logs.length

  // Scale to 0-100: each degree deviation = 10 points
  return Math.min(100, avgDeviation * 10)
}

export const calculateTransitDuration = (
  departureTime: Date,
  arrivalTime: Date
): number => {
  const durationHours =
    (arrivalTime.getTime() - departureTime.getTime()) / (1000 * 60 * 60)

  // Optimal transit time is 12 hours
  // Each hour above 12 = 5 risk points
  const optimalDuration = 12
  const excessHours = Math.max(0, durationHours - optimalDuration)

  return Math.min(100, excessHours * 5)
}

export const calculateBlendingComplexity = (sourceCount: number): number => {
  // Single source = 0 risk
  // Each additional source = 20 risk points
  return Math.min(100, (sourceCount - 1) * 20)
}

export const calculateQualityScore = (score: number): number => {
  // Inverted: lower quality = higher risk
  // Quality 100 = 0 risk, Quality 50 = 50 risk
  return Math.max(0, 100 - score)
}

export const calculateAnomaliesFactor = (anomalyCount: number): number => {
  // Each anomaly = 20 risk points
  return Math.min(100, anomalyCount * 20)
}
