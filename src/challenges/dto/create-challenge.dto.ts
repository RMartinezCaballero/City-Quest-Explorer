import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateChallengeAnswerDto {
  @ApiProperty({ example: 'MARTIR' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiPropertyOptional({ example: 'Respuesta correcta' })
  @IsString()
  @IsOptional()
  label?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  isCorrect?: boolean;

  @ApiPropertyOptional({ default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  penalty?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  orderIndex?: number;
}

export class CreateChallengeDto {
  @ApiProperty({ example: 'SECRET_CODE', enum: ['SECRET_CODE', 'QR', 'NFC', 'TEXT', 'IMAGE', 'AUDIO', 'GEOLOCATION', 'AI', 'PHYSICAL_OBJECT'] })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: '¿Qué palabra dejó Isabella como pista?' })
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @ApiPropertyOptional({ example: 'Busca en la carta' })
  @IsString()
  @IsOptional()
  hint1?: string;

  @ApiPropertyOptional({ example: 'Está relacionada con los mártires' })
  @IsString()
  @IsOptional()
  hint2?: string;

  @ApiPropertyOptional({ example: 'La respuesta comienza con M' })
  @IsString()
  @IsOptional()
  hint3?: string;

  @ApiPropertyOptional({ example: 'La respuesta es MARTIR' })
  @IsString()
  @IsOptional()
  hint4?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  orderIndex?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  penalty?: number;

  @ApiPropertyOptional({ type: [CreateChallengeAnswerDto] })
  @IsArray()
  @IsOptional()
  @Type(() => CreateChallengeAnswerDto)
  answers?: CreateChallengeAnswerDto[];
}
