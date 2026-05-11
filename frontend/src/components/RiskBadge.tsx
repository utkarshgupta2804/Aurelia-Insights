import { FC } from 'react'
import { AlertCircle } from 'lucide-react'

interface RiskBadgeProps {
  status: 'green' | 'amber' | 'red'
  score?: number
  size?: 'sm' | 'md' | 'lg'
}

export const RiskBadge: FC<RiskBadgeProps> = ({ status, score, size = 'md' }) => {
  const colors = {
    green: 'bg-emerald-500/20 text-emerald-100 border-emerald-700',
    amber: 'bg-amber-500/20 text-amber-100 border-amber-700',
    red: 'bg-red-500/20 text-red-100 border-red-700',
  }

  const labels = {
    green: 'Green - Low Risk',
    amber: 'Amber - Medium Risk',
    red: 'Red - High Risk',
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-2',
  }

  return (
    <div className={`flex items-center gap-2 border rounded-lg ${colors[status]} ${sizeClasses[size]} w-fit`}>
      <AlertCircle className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'}`} />
      <div>
        <div className="font-semibold">{labels[status]}</div>
        {score !== undefined && <div className="text-xs opacity-75">Score: {score.toFixed(1)}</div>}
      </div>
    </div>
  )
}
