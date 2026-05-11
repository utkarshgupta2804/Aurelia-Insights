import { FC } from 'react'
import { Package, Home, Search, Eye, AlertTriangle, Clock } from 'lucide-react'

interface HeaderProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export const Header: FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'lookup', label: 'QR Lookup', icon: Search },
    { id: 'genealogy', label: 'Genealogy', icon: Eye },
    { id: 'recall', label: 'Recall', icon: AlertTriangle },
    { id: 'risk', label: 'Risk Monitor', icon: Package },
    { id: 'tracking', label: 'Tracking', icon: Clock },
  ]

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-slate-900" />
            </div>
            <h1 className="text-2xl font-bold text-slate-100">Amul Traceability</h1>
          </div>
          <div className="text-sm text-slate-400">Milk Supply Chain Transparency System</div>
        </div>

        <nav className="flex gap-1 overflow-x-auto pb-2">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                currentPage === id
                  ? 'bg-emerald-500 text-slate-900'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
