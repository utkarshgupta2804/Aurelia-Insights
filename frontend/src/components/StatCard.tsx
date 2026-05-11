import { FC, ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: number | string
  icon?: ReactNode
  color?: 'default' | 'green' | 'amber' | 'red'
  trend?: number
}

export const StatCard: FC<StatCardProps> = ({
  label,
  value,
  icon,
  color = 'default',
  trend,
}) => {
  const colorClasses = {
    default: 'bg-slate-800 border-slate-700',
    green: 'bg-emerald-900/30 border-emerald-700',
    amber: 'bg-amber-900/30 border-amber-700',
    red: 'bg-red-900/30 border-red-700',
  }

  const textColor = {
    default: 'text-slate-100',
    green: 'text-emerald-100',
    amber: 'text-amber-100',
    red: 'text-red-100',
  }

  return (
    <div className={`rounded-lg border p-6 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-400 mb-2">{label}</p>
          <div className="flex items-end gap-2">
            <p className={`text-3xl font-bold ${textColor[color]}`}>{value}</p>
            {trend !== undefined && (
              <p className={`text-sm mb-1 ${trend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {trend >= 0 ? '+' : ''}{trend}%
              </p>
            )}
          </div>
        </div>
        {icon && (
          <div className="text-slate-500">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
