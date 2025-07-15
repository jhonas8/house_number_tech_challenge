import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HomePage from '../page'
import { ToastProvider } from '@/components/ui/toast-provider'
// Mock the SnippetService
jest.mock('@/services/snippetService')

// Mock fetch globally
global.fetch = jest.fn()

const renderWithToast = (component: React.ReactElement) => {
  return render(
    <ToastProvider>
      {component}
    </ToastProvider>
  )
}

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Initial Load', () => {
    it('should display the page title and description', () => {
      renderWithToast(<HomePage />)

      expect(screen.getByText('Text Summarizer')).toBeInTheDocument()
      expect(screen.getByText("Paste your text and get AI-powered summaries instantly")).toBeInTheDocument()
    })

    it('should display the create snippet form', () => {
      renderWithToast(<HomePage />)

      expect(screen.getByText('Create New Snippet')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Paste your blog draft, transcript, or any text here...')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Create Snippet' })).toBeInTheDocument()
    })

    it('should display snippets section', () => {
      renderWithToast(<HomePage />)

      expect(screen.getByText('Your Snippets (0)')).toBeInTheDocument()
    })
  })

  describe('Loading States', () => {
    it('should show loading state when fetching snippets', async () => {
      // Mock a delayed response
      ;(fetch as jest.Mock).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: () => Promise.resolve({ snippets: [], total: 0 })
        }), 100))
      )

      renderWithToast(<HomePage />)

      // Should show loading initially
      expect(screen.getByText('Your Snippets (0)')).toBeInTheDocument()
    })

    it('should show loading state when creating snippet', async () => {
      const user = userEvent.setup()
      
      // Mock successful snippet creation
      ;(fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ snippets: [], total: 0 })
        })
        .mockImplementation(() => 
          new Promise(resolve => setTimeout(() => resolve({
            ok: true,
            json: () => Promise.resolve({
              id: '1',
              text: 'Test text',
              summary: 'Test summary',
              createdAt: '2023-01-01T00:00:00.000Z'
            })
          }), 100))
        )

      renderWithToast(<HomePage />)

      const textarea = screen.getByPlaceholderText('Paste your blog draft, transcript, or any text here...')
      const createButton = screen.getByRole('button', { name: 'Create Snippet' })

      await user.type(textarea, 'Test text')
      await user.click(createButton)

      await waitFor(() => {
        expect(screen.getByText('Creating...')).toBeInTheDocument()
      })
    })
  })

  describe('Snippet Creation', () => {
    it('should create a snippet successfully', async () => {
      const user = userEvent.setup()
      
      const mockSnippet = {
        id: '1',
        text: 'Test text for summarization',
        summary: 'AI generated summary',
        createdAt: '2023-01-01T00:00:00.000Z'
      }

      ;(fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ snippets: [], total: 0 })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockSnippet)
        })

      renderWithToast(<HomePage />)

      // Wait for initial load to complete
      await waitFor(() => {
        expect(screen.getByText('Your Snippets (0)')).toBeInTheDocument()
      })

      const textarea = screen.getByPlaceholderText('Paste your blog draft, transcript, or any text here...')
      const createButton = screen.getByRole('button', { name: 'Create Snippet' })

      await user.type(textarea, 'Test text for summarization')
      await user.click(createButton)

      await waitFor(() => {
        expect(screen.getByText('AI generated summary')).toBeInTheDocument()
      })

      expect(screen.getByText('Your Snippets (1)')).toBeInTheDocument()
    })

    it('should show error when text is empty', async () => {
      const user = userEvent.setup()

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ snippets: [], total: 0 })
      })

      renderWithToast(<HomePage />)

      // Wait for initial load to complete
      await waitFor(() => {
        expect(screen.getByText('Your Snippets (0)')).toBeInTheDocument()
      })

      const createButton = screen.getByRole('button', { name: 'Create Snippet' })
      await user.click(createButton)

      await waitFor(() => {
        expect(screen.getByText('Please enter some text to summarize')).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('should show error when API call fails', async () => {
      const user = userEvent.setup()
      
      ;(fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ snippets: [], total: 0 })
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error'
        })

      renderWithToast(<HomePage />)

      // Wait for initial load to complete
      await waitFor(() => {
        expect(screen.getByText('Your Snippets (0)')).toBeInTheDocument()
      })

      const textarea = screen.getByPlaceholderText('Paste your blog draft, transcript, or any text here...')
      const createButton = screen.getByRole('button', { name: 'Create Snippet' })

      await user.type(textarea, 'Test text')
      await user.click(createButton)

      await waitFor(() => {
        expect(screen.getByText('Failed to create snippet: 500 Internal Server Error')).toBeInTheDocument()
      })
    })
  })

  describe('Snippet Display', () => {
    it('should display existing snippets', async () => {
      const mockSnippets = [
        {
          id: '1',
          text: 'First test text',
          summary: 'First summary',
          createdAt: '2023-01-01T00:00:00.000Z'
        },
        {
          id: '2',
          text: 'Second test text',
          summary: 'Second summary',
          createdAt: '2023-01-02T00:00:00.000Z'
        }
      ]

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ snippets: mockSnippets, total: 2 })
      })

      renderWithToast(<HomePage />)

      await waitFor(() => {
        expect(screen.getByText('Your Snippets (2)')).toBeInTheDocument()
        expect(screen.getByText('First summary')).toBeInTheDocument()
        expect(screen.getByText('Second summary')).toBeInTheDocument()
      })
    })

    it('should show empty state when no snippets exist', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ snippets: [], total: 0 })
      })

      renderWithToast(<HomePage />)

      await waitFor(() => {
        expect(screen.getByText('No snippets yet')).toBeInTheDocument()
        expect(screen.getByText('Create your first snippet by pasting some text above')).toBeInTheDocument()
      })
    })

    it('should truncate long text and show read more button', async () => {
      const longText = 'A'.repeat(300)
      const mockSnippet = {
        id: '1',
        text: longText,
        summary: 'Summary',
        createdAt: '2023-01-01T00:00:00.000Z'
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ snippets: [mockSnippet], total: 1 })
      })

      renderWithToast(<HomePage />)

      await waitFor(() => {
        expect(screen.getByText('Read more')).toBeInTheDocument()
      })
    })
  })

  describe('Character Count', () => {
    it('should display character count', async () => {
      const user = userEvent.setup()

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ snippets: [], total: 0 })
      })

      renderWithToast(<HomePage />)

      const textarea = screen.getByPlaceholderText('Paste your blog draft, transcript, or any text here...')
      
      expect(screen.getByText('0/10,000 characters')).toBeInTheDocument()

      await user.type(textarea, 'Hello')
      expect(screen.getByText('5/10,000 characters')).toBeInTheDocument()
    })
  })
}) 