import { Snippet, CreateSnippetRequest, ListSnippetsResponse } from '@/types/snippet'

export class SnippetService {
  private apiUrl: string

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl
  }

  async getAllSnippets(): Promise<ListSnippetsResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/snippets`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch snippets: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to fetch snippets')
    }
  }

  async getSnippetById(id: string): Promise<Snippet> {
    try {
      const response = await fetch(`${this.apiUrl}/snippets/${id}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch snippet: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to fetch snippet')
    }
  }

  async createSnippet(request: CreateSnippetRequest): Promise<Snippet> {
    try {
      const response = await fetch(`${this.apiUrl}/snippets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      })
      
      if (!response.ok) {
        throw new Error(`Failed to create snippet: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to create snippet')
    }
  }
} 