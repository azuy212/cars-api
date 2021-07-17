import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car, CarDocument } from './schemas/car.schema';
import { CarListFilterQuery, Page, PageQuery } from './types';

@Injectable()
export class CarsService {
  private readonly distinctFields = [
    'make',
    'transmission',
    'fuelType',
    'color',
    'bodyType',
  ];
  private readonly rangeFields = ['engineCapacity', 'year', 'price'];

  constructor(@InjectModel(Car.name) private carModel: Model<CarDocument>) {}

  async create(createCarDto: CreateCarDto): Promise<Car> {
    const createdCar = new this.carModel(createCarDto);
    return createdCar.save();
  }

  async findAll(
    pageQuery: PageQuery & CarListFilterQuery,
  ): Promise<Page<CarDocument>> {
    const {
      page = 0,
      size = 20,
      sort = 'updatedAt',
      direction = 'asc',
      ...filters
    } = pageQuery;

    const query = this.buildQuery(filters);

    const [content, totalElements] = await Promise.all([
      this.carModel
        .find(query)
        .skip(+page * +size)
        .limit(+size)
        .sort({ [sort]: direction })
        .exec(),
      this.carModel.countDocuments(query).exec(),
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

  private buildQuery(filter: CarListFilterQuery) {
    return Object.keys(filter).reduce<FilterQuery<CarDocument>>(
      (acc, key: keyof CarListFilterQuery) => {
        if (this.distinctFields.includes(key)) {
          acc[key] = { $in: filter[key].split(',') };
        } else if (this.rangeFields.includes(key)) {
          const [$gte, $lte] = filter[key].split(',').map(Number);
          acc[key] = { $gte, $lte };
        }
        return acc;
      },
      {},
    );
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

  async filters() {
    const distinctModels = await Promise.all(
      this.distinctFields.map((field) => this.carModel.distinct(field).exec()),
    );

    const rangeModels = await Promise.all(
      [1, -1].map((sort) =>
        Promise.all(
          this.rangeFields.map((field) =>
            this.carModel
              .find()
              .select(field)
              .sort({ [field]: sort })
              .limit(1),
          ),
        ),
      ),
    );

    return {
      ...distinctModels.reduce(
        (acc, model, idx) => ({ ...acc, [this.distinctFields[idx]]: model }),
        {},
      ),
      ...this.rangeFields.reduce(
        (acc, cur, idx) => ({
          ...acc,
          [cur]: {
            min: rangeModels[0][idx][0][cur],
            max: rangeModels[1][idx][0][cur],
          },
        }),
        {},
      ),
    };
  }
}
