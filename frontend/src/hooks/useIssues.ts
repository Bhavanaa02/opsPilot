import { useState, useCallback } from 'react'
import { issueService, Issue } from '../services/issueService'

export const useIssues = () => {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchIssues = useCallback(async (params?: any) => {
    setLoading(true)
    setError(null)
    try {
      const response = await issueService.getAll(params)
      setIssues(response.data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch issues')
    } finally {
      setLoading(false)
    }
  }, [])

  const createIssue = useCallback(async (data: any) => {
    setLoading(true)
    setError(null)
    try {
      const response = await issueService.create(data)
      setIssues((prev) => [response.data, ...prev])
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create issue')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { issues, loading, error, fetchIssues, createIssue }
}
