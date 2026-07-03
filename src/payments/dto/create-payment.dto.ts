import { IsEmail, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ description: 'Email del comprador', example: 'jugador@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Descripción del producto', example: 'City Quest - Individual Cartagena' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Monto en COP', example: 100000 })
  @IsInt()
  @Min(1000)
  amount: number;

  @ApiPropertyOptional({ description: 'ID del usuario (opcional si está autenticado)' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ description: 'Método de pago (CARD, NEQUI, PSE). Default según el proveedor.', example: 'NEQUI' })
  @IsOptional()
  @IsString()
  paymentMethod?: string;
}
