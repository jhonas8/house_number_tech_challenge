import mongoose, { Document, Schema } from 'mongoose';
import { ISnippet } from '../types/snippet';

export interface ISnippetDocument extends Omit<ISnippet, '_id'>, Document {}

const snippetSchema = new Schema<ISnippetDocument>({
  text: {
    type: String,
    required: [true, 'Text is required'],
    trim: true,
    maxlength: [10000, 'Text cannot exceed 10,000 characters']
  },
  summary: {
    type: String,
    required: [true, 'Summary is required'],
    trim: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(_doc, ret: any) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export const Snippet = mongoose.model<ISnippetDocument>('Snippet', snippetSchema); 