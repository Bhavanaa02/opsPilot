import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowLeft } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { useKnowledgeBase } from '../hooks/useKnowledgeBase'

interface KnowledgeBasePageProps {
  onBack: () => void
}

export const KnowledgeBasePage: React.FC<KnowledgeBasePageProps> = ({ onBack }) => {
  const { entries, loading, error, fetchEntries, searchEntries } = useKnowledgeBase()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEntry, setSelectedEntry] = useState<any>(null)
  const [filterCategory, setFilterCategory] = useState('')

  useEffect(() => {
    fetchEntries()
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      await searchEntries(searchTerm)
    } else {
      fetchEntries()
    }
  }

  const filteredEntries = filterCategory
    ? entries.filter((entry) => entry.category === filterCategory)
    : entries

  const categories = Array.from(new Set(entries.map((e) => e.category)))

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-6 py-12">
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:28px_28px]" />

      {/* Gradient Orbs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-green-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-white/10 transition-colors mb-8 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <PageHeader
          title="Knowledge Base"
          subtitle="Search and browse solutions to common issues"
        />

        {/* Search Bar */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSearch}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search knowledge base..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg glass focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="absolute right-3 top-2 px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-sm transition-colors"
            >
              Search
            </button>
          </div>
        </motion.form>

        {/* Category Filters */}
        {categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            <button
              onClick={() => setFilterCategory('')}
              className={`px-3 py-1 rounded-full text-sm transition-all ${
                filterCategory === ''
                  ? 'bg-indigo-600 text-white'
                  : 'glass text-gray-300 hover:bg-white/10'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  filterCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'glass text-gray-300 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        )}

        {/* Error Message */}
        {error && <ErrorMessage message={error} />}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Entries List */}
            <div className="md:col-span-1">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.05 }}
                className="space-y-3"
              >
                {filteredEntries.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">No entries found</p>
                ) : (
                  filteredEntries.map((entry, idx) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setSelectedEntry(entry)}
                      className={`glass rounded-lg p-3 cursor-pointer transition-all hover:bg-white/10 ${
                        selectedEntry?.id === entry.id ? 'ring-2 ring-indigo-500' : ''
                      }`}
                    >
                      <h4 className="font-semibold text-sm line-clamp-2">{entry.title}</h4>
                      <p className="text-xs text-gray-400 mt-1">{entry.category}</p>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </div>

            {/* Entry Details */}
            <div className="md:col-span-2">
              {selectedEntry ? (
                <motion.div
                  key={selectedEntry.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass rounded-lg p-6"
                >
                  <h3 className="text-2xl font-bold mb-4">{selectedEntry.title}</h3>
                  <div className="space-y-4">
                    {selectedEntry.problem_description && (
                      <div>
                        <h4 className="font-semibold text-indigo-400 mb-2">Problem</h4>
                        <p className="text-gray-300">{selectedEntry.problem_description}</p>
                      </div>
                    )}
                    {selectedEntry.root_cause && (
                      <div>
                        <h4 className="font-semibold text-yellow-400 mb-2">Root Cause</h4>
                        <p className="text-gray-300">{selectedEntry.root_cause}</p>
                      </div>
                    )}
                    {selectedEntry.resolution_steps && (
                      <div>
                        <h4 className="font-semibold text-green-400 mb-2">Resolution Steps</h4>
                        <ol className="list-decimal list-inside space-y-1 text-gray-300">
                          {typeof selectedEntry.resolution_steps === 'string'
                            ? JSON.parse(selectedEntry.resolution_steps).map((step: string, idx: number) => (
                                <li key={idx}>{step}</li>
                              ))
                            : selectedEntry.resolution_steps.map((step: string, idx: number) => (
                                <li key={idx}>{step}</li>
                              ))}
                        </ol>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="glass rounded-lg p-12 text-center text-gray-400">
                  <p>Select an entry to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
