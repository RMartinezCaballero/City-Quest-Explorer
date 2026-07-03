import { Body, Controller, Get, Header, HttpCode, HttpStatus, Param, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create')
  @ApiOperation({ summary: 'Crear preferencia de pago' })
  async createPayment(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.createPreference(dto);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/json')
  @ApiOperation({ summary: 'Webhook para notificaciones de pago (Mercado Pago / Wompi)' })
  async webhook(@Body() body: any, @Req() req: Request) {
    const headers = req.headers as Record<string, string>;
    return this.paymentsService.processWebhook(headers, body);
  }

  @Get('status/:paymentId')
  @ApiOperation({ summary: 'Consultar estado de un pago' })
  async getStatus(@Param('paymentId') paymentId: string) {
    return this.paymentsService.getPaymentStatus(paymentId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Listar pagos de un usuario' })
  async getUserPayments(@Param('userId') userId: string) {
    return this.paymentsService.getUserPayments(userId);
  }
}
