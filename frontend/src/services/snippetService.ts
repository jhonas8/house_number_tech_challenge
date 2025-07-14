import axios from 'axios';
import { Snippet, CreateSnippetRequest } from '../types/snippet';

export const snippetService = {
  async createSnippet(request: CreateSnippetRequest): Promise<Snippet> {
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
    const api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const response = await api.post('/snippets', request);
    return response.data;
  },

  async getSnippet(id: string): Promise<Snippet> {
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
    const api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const response = await api.get(`/snippets/${id}`);
    return response.data;
  },

  async getAllSnippets(): Promise<Snippet[]> {
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
    const api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const response = await api.get('/snippets');
    return response.data;
  },
}; 