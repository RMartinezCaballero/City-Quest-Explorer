import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

@Injectable()
export class ChallengesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(missionId: string, data: CreateChallengeDto) {
    const mission = await this.prisma.mission.findUnique({ where: { id: missionId } });
    if (!mission) {
      throw new NotFoundException('Misión no encontrada');
    }

    const { answers, ...challengeData } = data;

    return this.prisma.challenge.create({
      data: {
        missionId,
        ...challengeData,
        answers: answers && answers.length > 0
          ? {
              create: answers.map((a: { value: string; label?: string; isCorrect?: boolean; penalty?: number; orderIndex?: number }) => ({
                value: a.value,
                label: a.label,
                isCorrect: a.isCorrect ?? true,
                penalty: a.penalty ?? 0,
                orderIndex: a.orderIndex ?? 0,
              })),
            }
          : undefined,
      },
      include: { answers: true, unlockKeys: true },
    });
  }

  findByMission(missionId: string) {
    return this.prisma.challenge.findMany({
      where: { missionId },
      orderBy: { orderIndex: 'asc' },
      include: { answers: true, unlockKeys: true },
    });
  }

  async findOne(challengeId: string) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
      include: {
        mission: { include: { route: true } },
        answers: { orderBy: { orderIndex: 'asc' } },
        unlockKeys: true,
      },
    });
    if (!challenge) {
      throw new NotFoundException('Reto no encontrado');
    }
    return challenge;
  }

  async update(challengeId: string, data: UpdateChallengeDto) {
    const challenge = await this.prisma.challenge.findUnique({ where: { id: challengeId } });
    if (!challenge) {
      throw new NotFoundException('Reto no encontrado');
    }

    const { answers, ...challengeData } = data;

    // If answers provided, delete old and create new
    if (answers && answers.length > 0) {
      await this.prisma.challengeAnswer.deleteMany({ where: { challengeId } });
      return this.prisma.challenge.update({
        where: { id: challengeId },
        data: {
          ...challengeData as any,
          answers: {
            create: answers.map((a: any) => ({
              value: a.value,
              label: a.label,
              isCorrect: a.isCorrect ?? true,
              penalty: a.penalty ?? 0,
              orderIndex: a.orderIndex ?? 0,
            })),
          },
        },
        include: { answers: true, unlockKeys: true },
      });
    }

    // Sin answers: solo actualizar datos del challenge
    return this.prisma.challenge.update({
      where: { id: challengeId },
      data: challengeData as any,
      include: { answers: true, unlockKeys: true },
    });
  }

  async remove(challengeId: string) {
    const challenge = await this.prisma.challenge.findUnique({ where: { id: challengeId } });
    if (!challenge) {
      throw new NotFoundException('Reto no encontrado');
    }
    return this.prisma.challenge.delete({ where: { id: challengeId } });
  }

  async validateAnswer(challengeId: string, answer: string) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
      include: { answers: true },
    });
    if (!challenge) {
      throw new NotFoundException('Reto no encontrado');
    }

    const normalizedAnswer = answer.trim().toUpperCase();
    const matchedAnswer = challenge.answers.find(
      (a) => a.value.trim().toUpperCase() === normalizedAnswer,
    );

    return {
      isCorrect: matchedAnswer?.isCorrect ?? false,
      penalty: matchedAnswer?.penalty ?? challenge.penalty,
      matchedAnswer: matchedAnswer
        ? { id: matchedAnswer.id, label: matchedAnswer.label, isCorrect: matchedAnswer.isCorrect }
        : null,
    };
  }
}
