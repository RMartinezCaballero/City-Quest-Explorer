import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUnlockKeyDto } from './dto/create-unlock-key.dto';

@Injectable()
export class UnlockKeysService {
  constructor(private readonly prisma: PrismaService) {}

  async create(challengeId: string, data: CreateUnlockKeyDto) {
    const challenge = await this.prisma.challenge.findUnique({ where: { id: challengeId } });
    if (!challenge) {
      throw new NotFoundException('Reto no encontrado');
    }
    return this.prisma.unlockKey.create({
      data: {
        challengeId,
        type: data.type,
        keyValue: data.keyValue,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      },
    });
  }

  findByChallenge(challengeId: string) {
    return this.prisma.unlockKey.findMany({
      where: { challengeId },
    });
  }

  async validateKey(keyValue: string) {
    const key = await this.prisma.unlockKey.findUnique({
      where: { keyValue },
    });
    if (!key) {
      return { valid: false, reason: 'Llave no encontrada' };
    }
    if (key.usedAt) {
      return { valid: false, reason: 'Llave ya utilizada' };
    }
    if (key.expiresAt && key.expiresAt < new Date()) {
      return { valid: false, reason: 'Llave expirada' };
    }
    return { valid: true, key };
  }

  async useKey(keyValue: string) {
    const validation = await this.validateKey(keyValue);
    if (!validation.valid) {
      return validation;
    }
    await this.prisma.unlockKey.update({
      where: { keyValue },
      data: { usedAt: new Date() },
    });
    return { valid: true, message: 'Llave canjeada exitosamente' };
  }

  async remove(keyId: string) {
    const key = await this.prisma.unlockKey.findUnique({ where: { id: keyId } });
    if (!key) {
      throw new NotFoundException('Llave no encontrada');
    }
    return this.prisma.unlockKey.delete({ where: { id: keyId } });
  }
}
