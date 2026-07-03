/** Interfaz común para proveedores de pago (Mercado Pago, Wompi, etc.) */
export interface PaymentProvider {
  /** Nombre del proveedor */
  readonly name: string;

  /** Crea una preferencia/transacción de pago y devuelve el link de checkout */
  createPayment(data: {
    email: string;
    description: string;
    amount: number;       // En COP
    externalReference: string;
    notificationUrl: string;
    backUrlSuccess: string;
    backUrlFailure: string;
    paymentMethod?: string;  // Tipo de pago (CARD, NEQUI, PSE, etc.)
  }): Promise<{
    paymentId: string;       // ID local
    providerTransactionId: string;  // ID en el proveedor
    checkoutUrl: string;            // URL para redirigir al checkout
  }>;

  /** Procesa un webhook entrante del proveedor */
  processWebhook(headers: Record<string, string>, body: any): Promise<{
    providerPaymentId: string;
    status: 'APPROVED' | 'REJECTED' | 'PENDING' | 'REFUNDED';
    metadata?: Record<string, any>;
  } | null>;

  /** Consulta el estado de un pago en el proveedor */
  getPaymentStatus(providerPaymentId: string): Promise<{
    status: 'APPROVED' | 'REJECTED' | 'PENDING' | 'REFUNDED';
    metadata?: Record<string, any>;
  }>;
}
