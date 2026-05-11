import { FC, useState } from 'react'
import { api } from '../../services/api'
import { Search, AlertCircle } from 'lucide-react'

interface TrackingInfo {
  bottleId: string
  currentStage: string
  trackingLogs: Array<{
    stage: string
    location: string
    temperature?: number
    updatedBy: string
    timestamp: string
  }>
}

const stageOrder = ['collection', 'in-transit', 'reception', 'processing', 'packaging', 'dispatch', 'delivered']

export const Tracking: FC = () => {
  const [bottleId, setBottleId] = useState('')
  const [tracking, setTracking] = useState<TrackingInfo | null>(null)
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
      const data = await api.getBottle(bottleId)
      setTracking({
        bottleId: data._id,
        currentStage: data.currentStage,
        trackingLogs: data.trackingLogs,
      })
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tracking info')
      setTracking(null)
    } finally {
      setLoading(false)
    }
  }

  const getStageIndex = (stage: string): number => {
    return stageOrder.indexOf(stage)
  }

  const stageColors = {
    collection: 'bg-blue-500',
    'in-transit': 'bg-cyan-500',
    reception: 'bg-purple-500',
    processing: 'bg-indigo-500',
    packaging: 'bg-pink-500',
    dispatch: 'bg-orange-500',
    delivered: 'bg-emerald-500',
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-bold text-slate-100 mb-4">Live Tracking Timeline</h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter Bottle ID..."
            value={bottleId}
            onChange={(e) => setBottleId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 text-slate-900 font-semibold px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            {loading ? 'Searching...' : 'Track'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {tracking && (
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h3 className="font-bold text-slate-100 mb-6">Supply Chain Progress</h3>
            <div className="flex items-center gap-2">
              {stageOrder.map((stage, idx) => {
                const isCompleted = getStageIndex(tracking.currentStage) >= idx
                const isCurrent = tracking.currentStage === stage
                const color = stageColors[stage as keyof typeof stageColors]

                return (
                  <div key={stage} className="flex-1">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isCompleted ? color : 'bg-slate-700'
                      }`}
                    />
                    <p className={`text-xs mt-2 text-center capitalize ${isCurrent ? 'font-bold text-emerald-400' : isCompleted ? 'text-slate-300' : 'text-slate-500'}`}>
                      {stage.replace('-', ' ')}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h3 className="font-bold text-slate-100 mb-6">Timeline History</h3>
            <div className="space-y-6">
              {tracking.trackingLogs.length === 0 ? (
                <p className="text-slate-400">No tracking updates yet</p>
              ) : (
                tracking.trackingLogs.map((log, idx) => {
                  const color = stageColors[log.stage as keyof typeof stageColors]
                  return (
                    <div key={idx} className="flex gap-4">
                      {/* Timeline dot and line */}
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${color}`} />
                        {idx < tracking.trackingLogs.length - 1 && <div className="w-1 h-12 bg-slate-700" />}
                      </div>

                      {/* Event details */}
                      <div className="flex-1 pb-4">
                        <p className="font-semibold text-slate-100 capitalize">
                          {log.stage.replace('-', ' ')}
                        </p>
                        <p className="text-sm text-slate-400 mt-1">{log.location}</p>
                        {log.temperature !== undefined && (
                          <p className="text-sm text-slate-400">Temperature: {log.temperature}°C</p>
                        )}
                        <p className="text-xs text-slate-500 mt-2">
                          {new Date(log.timestamp).toLocaleString()} • {log.updatedBy}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
