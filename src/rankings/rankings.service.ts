import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRankingDto } from './dto/create-ranking.dto';

export type CreateRankingWithRouteDto = CreateRankingDto & { routeId: string };

@Injectable()
export class RankingsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateRankingWithRouteDto) {
    return this.prisma.ranking.create({
      data: {
        routeId: data.routeId,
        teamId: data.teamId,
        score: data.score,
        position: data.position,
      },
      include: { route: true, team: true },
    });
  }

  findByRoute(routeId: string) {
    return this.prisma.ranking.findMany({
      where: { routeId },
      orderBy: { position: 'asc' },
      include: { team: true },
    });
  }
}
