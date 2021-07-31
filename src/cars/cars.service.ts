import {
  CarDocument,
  CarListFilterKey,
  CarListFilterQuery,
  Page,
  PageQuery,
} from '@/interfaces/car';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car } from './schemas/car.schema';

@Injectable()
export class CarsService {
  private readonly distinctFields: Array<CarListFilterKey> = [
    'make',
    'model',
    'transmission',
    'fuelType',
    'color',
    'bodyType',
    'features',
  ];
  private readonly rangeFields: Array<CarListFilterKey> = [
    'engineCapacity',
    'year',
    'price',
  ];

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

    const query = this.buildFilterQuery(filters);

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

  private buildFilterQuery(filter: CarListFilterQuery) {
    return Object.keys(filter).reduce<FilterQuery<CarDocument>>(
      (acc, key: CarListFilterKey) => {
        if (filter[key]) {
          if (this.distinctFields.includes(key)) {
            acc[key] = { $in: filter[key].split(',') };
          } else if (this.rangeFields.includes(key)) {
            const [min, max] = filter[key].split(',').map(Number);
            if (max) {
              const [$gte, $lte] = [Math.min(min, max), Math.max(min, max)];
              acc[key] = { $gte, $lte };
            } else {
              acc[key] = { $gte: min };
            }
          }
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
    const [distinctModels, rangeModels] = await Promise.all([
      Promise.all(
        this.distinctFields.map((field) =>
          this.carModel.distinct(field).exec(),
        ),
      ),
      Promise.all(
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
      ),
    ]);

    return {
      ...distinctModels.reduce<Record<string, string[]>>(
        (acc, model, idx) => ({ ...acc, [this.distinctFields[idx]]: model }),
        {},
      ),
      ...this.rangeFields.reduce<Record<string, { min: number; max: number }>>(
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

  async filter(filter: CarListFilterKey, criteria?: CarListFilterQuery) {
    const query = this.buildFilterQuery(criteria);
    if (this.distinctFields.includes(filter)) {
      return this.carModel.distinct(filter, query).exec();
    } else if (this.rangeFields.includes(filter)) {
      const [min, max] = await Promise.all(
        [1, -1].map((sort) =>
          this.carModel
            .find(query)
            .select(filter)
            .sort({ [filter]: sort })
            .limit(1),
        ),
      );
      return { min: min?.[0]?.[filter], max: max?.[0]?.[filter] };
    }
    throw new HttpException(
      `Unknown filter provided: ${filter}`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
