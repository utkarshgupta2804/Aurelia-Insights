import { FC, useEffect, useState } from 'react'
import { api } from '../../services/api'
import { ProcessingBatch, PackagingBatch } from '../../types'
import { RiskBadge } from '../RiskBadge'
import { Loader } from 'lucide-react'

export const RiskMonitor: FC = () => {
  const [processingBatches, setProcessingBatches] = useState<ProcessingBatch[]>([])
  const [packagingBatches, setPackagingBatches] = useState<PackagingBatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'processing' | 'packaging'>('processing')

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true)
        const [processing, packaging] = await Promise.all([
          api.getProcessingBatches(),
          api.getPackagingBatches(),
        ])
        setProcessingBatches(processing.sort((a, b) => b.riskScore - a.riskScore))
        setPackagingBatches(packaging.sort((a, b) => b.riskScore - a.riskScore))
      } catch (err: any) {
        setError(err.message || 'Failed to fetch batches')
      } finally {
        setLoading(false)
      }
    }

    fetchBatches()
  }, [])

  if (loading) {
    return <div className="text-center py-8 flex items-center justify-center gap-2"><Loader className="w-4 h-4 animate-spin" /> Loading batches...</div>
  }

  if (error) {
    return <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-200">{error}</div>
  }

  const batches = activeTab === 'processing' ? processingBatches : packagingBatches

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-bold text-slate-100 mb-4">Risk Monitoring Dashboard</h2>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('processing')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'processing'
                ? 'bg-emerald-500 text-slate-900'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Processing Batches ({processingBatches.length})
          </button>
          <button
            onClick={() => setActiveTab('packaging')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'packaging'
                ? 'bg-emerald-500 text-slate-900'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Packaging Batches ({packagingBatches.length})
          </button>
        </div>

        {/* Batches Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-700">
              <tr>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Batch Code</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Risk Score</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {batches.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-slate-400">
                    No batches found
                  </td>
                </tr>
              ) : (
                batches.map((batch) => (
                  <tr key={batch._id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td className="py-4 px-4 text-slate-100 font-medium">{batch.batchCode}</td>
                    <td className="py-4 px-4">
                      <span className="text-slate-300">{batch.riskScore.toFixed(1)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <RiskBadge status={batch.riskStatus} size="sm" />
                    </td>
                    <td className="py-4 px-4 text-slate-400 text-xs">
                      {new Date(batch.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-900/20 border border-emerald-700 rounded-lg p-4">
          <p className="text-emerald-300 text-sm">Green (Low Risk)</p>
          <p className="text-3xl font-bold text-emerald-100 mt-2">
            {batches.filter((b) => b.riskStatus === 'green').length}
          </p>
        </div>
        <div className="bg-amber-900/20 border border-amber-700 rounded-lg p-4">
          <p className="text-amber-300 text-sm">Amber (Medium Risk)</p>
          <p className="text-3xl font-bold text-amber-100 mt-2">
            {batches.filter((b) => b.riskStatus === 'amber').length}
          </p>
        </div>
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
          <p className="text-red-300 text-sm">Red (High Risk)</p>
          <p className="text-3xl font-bold text-red-100 mt-2">
            {batches.filter((b) => b.riskStatus === 'red').length}
          </p>
        </div>
      </div>
    </div>
  )
}
