import { Content, ContentType } from '@/interfaces/content';
import { IsIn, IsString } from 'class-validator';

export class CreateContentDto implements Content {
  @IsIn(['ABOUT', 'BUY'])
  type: ContentType;

  @IsString()
  content: string;
}
