import { Router, Request, Response } from 'express'
import { ProcessingBatch } from '../models/ProcessingBatch'
import { ReceptionBatch } from '../models/ReceptionBatch'
import { TankerTrip } from '../models/TankerTrip'
import { QualityEvent } from '../models/QualityEvent'
import { CollectionCenter } from '../models/CollectionCenter'
import {
  calculateRiskScore,
  calculateTemperatureDeviation,
  calculateTransitDuration,
  calculateBlendingComplexity,
  calculateQualityScore,
  calculateAnomaliesFactor,
} from '../utils/riskScorer'

const router = Router()

router.get('/:batchId', async (req: Request, res: Response) => {
  try {
    const { batchId } = req.params

    // Assume it's a processing batch first
    let processingBatch = await ProcessingBatch.findById(batchId).populate(
      'receptionBatches'
    )

    if (!processingBatch) {
      return res.status(404).json({ error: 'Batch not found' })
    }

    // Get reception batches
    const receptionBatches = processingBatch.receptionBatches as any[]

    // Get temperature logs from tanker trips
    let temperatureLogs: any[] = []
    for (const rb of receptionBatches) {
      const tankerTrip = await TankerTrip.findById(rb.tankerTrip)
      if (tankerTrip) {
        temperatureLogs.push(...tankerTrip.temperatureLogs)
      }
    }

    // Get tanker trip info for transit duration
    let maxTransitDuration = 0
    for (const rb of receptionBatches) {
      const tankerTrip = await TankerTrip.findById(rb.tankerTrip)
      if (tankerTrip) {
        const duration = calculateTransitDuration(
          tankerTrip.departureTime,
          tankerTrip.arrivalTime
        )
        maxTransitDuration = Math.max(maxTransitDuration, duration)
      }
    }

    // Get collection centers quality scores
    const collectionCenterIds = receptionBatches.flatMap(
      (rb: any) => rb.collectionCenters || []
    )
    const collectionCenters = await CollectionCenter.find({
      _id: { $in: collectionCenterIds },
    })
    const avgCollectionQuality =
      collectionCenters.length > 0
        ? collectionCenters.reduce((sum, cc) => sum + cc.historicalQualityScore, 0) /
          collectionCenters.length
        : 50

    // Count quality anomalies
    const anomalies = await QualityEvent.countDocuments({
      entityType: 'ProcessingBatch',
      entityId: batchId,
    })

    // Calculate individual factors
    const tempDeviation = calculateTemperatureDeviation(temperatureLogs)
    const transitDuration = maxTransitDuration
    const blendingComplexity = calculateBlendingComplexity(receptionBatches.length)
    const collectionQuality = calculateQualityScore(avgCollectionQuality)
    const anomaliesFactor = calculateAnomaliesFactor(anomalies)

    // Calculate final risk score
    const riskScore = calculateRiskScore({
      temperatureDeviation: tempDeviation,
      transitDuration: transitDuration,
      blendingComplexity: blendingComplexity,
      collectionQualityScore: collectionQuality,
      anomaliesFactor: anomaliesFactor,
    })

    res.json(riskScore)
  } catch (error: any) {
    console.error('Risk score error:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
