import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';

export class CreateMissionDto {
  @ApiProperty({ example: 'Juramento en la Muralla' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  title: string;

  @ApiPropertyOptional({ example: 'La piedra despierta cuando caminas con intención...' })
  @IsString()
  @IsOptional()
  narrative?: string;

  @ApiPropertyOptional({ example: 'Encuentra el QR en la muralla y escanéalo' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(0)
  orderIndex: number;

  @ApiPropertyOptional({ example: 5 })
  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  difficulty?: number;

  @ApiPropertyOptional({ example: 15 })
  @IsInt()
  @Min(1)
  @IsOptional()
  timeLimit?: number;

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440101' })
  @IsString()
  @IsOptional()
  checkpointId?: string;

  @ApiPropertyOptional({ example: 'https://example.com/video.mp4' })
  @IsString()
  @IsOptional()
  mediaUrl?: string;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  isLastMission?: boolean;
}
