import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateRouteDto {
  @ApiProperty({ example: 'Ruta A - Centro Histórico' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Ruta principal por el centro histórico de Cartagena' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: 'EASY', enum: ['EASY', 'MEDIUM', 'HARD'] })
  @IsString()
  @IsOptional()
  difficulty?: string;

  @ApiProperty({ example: 1200 })
  @IsInt()
  @Min(0)
  distanceMeters: number;

  @ApiProperty({ example: 45 })
  @IsInt()
  @Min(1)
  estimatedMinutes: number;

  @ApiPropertyOptional({ default: false })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @ApiPropertyOptional({ example: { requiredMissions: ['M1', 'M2'] } })
  @IsOptional()
  conditions?: Record<string, unknown>;
}
