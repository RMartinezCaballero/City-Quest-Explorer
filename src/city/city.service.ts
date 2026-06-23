import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCityDto } from './dto/create-city.dto';

@Injectable()
export class CityService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateCityDto) {
    return this.prisma.city.create({ data });
  }

  findAll() {
    return this.prisma.city.findMany({ orderBy: { name: 'asc' } });
  }

  findById(id: string) {
    return this.prisma.city.findUnique({ where: { id } });
  }
}
