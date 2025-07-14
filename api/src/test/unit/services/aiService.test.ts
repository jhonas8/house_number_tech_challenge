import { AIService } from '../../../aiServices/aiService';
import { AiCompletion } from '../../../clients/AiCompletion';

const mockCompletion = (summary: string) => summary;

describe('AIService', () => {
  let mockClient: AiCompletion;
  let aiService: AIService;

  beforeEach(() => {
    mockClient = {
      generateCompletion: jest.fn()
    };
    aiService = new AIService(mockClient);
  });

  describe('generateSummary', () => {
    it('should call generateCompletion with the correct prompt and return the summary', async () => {
      const summary = 'This is a concise summary.';
      (mockClient.generateCompletion as jest.Mock).mockResolvedValueOnce(summary);

      const result = await aiService.generateSummary('Some long text to summarize.');
      
      expect(result).toBe(summary);
      expect(mockClient.generateCompletion).toHaveBeenCalledWith(
        'Summarize the following text in 30 words or less: Some long text to summarize.'
      );
    });

    it('should throw an error if generateCompletion throws', async () => {
      (mockClient.generateCompletion as jest.Mock).mockRejectedValueOnce(new Error('API error'));

      await expect(aiService.generateSummary('text')).rejects.toThrow('Failed to generate summary from AI service');
    });
  });
}); 