import React from 'react';
import { render, screen } from '@testing-library/react';
import SnippetList from '../SnippetList';
import { Snippet } from '../../types/snippet';

describe('SnippetList', () => {
  const mockSnippets: Snippet[] = [
    {
      id: '1',
      title: 'First Snippet',
      content: 'This is the first snippet content',
      summary: 'First snippet summary',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    },
    {
      id: '2',
      title: 'Second Snippet',
      content: 'This is the second snippet content',
      summary: 'Second snippet summary',
      createdAt: '2023-01-02T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z'
    }
  ];

  it('should render empty state when no snippets are provided', () => {
    render(<SnippetList snippets={[]} />);
    
    expect(screen.getByText(/snippets/i)).toBeInTheDocument();
    expect(screen.getByText(/no snippets created yet/i)).toBeInTheDocument();
  });

  it('should render snippet count in header', () => {
    render(<SnippetList snippets={mockSnippets} />);
    
    expect(screen.getByText(/snippets \(2\)/i)).toBeInTheDocument();
  });

  it('should render all snippets with their details', () => {
    render(<SnippetList snippets={mockSnippets} />);
    
    // Check first snippet
    expect(screen.getByText('First Snippet')).toBeInTheDocument();
    expect(screen.getByText(/this is the first snippet content/i)).toBeInTheDocument();
    expect(screen.getByText(/first snippet summary/i)).toBeInTheDocument();
    
    // Check second snippet
    expect(screen.getByText('Second Snippet')).toBeInTheDocument();
    expect(screen.getByText(/this is the second snippet content/i)).toBeInTheDocument();
    expect(screen.getByText(/second snippet summary/i)).toBeInTheDocument();
  });

  it('should display creation date for each snippet', () => {
    render(<SnippetList snippets={mockSnippets} />);
    
    // Check that dates are displayed (formatted by toLocaleString)
    expect(screen.getByText(/created:/i)).toBeInTheDocument();
  });

  it('should render snippets in the order provided', () => {
    render(<SnippetList snippets={mockSnippets} />);
    
    const snippetItems = screen.getAllByText(/snippet/i);
    expect(snippetItems[0]).toHaveTextContent('First Snippet');
    expect(snippetItems[1]).toHaveTextContent('Second Snippet');
  });
}); 