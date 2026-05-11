import { FC, useState } from 'react'
import { api } from '../../services/api'
import { GenealogySummary } from '../../types'
import { Search, AlertCircle } from 'lucide-react'

export const Genealogy: FC = () => {
  const [bottleId, setBottleId] = useState('')
  const [result, setResult] = useState<GenealogySummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!bottleId.trim()) {
      setError('Please enter a bottle ID')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await api.getGenealogy(bottleId)
      setResult(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch genealogy')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-bold text-slate-100 mb-4">Genealogy Trace</h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter Bottle ID (MongoDB ObjectId)..."
            value={bottleId}
            onChange={(e) => setBottleId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 text-slate-900 font-semibold px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h3 className="font-bold text-slate-100 mb-4">Upstream Genealogy Chain</h3>
            <div className="space-y-4">
              {/* Bottle */}
              <div className="p-4 bg-emerald-900/20 border border-emerald-700 rounded">
                <p className="font-semibold text-emerald-100">Bottle #{result.bottle.serial}</p>
                <p className="text-sm text-emerald-300">Current Stage: {result.bottle.currentStage}</p>
              </div>

              <div className="text-center text-slate-500">↑</div>

              {/* Packaging Batch */}
              <div className="p-4 bg-slate-700 border border-slate-600 rounded">
                <p className="font-semibold text-slate-100">{result.packagingBatch.batchCode}</p>
                <p className="text-sm text-slate-400">Packaging Batch</p>
              </div>

              <div className="text-center text-slate-500">↑</div>

              {/* Processing Batch */}
              <div className="p-4 bg-slate-700 border border-slate-600 rounded">
                <p className="font-semibold text-slate-100">{result.processingBatch.batchCode}</p>
                <p className="text-sm text-slate-400">Processing Batch ({result.receptionBatches.length} sources)</p>
              </div>

              <div className="text-center text-slate-500">↑</div>

              {/* Reception Batches */}
              <div className="space-y-2">
                {result.receptionBatches.map((rb, idx) => (
                  <div key={idx} className="p-4 bg-slate-700 border border-slate-600 rounded">
                    <p className="font-semibold text-slate-100">{rb.batchCode}</p>
                    <p className="text-sm text-slate-400">Reception Batch - Quality Score: {rb.qualityScore}</p>
                  </div>
                ))}
              </div>

              <div className="text-center text-slate-500">↑</div>

              {/* Tanker Trips */}
              <div className="space-y-2">
                {result.tankerTrips.map((tt, idx) => (
                  <div key={idx} className="p-4 bg-slate-700 border border-slate-600 rounded">
                    <p className="font-semibold text-slate-100">{tt.tankerName}</p>
                    <p className="text-sm text-slate-400">{tt.route}</p>
                  </div>
                ))}
              </div>

              <div className="text-center text-slate-500">↑</div>

              {/* Collection Centers */}
              <div className="space-y-2">
                {result.collectionCenters.map((cc, idx) => (
                  <div key={idx} className="p-4 bg-amber-900/20 border border-amber-700 rounded">
                    <p className="font-semibold text-amber-100">{cc.name}</p>
                    <p className="text-sm text-amber-300">{cc.location} - Quality: {cc.historicalQualityScore}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {result.qualityEvents.length > 0 && (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="font-bold text-slate-100 mb-4">Quality Events Along Chain</h3>
              <div className="space-y-3">
                {result.qualityEvents.map((evt, idx) => (
                  <div key={idx} className="p-3 bg-slate-700 rounded">
                    <p className="font-medium text-slate-100">{evt.eventType}</p>
                    <p className="text-sm text-slate-400">{evt.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
