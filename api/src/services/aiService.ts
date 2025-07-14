import OpenAI from 'openai';

export interface IAIClient {
  chat: {
    completions: {
      create: (params: any) => Promise<any>;
    };
  };
}

export class AIService {
  private client: IAIClient;

  constructor(client?: IAIClient) {
    this.client = client || new OpenAI({
      apiKey: process.env['OPENAI_API_KEY']
    });
  }

  async generateSummary(text: string): Promise<string> {
    try {
      const completion = await this.client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that creates concise summaries. Always respond with summaries of 30 words or less."
          },
          {
            role: "user",
            content: `Summarize the following text in 30 words or less: ${text}`
          }
        ],
        max_tokens: 100,
        temperature: 0.3
      });

      const summary = completion.choices[0]?.message?.content?.trim();
      
      if (!summary) {
        throw new Error('Failed to generate summary');
      }

      return summary;
    } catch (error) {
      console.error('AI service error:', error);
      throw new Error('Failed to generate summary from AI service');
    }
  }
} 