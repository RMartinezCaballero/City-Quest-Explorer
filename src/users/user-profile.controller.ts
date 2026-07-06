import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../common/decorators/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/me')
export class UserProfileController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  getProfile(@User('id') userId: string) {
    return this.usersService.findById(userId);
  }

  @Patch()
  @ApiOperation({ summary: 'Actualizar perfil del usuario autenticado' })
  updateProfile(@User('id') userId: string, @Body() payload: UpdateUserDto) {
    return this.usersService.updateProfile(userId, payload);
  }
}
