import { Request, Response } from 'express';
import { BaseErrorHandler } from './BaseErrorHandler';

export class DefaultErrorHandler extends BaseErrorHandler {
  canHandle(_error: Error): boolean {
    return true; // Always handles any error
  }

  handle(_error: Error, _req: Request, res: Response): void {
    const response = this.createErrorResponse(
      'Internal Server Error',
      'Something went wrong',
      500
    );
    res.status(500).json(response);
  }
} 