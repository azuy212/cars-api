import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Asset, BODY_TYPE, Car as ICar, FUEL_TYPE } from '../types';

export type CarDocument = Car & Document;

@Schema({ timestamps: true })
export class Car implements ICar {
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

  @Prop({ type: [{ name: String, primary: Boolean, source: String }] })
  assets: Asset[];
}

export const CarSchema = SchemaFactory.createForClass(Car);
