import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateStoryDto {
  @ApiProperty({ example: 'El Manuscrito Prohibido' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional({ example: 'En las calles empedradas de Cartagena...' })
  @IsString()
  @IsOptional()
  introduction?: string;

  @ApiPropertyOptional({ example: 'Hace tres siglos, un manuscrito fue...' })
  @IsString()
  @IsOptional()
  lore?: string;

  @ApiPropertyOptional({ example: ['Encontrar el manuscrito', 'Descubrir la verdad'] })
  @IsOptional()
  objectives?: string[];

  @ApiPropertyOptional({ example: 'No se puede usar el móvil para fotos' })
  @IsString()
  @IsOptional()
  rules?: string;
}
