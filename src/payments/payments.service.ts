import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentProvider } from './providers/payment-provider.interface';
import { MercadoPagoProvider } from './providers/mercadopago.provider';
import { WompiProvider } from './providers/wompi.provider';

@Injectable()
export class PaymentsService {
  private provider: PaymentProvider;

  constructor(
    private readonly prisma: PrismaService,
    mercadopago: MercadoPagoProvider,
    wompi: WompiProvider,
  ) {
    const selected = (process.env.PAYMENT_PROVIDER || 'mercadopago').toLowerCase();
    if (selected === 'wompi' && wompi.isConfigured) {
      this.provider = wompi;
    } else if (mercadopago.isConfigured) {
      this.provider = mercadopago;
    } else {
      this.provider = mercadopago; // fallback, lanzará error al usar si no configurado
    }
  }

  get providerName(): string {
    return this.provider?.name || 'none';
  }

  get isConfigured(): boolean {
    return !!(this.provider);
  }

  async createPreference(dto: { email: string; description: string; amount: number; userId?: string; paymentMethod?: string }) {
    // 1. Crear registro en DB (PENDING)
    const payment = await this.prisma.payment.create({
      data: {
        email: dto.email,
        description: dto.description,
        amount: dto.amount,
        userId: dto.userId,
        status: 'PENDING',
      },
    });

    // 2. Delegar al proveedor configurado
    const apiBase = process.env.API_BASE_URL || 'https://city-quest-explorer-api.onrender.com';
    const frontendUrl = process.env.FRONTEND_URL || 'https://city-quest-admin.vercel.app';

    const result = await this.provider.createPayment({
      email: dto.email,
      description: dto.description,
      amount: dto.amount,
      externalReference: payment.id,
      notificationUrl: `${apiBase}/payments/webhook`,
      backUrlSuccess: `${frontendUrl}/pago/exito`,
      backUrlFailure: `${frontendUrl}/pago/fallo`,
      paymentMethod: dto.paymentMethod,
    });

    // 3. Actualizar DB con ID del proveedor
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        mpPreferenceId: this.providerName === 'mercadopago' ? result.providerTransactionId : null,
        metadata: { provider: this.providerName, providerTransactionId: result.providerTransactionId },
      },
    });

    return {
      paymentId: payment.id,
      provider: this.providerName,
      checkoutUrl: result.checkoutUrl,
    };
  }

  async processWebhook(headers: Record<string, string>, body: any) {
    const result = await this.provider.processWebhook(headers, body);
    if (!result) return { received: true };

    // Buscar pago por provider ID en metadata (Wompi) o mpPaymentId (MercadoPago)
    const providerPaymentIdNum = parseInt(result.providerPaymentId, 10);
    const payment = await this.prisma.payment.findFirst({
      where: {
        OR: [
          { mpPaymentId: isNaN(providerPaymentIdNum) ? undefined : providerPaymentIdNum },
          { metadata: { path: ['providerTransactionId'], equals: result.providerPaymentId } },
        ],
      },
    });

    if (payment) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: result.status,
          mpPaymentId: isNaN(providerPaymentIdNum) ? payment.mpPaymentId : providerPaymentIdNum,
          metadata: { ...(payment.metadata as any || {}), ...result.metadata },
        },
      });
    }

    return { received: true };
  }

  async getPaymentStatus(paymentId: string) {
    return this.prisma.payment.findUnique({
      where: { id: paymentId },
      select: {
        id: true,
        status: true,
        amount: true,
        description: true,
        createdAt: true,
        mpPaymentId: true,
        metadata: true,
      },
    });
  }

  async getUserPayments(userId: string) {
    return this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        description: true,
        amount: true,
        status: true,
        createdAt: true,
      },
    });
  }
}
