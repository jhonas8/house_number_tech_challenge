import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SnippetForm from '../SnippetForm';
import { snippetService } from '../../services/snippetService';

// Mock the snippet service
jest.mock('../../services/snippetService');
const mockSnippetService = snippetService as jest.Mocked<typeof snippetService>;

describe('SnippetForm', () => {
  const mockOnSnippetCreated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form with title and content inputs', () => {
    render(<SnippetForm onSnippetCreated={mockOnSnippetCreated} />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create snippet/i })).toBeInTheDocument();
  });

  it('should show error when form is submitted with empty fields', async () => {
    const user = userEvent.setup();
    render(<SnippetForm onSnippetCreated={mockOnSnippetCreated} />);
    
    const submitButton = screen.getByRole('button', { name: /create snippet/i });
    await user.click(submitButton);
    
    expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
    expect(mockOnSnippetCreated).not.toHaveBeenCalled();
  });

  it('should call snippetService.createSnippet when form is submitted with valid data', async () => {
    const user = userEvent.setup();
    const mockSnippet = {
      id: '1',
      title: 'Test Title',
      content: 'Test Content',
      summary: 'Test Summary',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    };
    
    mockSnippetService.createSnippet.mockResolvedValue(mockSnippet);
    
    render(<SnippetForm onSnippetCreated={mockOnSnippetCreated} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const contentInput = screen.getByLabelText(/content/i);
    const submitButton = screen.getByRole('button', { name: /create snippet/i });
    
    await user.type(titleInput, 'Test Title');
    await user.type(contentInput, 'Test Content');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockSnippetService.createSnippet).toHaveBeenCalledWith({
        title: 'Test Title',
        content: 'Test Content'
      });
      expect(mockOnSnippetCreated).toHaveBeenCalledWith(mockSnippet);
    });
  });

  it('should show loading state during form submission', async () => {
    const user = userEvent.setup();
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    
    mockSnippetService.createSnippet.mockReturnValue(promise);
    
    render(<SnippetForm onSnippetCreated={mockOnSnippetCreated} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const contentInput = screen.getByLabelText(/content/i);
    const submitButton = screen.getByRole('button', { name: /create snippet/i });
    
    await user.type(titleInput, 'Test Title');
    await user.type(contentInput, 'Test Content');
    await user.click(submitButton);
    
    expect(screen.getByText(/creating/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
    
    resolvePromise!({
      id: '1',
      title: 'Test Title',
      content: 'Test Content',
      summary: 'Test Summary',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    });
  });

  it('should show error message when API call fails', async () => {
    const user = userEvent.setup();
    mockSnippetService.createSnippet.mockRejectedValue(new Error('API Error'));
    
    render(<SnippetForm onSnippetCreated={mockOnSnippetCreated} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const contentInput = screen.getByLabelText(/content/i);
    const submitButton = screen.getByRole('button', { name: /create snippet/i });
    
    await user.type(titleInput, 'Test Title');
    await user.type(contentInput, 'Test Content');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to create snippet/i)).toBeInTheDocument();
    });
    
    expect(mockOnSnippetCreated).not.toHaveBeenCalled();
  });

  it('should clear form fields after successful submission', async () => {
    const user = userEvent.setup();
    const mockSnippet = {
      id: '1',
      title: 'Test Title',
      content: 'Test Content',
      summary: 'Test Summary',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    };
    
    mockSnippetService.createSnippet.mockResolvedValue(mockSnippet);
    
    render(<SnippetForm onSnippetCreated={mockOnSnippetCreated} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const contentInput = screen.getByLabelText(/content/i);
    const submitButton = screen.getByRole('button', { name: /create snippet/i });
    
    await user.type(titleInput, 'Test Title');
    await user.type(contentInput, 'Test Content');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(titleInput).toHaveValue('');
      expect(contentInput).toHaveValue('');
    });
  });
}); 