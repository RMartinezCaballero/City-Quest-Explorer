import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';

@Injectable()
export class MissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(routeId: string, data: CreateMissionDto) {
    const route = await this.prisma.route.findUnique({ where: { id: routeId } });
    if (!route) {
      throw new NotFoundException('Ruta no encontrada');
    }
    return this.prisma.mission.create({
      data: {
        routeId,
        ...data,
      },
      include: { route: true, checkpoint: true },
    });
  }

  findByRoute(routeId: string) {
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

  async findOne(missionId: string) {
    const mission = await this.prisma.mission.findUnique({
      where: { id: missionId },
      include: {
        route: { include: { story: true } },
        checkpoint: true,
        challenges: {
          include: { answers: true, unlockKeys: true },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });
    if (!mission) {
      throw new NotFoundException('Misión no encontrada');
    }
    return mission;
  }

  async update(missionId: string, data: UpdateMissionDto) {
    const mission = await this.prisma.mission.findUnique({ where: { id: missionId } });
    if (!mission) {
      throw new NotFoundException('Misión no encontrada');
    }
    return this.prisma.mission.update({
      where: { id: missionId },
      data,
      include: { checkpoint: true, challenges: true },
    });
  }

  async reorder(routeId: string, missionIds: string[]) {
    const route = await this.prisma.route.findUnique({ where: { id: routeId } });
    if (!route) {
      throw new NotFoundException('Ruta no encontrada');
    }

    const updates = missionIds.map((id, index) =>
      this.prisma.mission.update({
        where: { id },
        data: { orderIndex: index },
      }),
    );

    await this.prisma.$transaction(updates);
    return this.findByRoute(routeId);
  }

  async remove(missionId: string) {
    const mission = await this.prisma.mission.findUnique({ where: { id: missionId } });
    if (!mission) {
      throw new NotFoundException('Misión no encontrada');
    }
    return this.prisma.mission.delete({ where: { id: missionId } });
  }
}
