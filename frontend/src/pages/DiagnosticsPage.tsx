import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Lightbulb, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { useDiagnostics } from '../hooks/useDiagnostics'
import { Issue } from '../services/issueService'

interface DiagnosticsPageProps {
  issue: Issue
  onBack: () => void
}

export const DiagnosticsPage: React.FC<DiagnosticsPageProps> = ({ issue, onBack }) => {
  const { diagnosis, loading, error, analyzeProblem } = useDiagnostics()
  const [description, setDescription] = useState(issue.description || '')

  const handleAnalyze = async () => {
    if (!description.trim()) return
    await analyzeProblem(issue.id, description)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-6 py-12">
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:28px_28px]" />

      {/* Gradient Orbs */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-white/10 transition-colors mb-8 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <PageHeader
          title="Troubleshooting Assistant"
          subtitle="AI-guided diagnostics for your infrastructure issues"
          icon={<Lightbulb className="w-8 h-8 text-purple-500" />}
        />

        {/* Issue Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-lg p-6 mb-8"
        >
          <h3 className="text-xl font-semibold mb-2">Issue: {issue.title}</h3>
          <p className="text-gray-400 mb-4">{issue.description}</p>
          <div className="flex gap-3">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-sm">
              {issue.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm">
              {issue.status}
            </span>
          </div>
        </motion.div>

        {/* Analysis Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-lg p-6 mb-8"
        >
          <h3 className="text-lg font-semibold mb-4">Describe the Problem</h3>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide detailed information about the issue..."
            className="w-full px-4 py-3 rounded-lg glass focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32 resize-none"
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !description.trim()}
            className="mt-4 px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Analyzing...' : 'Analyze Problem'}
          </button>
        </motion.div>

        {/* Error Message */}
        {error && <ErrorMessage message={error} />}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        )}

        {/* Diagnosis Results */}
        {diagnosis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ staggerChildren: 0.1 }}
            className="space-y-6"
          >
            {/* Possible Causes */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Possible Causes
              </h3>
              <ul className="space-y-2">
                {diagnosis.possible_causes.map((cause, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                    {cause}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Troubleshooting Steps */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Troubleshooting Steps
              </h3>
              <ol className="space-y-3">
                {diagnosis.troubleshooting_steps.map((step, idx) => (
                  <li key={idx} className="flex gap-3 text-gray-300">
                    <span className="font-semibold text-indigo-400 flex-shrink-0">{idx + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </motion.div>

            {/* Recommended Commands */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Recommended Commands</h3>
              <div className="space-y-2">
                {diagnosis.recommended_commands.map((cmd, idx) => (
                  <div key={idx} className="bg-slate-900/50 rounded px-3 py-2 font-mono text-sm text-green-400">
                    $ {cmd}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
