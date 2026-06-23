import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async updateProfile(userId: string, payload: UpdateUserDto) {
    // Validar que el usuario existe primero
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Preparar datos para actualizar
    const updateData: any = {
      name: payload.name,
    };

    // Si se proporciona password, hashearla y guardarla
    if (payload.password) {
      updateData.passwordHash = await bcrypt.hash(payload.password, 12);
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }
}
