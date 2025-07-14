import { Request, Response } from 'express';
import { BaseErrorHandler } from './BaseErrorHandler';

export class SnippetNotFoundErrorHandler extends BaseErrorHandler {
  canHandle(error: Error): boolean {
    return error.message === 'Snippet not found';
  }

  handle(_error: Error, _req: Request, res: Response): void {
    const response = this.createErrorResponse(
      'Not Found',
      'Snippet not found',
      404
    );
    res.status(404).json(response);
  }
} 