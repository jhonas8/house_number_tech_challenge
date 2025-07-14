import React from 'react';
import { Snippet } from '../types/snippet';

interface SnippetListProps {
  snippets: Snippet[];
}

const SnippetList: React.FC<SnippetListProps> = ({ snippets }) => {
  if (snippets.length === 0) {
    return (
      <div className="snippet-list">
        <h2>Snippets</h2>
        <p>No snippets created yet. Create your first snippet above!</p>
      </div>
    );
  }

  return (
    <div className="snippet-list">
      <h2>Snippets ({snippets.length})</h2>
      {snippets.map((snippet) => (
        <div key={snippet.id} className="snippet-item">
          <p><strong>Text:</strong> {snippet.text}</p>
          <p><strong>Summary:</strong> {snippet.summary}</p>
          <small>Created: {new Date(snippet.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
};

export default SnippetList; 