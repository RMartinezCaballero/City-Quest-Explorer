import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SupabaseUserSyncService } from './supabase-user-sync.service';


// Nota: esta estrategia seguirá usando la verificación por secreto.
// En un siguiente paso la reemplazaremos por validación con JWKS de Supabase.

@Injectable()
export class SupabaseJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly supabaseUserSync: SupabaseUserSyncService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.SUPABASE_JWT_SECRET || process.env.JWT_SECRET || 'supersecretjwtkey',
        });
    }

    async validate(payload: any) {
        // Supabase JWT típicamente incluye `sub` y `email`.
        const sub = payload?.sub as string | undefined;
        if (!sub) {
            throw new UnauthorizedException('Token Supabase inválido: falta sub');
        }

        // name puede venir en `user_metadata.name` (o similar) según configuración.
        const name = payload?.user_metadata?.name as string | undefined;
        const email = (payload?.email || payload?.user_metadata?.email) as string | undefined;

        // Sincroniza el usuario de Supabase -> tabla Prisma.
        // Si falla, el request se rechaza por Unauthorized/500 según el error del servicio.
        await this.supabaseUserSync.upsertFromSupabaseUser({
            sub,
            email,
            name,
        });

        return {
            id: sub,
            email,
            name,
            role: 'USER',
        };
    }
}

