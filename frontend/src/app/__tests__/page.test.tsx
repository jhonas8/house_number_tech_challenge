import { render, screen } from '@testing-library/react'
import HomePage from '../page'

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

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Initial Load', () => {
    it('should display the page title and description', () => {
      renderWithToast(<HomePage />)

      expect(screen.getByText(/Text Summarizer/)).toBeInTheDocument()
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
}) 