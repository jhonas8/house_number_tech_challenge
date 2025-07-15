import { Request, Response, NextFunction } from 'express';
import { ErrorHandlerOrchestrator } from '../errors/ErrorHandlerOrchestrator';

const errorOrchestrator = new ErrorHandlerOrchestrator();

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  // Handle JSON parsing errors
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid JSON format',
      statusCode: 400,
      timestamp: new Date().toISOString()
    });
    return;
  }
  
  errorOrchestrator.handleError(err, req, res, next);
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.path}`,
    statusCode: 404,
    timestamp: new Date().toISOString()
  });
}; 