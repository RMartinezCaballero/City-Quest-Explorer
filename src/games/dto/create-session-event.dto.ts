import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export enum EventType {
  LOCATION_UPDATE = 'LOCATION_UPDATE',
  QR_SCANNED = 'QR_SCANNED',
  CHECKPOINT_REACHED = 'CHECKPOINT_REACHED',
  SESSION_FINISHED = 'SESSION_FINISHED',
}

export class CreateSessionEventDto {
  @ApiProperty({ enum: EventType })
  @IsEnum(EventType)
  eventType: EventType;

  @ApiProperty({ example: { latitude: 40.4168, longitude: -3.7038 } })
  @IsObject()
  @IsNotEmpty()
  eventData: Record<string, unknown>;

  @ApiProperty({ required: false, example: 'd5b8f6e1-054e-4128-b199-3da7f8a29c1a' })
  @IsString()
  @IsOptional()
  checkpointId?: string;
}
