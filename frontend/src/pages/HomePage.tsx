import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Loader2, Plus, FileText, Clock } from 'lucide-react';
import { Snippet } from '../types/snippet';
import { snippetService } from '../services/snippetService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const HomePage: React.FC = () => {
  const [text, setText] = useState('');
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSnippets();
  }, []);

  const fetchSnippets = async () => {
    try {
      const data = await snippetService.getAllSnippets();
      setSnippets(data);
    } catch (error) {
      console.error('Failed to load snippets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createSnippet = async () => {
    if (!text.trim()) {
      alert('Please enter some text to summarize');
      return;
    }

    setIsCreating(true);
    try {
      const newSnippet = await snippetService.createSnippet({ text: text.trim() });
      setSnippets(prev => [newSnippet, ...prev]);
      setText('');
      alert('Snippet created and summarized!');
    } catch (error) {
      console.error('Failed to create snippet:', error);
      alert('Failed to create snippet');
    } finally {
      setIsCreating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateText = (text: string, maxLength = 200) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Snippet Summarizer</h1>
          <p className="text-lg text-gray-600">AI-powered text summarization service</p>
        </div>

        {/* Input Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Snippet
            </CardTitle>
            <CardDescription>
              Enter your text below and let AI create a summary for you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[120px]"
            />
            <Button 
              onClick={createSnippet} 
              disabled={isCreating || !text.trim()}
              className="w-full sm:w-auto"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Snippet
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Snippets List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Snippets</h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : snippets.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No snippets yet. Create your first one above!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {snippets.map((snippet) => (
                <Card key={snippet.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                          {truncateText(snippet.text, 100)}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          {formatDate(snippet.createdAt)}
                        </div>
                      </div>
                      <Badge variant="secondary">AI Generated</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Original Text:</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {truncateText(snippet.text, 300)}
                        </p>
                      </div>
                      {snippet.summary && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Summary:</h4>
                          <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-md">
                            {snippet.summary}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage; 