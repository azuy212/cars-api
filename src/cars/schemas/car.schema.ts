import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BODY_TYPE, FUEL_TYPE } from '../types';

export type CarDocument = Car & Document;

@Schema()
export class Car {
  @Prop(String)
  chassisNo: string;

  @Prop(String)
  make: string;

  @Prop(String)
  model: string;

  @Prop(Number)
  year: number;

  @Prop(String)
  registrationMonth: string;

  @Prop(Number)
  engineCapacity: number;

  @Prop(String)
  steeringPosition: 'LEFT' | 'RIGHT';

  @Prop(String)
  transmission: 'AUTO' | 'MANUAL';

  @Prop([String])
  fuelType: FUEL_TYPE[];

  @Prop(String)
  color: string;

  @Prop(Number)
  door: number;

  @Prop(String)
  bodyType: BODY_TYPE;

  @Prop(Number)
  price: number;
}

export const CarSchema = SchemaFactory.createForClass(Car);
