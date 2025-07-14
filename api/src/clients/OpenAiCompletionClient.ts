import OpenAI from 'openai';
import { AiCompletion } from './AiCompletion';

export class OpenAiCompletionClient implements AiCompletion {
  private client: OpenAI;

  constructor(apiKey?: string) {
    this.client = new OpenAI({
      apiKey: apiKey || process.env['OPENAI_API_KEY']
    });
  }

  async generateCompletion(prompt: string): Promise<string> {
    const completion = await this.client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that creates concise summaries. Always respond with summaries of 30 words or less."
        },
        {
          role: "user",
          content: prompt
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
  }
} 