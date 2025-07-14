import { Request, Response } from 'express';
import { BaseErrorHandler } from './BaseErrorHandler';

export class CastErrorHandler extends BaseErrorHandler {
  canHandle(error: Error): boolean {
    return error.name === 'CastError';
  }

  handle(error: Error, req: Request, res: Response): void {
    const response = this.createErrorResponse(
      'Bad Request',
      'Invalid ID format',
      400
    );
    res.status(400).json(response);
  }
} 