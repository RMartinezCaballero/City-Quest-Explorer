import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateRankingDto {
  @ApiProperty({ example: 'c12e8e12-98e9-4d71-9aca-8fce5fcd3dc4' })
  @IsString()
  @IsNotEmpty()
  teamId: string;

  @ApiProperty({ example: 350 })
  @IsInt()
  @Min(0)
  score: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  position: number;
}
