export interface Snippet {
  id: string
  text: string
  summary: string
  createdAt: string
}

export interface CreateSnippetRequest {
  text: string
}

export interface CreateSnippetResponse {
  id: string
  text: string
  summary: string
  createdAt: string
}

export interface ListSnippetsResponse {
  snippets: Snippet[]
  total: number
}

export interface ApiError {
  error: string
  message: string
  statusCode: number
  timestamp: string
} 