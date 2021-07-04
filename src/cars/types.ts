export type FUEL_TYPE =
  | 'PETROL'
  | 'HYBRID'
  | 'DIESEL'
  | 'CNG'
  | 'LPG'
  | 'ELECTRIC';

export type BODY_TYPE =
  | 'COMPACT_SEDAN'
  | 'COMPACT_SUV'
  | 'CONVERTIBLE'
  | 'COUPE'
  | 'CROSSOVER'
  | 'DOUBLE_CABIN'
  | 'HATCHBACK'
  | 'HIGH_ROOF'
  | 'MICRO_VAN'
  | 'MINI_VAN'
  | 'MINI_VEHICLES'
  | 'MPV'
  | 'OFF-ROAD_VEHICLES'
  | 'PICK_UP'
  | 'SEDAN'
  | 'SINGLE_CABIN'
  | 'STATION_WAGON'
  | 'SUV'
  | 'TRUCK'
  | 'VAN';

export interface Asset {
  _id?: string;
  name?: string;
  primary: boolean;
  source: string;
}

export interface Car {
  _id?: string;
  chassisNo: string;
  make: string;
  model: string;
  year: number;
  registrationMonth: string;
  engineCapacity: number;
  steeringPosition: 'LEFT' | 'RIGHT';
  transmission: 'AUTO' | 'MANUAL';
  fuelType: FUEL_TYPE[];
  color: string;
  door: number;
  bodyType: BODY_TYPE;
  price: number;
  assets: Asset[];
}
