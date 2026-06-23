import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type SupabaseJwtUser = {
    sub: string;
    email?: string;
    name?: string;
};

@Injectable()
export class SupabaseUserSyncService {
    constructor(private readonly prisma: PrismaService) { }

    async upsertFromSupabaseUser(user: SupabaseJwtUser) {
        const email = user.email;
        if (!user.sub) {
            throw new InternalServerErrorException('Supabase token no tiene sub');
        }
        if (!email) {
            throw new InternalServerErrorException('Supabase token no tiene email');
        }

        const existing = await this.prisma.user.findUnique({
            where: { supabaseUserId: user.sub },
        });

        if (existing) {
            return this.prisma.user.update({
                where: { id: existing.id },
                data: {
                    email,
                    name: user.name ?? existing.name,
                },
            });
        }

        // Si el email ya existe pero con otro sub, actualizamos el registro para evitar duplicados.
        const byEmail = await this.prisma.user.findUnique({
            where: { email },
        });

        if (byEmail) {
            return this.prisma.user.update({
                where: { id: byEmail.id },
                data: {
                    // `email` ya existe; vinculamos el sub de Supabase al mismo usuario.
                    supabaseUserId: user.sub,
                    name: user.name ?? byEmail.name,
                },
            });

        }

        return this.prisma.user.create({
            data: {
                email,
                supabaseUserId: user.sub,
                name: user.name ?? 'User',
            },
        });
    }
}

