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
}
