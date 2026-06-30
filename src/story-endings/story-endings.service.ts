import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoryEndingDto } from './dto/create-story-ending.dto';
import { UpdateStoryEndingDto } from './dto/update-story-ending.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class StoryEndingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(storyId: string, data: CreateStoryEndingDto) {
    const story = await this.prisma.story.findUnique({ where: { id: storyId } });
    if (!story) {
      throw new NotFoundException('Historia no encontrada');
    }
    return this.prisma.storyEnding.create({
      data: {
        storyId,
        ...data,
        conditions: (data.conditions ?? Prisma.JsonNull) as Prisma.InputJsonValue,
      },
    });
  }

  findByStory(storyId: string) {
    return this.prisma.storyEnding.findMany({
      where: { storyId },
      orderBy: { orderIndex: 'asc' },
    });
  }

  async findOne(endingId: string) {
    const ending = await this.prisma.storyEnding.findUnique({
      where: { id: endingId },
      include: { story: true },
    });
    if (!ending) {
      throw new NotFoundException('Final no encontrado');
    }
    return ending;
  }

  async update(endingId: string, data: UpdateStoryEndingDto) {
    const ending = await this.prisma.storyEnding.findUnique({ where: { id: endingId } });
    if (!ending) {
      throw new NotFoundException('Final no encontrado');
    }
    return this.prisma.storyEnding.update({
      where: { id: endingId },
      data: {
        ...data,
        conditions: (data.conditions ?? Prisma.JsonNull) as Prisma.InputJsonValue,
      },
    });
  }

  async remove(endingId: string) {
    const ending = await this.prisma.storyEnding.findUnique({ where: { id: endingId } });
    if (!ending) {
      throw new NotFoundException('Final no encontrado');
    }
    return this.prisma.storyEnding.delete({ where: { id: endingId } });
  }
}
