import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateStoryEndingDto {
  @ApiProperty({ example: 'Final Feliz' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'El equipo descubre la verdad y Cartagena está a salvo' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: { minScore: 800, requiredMissions: 10 } })
  @IsOptional()
  conditions?: Record<string, unknown>;

  @ApiPropertyOptional({ example: 'Y así, los investigadores lograron restaurar el Manuscrito...' })
  @IsString()
  @IsOptional()
  narrative?: string;

  @ApiPropertyOptional({ example: 'https://example.com/ending-video.mp4' })
  @IsString()
  @IsOptional()
  mediaUrl?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  orderIndex?: number;
}
