import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) { }

  // Compatibilidad legacy (ya no se usa con Supabase Auth para el modo A).
  async validateUser(_email: string, _password: string) {
    throw new UnauthorizedException('Login legacy deshabilitado: usa Supabase Auth.');
  }

  async login(_user: { id: string; email: string; name: string; role: string }) {
    throw new UnauthorizedException('Login legacy deshabilitado: usa Supabase Auth.');
  }

  async register(_data: RegisterDto) {
    throw new UnauthorizedException('Register legacy deshabilitado: usa Supabase Auth.');
  }
}

