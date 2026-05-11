import { FC, useEffect, useState } from 'react'
import { api } from '../../services/api'
import { StatCard } from '../StatCard'
import { RiskBadge } from '../RiskBadge'
import { Package, AlertTriangle, TrendingUp, Clock } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Stats {
  totalBottles: number
  totalPackagingBatches: number
  totalProcessingBatches: number
  atRiskBottles: number
  recentAnomalies: any[]
  riskDistribution: any
}

export const Dashboard: FC = () => {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const data = await api.getStats()
        setStats(data)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch stats')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>
  }

  if (error) {
    return <div className="text-red-400 text-center py-8">Error: {error}</div>
  }

  if (!stats) {
    return <div className="text-center py-8">No data available</div>
  }

  const riskData = [
    { name: 'Green', value: stats.riskDistribution.green || 0, fill: '#10b981' },
    { name: 'Amber', value: stats.riskDistribution.amber || 0, fill: '#f59e0b' },
    { name: 'Red', value: stats.riskDistribution.red || 0, fill: '#ef4444' },
  ]

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Bottles"
          value={stats.totalBottles}
          icon={<Package className="w-6 h-6" />}
          color="default"
        />
        <StatCard
          label="Packaging Batches"
          value={stats.totalPackagingBatches}
          icon={<Package className="w-6 h-6" />}
          color="default"
        />
        <StatCard
          label="Processing Batches"
          value={stats.totalProcessingBatches}
          icon={<TrendingUp className="w-6 h-6" />}
          color="default"
        />
        <StatCard
          label="At-Risk Items"
          value={stats.atRiskBottles}
          icon={<AlertTriangle className="w-6 h-6" />}
          color={stats.atRiskBottles > 0 ? 'amber' : 'green'}
        />
      </div>

      {/* Risk Distribution Chart */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-bold text-slate-100 mb-4">Risk Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={riskData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
              }}
              cursor={{ fill: 'rgba(255,255,255,0.1)' }}
            />
            <Bar dataKey="value" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Anomalies */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Recent Quality Events
        </h2>
        {stats.recentAnomalies.length === 0 ? (
          <p className="text-slate-400">No recent anomalies</p>
        ) : (
          <div className="space-y-3">
            {stats.recentAnomalies.map((anomaly, idx) => (
              <div key={idx} className="flex items-start gap-4 p-3 bg-slate-700/50 rounded-lg">
                <Clock className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-slate-100">{anomaly.eventType}</p>
                  <p className="text-sm text-slate-400">{anomaly.description}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(anomaly.timestamp).toLocaleString()}
                  </p>
                </div>
                <RiskBadge status={anomaly.severity === 'high' ? 'red' : anomaly.severity === 'medium' ? 'amber' : 'green'} size="sm" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
