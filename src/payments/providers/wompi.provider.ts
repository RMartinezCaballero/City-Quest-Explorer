import { createHash } from 'crypto';
import { Injectable } from '@nestjs/common';
import { PaymentProvider } from './payment-provider.interface';

const WOMPI_API = () => process.env.WOMPI_API_URL || 'https://sandbox.wompi.co/v1';

@Injectable()
export class WompiProvider implements PaymentProvider {
  readonly name = 'wompi';

  private get privateKey(): string | undefined {
    return process.env.WOMPI_PRIVATE_KEY;
  }

  private get publicKey(): string | undefined {
    return process.env.WOMPI_PUBLIC_KEY;
  }

  private get eventSecret(): string | undefined {
    return process.env.WOMPI_EVENT_SECRET;
  }

  get isConfigured(): boolean {
    return !!(this.privateKey && this.publicKey);
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
    if (!this.isConfigured) throw new Error('WOMPI_PRIVATE_KEY o WOMPI_PUBLIC_KEY no configurados');

    // Obtener acceptance_token requerido por normativa colombiana
    const acceptanceRes = await fetch(`${WOMPI_API()}/merchants/${this.publicKey}`);
    const merchantData = await acceptanceRes.json() as any;
    const acceptanceToken = merchantData?.data?.presigned_acceptance?.acceptance_token;

    // Determinar método de pago (NEQUI por defecto, funciona sin frontend widget)
    const methodType = data.paymentMethod || 'NEQUI';

    // Construir payment_method según el tipo
    const paymentMethodBody: Record<string, any> = { type: methodType };
    if (methodType === 'NEQUI') {
      paymentMethodBody.user_type = 'CUSTOMER';
      paymentMethodBody.user_email = data.email;
    }

    // Crear transacción en Wompi
    const res = await fetch(`${WOMPI_API()}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.privateKey}`,
      },
      body: JSON.stringify({
        amount_in_cents: data.amount,
        currency: 'COP',
        customer_email: data.email,
        reference: data.externalReference,
        payment_method: paymentMethodBody,
        acceptance_token: acceptanceToken,
        redirect_url: data.backUrlSuccess,
      }),
    });

    const result = await res.json() as any;

    if (!res.ok) {
      throw new Error(`Wompi error: ${JSON.stringify(result)}`);
    }

    const transaction = result.data;
    if (!transaction?.id) {
      throw new Error('Wompi: no se obtuvo ID de transacción');
    }

    // Wompi redirect checkout URL
    const checkoutUrl = `${WOMPI_API()}/transactions/${transaction.id}/redirect`;

    return {
      paymentId: data.externalReference,
      providerTransactionId: transaction.id,
      checkoutUrl,
    };
  }

  async processWebhook(headers: Record<string, string>, body: any) {
    // Validar firma SHA256
    if (this.eventSecret && body?.signature?.checksum && body?.timestamp) {
      const properties = body.signature.properties || [];
      const toConcat = properties
        .map((p: string) => body[p] ?? body?.data?.[p] ?? '')
        .join('');
      const checkString = toConcat + body.timestamp + this.eventSecret;
      const hash = this.sha256(checkString);
      if (hash !== body.signature.checksum) {
        return null; // Firma inválida
      }
    }

    if (body?.event !== 'transaction.updated') return null;
    const transaction = body?.data?.transaction;
    if (!transaction?.id) return null;

    const statusMap: Record<string, 'APPROVED' | 'REJECTED' | 'PENDING' | 'REFUNDED'> = {
      APPROVED: 'APPROVED',
      DECLINED: 'REJECTED',
      VOIDED: 'REJECTED',
      ERROR: 'REJECTED',
      PENDING: 'PENDING',
      REFUNDED: 'REFUNDED',
    };

    return {
      providerPaymentId: transaction.id,
      status: statusMap[transaction.status] || 'PENDING',
      metadata: { wompiStatus: transaction.status, reference: transaction.reference },
    };
  }

  async getPaymentStatus(providerPaymentId: string) {
    if (!this.privateKey) throw new Error('WOMPI_PRIVATE_KEY no configurado');

    const res = await fetch(`${WOMPI_API()}/transactions/${providerPaymentId}`, {
      headers: { Authorization: `Bearer ${this.privateKey}` },
    });
    const result = await res.json() as any;
    const transaction = result?.data;

    if (!transaction) {
      throw new Error(`Wompi: transacción no encontrada ${providerPaymentId}`);
    }

    const statusMap: Record<string, 'APPROVED' | 'REJECTED' | 'PENDING' | 'REFUNDED'> = {
      APPROVED: 'APPROVED',
      DECLINED: 'REJECTED',
      VOIDED: 'REJECTED',
      ERROR: 'REJECTED',
      PENDING: 'PENDING',
      REFUNDED: 'REFUNDED',
    };

    const wompiStatus = transaction.status || 'PENDING';
    return {
      status: statusMap[wompiStatus] || 'PENDING',
      metadata: { wompiStatus: transaction.status },
    };
  }

  private sha256(str: string): string {
    return createHash('sha256').update(str).digest('hex');
  }
}
