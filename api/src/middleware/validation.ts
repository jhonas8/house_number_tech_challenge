import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { createSnippetSchema, snippetIdSchema } from '../types/snippet';

export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Parse and transform the data
      const parsedData = schema.parse(req.body);
      // Update the request body with the transformed data
      req.body = parsedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors.map(err => err.message).join(', ');
        res.status(400).json({
          error: 'Validation Error',
          message,
          statusCode: 400,
          timestamp: new Date().toISOString()
        });
        return;
      }
      next(error);
    }
  };
};

export const validateParams = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors.map(err => err.message).join(', ');
        res.status(400).json({
          error: 'Validation Error',
          message,
          statusCode: 400,
          timestamp: new Date().toISOString()
        });
        return;
      }
      next(error);
    }
  };
};

export const validateCreateSnippet = validateRequest(createSnippetSchema);
export const validateSnippetId = validateParams(snippetIdSchema); 