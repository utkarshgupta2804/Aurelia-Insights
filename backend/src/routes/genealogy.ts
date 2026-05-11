import { Router, Request, Response } from 'express'
import { getGenealogiesByBottleId } from '../services/genealogyService'

const router = Router()

router.get('/:bottleId', async (req: Request, res: Response) => {
  try {
    const { bottleId } = req.params
    const genealogy = await getGenealogiesByBottleId(bottleId)
    res.json(genealogy)
  } catch (error: any) {
    console.error('Genealogy error:', error)
    res.status(404).json({ error: error.message || 'Not found' })
  }
})

export default router
