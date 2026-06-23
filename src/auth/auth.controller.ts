import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiOperation({ summary: 'Registrar usuario' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Usuario registrado correctamente' })
  async register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autenticar usuario y obtener token' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Token JWT generado' })
  async login(@Body() payload: LoginDto) {
    // Compatibilidad: con Supabase Auth (modo A) el móvil no usa este endpoint.
    // Se mantiene para no romper integraciones existentes.
    return this.authService.login({
      // eslint no-null assertion: solo se pasa para satisfacer tipos.
      id: 'legacy',
      email: payload.email,
      name: 'legacy',
      role: 'USER',
    } as any);
  }

}
