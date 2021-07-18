import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Asset, BODY_TYPE, Car, FUEL_TYPE } from '../types';

class AssetDto implements Asset {
  @IsOptional()
  @IsString()
  name: string;

  @IsBoolean()
  primary: boolean;

  @IsString()
  source: string;
}
export class CreateCarDto implements Car {
  @IsOptional()
  @IsMongoId()
  _id: string;

  @IsString()
  chassisNo: string;

  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  year: number;

  @IsIn([
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER',
  ])
  registrationMonth: string;

  @IsNumber()
  engineCapacity: number;

  @IsIn(['LEFT', 'RIGHT'])
  steeringPosition: 'LEFT' | 'RIGHT';

  @IsIn(['AUTO', 'MANUAL'])
  transmission: 'AUTO' | 'MANUAL';

  @IsIn(['PETROL', 'HYBRID', 'DIESEL', 'CNG', 'LPG', 'ELECTRIC'], {
    each: true,
  })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  fuelType: FUEL_TYPE[];

  @IsString()
  color: string;

  @IsNumber()
  door: number;

  @IsIn([
    'COMPACT_SEDAN',
    'COMPACT_SUV',
    'CONVERTIBLE',
    'COUPE',
    'CROSSOVER',
    'DOUBLE_CABIN',
    'HATCHBACK',
    'HIGH_ROOF',
    'MICRO_VAN',
    'MINI_VAN',
    'MINI_VEHICLES',
    'MPV',
    'OFF-ROAD_VEHICLES',
    'PICK_UP',
    'SEDAN',
    'SINGLE_CABIN',
    'STATION_WAGON',
    'SUV',
    'TRUCK',
    'VAN',
  ])
  bodyType: BODY_TYPE;

  @IsNumber()
  price: number;

  @ValidateNested({ each: true })
  @Type(() => AssetDto)
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  assets: Asset[];

  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  features: string[];
}
