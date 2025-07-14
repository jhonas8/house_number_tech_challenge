import { Request, Response, NextFunction } from 'express';
import { SnippetService } from '../services/snippetService';
import { CreateSnippetRequest } from '../types/snippet';

export class SnippetController {
  static async createSnippet(req: Request, res: Response, next: NextFunction) {
    try {
      const snippetData: CreateSnippetRequest = req.body;
      const snippet = await SnippetService.createSnippet(snippetData);
      
      res.status(201)
        .header('Location', `/snippets/${snippet.id}`)
        .json(snippet);
    } catch (error) {
      next(error);
    }
  }

  static async getSnippetById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Snippet ID is required',
          statusCode: 400,
          timestamp: new Date().toISOString()
        });
      }
      const snippet = await SnippetService.getSnippetById(id);
      
      return res.json(snippet);
    } catch (error) {
      return next(error);
    }
  }

  static async getAllSnippets(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await SnippetService.getAllSnippets();
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  }
} 