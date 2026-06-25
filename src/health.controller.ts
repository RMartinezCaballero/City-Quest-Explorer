import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from './prisma/prisma.service';

/**
 * Health endpoint para cron job "Mantener Supabase Vivo".
 *
 * Usar con cron-job.org (plan free: 1 job cada 30 min):
 *   - URL: https://tu-app.onrender.com/health
 *   - Frecuencia: cada 30 minutos
 *   - Evita que Supabase duerma el backend tras 7 días de inactividad
 */
@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Health check — verifica que el servidor y la DB respondan' })
  async check() {
    const dbOk = await this.prisma.$queryRaw`SELECT 1`;
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      db: Array.isArray(dbOk) ? 'connected' : 'error',
    };
  }
}
