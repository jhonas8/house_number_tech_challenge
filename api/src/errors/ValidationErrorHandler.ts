import { Request, Response } from 'express';
import { BaseErrorHandler } from './BaseErrorHandler';

export class ValidationErrorHandler extends BaseErrorHandler {
  canHandle(error: Error): boolean {
    return error.name === 'ValidationError';
  }

  handle(error: Error, req: Request, res: Response): void {
    const response = this.createErrorResponse(
      'Validation Error',
      error.message,
      400
    );
    res.status(400).json(response);
  }
} 