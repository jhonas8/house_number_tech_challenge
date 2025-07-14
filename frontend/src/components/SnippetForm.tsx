import React, { useState } from 'react';
import { Snippet, CreateSnippetRequest } from '../types/snippet';
import { snippetService } from '../services/snippetService';

interface SnippetFormProps {
  onSnippetCreated: (snippet: Snippet) => void;
}

const SnippetForm: React.FC<SnippetFormProps> = ({ onSnippetCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const request: CreateSnippetRequest = { title, content };
      const snippet = await snippetService.createSnippet(request);
      onSnippetCreated(snippet);
      setTitle('');
      setContent('');
    } catch (err) {
      setError('Failed to create snippet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="snippet-form">
      <h2>Create New Snippet</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isLoading}
            rows={5}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Snippet'}
        </button>
      </form>
    </div>
  );
};

export default SnippetForm; 