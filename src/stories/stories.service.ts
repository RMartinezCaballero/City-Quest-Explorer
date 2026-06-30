import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';

@Injectable()
export class StoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(gameId: string, data: CreateStoryDto) {
    const game = await this.prisma.game.findUnique({ where: { id: gameId } });
    if (!game) {
      throw new NotFoundException('Juego no encontrado');
    }
    return this.prisma.story.create({
      data: {
        gameId,
        ...data,
        objectives: data.objectives ?? undefined,
      },
      include: { game: { include: { city: true } } },
    });
  }

  findByGame(gameId: string) {
    return this.prisma.story.findMany({
      where: { gameId },
      orderBy: { name: 'asc' },
      include: {
        routes: {
          select: { id: true, name: true, difficulty: true, status: true },
        },
        endings: {
          select: { id: true, name: true, orderIndex: true },
        },
      },
    });
  }

  async findOne(storyId: string) {
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
      include: {
        game: { include: { city: true } },
        routes: {
          include: {
            missions: {
              orderBy: { orderIndex: 'asc' },
              include: {
                challenges: {
                  include: { answers: true, unlockKeys: true },
                },
              },
            },
            checkpoints: true,
          },
        },
        endings: { orderBy: { orderIndex: 'asc' } },
      },
    });
    if (!story) {
      throw new NotFoundException('Historia no encontrada');
    }
    return story;
  }

  async update(storyId: string, data: UpdateStoryDto) {
    const story = await this.prisma.story.findUnique({ where: { id: storyId } });
    if (!story) {
      throw new NotFoundException('Historia no encontrada');
    }
    return this.prisma.story.update({
      where: { id: storyId },
      data: {
        ...data,
        objectives: data.objectives ?? undefined,
      },
    });
  }

  async publish(storyId: string) {
    const story = await this.prisma.story.findUnique({ where: { id: storyId } });
    if (!story) {
      throw new NotFoundException('Historia no encontrada');
    }
    return this.prisma.story.update({
      where: { id: storyId },
      data: { status: story.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' },
    });
  }

  async remove(storyId: string) {
    const story = await this.prisma.story.findUnique({ where: { id: storyId } });
    if (!story) {
      throw new NotFoundException('Historia no encontrada');
    }
    return this.prisma.story.delete({ where: { id: storyId } });
  }
}
