import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateNotificationDto {
  type: string;
  teamName: string;
  location: string;
  actors: string[];
  message?: string;
}

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateNotificationDto) {
    // Store notification in session_events for now (using a dedicated eventData structure)
    // In a future iteration, this could be its own table or push notification dispatch
    return {
      id: crypto.randomUUID(),
      type: dto.type,
      teamName: dto.teamName,
      location: dto.location,
      actors: dto.actors,
      message: dto.message ?? '',
      status: 'pending',
      createdAt: new Date(),
    };
  }

  async findAll() {
    // Return recent session events of type NOTIFICATION
    const events = await this.prisma.sessionEvent.findMany({
      where: {
        eventType: 'SESSION_STARTED',
      },
      orderBy: { occurredAt: 'desc' },
      take: 50,
      include: {
        session: {
          include: {
            team: true,
            route: { include: { city: true } },
          },
        },
      },
    });

    return events.map((e) => ({
      id: e.id,
      type: e.eventType,
      teamName: (e.eventData as Record<string, unknown>)?.teamName ?? '',
      location: (e.eventData as Record<string, unknown>)?.location ?? '',
      actors: (e.eventData as Record<string, unknown>)?.actors ?? [],
      message: (e.eventData as Record<string, unknown>)?.message ?? '',
      status: 'sent',
      createdAt: e.occurredAt,
    }));
  }
}
