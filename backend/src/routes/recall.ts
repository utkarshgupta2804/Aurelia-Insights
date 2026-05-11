import { Router, Request, Response } from 'express'
import { simulateRecall } from '../services/recallService'

const router = Router()

router.post('/', async (req: Request, res: Response) => {
  try {
    const { batchId, batchType } = req.body

    if (!batchId || !batchType) {
      return res.status(400).json({
        error: 'batchId and batchType (processing or reception) are required',
      })
    }

    if (!['processing', 'reception'].includes(batchType)) {
      return res.status(400).json({ error: 'batchType must be "processing" or "reception"' })
    }

    const result = await simulateRecall(batchId, batchType)
    res.json(result)
  } catch (error: any) {
    console.error('Recall error:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
})

export default router
