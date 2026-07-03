import { IsOptional, IsString } from 'class-validator';

export class WebhookPaymentDto {
  @IsOptional()
  @IsString()
  type?: string; // "payment"

  @IsOptional()
  data?: {
    id: string; // Payment ID from Mercado Pago
  };

  @IsOptional()
  action?: string;

  @IsOptional()
  @IsString()
  topic?: string; // "payment", "merchant_order", etc.

  @IsOptional()
  @IsString()
  resource?: string; // URL to fetch payment details
}
