import { AIService, IAIClient } from '../../../services/aiService';

const mockCompletion = (summary: string) => ({
  choices: [
    { message: { content: summary } }
  ]
});

describe('AIService', () => {
  let mockClient: IAIClient;
  let aiService: AIService;

  beforeEach(() => {
    const createMock = jest.fn();
    mockClient = {
      chat: {
        completions: {
          create: createMock
        }
      }
    };
    aiService = new AIService(mockClient);
  });

  describe('generateSummary', () => {
    it('should call OpenAI with the correct prompt and return the summary', async () => {
      const summary = 'This is a concise summary.';
      (mockClient.chat.completions.create as jest.Mock).mockResolvedValueOnce(mockCompletion(summary));

      const result = await aiService.generateSummary('Some long text to summarize.');
      
      expect(result).toBe(summary);
      expect(mockClient.chat.completions.create).toHaveBeenCalledWith({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that creates concise summaries. Always respond with summaries of 30 words or less."
          },
          {
            role: "user",
            content: "Summarize the following text in 30 words or less: Some long text to summarize."
          }
        ],
        max_tokens: 100,
        temperature: 0.3
      });
    });

    it('should throw an error if OpenAI returns no summary', async () => {
      (mockClient.chat.completions.create as jest.Mock).mockResolvedValueOnce({ choices: [{}] });

      await expect(aiService.generateSummary('text')).rejects.toThrow('Failed to generate summary');
    });

    it('should throw an error if OpenAI throws', async () => {
      (mockClient.chat.completions.create as jest.Mock).mockRejectedValueOnce(new Error('API error'));

      await expect(aiService.generateSummary('text')).rejects.toThrow('Failed to generate summary from AI service');
    });
  });
}); 