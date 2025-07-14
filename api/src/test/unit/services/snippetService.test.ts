import { SnippetService } from '../../../services/snippetService';
import { Snippet } from '../../../models/Snippet';
import { CreateSnippetRequest } from '../../../types/snippet';
import { AiCompletion } from '../../../clients/AiCompletion';

// Mock the Snippet model
jest.mock('../../../models/Snippet');

const mockSnippet = {
  id: '507f1f77bcf86cd799439011',
  text: 'Test text',
  summary: 'Test summary',
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  save: jest.fn()
};

const mockSnippetModel = Snippet as any;

describe('SnippetService', () => {
  let mockAiCompletion: jest.Mocked<AiCompletion>;
  let snippetService: SnippetService;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockAiCompletion = {
      generateCompletion: jest.fn()
    } as any;

    snippetService = new SnippetService(mockAiCompletion);
  });

  describe('createSnippet', () => {
    it('should create a snippet with AI-generated summary', async () => {
      const snippetData: CreateSnippetRequest = {
        text: 'This is a test snippet that needs summarization.'
      };
      
      const aiSummary = 'Test snippet summary';
      const savedSnippet = { ...mockSnippet, save: jest.fn().mockResolvedValue(mockSnippet) };
      
      (mockAiCompletion.generateCompletion as jest.Mock).mockResolvedValue(aiSummary);
      mockSnippetModel.mockImplementation(() => savedSnippet as any);

      const result = await snippetService.createSnippet(snippetData);

      expect(mockAiCompletion.generateCompletion).toHaveBeenCalledWith(
        'Summarize the following text in 30 words or less: This is a test snippet that needs summarization.'
      );
      expect(mockSnippetModel).toHaveBeenCalledWith({
        text: snippetData.text,
        summary: aiSummary
      });
      expect(savedSnippet.save).toHaveBeenCalled();
      expect(result).toEqual({
        id: mockSnippet.id,
        text: mockSnippet.text,
        summary: mockSnippet.summary,
        createdAt: mockSnippet.createdAt.toISOString()
      });
    });

    it('should throw error if AI service fails', async () => {
      const snippetData: CreateSnippetRequest = {
        text: 'Test text'
      };

      (mockAiCompletion.generateCompletion as jest.Mock).mockRejectedValue(new Error('AI service error'));

      await expect(snippetService.createSnippet(snippetData)).rejects.toThrow('AI service error');
    });

    it('should throw error if database save fails', async () => {
      const snippetData: CreateSnippetRequest = {
        text: 'Test text'
      };
      
      const savedSnippet = { ...mockSnippet, save: jest.fn().mockRejectedValue(new Error('DB error')) };
      
      (mockAiCompletion.generateCompletion as jest.Mock).mockResolvedValue('Summary');
      mockSnippetModel.mockImplementation(() => savedSnippet as any);

      await expect(snippetService.createSnippet(snippetData)).rejects.toThrow('DB error');
    });
  });

  describe('getSnippetById', () => {
    it('should return snippet when found', async () => {
      const snippetId = '507f1f77bcf86cd799439011';
      
      mockSnippetModel.findById.mockResolvedValue(mockSnippet as any);

      const result = await snippetService.getSnippetById(snippetId);

      expect(mockSnippetModel.findById).toHaveBeenCalledWith(snippetId);
      expect(result).toEqual({
        id: mockSnippet.id,
        text: mockSnippet.text,
        summary: mockSnippet.summary,
        createdAt: mockSnippet.createdAt.toISOString()
      });
    });

    it('should throw error when snippet not found', async () => {
      const snippetId = '507f1f77bcf86cd799439011';
      
      mockSnippetModel.findById.mockResolvedValue(null);

      await expect(snippetService.getSnippetById(snippetId)).rejects.toThrow('Snippet not found');
    });
  });

  describe('getAllSnippets', () => {
    it('should return all snippets with total count', async () => {
      const snippets = [
        { ...mockSnippet, id: '1' },
        { ...mockSnippet, id: '2' }
      ];
      
      mockSnippetModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue(snippets)
      } as any);
      mockSnippetModel.countDocuments.mockResolvedValue(2);

      const result = await snippetService.getAllSnippets();

      expect(mockSnippetModel.find).toHaveBeenCalled();
      expect(mockSnippetModel.countDocuments).toHaveBeenCalled();
      expect(result).toEqual({
        snippets: snippets.map(snippet => ({
          id: snippet.id,
          text: snippet.text,
          summary: snippet.summary,
          createdAt: snippet.createdAt.toISOString()
        })),
        total: 2
      });
    });

    it('should return empty array when no snippets exist', async () => {
      mockSnippetModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue([])
      } as any);
      mockSnippetModel.countDocuments.mockResolvedValue(0);

      const result = await snippetService.getAllSnippets();

      expect(result).toEqual({
        snippets: [],
        total: 0
      });
    });
  });
}); 