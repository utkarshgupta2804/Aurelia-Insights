import { Router, Request, Response } from 'express'
import { getGenealogiesByQRPayload } from '../services/genealogyService'

const router = Router()

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { qrPayload } = req.query

    if (!qrPayload || typeof qrPayload !== 'string') {
      res.status(400).json({ error: 'QR payload is required' })
      return
    }

    const genealogy = await getGenealogiesByQRPayload(qrPayload)
    res.json(genealogy)
  } catch (error: any) {
    console.error('Lookup error:', error)
    res.status(404).json({ error: error.message || 'Not found' })
  }
})

export default router
