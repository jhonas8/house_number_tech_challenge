import { SnippetService } from '../snippetService'
import { Snippet, CreateSnippetRequest } from '@/types/snippet'

// Mock fetch globally
global.fetch = jest.fn()

describe('SnippetService', () => {
  let snippetService: SnippetService
  const mockApiUrl = 'http://localhost:3000'

  beforeEach(() => {
    snippetService = new SnippetService(mockApiUrl)
    jest.clearAllMocks()
  })

  describe('getAllSnippets', () => {
    it('should fetch all snippets successfully', async () => {
      const mockSnippets: Snippet[] = [
        {
          id: '1',
          text: 'Test text 1',
          summary: 'Test summary 1',
          createdAt: '2023-01-01T00:00:00.000Z'
        },
        {
          id: '2',
          text: 'Test text 2',
          summary: 'Test summary 2',
          createdAt: '2023-01-02T00:00:00.000Z'
        }
      ]

      const mockResponse = {
        snippets: mockSnippets,
        total: 2
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const result = await snippetService.getAllSnippets()

      expect(fetch).toHaveBeenCalledWith(`${mockApiUrl}/snippets`)
      expect(result).toEqual(mockResponse)
    })

    it('should throw error when API call fails', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      })

      await expect(snippetService.getAllSnippets()).rejects.toThrow(
        'Failed to fetch snippets: 500 Internal Server Error'
      )
    })

    it('should throw error when network error occurs', async () => {
      const networkError = new Error('Network error')
      ;(fetch as jest.Mock).mockRejectedValueOnce(networkError)

      await expect(snippetService.getAllSnippets()).rejects.toThrow('Network error')
    })
  })

  describe('getSnippetById', () => {
    it('should fetch a snippet by ID successfully', async () => {
      const mockSnippet: Snippet = {
        id: '1',
        text: 'Test text',
        summary: 'Test summary',
        createdAt: '2023-01-01T00:00:00.000Z'
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSnippet
      })

      const result = await snippetService.getSnippetById('1')

      expect(fetch).toHaveBeenCalledWith(`${mockApiUrl}/snippets/1`)
      expect(result).toEqual(mockSnippet)
    })

    it('should throw error when snippet not found', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      })

      await expect(snippetService.getSnippetById('999')).rejects.toThrow(
        'Failed to fetch snippet: 404 Not Found'
      )
    })
  })

  describe('createSnippet', () => {
    it('should create a snippet successfully', async () => {
      const createRequest: CreateSnippetRequest = {
        text: 'New test text'
      }

      const mockResponse: Snippet = {
        id: '3',
        text: 'New test text',
        summary: 'AI generated summary',
        createdAt: '2023-01-03T00:00:00.000Z'
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const result = await snippetService.createSnippet(createRequest)

      expect(fetch).toHaveBeenCalledWith(`${mockApiUrl}/snippets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(createRequest)
      })
      expect(result).toEqual(mockResponse)
    })

    it('should throw error when creation fails', async () => {
      const createRequest: CreateSnippetRequest = {
        text: ''
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ error: 'Text cannot be empty' })
      })

      await expect(snippetService.createSnippet(createRequest)).rejects.toThrow(
        'Failed to create snippet: 400 Bad Request'
      )
    })
  })
}) 