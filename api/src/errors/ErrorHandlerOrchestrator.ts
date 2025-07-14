import { Request, Response, NextFunction } from 'express';
import { BaseErrorHandler } from './BaseErrorHandler';
import { SnippetNotFoundErrorHandler } from './SnippetNotFoundErrorHandler';
import { AIServiceErrorHandler } from './AIServiceErrorHandler';
import { ValidationErrorHandler } from './ValidationErrorHandler';
import { CastErrorHandler } from './CastErrorHandler';
import { DefaultErrorHandler } from './DefaultErrorHandler';

export class ErrorHandlerOrchestrator {
  private handlers: BaseErrorHandler[];

  constructor() {
    this.handlers = [
      new SnippetNotFoundErrorHandler(),
      new AIServiceErrorHandler(),
      new ValidationErrorHandler(),
      new CastErrorHandler(),
      new DefaultErrorHandler() // Must be last as it handles everything
    ];
  }

  handleError(error: Error, req: Request, res: Response, next: NextFunction): void {
    console.error('Error:', error);

    for (const handler of this.handlers) {
      if (handler.canHandle(error)) {
        handler.handle(error, req, res);
        return;
      }
    }

    // Fallback - should never reach here if DefaultErrorHandler is working
    next(error);
  }

  // Method to add custom handlers (useful for testing or extending)
  addHandler(handler: BaseErrorHandler): void {
    // Insert before the default handler
    this.handlers.splice(-1, 0, handler);
  }
} 