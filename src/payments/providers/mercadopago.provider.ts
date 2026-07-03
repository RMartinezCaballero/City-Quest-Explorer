import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Preference, Payment as MpPayment } from 'mercadopago';
import { PaymentProvider } from './payment-provider.interface';

@Injectable()
export class MercadoPagoProvider implements PaymentProvider {
  readonly name = 'mercadopago';
  private client: MercadoPagoConfig;

  constructor() {
    const token = process.env.MP_ACCESS_TOKEN;
    if (token) {
      this.client = new MercadoPagoConfig({ accessToken: token });
    }
  }

  get isConfigured(): boolean {
    return !!this.client;
  }

  async createPayment(data: {
    email: string;
    description: string;
    amount: number;
    externalReference: string;
    notificationUrl: string;
    backUrlSuccess: string;
    backUrlFailure: string;
    paymentMethod?: string;
  }) {
    if (!this.client) throw new Error('MP_ACCESS_TOKEN no configurado');

    const preference = new Preference(this.client);
    const result = await preference.create({
      body: {
        items: [{
          id: data.externalReference,
          title: data.description,
          unit_price: data.amount,
          quantity: 1,
          currency_id: 'COP',
        }],
        payer: { email: data.email },
        back_urls: {
          success: data.backUrlSuccess,
          failure: data.backUrlFailure,
          pending: `${data.backUrlFailure}?status=pending`,
        },
        auto_return: 'approved',
        notification_url: data.notificationUrl,
        statement_descriptor: 'CITY QUEST EXP',
        external_reference: data.externalReference,
      },
    });

    const checkoutUrl = result.init_point || result.sandbox_init_point;
    if (!checkoutUrl) throw new Error('MercadoPago: no se obtuvo init_point');
    if (!result.id) throw new Error('MercadoPago: no se obtuvo ID de preferencia');

    return {
      paymentId: data.externalReference,
      providerTransactionId: result.id,
      checkoutUrl,
    };
  }

  async processWebhook(headers: Record<string, string>, body: any) {
    let paymentId: number | null = null;

    if (body?.type === 'payment' && body?.data?.id) {
      paymentId = parseInt(body.data.id, 10);
    } else if (body?.topic === 'payment' && body?.resource) {
      const parts = body.resource.split('/');
      paymentId = parseInt(parts[parts.length - 1], 10);
    }

    if (!paymentId) return null;

    if (!this.client) throw new Error('MP_ACCESS_TOKEN no configurado');

    const payment = new MpPayment(this.client);
    const mpPayment = await payment.get({ id: paymentId });
    const mpStatus = mpPayment.status || 'pending';

    const statusMap: Record<string, 'APPROVED' | 'REJECTED' | 'PENDING' | 'REFUNDED'> = {
      approved: 'APPROVED',
      rejected: 'REJECTED',
      cancelled: 'REJECTED',
      refunded: 'REFUNDED',
      in_process: 'PENDING',
      pending: 'PENDING',
    };

    return {
      providerPaymentId: String(paymentId),
      status: statusMap[mpStatus] || 'PENDING',
      metadata: {
        mpStatus: mpPayment.status || null,
        mpDetail: mpPayment.status_detail || null,
        externalReference: mpPayment.external_reference || null,
      },
    };
  }

  async getPaymentStatus(providerPaymentId: string) {
    if (!this.client) throw new Error('MP_ACCESS_TOKEN no configurado');

    const payment = new MpPayment(this.client);
    const mpPayment = await payment.get({ id: parseInt(providerPaymentId, 10) });
    const mpStatus = mpPayment.status || 'pending';

    const statusMap: Record<string, 'APPROVED' | 'REJECTED' | 'PENDING' | 'REFUNDED'> = {
      approved: 'APPROVED',
      rejected: 'REJECTED',
      cancelled: 'REJECTED',
      refunded: 'REFUNDED',
      in_process: 'PENDING',
      pending: 'PENDING',
    };

    return {
      status: statusMap[mpStatus] || 'PENDING',
      metadata: { mpStatus: mpPayment.status || null, mpDetail: mpPayment.status_detail || null },
    };
  }
}
