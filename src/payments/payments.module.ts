import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MercadoPagoProvider } from './providers/mercadopago.provider';
import { WompiProvider } from './providers/wompi.provider';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, MercadoPagoProvider, WompiProvider],
  exports: [PaymentsService],
})
export class PaymentsModule {}
