import OpenAI from 'openai';
import { AiCompletion } from './AiCompletion';

export class OpenAiCompletionClient implements AiCompletion {
  private client: OpenAI;
  private smallModel: string;
  // private strongModel: string; // TODO: Implement when needed for different model selection

  constructor(apiKey?: string) {
    this.client = new OpenAI({
      apiKey: apiKey || process.env['OPENAI_API_KEY']
    });
    this.smallModel = process.env['OPENAI_SMALL_MODEL'] || "gpt-3.5-turbo";
    // this.strongModel = process.env['OPENAI_STRONG_MODEL'] || "gpt-4o"; // TODO: Implement when needed
  }

  async generateCompletion(prompt: string): Promise<string> {
    const completion = await this.client.chat.completions.create({
      model: this.smallModel,
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