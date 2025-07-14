import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../HomePage';
import { Snippet } from '../../types/snippet';

// Mock the child components
jest.mock('../../components/SnippetForm', () => {
  return function MockSnippetForm({ onSnippetCreated }: { onSnippetCreated: (snippet: Snippet) => void }) {
    return (
      <div data-testid="snippet-form">
        <button onClick={() => onSnippetCreated({
          id: '1',
          text: 'Test Snippet Text',
          summary: 'Test Summary',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z'
        })}>
          Create Test Snippet
        </button>
      </div>
    );
  };
});

jest.mock('../../components/SnippetList', () => {
  return function MockSnippetList({ snippets }: { snippets: Snippet[] }) {
    return (
      <div data-testid="snippet-list">
        {snippets.map(snippet => (
          <div key={snippet.id} data-testid={`snippet-${snippet.id}`}>
            {snippet.text}
          </div>
        ))}
      </div>
    );
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('HomePage', () => {
  it('should render the page header', () => {
    renderWithRouter(<HomePage />);
    
    expect(screen.getByText(/snippet summarizer/i)).toBeInTheDocument();
    expect(screen.getByText(/ai-powered text summarization service/i)).toBeInTheDocument();
  });

  it('should render SnippetForm component', () => {
    renderWithRouter(<HomePage />);
    
    expect(screen.getByTestId('snippet-form')).toBeInTheDocument();
  });

  it('should render SnippetList component', () => {
    renderWithRouter(<HomePage />);
    
    expect(screen.getByTestId('snippet-list')).toBeInTheDocument();
  });

  it('should start with empty snippets list', () => {
    renderWithRouter(<HomePage />);
    
    const snippetList = screen.getByTestId('snippet-list');
    expect(snippetList.children).toHaveLength(0);
  });

  it('should add new snippet to list when created', () => {
    renderWithRouter(<HomePage />);
    
    const createButton = screen.getByText(/create test snippet/i);
    createButton.click();
    
    expect(screen.getByTestId('snippet-1')).toBeInTheDocument();
    expect(screen.getByText('Test Snippet Text')).toBeInTheDocument();
  });

  it('should add multiple snippets to list', () => {
    renderWithRouter(<HomePage />);
    
    const createButton = screen.getByText(/create test snippet/i);
    
    // Create first snippet
    createButton.click();
    expect(screen.getByTestId('snippet-1')).toBeInTheDocument();
    
    // Create second snippet (mock will create same snippet, but in real app it would be different)
    createButton.click();
    expect(screen.getAllByTestId(/snippet-/)).toHaveLength(2);
  });
}); 