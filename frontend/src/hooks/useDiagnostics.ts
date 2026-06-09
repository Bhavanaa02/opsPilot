import { useState, useCallback } from 'react'
import { diagnosticService, DiagnosticResult } from '../services/issueService'

export const useDiagnostics = () => {
  const [diagnosis, setDiagnosis] = useState<DiagnosticResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeProblem = useCallback(async (issueId: number, description: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await diagnosticService.analyze({
        issue_id: issueId,
        description,
      })
      setDiagnosis(response.data)
      return response.data
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'Failed to analyze problem'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { diagnosis, loading, error, analyzeProblem }
}
