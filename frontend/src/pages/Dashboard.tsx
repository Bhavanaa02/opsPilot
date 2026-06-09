import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { useIssues } from '../hooks/useIssues'
import { Issue } from '../services/issueService'

const CATEGORIES = [
  { value: 'networking', label: 'Networking' },
  { value: 'hosting', label: 'Hosting' },
  { value: 'linux', label: 'Linux' },
  { value: 'database', label: 'Database' },
  { value: 'security', label: 'Security' },
  { value: 'email', label: 'Email' },
  { value: 'dns', label: 'DNS' },
  { value: 'web_server', label: 'Web Server' },
]

const STATUS_COLORS: { [key: string]: string } = {
  open: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  investigating: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
  closed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

export const Dashboard: React.FC<{ onSelectIssue: (issue: Issue) => void }> = ({
  onSelectIssue,
}) => {
  const { issues, loading, error, fetchIssues, createIssue } = useIssues()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('networking')
  const [filterStatus, setFilterStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  React.useEffect(() => {
    fetchIssues()
  }, [])

  const handleCreateIssue = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createIssue({ title, description, category })
      setTitle('')
      setDescription('')
      setCategory('networking')
      setShowCreateForm(false)
    } catch (err) {
      console.error('Failed to create issue')
    }
  }

  const filteredIssues = issues.filter((issue) => {
    const matchesStatus = !filterStatus || issue.status === filterStatus
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 px-6 py-12">
      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:28px_28px]" />

      {/* Gradient Orbs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <PageHeader
          title="Dashboard"
          subtitle="Monitor and manage all your infrastructure issues"
        />

        {/* Search and Create Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg glass focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Create Issue Button */}
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            <Plus className="w-5 h-5" />
            New Issue
          </button>
        </motion.div>

        {/* Create Form Modal */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          >
            <div className="glass rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Create New Issue</h2>
              <form onSubmit={handleCreateIssue} className="space-y-4">
                <input
                  type="text"
                  placeholder="Issue title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg glass focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg glass focus:outline-none focus:ring-2 focus:ring-indigo-500 h-20"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg glass focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 px-4 py-2 rounded-lg glass hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && <ErrorMessage message={error} />}

        {/* Issues List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 gap-4"
          >
            {filteredIssues.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-lg">No issues found</p>
              </div>
            ) : (
              filteredIssues.map((issue, index) => (
                <motion.div
                  key={issue.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSelectIssue(issue)}
                  className="glass rounded-lg p-4 hover:bg-white/10 cursor-pointer transition-all hover:shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{issue.title}</h3>
                      <p className="text-sm text-gray-400 mb-3">{issue.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-400">
                          {issue.category}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full border ${
                            STATUS_COLORS[issue.status]
                          }`}
                        >
                          {issue.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
