import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateRouteDto {
  @ApiProperty({ example: 'Ruta histórica' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Ruta guiada por los principales puntos históricos de la ciudad' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 1200 })
  @IsInt()
  @Min(0)
  distanceMeters: number;

  @ApiProperty({ example: 45 })
  @IsInt()
  @Min(1)
  estimatedMinutes: number;
}
