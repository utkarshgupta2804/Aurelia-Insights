import { Router, Request, Response } from 'express'
import { Bottle } from '../models/Bottle'

const router = Router()

router.post('/update', async (req: Request, res: Response) => {
  try {
    const { bottleId, stage, location, temperature, updatedBy } = req.body

    if (!bottleId || !stage || !location) {
      return res.status(400).json({
        error: 'bottleId, stage, and location are required',
      })
    }

    const bottle = await Bottle.findById(bottleId)
    if (!bottle) {
      return res.status(404).json({ error: 'Bottle not found' })
    }

    // Add tracking log
    bottle.trackingLogs.push({
      stage,
      location,
      temperature,
      updatedBy: updatedBy || 'system',
      timestamp: new Date(),
    })

    bottle.currentStage = stage

    const updated = await bottle.save()
    res.json(updated)
  } catch (error: any) {
    console.error('Tracking update error:', error)
    res.status(500).json({ error: error.message })
  }
})

router.get('/:bottleId', async (req: Request, res: Response) => {
  try {
    const bottle = await Bottle.findById(req.params.bottleId)
    if (!bottle) {
      return res.status(404).json({ error: 'Bottle not found' })
    }
    res.json({
      bottleId: bottle._id,
      currentStage: bottle.currentStage,
      trackingLogs: bottle.trackingLogs,
    })
  } catch (error: any) {
    console.error('Tracking error:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
