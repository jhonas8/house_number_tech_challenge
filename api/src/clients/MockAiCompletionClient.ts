import { AiCompletion } from './AiCompletion';

export class MockAiCompletionClient implements AiCompletion {
  async generateCompletion(prompt: string): Promise<string> {
    // Simulate minimal AI processing delay for tests
    await new Promise(resolve => setTimeout(resolve, 1));
    
    // Return a mock summary based on the input
    const words = prompt.split(' ').slice(-5); // Take last 5 words as "summary"
    return `Mock summary: ${words.join(' ')}`;
  }
} 