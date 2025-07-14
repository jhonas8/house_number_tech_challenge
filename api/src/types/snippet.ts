import { z } from 'zod';

// Zod schemas for validation
export const createSnippetSchema = z.object({
  text: z.string()
    .min(1, 'Text cannot be empty')
    .max(10000, 'Text cannot exceed 10,000 characters')
    .trim()
});

export const snippetIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid snippet ID format')
});

// TypeScript interfaces derived from Zod schemas
export type CreateSnippetRequest = z.infer<typeof createSnippetSchema>;
export type SnippetIdParams = z.infer<typeof snippetIdSchema>;

// Database model interface
export interface ISnippet {
  _id: string;
  text: string;
  summary: string;
  createdAt: Date;
  updatedAt: Date;
}

// API response interfaces
export interface CreateSnippetResponse {
  id: string;
  text: string;
  summary: string;
  createdAt: string;
}

export interface GetSnippetResponse {
  id: string;
  text: string;
  summary: string;
  createdAt: string;
}

export interface ListSnippetsResponse {
  snippets: GetSnippetResponse[];
  total: number;
}

// Error response interface
export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
} 