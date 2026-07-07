import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  findAll() {
    return this.prisma.user.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        phoneNumber: true,
        profilePhotoUrl: true,
        socialAccounts: true,
        isVerified: true,
        verificationMethod: true,
        verificationStatus: true,
        soloMode: true,
        teamId: true,
        playerQrCode: true,
      },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ 
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        phoneNumber: true,
        profilePhotoUrl: true,
        socialAccounts: true,
        isVerified: true,
        verificationMethod: true,
        verificationStatus: true,
        soloMode: true,
        teamId: true,
        playerQrCode: true,
        allergiesNotes: true,
        sensitivityNotes: true,
      },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(payload: { email: string; name: string; password: string; role?: string }) {
    const existing = await this.prisma.user.findUnique({ where: { email: payload.email } });
    if (existing) {
      throw new ConflictException('Ya existe un usuario con ese email');
    }
    const passwordHash = await bcrypt.hash(payload.password, 12);
    return this.prisma.user.create({
      data: {
        email: payload.email,
        name: payload.name,
        passwordHash,
        role: payload.role || 'USER',
      },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
  }

  async updateProfile(userId: string, payload: UpdateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const updateData: any = {
      name: payload.name,
      phoneNumber: payload.phoneNumber,
      profilePhotoUrl: payload.profilePhotoUrl,
      socialAccounts: payload.socialAccounts ?? undefined,
      isVerified: payload.isVerified,
      verificationMethod: payload.verificationMethod,
      verificationStatus: payload.verificationStatus,
      allergiesNotes: payload.allergiesNotes,
      sensitivityNotes: payload.sensitivityNotes,
    };

    if (payload.password) {
      updateData.passwordHash = await bcrypt.hash(payload.password, 12);
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }

  async update(id: string, payload: UpdateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const updateData: any = { name: payload.name };
    if (payload.password) {
      updateData.passwordHash = await bcrypt.hash(payload.password, 12);
    }
    if (payload.phoneNumber !== undefined) updateData.phoneNumber = payload.phoneNumber;
    if (payload.profilePhotoUrl !== undefined) updateData.profilePhotoUrl = payload.profilePhotoUrl;
    if (payload.socialAccounts !== undefined) updateData.socialAccounts = payload.socialAccounts;
    if (payload.isVerified !== undefined) updateData.isVerified = payload.isVerified;
    if (payload.verificationMethod !== undefined) updateData.verificationMethod = payload.verificationMethod;
    if (payload.verificationStatus !== undefined) updateData.verificationStatus = payload.verificationStatus;
    if (payload.allergiesNotes !== undefined) updateData.allergiesNotes = payload.allergiesNotes;
    if (payload.sensitivityNotes !== undefined) updateData.sensitivityNotes = payload.sensitivityNotes;
    if (payload.teamStatus !== undefined) {
      updateData.soloMode = payload.teamStatus !== 'TEAM';
    }
    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true, phoneNumber: true, profilePhotoUrl: true, socialAccounts: true, isVerified: true, verificationMethod: true, verificationStatus: true, soloMode: true, teamId: true, playerQrCode: true },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Usuario no encontrado');
    }
    await this.prisma.user.delete({ where: { id } });
    return { deleted: true, id };
  }
}
