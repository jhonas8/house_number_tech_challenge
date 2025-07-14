export interface AiCompletion {
  generateCompletion(prompt: string): Promise<string>;
} 