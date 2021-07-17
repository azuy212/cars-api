import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car, CarDocument } from './schemas/car.schema';
import { Page, PageQuery } from './types';

@Injectable()
export class CarsService {
  constructor(@InjectModel(Car.name) private carModel: Model<CarDocument>) {}

  async create(createCarDto: CreateCarDto): Promise<Car> {
    const createdCar = new this.carModel(createCarDto);
    return createdCar.save();
  }

  async findAll(pageQuery: PageQuery): Promise<Page<CarDocument>> {
    const {
      page = 0,
      size = 20,
      sort = 'updatedAt',
      direction = 'asc',
    } = pageQuery;

    const [content, totalElements] = await Promise.all([
      this.carModel
        .find()
        .skip(+page * +size)
        .limit(+size)
        .sort({ [sort]: direction })
        .exec(),
      this.carModel.countDocuments().exec(),
    ]);

    const totalPages = Math.ceil(totalElements / +size);

    return {
      content,
      first: +page === 0,
      last: +page === totalPages - 1,
      number: +page,
      numberOfElements: content.length,
      size: +size,
      sort: `${sort},${direction}`,
      totalElements,
      totalPages,
    };
  }

  findOne(id: string) {
    return this.carModel.findById(id).exec();
  }

  update(id: string, updateCarDto: UpdateCarDto) {
    return this.carModel
      .findOneAndUpdate({ _id: id }, updateCarDto, {
        new: true,
        useFindAndModify: false,
      })
      .exec();
  }

  remove(id: string) {
    return this.carModel
      .findOneAndRemove({ _id: id }, { useFindAndModify: false })
      .exec();
  }
}
