import { useState } from 'react'
import './globals.css'
import { Header } from './components/Header'
import { Dashboard } from './components/pages/Dashboard'
import { QRLookup } from './components/pages/QRLookup'
import { Genealogy } from './components/pages/Genealogy'
import { Recall } from './components/pages/Recall'
import { RiskMonitor } from './components/pages/RiskMonitor'
import { Tracking } from './components/pages/Tracking'

type PageType = 'dashboard' | 'lookup' | 'genealogy' | 'recall' | 'risk' | 'tracking'

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'lookup':
        return <QRLookup />
      case 'genealogy':
        return <Genealogy />
      case 'recall':
        return <Recall />
      case 'risk':
        return <RiskMonitor />
      case 'tracking':
        return <Tracking />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Header currentPage={currentPage} onNavigate={(page) => setCurrentPage(page as PageType)} />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {renderPage()}
      </main>
    </div>
  )
}

export default App
