import { Content as IContent, ContentType } from '@/interfaces/content';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Content implements IContent {
  @Prop(String)
  type: ContentType;

  @Prop(String)
  content: string;
}

export const ContentSchema = SchemaFactory.createForClass(Content);
