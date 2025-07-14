import React, { useState } from 'react';
import SnippetForm from '../components/SnippetForm';
import SnippetList from '../components/SnippetList';
import { Snippet } from '../types/snippet';

const HomePage: React.FC = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);

  const handleSnippetCreated = (newSnippet: Snippet) => {
    setSnippets(prev => [newSnippet, ...prev]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Snippet Summarizer</h1>
        <p>AI-powered text summarization service</p>
      </header>
      <main className="App-content">
        <SnippetForm onSnippetCreated={handleSnippetCreated} />
        <SnippetList snippets={snippets} />
      </main>
    </div>
  );
};

export default HomePage; 