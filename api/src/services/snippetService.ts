import { Snippet } from '../models/Snippet';
import { AIService } from './aiService';
import { CreateSnippetRequest, CreateSnippetResponse, GetSnippetResponse, ListSnippetsResponse } from '../types/snippet';

export class SnippetService {
  private aiService: AIService;

  constructor(aiService?: AIService) {
    this.aiService = aiService || new AIService();
  }

  async createSnippet(data: CreateSnippetRequest): Promise<CreateSnippetResponse> {
    try {
      // Generate AI summary
      const summary = await this.aiService.generateSummary(data.text);
      
      // Create snippet in database
      const snippet = new Snippet({
        text: data.text,
        summary
      });
      
      const savedSnippet = await snippet.save();
      
      return {
        id: savedSnippet.id,
        text: savedSnippet.text,
        summary: savedSnippet.summary,
        createdAt: savedSnippet.createdAt.toISOString()
      };
    } catch (error) {
      console.error('Error creating snippet:', error);
      throw error;
    }
  }

  async getSnippetById(id: string): Promise<GetSnippetResponse> {
    const snippet = await Snippet.findById(id);
    
    if (!snippet) {
      throw new Error('Snippet not found');
    }
    
    return {
      id: snippet.id,
      text: snippet.text,
      summary: snippet.summary,
      createdAt: snippet.createdAt.toISOString()
    };
  }

  async getAllSnippets(): Promise<ListSnippetsResponse> {
    const snippets = await Snippet.find().sort({ createdAt: -1 });
    const total = await Snippet.countDocuments();
    
    return {
      snippets: snippets.map(snippet => ({
        id: snippet.id,
        text: snippet.text,
        summary: snippet.summary,
        createdAt: snippet.createdAt.toISOString()
      })),
      total
    };
  }
} 