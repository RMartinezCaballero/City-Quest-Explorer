import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AdminGuard } from '../common/guards/admin.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsIn } from 'class-validator';

export class UpdateUserVerificationDto {
  @ApiPropertyOptional({ enum: ['EMAIL', 'PHONE', 'ADMIN'] })
  @IsOptional()
  @IsString()
  @IsIn(['EMAIL', 'PHONE', 'ADMIN'])
  verificationMethod?: 'EMAIL' | 'PHONE' | 'ADMIN';

  @ApiPropertyOptional({ enum: ['APPROVED', 'PENDING', 'REJECTED'] })
  @IsOptional()
  @IsString()
  @IsIn(['APPROVED', 'PENDING', 'REJECTED'])
  verificationStatus?: 'APPROVED' | 'PENDING' | 'REJECTED';

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Listar todos los usuarios (admin)' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Obtener usuario por ID (admin)' })
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Crear un nuevo usuario (admin)' })
  create(@Body() payload: { email: string; name: string; password: string; role?: string }) {
    return this.usersService.create(payload);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Actualizar un usuario (admin)' })
  update(@Param('id') id: string, @Body() payload: UpdateUserDto) {
    return this.usersService.update(id, payload);
  }

  @Patch(':id/verification')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Actualizar verificación de usuario (admin)' })
  updateVerification(@Param('id') id: string, @Body() payload: UpdateUserVerificationDto) {
    return this.usersService.updateVerification(id, payload);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Eliminar un usuario (admin)' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
