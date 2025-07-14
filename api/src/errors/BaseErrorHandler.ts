import { Request, Response } from 'express';

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}

export abstract class BaseErrorHandler {
  abstract canHandle(error: Error): boolean;
  abstract handle(error: Error, req: Request, res: Response): void;

  protected createErrorResponse(error: string, message: string, statusCode: number): ErrorResponse {
    return {
      error,
      message,
      statusCode,
      timestamp: new Date().toISOString()
    };
  }
} 