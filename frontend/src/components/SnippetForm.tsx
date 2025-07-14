import React, { useState } from 'react';
import { Snippet, CreateSnippetRequest } from '../types/snippet';
import { snippetService } from '../services/snippetService';

interface SnippetFormProps {
  onSnippetCreated: (snippet: Snippet) => void;
}

const SnippetForm: React.FC<SnippetFormProps> = ({ onSnippetCreated }) => {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Please enter some text');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const request: CreateSnippetRequest = { text };
      const snippet = await snippetService.createSnippet(request);
      onSnippetCreated(snippet);
      setText('');
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
          <label htmlFor="text">Text:</label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading}
            rows={8}
            placeholder="Enter your text here to get an AI-generated summary..."
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