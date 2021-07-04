import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car, CarDocument } from './schemas/car.schema';

@Injectable()
export class CarsService {
  constructor(@InjectModel(Car.name) private carModel: Model<CarDocument>) {}

  async create(createCarDto: CreateCarDto): Promise<Car> {
    const createdCar = new this.carModel(createCarDto);
    return createdCar.save();
  }

  findAll() {
    return this.carModel.find().exec();
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
