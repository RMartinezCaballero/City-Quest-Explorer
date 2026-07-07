import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Carlos Pérez' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'NuevaContraseña123' })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiPropertyOptional({ example: '+573001234567' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  profilePhotoUrl?: string;

  @ApiPropertyOptional({ example: { facebook: '', instagram: '', whatsapp: '', tiktok: '' } })
  @IsOptional()
  socialAccounts?: Record<string, string | null>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @ApiPropertyOptional({ example: 'EMAIL', enum: ['EMAIL', 'PHONE', 'ADMIN'] })
  @IsOptional()
  @IsString()
  verificationMethod?: 'EMAIL' | 'PHONE' | 'ADMIN';

  @ApiPropertyOptional({ example: 'APPROVED', enum: ['PENDING', 'APPROVED', 'REJECTED'] })
  @IsOptional()
  @IsString()
  verificationStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';

  @ApiPropertyOptional({ example: 'Alergia a mariscos' })
  @IsOptional()
  @IsString()
  allergiesNotes?: string;

  @ApiPropertyOptional({ example: 'Sensibilidad a luces estroboscópicas' })
  @IsOptional()
  @IsString()
  sensitivityNotes?: string;

  @ApiPropertyOptional({ example: 'SOLO' })
  @IsOptional()
  @IsString()
  teamStatus?: 'SOLO' | 'TEAM';
}
