import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoutesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(storyId: string, cityId: string, data: CreateRouteDto) {
    const story = await this.prisma.story.findUnique({ where: { id: storyId } });
    if (!story) {
      throw new NotFoundException('Historia no encontrada');
    }

    const conditions = data.conditions ?? {};
    if (data.missionCount) {
      (conditions as Record<string, unknown>).missionCount = data.missionCount;
    }

    return this.prisma.route.create({
      data: {
        storyId,
        cityId,
        name: data.name,
        description: data.description,
        difficulty: data.difficulty ?? 'EASY',
        distanceMeters: data.distanceMeters,
        estimatedMinutes: data.estimatedMinutes,
        isDefault: data.isDefault ?? false,
        conditions: conditions as Prisma.InputJsonValue,
      },
      include: {
        missions: { orderBy: { orderIndex: 'asc' } },
      },
    });
  }

  findByCity(cityId: string) {
    return this.prisma.route.findMany({
      where: { cityId },
      orderBy: { name: 'asc' },
      include: {
        story: { select: { id: true, name: true } },
        missions: {
          orderBy: { orderIndex: 'asc' },
          select: {
            id: true,
            title: true,
            description: true,
            orderIndex: true,
            difficulty: true,
            isLastMission: true,
          },
        },
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

  async findOne(routeId: string) {
    const route = await this.prisma.route.findUnique({
      where: { id: routeId },
      include: {
        story: { select: { id: true, name: true } },
        missions: {
          orderBy: { orderIndex: 'asc' },
          include: {
            checkpoint: true,
            challenges: {
              include: { answers: true, unlockKeys: true },
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
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
    if (!route) {
      throw new NotFoundException('Ruta no encontrada');
    }
    return route;
  }

  findByStory(storyId: string) {
    return this.prisma.route.findMany({
      where: { storyId },
      orderBy: { name: 'asc' },
      include: {
        missions: {
          orderBy: { orderIndex: 'asc' },
          select: { id: true, title: true, orderIndex: true, difficulty: true },
        },
      },
    });
  }

  async update(routeId: string, data: Partial<CreateRouteDto>) {
    const route = await this.prisma.route.findUnique({ where: { id: routeId } });
    if (!route) {
      throw new NotFoundException('Ruta no encontrada');
    }

    // Extract missionCount and conditions from data, merge properly
    const { missionCount, conditions: incomingConditions, ...restData } = data;
    const mergedConditions = {
      ...(route.conditions ?? {}) as Record<string, unknown>,
      ...(incomingConditions ?? {}) as Record<string, unknown>,
    };
    if (missionCount !== undefined) {
      mergedConditions.missionCount = missionCount;
    }

    return this.prisma.route.update({
      where: { id: routeId },
      data: {
        ...restData,
        conditions: mergedConditions as Prisma.InputJsonValue,
      },
      include: { missions: true },
    });
  }

  async remove(routeId: string) {
    const route = await this.prisma.route.findUnique({ where: { id: routeId } });
    if (!route) {
      throw new NotFoundException('Ruta no encontrada');
    }
    return this.prisma.route.delete({ where: { id: routeId } });
  }
}
