import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';

export type CreateTeamWithRouteDto = CreateTeamDto & { routeId: string };

@Injectable()
export class TeamsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateTeamWithRouteDto) {
    return this.prisma.team.create({
      data: {
        name: data.name,
        routeId: data.routeId,
        captainId: data.captainId,
      },
      include: { members: true },
    });
  }

  findByRoute(routeId: string) {
    return this.prisma.team.findMany({
      where: { routeId },
      orderBy: { name: 'asc' },
      include: { members: true },
    });
  }

  findOne(teamId: string) {
    return this.prisma.team.findUnique({
      where: { id: teamId },
      include: { members: true },
    });
  }
}
