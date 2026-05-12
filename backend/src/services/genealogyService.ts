import { Bottle } from '../models/Bottle'
import { PackagingBatch } from '../models/PackagingBatch'
import { ReceptionBatch } from '../models/ReceptionBatch'
import { TankerTrip } from '../models/TankerTrip'
import { CollectionCenter } from '../models/CollectionCenter'
import { QualityEvent } from '../models/QualityEvent'
import { parseQRPayload } from '../utils/qrGenerator'

export interface GenealogySummary {
  bottle: any
  packagingBatch: any
  processingBatch: any
  receptionBatches: any[]
  tankerTrips: any[]
  collectionCenters: any[]
  qualityEvents: any[]
}

export const getGenealogiesByQRPayload = async (
  qrPayload: string
): Promise<GenealogySummary> => {
  const parsed = parseQRPayload(qrPayload)
  if (!parsed) {
    throw new Error('Invalid QR payload format')
  }

  const { packagingBatchCode, serial } = parsed

  // Find packaging batch by code
  const packagingBatch = await PackagingBatch.findOne({
    batchCode: packagingBatchCode,
  })
  if (!packagingBatch) {
    throw new Error('Packaging batch not found')
  }

  // Find bottle by serial and package batch
  const bottle = await Bottle.findOne({
    packageBatch: packagingBatch._id,
    serial,
  })
  if (!bottle) {
    throw new Error('Bottle not found')
  }

  return getGenealogiesByBottleId(bottle._id.toString())
}

export const getGenealogiesByBottleId = async (
  bottleId: string
): Promise<GenealogySummary> => {
  // Get bottle
  const bottle = await Bottle.findById(bottleId)
  if (!bottle) {
    throw new Error('Bottle not found')
  }

  // Get packaging batch
  const packagingBatch = await PackagingBatch.findById(bottle.packageBatch).populate(
    'processingBatch'
  )
  if (!packagingBatch) {
    throw new Error('Packaging batch not found')
  }

  // Get processing batch (should be from populated field)
  const processingBatch = packagingBatch.processingBatch as any
  if (!processingBatch) {
    throw new Error('Processing batch not found')
  }

  // Get all reception batches (processing batch may have multiple)
  const receptionBatches = await ReceptionBatch.find({
    _id: { $in: processingBatch.receptionBatches },
  }).populate('tankerTrip')

  // Get unique tanker trips
  const tankerTripIds = [
    ...new Set(receptionBatches.map((rb: any) => rb.tankerTrip._id.toString())),
  ]
  const tankerTrips = await TankerTrip.find({
    _id: { $in: tankerTripIds },
  }).populate('collectionCenters')

  // Get all collection centers
  const collectionCenterIds = [
    ...new Set(
      tankerTrips.flatMap((tt: any) => tt.collectionCenters.map((cc: any) => cc._id.toString()))
    ),
  ]
  const collectionCenters = await CollectionCenter.find({
    _id: { $in: collectionCenterIds },
  })

  // Get quality events for all entities
  const entityIds = [
    bottle._id,
    packagingBatch._id,
    processingBatch._id,
    ...receptionBatches.map((rb: any) => rb._id),
    ...tankerTrips.map((tt: any) => tt._id),
    ...collectionCenters.map((cc: any) => cc._id),
  ]

  const qualityEvents = await QualityEvent.find({
    entityId: { $in: entityIds },
  })

  return {
    bottle,
    packagingBatch,
    processingBatch,
    receptionBatches,
    tankerTrips,
    collectionCenters,
    qualityEvents,
  }
}
