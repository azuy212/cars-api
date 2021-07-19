import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarsModule } from './cars/cars.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => {
        const {
          DB_USER_NAME,
          DB_PASSWORD,
          DB_HOST = 'localhost:27017',
          DB_NAME = 'primeTraders',
        } = process.env;
        return {
          uri: DB_HOST.includes('localhost')
            ? `mongodb://${DB_HOST}/${DB_NAME}`
            : `mongodb+srv://${DB_USER_NAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`,
        };
      },
    }),
    CarsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
