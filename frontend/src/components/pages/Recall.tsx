import { FC, useState } from 'react'
import { api } from '../../services/api'
import { RecallResult } from '../../types'
import { AlertTriangle } from 'lucide-react'

export const Recall: FC = () => {
  const [batchId, setBatchId] = useState('')
  const [batchType, setBatchType] = useState<'processing' | 'reception'>('processing')
  const [result, setResult] = useState<RecallResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSimulate = async () => {
    if (!batchId.trim()) {
      setError('Please enter a batch ID')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await api.simulateRecall(batchId, batchType)
      setResult(data)
    } catch (err: any) {
      setError(err.message || 'Failed to simulate recall')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const severityColor = {
    none: 'text-slate-400',
    low: 'text-emerald-400',
    medium: 'text-amber-400',
    high: 'text-red-400',
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          Recall Impact Simulation
        </h2>
        <p className="text-slate-400 text-sm mb-4">
          Simulate the impact of a quality issue on downstream products
        </p>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">Batch ID</label>
              <input
                type="text"
                placeholder="Enter batch ID (MongoDB ObjectId)..."
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Batch Type</label>
              <select
                value={batchType}
                onChange={(e) => setBatchType(e.target.value as 'processing' | 'reception')}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="processing">Processing Batch</option>
                <option value="reception">Reception Batch</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSimulate}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-600 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            {loading ? 'Simulating...' : 'Simulate Recall'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h3 className="font-bold text-slate-100 mb-4">Impact Assessment</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm">Affected Bottles</p>
                <p className="text-3xl font-bold text-slate-100 mt-2">{result.affectedBottleCount}</p>
              </div>
              <div className="bg-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm">Packaging Batches</p>
                <p className="text-3xl font-bold text-slate-100 mt-2">{result.affectedPackagingBatches}</p>
              </div>
              <div className="bg-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm">Dispatch Pallets</p>
                <p className="text-3xl font-bold text-slate-100 mt-2">{result.affectedDispatchPallets}</p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-slate-700 rounded-lg">
              <p className="text-slate-400 text-sm mb-2">Severity</p>
              <p className={`text-2xl font-bold ${severityColor[result.severity as keyof typeof severityColor]}`}>
                {result.severity.toUpperCase()}
              </p>
            </div>
          </div>

          {result.bottleDetails.length > 0 && (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="font-bold text-slate-100 mb-4">Affected Bottles (First 10)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.bottleDetails.slice(0, 10).map((bottle, idx) => (
                  <div key={idx} className="p-3 bg-slate-700 rounded">
                    <p className="font-medium text-slate-100">Bottle #{bottle.serial}</p>
                    <p className="text-xs text-slate-400">Stage: {bottle.currentStage}</p>
                  </div>
                ))}
              </div>
              {result.bottleDetails.length > 10 && (
                <p className="mt-3 text-sm text-slate-400">
                  ... and {result.bottleDetails.length - 10} more bottles
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
