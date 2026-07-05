import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport';
import { ExtractJwt } from 'passport-jwt';
import { SupabaseJwksClient } from './supabase-jwks.client';
import { SupabaseUserSyncService } from './supabase-user-sync.service';

/**
 * Estrategia JWT que verifica tokens usando JWKS de Supabase (vía `jose`).
 *
 * Soporta ES256 (algoritmo actual de Supabase) y rotación automática de claves.
 * No depende de `secretOrKey` compartido.
 */
@Injectable()
export class SupabaseJwtStrategy extends PassportStrategy(Strategy as any, 'jwt') {
  constructor(
    private readonly jwksClient: SupabaseJwksClient,
    private readonly supabaseUserSync: SupabaseUserSyncService,
  ) {
    super();
  }

  async authenticate(req: any): Promise<void> {
    try {
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

      if (!token) {
        return this.fail({ message: 'Token no proporcionado' }, 401);
      }

      const verified = await this.jwksClient.verifyToken(token);

      if (!verified.sub) {
        return this.fail({ message: 'Token inválido: falta sub' }, 401);
      }

      const payload = verified as Record<string, unknown>;
      const name = (payload?.user_metadata as Record<string, unknown> | undefined)
        ?.name as string | undefined;
      const email =
        (payload?.email as string | undefined) ||
        ((payload?.user_metadata as Record<string, unknown> | undefined)
          ?.email as string | undefined);

      // Sincroniza el usuario de Supabase -> tabla Prisma
      const dbUser = await this.supabaseUserSync.upsertFromSupabaseUser({
        sub: verified.sub,
        email,
        name,
      });

      this.success({
        id: dbUser.id, // ← Usar el ID real de Prisma, no el sub de Supabase
        supabaseUserId: verified.sub,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role,
      });
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : 'Token Supabase inválido';
      this.fail({ message }, 401);
    }
  }
}
