import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import {
  CarListFilterKey,
  CarListFilterQuery,
  PageQuery,
} from '@/interfaces/car';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCarDto: CreateCarDto) {
    return this.carsService.create(createCarDto);
  }

  @Get()
  findAll(@Query() page: PageQuery & CarListFilterQuery) {
    return this.carsService.findAll(page);
  }

  @Get('filters')
  getFilters() {
    return this.carsService.filters();
  }

  @Get('filters/:filter')
  getFilter(
    @Param('filter') filter: CarListFilterKey,
    @Query() criteria: CarListFilterQuery,
  ) {
    return this.carsService.filter(filter, criteria);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carsService.update(id, updateCarDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carsService.remove(id);
  }
}
