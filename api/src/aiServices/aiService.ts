import { AiCompletion } from '../clients/AiCompletion';

export class AIService {
  private aiClient: AiCompletion;

  constructor(aiClient: AiCompletion) {
    this.aiClient = aiClient;
  }

  async generateSummary(text: string): Promise<string> {
    try {
      const prompt = `Summarize the following text in 30 words or less: ${text}`;
      return await this.aiClient.generateCompletion(prompt);
    } catch (error) {
      console.error('AI service error:', error);
      throw new Error('Failed to generate summary from AI service');
    }
  }
} 