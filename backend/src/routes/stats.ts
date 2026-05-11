import { Router, Request, Response } from 'express'
import { Bottle } from '../models/Bottle'
import { PackagingBatch } from '../models/PackagingBatch'
import { ProcessingBatch } from '../models/ProcessingBatch'
import { QualityEvent } from '../models/QualityEvent'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const totalBottles = await Bottle.countDocuments()
    const totalPackagingBatches = await PackagingBatch.countDocuments()
    const totalProcessingBatches = await ProcessingBatch.countDocuments()

    const atRiskBottles = await PackagingBatch.countDocuments({
      riskStatus: { $in: ['amber', 'red'] },
    })

    const recentAnomalies = await QualityEvent.find()
      .sort({ timestamp: -1 })
      .limit(10)

    const riskDistribution = await ProcessingBatch.aggregate([
      {
        $group: {
          _id: '$riskStatus',
          count: { $sum: 1 },
        },
      },
    ])

    res.json({
      totalBottles,
      totalPackagingBatches,
      totalProcessingBatches,
      atRiskBottles,
      recentAnomalies,
      riskDistribution: riskDistribution.reduce((acc: any, curr: any) => {
        acc[curr._id] = curr.count
        return acc
      }, {}),
    })
  } catch (error: any) {
    console.error('Stats error:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
