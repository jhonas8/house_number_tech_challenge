import { AIService } from '../../../services/aiService';

jest.mock('openai', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn()
        }
      }
    }))
  };
});

const mockOpenAI = require('openai').default;

const mockCompletion = (summary: string) => ({
  choices: [
    { message: { content: summary } }
  ]
});

describe('AIService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateSummary', () => {
    it('should call OpenAI with the correct prompt and return the summary', async () => {
      const summary = 'This is a concise summary.';
      const createMock = jest.fn().mockResolvedValueOnce(mockCompletion(summary));
      mockOpenAI.mockImplementation(() => ({
        chat: { completions: { create: createMock } }
      }));

      const result = await AIService.generateSummary('Some long text to summarize.');
      expect(result).toBe(summary);
      expect(createMock).toHaveBeenCalledWith(expect.objectContaining({
        model: expect.any(String),
        messages: expect.any(Array),
        max_tokens: expect.any(Number),
        temperature: expect.any(Number)
      }));
    });

    it('should throw an error if OpenAI returns no summary', async () => {
      const createMock = jest.fn().mockResolvedValueOnce({ choices: [{}] });
      mockOpenAI.mockImplementation(() => ({
        chat: { completions: { create: createMock } }
      }));

      await expect(AIService.generateSummary('text')).rejects.toThrow('Failed to generate summary');
    });

    it('should throw an error if OpenAI throws', async () => {
      const createMock = jest.fn().mockRejectedValueOnce(new Error('API error'));
      mockOpenAI.mockImplementation(() => ({
        chat: { completions: { create: createMock } }
      }));

      await expect(AIService.generateSummary('text')).rejects.toThrow('Failed to generate summary from AI service');
    });
  });
}); 