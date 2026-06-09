import api from './api'

export interface Issue {
  id: number
  title: string
  description?: string
  category: string
  status: string
  created_at: string
  updated_at: string
}

export interface DiagnosticResult {
  issue_id: number
  possible_causes: string[]
  troubleshooting_steps: string[]
  recommended_commands: string[]
  next_steps: string
}

export interface KnowledgeBaseEntry {
  id: number
  title: string
  category: string
  problem_description: string
  root_cause?: string
  resolution_steps?: string
  recommended_commands?: string
  references?: string
  created_at: string
  updated_at: string
}

// Issue API
export const issueService = {
  create: (data: { title: string; description?: string; category: string }) =>
    api.post<Issue>('/api/issues/', data),
  getAll: (params?: { skip?: number; limit?: number; status?: string; category?: string }) =>
    api.get<Issue[]>('/api/issues/', { params }),
  getById: (id: number) => api.get<Issue>(`/api/issues/${id}`),
  update: (id: number, data: Partial<Issue>) => api.put<Issue>(`/api/issues/${id}`, data),
  delete: (id: number) => api.delete(`/api/issues/${id}`),
}

// Diagnostic API
export const diagnosticService = {
  analyze: (data: { issue_id: number; description: string }) =>
    api.post<DiagnosticResult>('/api/diagnostics/analyze', data),
  getSolution: (issueId: number) => api.get(`/api/diagnostics/${issueId}/solution`),
}

// Knowledge Base API
export const knowledgeBaseService = {
  create: (data: Partial<KnowledgeBaseEntry>) =>
    api.post<KnowledgeBaseEntry>('/api/knowledge-base/', data),
  getAll: (params?: { skip?: number; limit?: number; category?: string }) =>
    api.get<KnowledgeBaseEntry[]>('/api/knowledge-base/', { params }),
  getById: (id: number) => api.get<KnowledgeBaseEntry>(`/api/knowledge-base/${id}`),
  search: (query: string) => api.get<KnowledgeBaseEntry[]>('/api/knowledge-base/search', { params: { query } }),
  update: (id: number, data: Partial<KnowledgeBaseEntry>) =>
    api.put<KnowledgeBaseEntry>(`/api/knowledge-base/${id}`, data),
  delete: (id: number) => api.delete(`/api/knowledge-base/${id}`),
}
