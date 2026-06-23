import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { CreateSessionEventDto, EventType } from './dto/create-session-event.dto';

@Injectable()
export class GamesService {
  constructor(private readonly prisma: PrismaService) { }

  async createSession(data: CreateSessionDto) {
    return this.prisma.gameSession.create({
      data: {
        teamId: data.teamId,
        routeId: data.routeId,
        cityId: data.cityId,
      },
      include: { team: true, route: true, city: true },
    });
  }

  async createSoloSession(data: { userId: string; routeId: string; cityId: string }) {
    const route = await this.prisma.route.findUnique({ where: { id: data.routeId } });
    if (!route) {
      throw new NotFoundException('Ruta no encontrada');
    }

    // Solo identificado por: captainId === userId y miembro count === 1.
    // (Sin campo extra en schema.)
    let team = await this.prisma.team.findFirst({
      where: {
        routeId: data.routeId,
        captainId: data.userId,
      },
      include: { members: true },
    });

    if (!team || team.members.length !== 1) {
      // Crear un Team nuevo "Solo".
      team = await this.prisma.team.create({
        data: {
          name: 'Solo',
          routeId: data.routeId,
          captainId: data.userId,
          members: {
            create: {
              userId: data.userId,
              role: 'CAPTAIN',
            },
          },
        },
        include: { members: true },
      });
    }

    return this.prisma.gameSession.create({
      data: {
        teamId: team.id,
        routeId: data.routeId,
        cityId: data.cityId,
      },
      include: { team: true, route: true, city: true },
    });
  }

  findSession(sessionId: string) {
    return this.prisma.gameSession.findUnique({
      where: { id: sessionId },
      include: { team: true, route: true, city: true, currentCheckpoint: true, events: true },
    });
  }

  findByTeam(teamId: string) {
    return this.prisma.gameSession.findMany({
      where: { teamId },
      include: { route: true, city: true, currentCheckpoint: true, events: true },
    });
  }

  async addSessionEvent(sessionId: string, payload: CreateSessionEventDto) {
    const session = await this.prisma.gameSession.findUnique({
      where: { id: sessionId },
      include: { events: true },
    });
    if (!session) {
      throw new NotFoundException('Sesión de juego no encontrada');
    }

    // ── IDEMPOTENCIA ──
    // Si la sesión ya está COMPLETED, rechazar eventos de scoring
    if (session.status === 'COMPLETED' &&
        (payload.eventType === EventType.SESSION_FINISHED ||
         payload.eventType === EventType.CHECKPOINT_REACHED ||
         payload.eventType === EventType.QR_SCANNED)) {
      throw new NotFoundException('La sesión ya fue completada. No se pueden registrar más eventos.');
    }

    // Para QR_SCANNED: verificar si el mismo código QR ya fue escaneado
    if (payload.eventType === EventType.QR_SCANNED) {
      const qrCode = payload.eventData?.['qrCode'];
      if (qrCode) {
        const alreadyScanned = session.events.some(
          (e) => e.eventType === EventType.QR_SCANNED &&
                typeof e.eventData === 'object' &&
                e.eventData !== null &&
                (e.eventData as Record<string, unknown>)['qrCode'] === qrCode
        );
        if (alreadyScanned) {
          const lastEvent = session.events[session.events.length - 1];
          return lastEvent;
        }
      }
    }

    // Para CHECKPOINT_REACHED: si el checkpoint ya es el actual, no duplicar puntos
    if (payload.eventType === EventType.CHECKPOINT_REACHED &&
        payload.checkpointId &&
        session.currentCheckpointId === payload.checkpointId) {
      // El checkpoint ya fue alcanzado, devolver el último evento sin modificar
      const lastEvent = session.events[session.events.length - 1];
      return lastEvent;
    }

    const event = await this.prisma.sessionEvent.create({
      data: {
        sessionId,
        eventType: payload.eventType,
        eventData: payload.eventData as unknown as object,
      },
    });

    const updateData: Record<string, unknown> = {};

    if (payload.eventType === EventType.CHECKPOINT_REACHED && payload.checkpointId) {
      // Idempotencia: no actualizar si ya está en ese checkpoint
      if (session.currentCheckpointId !== payload.checkpointId) {
        updateData.currentCheckpointId = payload.checkpointId;
        updateData.score = { increment: 10 };
      }
    }

    if (payload.eventType === EventType.QR_SCANNED) {
      updateData.score = { increment: 15 };
    }

    if (payload.eventType === EventType.SESSION_FINISHED) {
      updateData.status = 'COMPLETED';
      updateData.finishedAt = new Date();
      // Bonus de misión completa (Mission Pack canónico)
      updateData.score = { increment: 100 };
    }

    if (Object.keys(updateData).length) {
      await this.prisma.gameSession.update({
        where: { id: sessionId },
        data: updateData,
      });
    }

    return event;
  }
}
