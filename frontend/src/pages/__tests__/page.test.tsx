import { render, screen, waitFor } from '@testing-library/react'
import HomePage from '../'

// Mock the SnippetService
jest.mock('@/services/snippetService')

// Mock the toast context
jest.mock('@/components/ui/toast-provider', () => ({
  useToastContext: () => ({
    toast: jest.fn()
  }),
  ToastProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

// Mock fetch globally
global.fetch = jest.fn()

const renderWithToast = (component: React.ReactElement) => {
  return render(component)
}

describe('HomePage - Core Functionality and Layout', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Page Initialization and Loading States', () => {
    it('should render the main page header with correct title and description text', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ snippets: [], total: 0 })
      })

      renderWithToast(<HomePage />)

      await waitFor(() => {
        expect(screen.getByText(/Text Summarizer/)).toBeInTheDocument()
        expect(screen.getByText("Paste your text and get AI-powered summaries instantly")).toBeInTheDocument()
      })
    })

    it('should render the complete snippet creation form with textarea and submit button', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ snippets: [], total: 0 })
      })

      renderWithToast(<HomePage />)

      await waitFor(() => {
        expect(screen.getByText('Create New Snippet')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Paste your blog draft, transcript, or any text here...')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Create Snippet' })).toBeInTheDocument()
      })
    })

    it('should render the snippets list section with correct initial count display', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ snippets: [], total: 0 })
      })

      renderWithToast(<HomePage />)

      await waitFor(() => {
        expect(screen.getByText('Your Snippets (0)')).toBeInTheDocument()
      })
    })
  })
}) 