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

  findByCity(cityId: string, difficulty?: string) {
    const where: any = { cityId };
    if (difficulty) {
      where.difficulty = difficulty;
    }

    return this.prisma.route.findMany({
      where,
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

  /**
   * Genera misiones placeholder para una ruta basándose en su missionCount (conditions).
   * Solo crea las misiones faltantes si actualmente hay menos del target.
   */
  async generateMissions(routeId: string) {
    const route = await this.prisma.route.findUnique({
      where: { id: routeId },
      include: { missions: { orderBy: { orderIndex: 'asc' } } },
    });
    if (!route) {
      throw new NotFoundException('Ruta no encontrada');
    }

    // Read missionCount from conditions
    const conditions = (route.conditions ?? {}) as Record<string, unknown>;
    const targetCount =
      typeof conditions.missionCount === 'number'
        ? conditions.missionCount
        : 10;

    const existingCount = route.missions.length;
    if (existingCount >= targetCount) {
      // Already at or above target — just return existing missions
      return route.missions;
    }

    const missionsToCreate = targetCount - existingCount;
    const startIndex = existingCount;

    // Reset isLastMission on existing missions to avoid duplicates
    if (existingCount > 0) {
      await this.prisma.mission.updateMany({
        where: { routeId },
        data: { isLastMission: false },
      });
    }

    // Sample narrative templates for variety
    const narrativeTemplates = [
      'Explora los alrededores y descubre los secretos que esconde este lugar.',
      'Sigue las pistas y resuelve el enigma para avanzar en tu misión.',
      'El tiempo corre. Encuentra el punto exacto y completa el desafío.',
      'La historia te espera. Descubre qué ocurrió aquí y actúa en consecuencia.',
      'Observa con atención. No todo es lo que parece en este escenario.',
      'Solo los más astutos lograrán descifrar el mensaje oculto.',
      'Cada paso cuenta. Reúne las pruebas necesarias para continuar.',
      'La ciudad guarda secretos. Hoy es tu misión descubrir uno de ellos.',
    ];

    for (let i = 0; i < missionsToCreate; i++) {
      const orderIndex = startIndex + i;
      const isLast = orderIndex === targetCount - 1;
      const missionSeed = (orderIndex % narrativeTemplates.length);

      await this.prisma.mission.create({
        data: {
          routeId,
          title: `Misión #${orderIndex + 1}`,
          narrative: narrativeTemplates[missionSeed],
          description: 'Completa los objetivos de esta misión para avanzar.',
          orderIndex,
          difficulty: 5,
          isLastMission: isLast,
        },
      });
    }

    return this.prisma.mission.findMany({
      where: { routeId },
      orderBy: { orderIndex: 'asc' },
      include: {
        checkpoint: true,
        challenges: {
          include: { answers: true, unlockKeys: true },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });
  }
}
