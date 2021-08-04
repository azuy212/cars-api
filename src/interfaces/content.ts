import { Document } from 'mongoose';

export type ContentType = 'ABOUT' | 'BUY';

export interface Content {
  type: ContentType;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ContentDocument = Content & Document;
