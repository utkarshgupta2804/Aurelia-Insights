import { ProcessingBatch } from '../models/ProcessingBatch'
import { PackagingBatch } from '../models/PackagingBatch'
import { Bottle } from '../models/Bottle'

export interface RecallResult {
  affectedBottleCount: number
  affectedPackagingBatches: number
  affectedDispatchPallets: number
  bottleDetails: any[]
  severity: string
}

export const simulateRecall = async (
  batchId: string,
  batchType: 'processing' | 'reception'
): Promise<RecallResult> => {
  if (batchType === 'processing') {
    return recallFromProcessingBatch(batchId)
  } else {
    return recallFromReceptionBatch(batchId)
  }
}

const recallFromProcessingBatch = async (processingBatchId: string): Promise<RecallResult> => {
  // Find all packaging batches from this processing batch
  const packagingBatches = await PackagingBatch.find({
    processingBatch: processingBatchId,
  })

  if (packagingBatches.length === 0) {
    return {
      affectedBottleCount: 0,
      affectedPackagingBatches: 0,
      affectedDispatchPallets: 0,
      bottleDetails: [],
      severity: 'none',
    }
  }

  // Find all bottles from these packaging batches
  const packagingBatchIds = packagingBatches.map((pb) => pb._id)
  const bottles = await Bottle.find({
    packageBatch: { $in: packagingBatchIds },
  })

  // Estimate dispatch pallets (assume ~2000 bottles per pallet)
  const dispatchPallets = Math.ceil(bottles.length / 2000)

  const severity = determineSeverity(bottles.length, packagingBatches.length)

  return {
    affectedBottleCount: bottles.length,
    affectedPackagingBatches: packagingBatches.length,
    affectedDispatchPallets: dispatchPallets,
    bottleDetails: bottles,
    severity,
  }
}

const recallFromReceptionBatch = async (receptionBatchId: string): Promise<RecallResult> => {
  // Find all processing batches that use this reception batch
  const processingBatches = await ProcessingBatch.find({
    receptionBatches: receptionBatchId,
  })

  if (processingBatches.length === 0) {
    return {
      affectedBottleCount: 0,
      affectedPackagingBatches: 0,
      affectedDispatchPallets: 0,
      bottleDetails: [],
      severity: 'none',
    }
  }

  // Find all packaging batches from these processing batches
  const processingBatchIds = processingBatches.map((pb) => pb._id)
  const packagingBatches = await PackagingBatch.find({
    processingBatch: { $in: processingBatchIds },
  })

  // Find all bottles from these packaging batches
  const packagingBatchIds = packagingBatches.map((pb) => pb._id)
  const bottles = await Bottle.find({
    packageBatch: { $in: packagingBatchIds },
  })

  // Estimate dispatch pallets
  const dispatchPallets = Math.ceil(bottles.length / 2000)

  const severity = determineSeverity(bottles.length, packagingBatches.length)

  return {
    affectedBottleCount: bottles.length,
    affectedPackagingBatches: packagingBatches.length,
    affectedDispatchPallets: dispatchPallets,
    bottleDetails: bottles,
    severity,
  }
}

const determineSeverity = (bottleCount: number, _batchCount: number): string => {
  if (bottleCount === 0) {
    return 'none'
  } else if (bottleCount < 10000) {
    return 'low'
  } else if (bottleCount < 100000) {
    return 'medium'
  } else {
    return 'high'
  }
}
