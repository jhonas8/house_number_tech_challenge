export interface Snippet {
  id: string;
  text: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSnippetRequest {
  text: string;
} 