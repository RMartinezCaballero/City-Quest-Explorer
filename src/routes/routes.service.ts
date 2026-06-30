import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRouteDto } from './dto/create-route.dto';

@Injectable()
export class RoutesService {
  constructor(private readonly prisma: PrismaService) { }

  create(cityId: string, data: CreateRouteDto) {
    return this.prisma.route.create({
      data: {
        cityId,
        ...data,
      },
    });
  }

  /**
   * Contrato “Rutas -> Misiones”.
   * MVP: Misiones = checkpoints ordenados por orderIndex.
   */
  findByCity(cityId: string) {
    return this.prisma.route.findMany({
      where: { cityId },
      orderBy: { name: 'asc' },
      include: {
        checkpoints: {
          orderBy: { orderIndex: 'asc' },
          select: {
            id: true,
            name: true,
            description: true,
            orderIndex: true,
            latitude: true,
            longitude: true,
            qrCodes: {
              select: {
                id: true,
                code: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Contrato “misiones” para una ruta.
   */
  findOne(routeId: string) {
    return this.prisma.route.findUnique({
      where: { id: routeId },
      include: {
        checkpoints: {
          orderBy: { orderIndex: 'asc' },
          select: {
            id: true,
            name: true,
            description: true,
            orderIndex: true,
            latitude: true,
            longitude: true,
            qrCodes: {
              select: {
                id: true,
                code: true,
              },
            },
          },
        },
      },
    });
  }
}

