import { FC, useState } from 'react'
import { api } from '../../services/api'
import { GenealogySummary } from '../../types'
import { Search, AlertCircle } from 'lucide-react'
import { RiskBadge } from '../RiskBadge'

export const QRLookup: FC = () => {
  const [qrPayload, setQrPayload] = useState('')
  const [result, setResult] = useState<GenealogySummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['bottle']))

  const toggleSection = (section: string) => {
    const newSections = new Set(expandedSections)
    if (newSections.has(section)) {
      newSections.delete(section)
    } else {
      newSections.add(section)
    }
    setExpandedSections(newSections)
  }

  const handleLookup = async () => {
    if (!qrPayload.trim()) {
      setError('Please enter a QR payload')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await api.lookupQR(qrPayload)
      setResult(data)
    } catch (err: any) {
      setError(err.message || 'Failed to lookup QR')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLookup()
    }
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-bold text-slate-100 mb-4">QR Code Lookup</h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter QR payload URL..."
            value={qrPayload}
            onChange={(e) => setQrPayload(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={handleLookup}
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 text-slate-900 font-semibold px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Search className="w-4 h-4" />
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-3">
          Example: https://trace.aurelia.ai/amk/01/8901234567890/lot/AMUL-PKG-MUM-20260505-A-01/ser/000001
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-100">Error</p>
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Bottle Info */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <button
              onClick={() => toggleSection('bottle')}
              className="w-full flex items-center justify-between font-bold text-slate-100 hover:text-emerald-400 transition-colors"
            >
              <span>Bottle Information</span>
              <span className="text-sm">{expandedSections.has('bottle') ? '▼' : '▶'}</span>
            </button>
            {expandedSections.has('bottle') && (
              <div className="mt-4 space-y-2">
                <p className="text-slate-300">
                  <span className="text-slate-400">Serial:</span> {result.bottle.serial}
                </p>
                <p className="text-slate-300">
                  <span className="text-slate-400">Current Stage:</span> {result.bottle.currentStage}
                </p>
                <p className="text-slate-300">
                  <span className="text-slate-400">Created:</span>{' '}
                  {new Date(result.bottle.createdAt).toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Packaging Batch */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <button
              onClick={() => toggleSection('packaging')}
              className="w-full flex items-center justify-between font-bold text-slate-100 hover:text-emerald-400 transition-colors"
            >
              <span>Packaging Batch</span>
              <span className="text-sm">{expandedSections.has('packaging') ? '▼' : '▶'}</span>
            </button>
            {expandedSections.has('packaging') && (
              <div className="mt-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-300">
                      <span className="text-slate-400">Batch Code:</span> {result.packagingBatch.batchCode}
                    </p>
                    <p className="text-slate-300 text-sm">
                      <span className="text-slate-400">GTIN:</span> {result.packagingBatch.gtin}
                    </p>
                    <p className="text-slate-300 text-sm">
                      <span className="text-slate-400">Pack Size:</span> {result.packagingBatch.packSize} bottles
                    </p>
                  </div>
                  <RiskBadge status={result.packagingBatch.riskStatus} score={result.packagingBatch.riskScore} />
                </div>
              </div>
            )}
          </div>

          {/* Processing Batch */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <button
              onClick={() => toggleSection('processing')}
              className="w-full flex items-center justify-between font-bold text-slate-100 hover:text-emerald-400 transition-colors"
            >
              <span>Processing Batch</span>
              <span className="text-sm">{expandedSections.has('processing') ? '▼' : '▶'}</span>
            </button>
            {expandedSections.has('processing') && (
              <div className="mt-4 space-y-2">
                <p className="text-slate-300">
                  <span className="text-slate-400">Batch Code:</span> {result.processingBatch.batchCode}
                </p>
                <p className="text-slate-300 text-sm">
                  <span className="text-slate-400">Pasteurization:</span> {result.processingBatch.pasteurizationTemp}°C for{' '}
                  {result.processingBatch.pasteurizationDuration} min
                </p>
                <p className="text-slate-300 text-sm">
                  <span className="text-slate-400">Sources:</span> {result.receptionBatches.length} reception batch(es)
                </p>
              </div>
            )}
          </div>

          {/* Quality Events */}
          {result.qualityEvents.length > 0 && (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="font-bold text-slate-100 mb-4">Quality Events</h3>
              <div className="space-y-3">
                {result.qualityEvents.map((event, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-slate-700/50 rounded">
                    <AlertCircle className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-slate-200">{event.eventType}</p>
                      <p className="text-sm text-slate-400">{event.description}</p>
                    </div>
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
