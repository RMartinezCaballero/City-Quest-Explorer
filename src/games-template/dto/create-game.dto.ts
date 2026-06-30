import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min, Max, MinLength } from 'class-validator';

export class CreateGameDto {
  @ApiProperty({ example: 'El Manuscrito Prohibido' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional({ example: 'Una aventura urbana por Cartagena' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 120 })
  @IsInt()
  @Min(1)
  @IsOptional()
  durationMinutes?: number;

  @ApiPropertyOptional({ example: 'MEDIUM', enum: ['EASY', 'MEDIUM', 'HARD'] })
  @IsString()
  @IsOptional()
  difficulty?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  maxPlayers?: number;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
