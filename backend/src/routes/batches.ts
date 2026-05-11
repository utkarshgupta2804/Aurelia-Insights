import { Router, Request, Response } from 'express'
import { ProcessingBatch } from '../models/ProcessingBatch'
import { PackagingBatch } from '../models/PackagingBatch'

const router = Router()

router.get('/processing', async (req: Request, res: Response) => {
  try {
    const batches = await ProcessingBatch.find()
      .populate('receptionBatches')
      .sort({ createdAt: -1 })
    res.json(batches)
  } catch (error: any) {
    console.error('Error fetching processing batches:', error)
    res.status(500).json({ error: error.message })
  }
})

router.get('/packaging', async (req: Request, res: Response) => {
  try {
    const batches = await PackagingBatch.find()
      .populate('processingBatch')
      .sort({ createdAt: -1 })
    res.json(batches)
  } catch (error: any) {
    console.error('Error fetching packaging batches:', error)
    res.status(500).json({ error: error.message })
  }
})

router.get('/processing/:id', async (req: Request, res: Response) => {
  try {
    const batch = await ProcessingBatch.findById(req.params.id).populate(
      'receptionBatches'
    )
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' })
    }
    res.json(batch)
  } catch (error: any) {
    console.error('Error fetching processing batch:', error)
    res.status(500).json({ error: error.message })
  }
})

router.get('/packaging/:id', async (req: Request, res: Response) => {
  try {
    const batch = await PackagingBatch.findById(req.params.id).populate(
      'processingBatch'
    )
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' })
    }
    res.json(batch)
  } catch (error: any) {
    console.error('Error fetching packaging batch:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
