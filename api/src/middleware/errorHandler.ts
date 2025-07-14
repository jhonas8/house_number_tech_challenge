import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types/snippet';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  // Handle specific error types
  if (err.message === 'Snippet not found') {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Snippet not found',
      statusCode: 404,
      timestamp: new Date().toISOString()
    });
  }

  if (err.message.includes('Failed to generate summary')) {
    return res.status(503).json({
      error: 'Service Unavailable',
      message: 'AI service is currently unavailable',
      statusCode: 503,
      timestamp: new Date().toISOString()
    });
  }

  // Handle MongoDB errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      statusCode: 400,
      timestamp: new Date().toISOString()
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid ID format',
      statusCode: 400,
      timestamp: new Date().toISOString()
    });
  }

  // Default error
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong',
    statusCode: 500,
    timestamp: new Date().toISOString()
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.path}`,
    statusCode: 404,
    timestamp: new Date().toISOString()
  });
}; 