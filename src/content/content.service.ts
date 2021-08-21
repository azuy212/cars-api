import { ContentDocument, ContentType } from '@/interfaces/content';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { Content } from './schemas/content.schema';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(Content.name) private contentModel: Model<ContentDocument>,
  ) {}

  create(createContentDto: CreateContentDto) {
    const createdContent = new this.contentModel(createContentDto);
    return createdContent.save();
  }

  findAll() {
    return this.contentModel.find();
  }

  findOne(type: ContentType) {
    return this.contentModel.findOne({ type });
  }

  update(_id: number, updateContentDto: UpdateContentDto) {
    return this.contentModel
      .findOneAndUpdate({ _id }, updateContentDto, {
        new: true,
        useFindAndModify: false,
      })
      .exec();
  }

  remove(id: number) {
    return this.contentModel.findByIdAndRemove(id);
  }
}
