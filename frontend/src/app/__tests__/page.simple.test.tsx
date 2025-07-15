import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HomePage from '../page'

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

describe('HomePage - UI Components and User Interactions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should display the main page header with title and subtitle', async () => {
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

  it('should display the snippet creation form with all required elements', async () => {
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

  it('should display the snippets section header with correct count', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ snippets: [], total: 0 })
    })

    renderWithToast(<HomePage />)

    await waitFor(() => {
      expect(screen.getByText('Your Snippets (0)')).toBeInTheDocument()
    })
  })

  it('should show empty state message when no snippets exist', async () => {
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

  it('should display and update character count as user types in textarea', async () => {
    const user = userEvent.setup()

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ snippets: [], total: 0 })
    })

    renderWithToast(<HomePage />)

    await waitFor(() => {
      expect(screen.getByText('0/10,000 characters')).toBeInTheDocument()
    })

    const textarea = screen.getByPlaceholderText('Paste your blog draft, transcript, or any text here...')
    
    await user.type(textarea, 'Hello')
    expect(screen.getByText('5/10,000 characters')).toBeInTheDocument()
  })
}) 