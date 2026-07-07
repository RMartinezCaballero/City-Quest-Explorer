import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class GamesTemplateService {
  constructor(private readonly prisma: PrismaService) {}

  async create(cityId: string, data: CreateGameDto) {
    const city = await this.prisma.city.findUnique({ where: { id: cityId } });
    if (!city) {
      throw new NotFoundException('Ciudad no encontrada');
    }
    return this.prisma.game.create({
      data: {
        cityId,
        ...data,
      },
      include: { city: true },
    });
  }

  findAll(cityId: string) {
    return this.prisma.game.findMany({
      where: { cityId },
      orderBy: { name: 'asc' },
      include: {
        stories: {
          select: { id: true, name: true, status: true },
        },
      },
    });
  }

  async findOne(gameId: string) {
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
      include: {
        city: true,
        stories: {
          include: {
            routes: {
              select: { id: true, name: true, difficulty: true, status: true },
            },
          },
        },
      },
    });
    if (!game) {
      throw new NotFoundException('Juego no encontrado');
    }
    return game;
  }

  async update(gameId: string, data: UpdateGameDto) {
    const game = await this.prisma.game.findUnique({ where: { id: gameId } });
    if (!game) {
      throw new NotFoundException('Juego no encontrado');
    }
    return this.prisma.game.update({
      where: { id: gameId },
      data,
    });
  }

  async publish(gameId: string) {
    const game = await this.prisma.game.findUnique({ where: { id: gameId } });
    if (!game) {
      throw new NotFoundException('Juego no encontrado');
    }
    return this.prisma.game.update({
      where: { id: gameId },
      data: { status: game.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' },
    });
  }

  async clone(gameId: string) {
    const original = await this.prisma.game.findUnique({
      where: { id: gameId },
      include: {
        stories: {
          include: {
            routes: {
              include: {
                missions: {
                  include: {
                    challenges: {
                      include: { answers: true, unlockKeys: true },
                    },
                  },
                },
                checkpoints: true,
                qrCodes: true,
              },
            },
            endings: true,
          },
        },
      },
    });
    if (!original) {
      throw new NotFoundException('Juego no encontrado');
    }

    // Clone game
    const clonedGame = await this.prisma.game.create({
      data: {
        cityId: original.cityId,
        name: `${original.name} (Copia)`,
        description: original.description,
        durationMinutes: original.durationMinutes,
        difficulty: original.difficulty,
        maxPlayers: original.maxPlayers,
        imageUrl: original.imageUrl,
        status: 'DRAFT',
      },
    });

    // Clone stories, routes, missions, challenges
    for (const story of original.stories) {
      const clonedStory = await this.prisma.story.create({
        data: {
          gameId: clonedGame.id,
          name: story.name,
          introduction: story.introduction,
          lore: story.lore,
          objectives: story.objectives as Prisma.InputJsonValue | undefined,
          rules: story.rules,
        },
      });

      for (const route of story.routes) {
        const clonedRoute = await this.prisma.route.create({
          data: {
            storyId: clonedStory.id,
            cityId: original.cityId,
            name: route.name,
            description: route.description,
            difficulty: route.difficulty,
            distanceMeters: route.distanceMeters,
            estimatedMinutes: route.estimatedMinutes,
            isDefault: route.isDefault,
            conditions: route.conditions as Prisma.InputJsonValue | undefined,
          },
        });

        for (const mission of route.missions) {
          const clonedMission = await this.prisma.mission.create({
            data: {
              routeId: clonedRoute.id,
              title: mission.title,
              narrative: mission.narrative,
              description: mission.description,
              orderIndex: mission.orderIndex,
              difficulty: mission.difficulty,
              timeLimit: mission.timeLimit,
              mediaUrl: mission.mediaUrl,
              isLastMission: mission.isLastMission,
            },
          });

          for (const challenge of mission.challenges) {
            const clonedChallenge = await this.prisma.challenge.create({
              data: {
                missionId: clonedMission.id,
                type: challenge.type,
                prompt: challenge.prompt,
                hint1: challenge.hint1,
                hint2: challenge.hint2,
                hint3: challenge.hint3,
                hint4: challenge.hint4,
                orderIndex: challenge.orderIndex,
                penalty: challenge.penalty,
              },
            });

            for (const answer of challenge.answers) {
              await this.prisma.challengeAnswer.create({
                data: {
                  challengeId: clonedChallenge.id,
                  value: answer.value,
                  label: answer.label,
                  isCorrect: answer.isCorrect ?? true,
                  penalty: answer.penalty ?? 0,
                  orderIndex: answer.orderIndex ?? 0,
                } as any,
              });
            }

            for (const key of challenge.unlockKeys) {
              await this.prisma.unlockKey.create({
                data: {
                  challengeId: clonedChallenge.id,
                  type: key.type,
                  keyValue: key.keyValue,
                  expiresAt: key.expiresAt,
                } as any,
              });
            }
          }
        }

        // Clone endings
        for (const ending of story.endings) {
          await this.prisma.storyEnding.create({
            data: {
              storyId: clonedStory.id,
              name: ending.name,
              description: ending.description,
              conditions: ending.conditions as Prisma.InputJsonValue | undefined,
              narrative: ending.narrative,
              mediaUrl: ending.mediaUrl,
              orderIndex: ending.orderIndex,
            } as any,
          });
        }
      }
    }

    return this.findOne(clonedGame.id);
  }

  async remove(gameId: string) {
    const game = await this.prisma.game.findUnique({ where: { id: gameId } });
    if (!game) {
      throw new NotFoundException('Juego no encontrado');
    }
    return this.prisma.game.delete({ where: { id: gameId } });
  }

  async listPlayableRoutes(gameId: string, difficulty?: string) {
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
      select: { id: true, cityId: true },
    });
    if (!game) {
      throw new NotFoundException('Juego no encontrado');
    }

    const stories = await this.prisma.story.findMany({
      where: { gameId },
      select: { id: true },
    });

    const storyIds = stories.map((s) => s.id);
    if (!storyIds.length) {
      return [];
    }

    const where: any = { storyId: { in: storyIds } };
    if (difficulty) {
      where.difficulty = difficulty;
    }

    const routes = await this.prisma.route.findMany({
      where,
      orderBy: { difficulty: 'asc' },
      include: {
        missions: {
          orderBy: { orderIndex: 'asc' },
          select: { id: true, title: true, orderIndex: true, difficulty: true },
        },
      },
    });

    return routes.map((route: any) => ({
      ...route,
      missionCount:
        route.conditions &&
        typeof route.conditions.missionCount === 'number'
          ? Number(route.conditions.missionCount)
          : Number(difficultyConfigByRoute[route.difficulty]?.max ?? 10),
    }));
  }

  async ensureGameRoutes(gameId: string) {
    const game = await this.prisma.game.findUnique({ where: { id: gameId }, include: { city: true } });
    if (!game) {
      throw new NotFoundException('Juego no encontrado');
    }

    const normalizedDifficulty = (game.difficulty || 'MEDIUM').toUpperCase();
    const allowed = ['EASY', 'MEDIUM', 'HARD'];
    const targetDifficulties = allowed.includes(normalizedDifficulty) ? allowed : ['EASY', 'MEDIUM', 'HARD'];

    let story = await this.prisma.story.findFirst({ where: { gameId } });
    if (!story) {
      story = await this.prisma.story.create({
        data: {
          gameId,
          name: `${game.name} — Historia Principal`,
          introduction: 'Historia generada automáticamente para la experiencia de juego.',
          status: 'PUBLISHED',
        },
      });
    }

    const createdRoutes: { difficulty: string; created: boolean; routeId?: string; missions?: number }[] = [];
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

    const resolveTargetCount = (route: { conditions?: Record<string, unknown>; difficulty: string }, diff: string) => {
      const conditions = (route.conditions ?? {}) as Record<string, unknown>;
      if (typeof conditions.missionCount === 'number') {
        return Number(conditions.missionCount);
      }
      return difficultyConfigByRoute[diff]?.max ?? 10;
    };

    const generateMissingMissions = async (routeId: string, currentCount: number, targetCount: number) => {
      if (currentCount >= targetCount) {
        return;
      }

      if (currentCount > 0) {
        await this.prisma.mission.updateMany({
          where: { routeId },
          data: { isLastMission: false },
        });
      }

      const missionsToCreate = targetCount - currentCount;
      for (let i = 0; i < missionsToCreate; i++) {
        const orderIndex = currentCount + i;
        const isLast = orderIndex === targetCount - 1;
        const missionSeed = orderIndex % narrativeTemplates.length;

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
    };

    for (const diff of targetDifficulties) {
      const existing = await this.prisma.route.findFirst({ where: { storyId: story.id, difficulty: diff }, include: { missions: true } });
      if (existing) {
        const targetCount = resolveTargetCount(existing, diff);
        if (existing.missions.length < targetCount) {
          await generateMissingMissions(existing.id, existing.missions.length, targetCount);
        }
        const missions = await this.prisma.mission.findMany({ where: { routeId: existing.id } });
        createdRoutes.push({ difficulty: diff, created: false, routeId: existing.id, missions: missions.length });
        continue;
      }

      const created = await this.prisma.route.create({
        data: {
          storyId: story.id,
          cityId: game.cityId,
          name: `${game.name} — ${diff}`,
          description: `Ruta ${diff.toLowerCase()} generada automáticamente.`,
          difficulty: diff,
          distanceMeters: diff === 'EASY' ? 2500 : diff === 'MEDIUM' ? 4500 : 7000,
          estimatedMinutes: diff === 'EASY' ? 60 : diff === 'MEDIUM' ? 120 : 180,
          isDefault: diff === normalizedDifficulty,
          status: 'PUBLISHED',
          conditions: { missionCount: difficultyConfigByRoute[diff]?.max ?? 10 } as any,
        },
        include: { missions: true },
      });

      const targetCount = difficultyConfigByRoute[diff]?.max ?? 10;
      await generateMissingMissions(created.id, 0, targetCount);

      const missions = await this.prisma.mission.findMany({ where: { routeId: created.id } });
      createdRoutes.push({ difficulty: diff, created: true, routeId: created.id, missions: missions.length });
    }

    return { gameId, storyId: story.id, createdRoutes };
  }
}

const difficultyConfigByRoute: Record<string, { min: number; max: number }> = {
  EASY: { min: 5, max: 8 },
  MEDIUM: { min: 8, max: 12 },
  HARD: { min: 12, max: 15 },
};
