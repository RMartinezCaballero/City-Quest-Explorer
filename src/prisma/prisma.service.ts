import { Injectable, OnModuleInit, INestApplication, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Base de datos conectada correctamente a través de Prisma');
    } catch (error) {
      console.error('❌ Error al conectar con la base de datos en PrismaService:', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Nota: $on() tipado estricto puede fallar según versión Prisma/TS.
  // Mantenemos el hook de cierre deshabilitado para no romper compilación.
  async enableShutdownHooks(_app: INestApplication) {
    return;
  }

}
