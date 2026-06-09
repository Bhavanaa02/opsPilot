import { useState } from 'react'
import { motion } from 'framer-motion'
import { Database, Lightbulb, BookOpen } from 'lucide-react'
import { Dashboard } from './pages/Dashboard'
import { DiagnosticsPage } from './pages/DiagnosticsPage'
import { KnowledgeBasePage } from './pages/KnowledgeBasePage'
import { Issue } from './services/issueService'
import './styles/globals.css'

type PageType = 'dashboard' | 'diagnostics' | 'knowledge-base'

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard')
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)

  const handleSelectIssue = (issue: Issue) => {
    setSelectedIssue(issue)
    setCurrentPage('diagnostics')
  }

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard')
    setSelectedIssue(null)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'diagnostics':
        return selectedIssue ? (
          <DiagnosticsPage issue={selectedIssue} onBack={handleBackToDashboard} />
        ) : (
          <Dashboard onSelectIssue={handleSelectIssue} />
        )
      case 'knowledge-base':
        return <KnowledgeBasePage onBack={handleBackToDashboard} />
      default:
        return <Dashboard onSelectIssue={handleSelectIssue} />
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-white/10 bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
              <Database className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl gradient-text">OpsPilot</span>
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <button
              onClick={() => handleBackToDashboard()}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                currentPage === 'dashboard'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <Database className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => setCurrentPage('diagnostics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                currentPage === 'diagnostics'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              Diagnostics
            </button>
            <button
              onClick={() => setCurrentPage('knowledge-base')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                currentPage === 'knowledge-base'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Knowledge Base
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderPage()}
        </motion.div>
      </main>
    </div>
  )
}

export default App
