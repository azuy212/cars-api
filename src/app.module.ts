import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarsModule } from './cars/cars.module';
import { DB_URL } from './config/database';

@Module({
  imports: [MongooseModule.forRoot(DB_URL), CarsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
