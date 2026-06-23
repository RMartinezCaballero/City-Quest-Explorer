import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRouteDto } from './dto/create-route.dto';

@Injectable()
export class RoutesService {
  constructor(private readonly prisma: PrismaService) {}

  create(cityId: string, data: CreateRouteDto) {
    return this.prisma.route.create({
      data: {
        cityId,
        ...data,
      },
    });
  }

  findByCity(cityId: string) {
    return this.prisma.route.findMany({
      where: { cityId },
      orderBy: { name: 'asc' },
      include: { checkpoints: true },
    });
  }

  findOne(routeId: string) {
    return this.prisma.route.findUnique({
      where: { id: routeId },
      include: { checkpoints: true },
    });
  }
}
