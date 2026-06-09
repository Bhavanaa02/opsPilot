import { useState, useCallback } from 'react'
import { knowledgeBaseService, KnowledgeBaseEntry } from '../services/issueService'

export const useKnowledgeBase = () => {
  const [entries, setEntries] = useState<KnowledgeBaseEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEntries = useCallback(async (params?: any) => {
    setLoading(true)
    setError(null)
    try {
      const response = await knowledgeBaseService.getAll(params)
      setEntries(response.data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch knowledge base')
    } finally {
      setLoading(false)
    }
  }, [])

  const searchEntries = useCallback(async (query: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await knowledgeBaseService.search(query)
      setEntries(response.data)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Search failed')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { entries, loading, error, fetchEntries, searchEntries }
}
