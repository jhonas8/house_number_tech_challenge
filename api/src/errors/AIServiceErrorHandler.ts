import { Request, Response } from 'express';
import { BaseErrorHandler } from './BaseErrorHandler';

export class AIServiceErrorHandler extends BaseErrorHandler {
  canHandle(error: Error): boolean {
    return error.message.includes('Failed to generate summary');
  }

  handle(_error: Error, _req: Request, res: Response): void {
    const response = this.createErrorResponse(
      'Service Unavailable',
      'AI service is currently unavailable',
      503
    );
    res.status(503).json(response);
  }
} 