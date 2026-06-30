import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUnlockKeyDto {
  @ApiProperty({ example: 'DYNAMIC_QR', enum: ['DYNAMIC_QR', 'TEMPORAL_TOKEN', 'UNIQUE_CODE', 'NARRATIVE_VARIABLE'] })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'CQE-MP-01-CARTAGENA-UNLOCK' })
  @IsString()
  @IsNotEmpty()
  keyValue: string;

  @ApiPropertyOptional({ example: '2026-12-31T23:59:59Z' })
  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}
