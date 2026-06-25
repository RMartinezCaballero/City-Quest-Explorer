import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createLocalJWKSet, jwtVerify, JWTPayload } from 'jose';

/**
 * JWKS client usando `jose`.
 *
 * - Descarga el JWKS de Supabase (cache 10 min)
 * - Verifica tokens usando el algoritmo correcto (ES256 para Supabase moderno)
 * - Soporta rotación de claves automáticamente
 */
@Injectable()
export class SupabaseJwksClient {
  private jwks: Awaited<ReturnType<typeof createLocalJWKSet>> | null = null;
  private lastFetchTime = 0;
  private fetchPromise: Promise<void> | null = null;

  private getJwksUrl(): string {
    return (
      process.env.SUPABASE_JWKS_URL ||
      'https://ylyajclxleqkfdpyregz.supabase.co/auth/v1/.well-known/jwks.json'
    );
  }

  private async refreshJwks(): Promise<void> {
    // Cache por 10 minutos
    if (this.jwks && Date.now() - this.lastFetchTime < 10 * 60 * 1000) {
      return;
    }

    // Debounce: si ya hay una carga en curso, esperar
    if (this.fetchPromise) {
      await this.fetchPromise;
      return;
    }

    this.fetchPromise = fetch(this.getJwksUrl())
      .then((res) => res.json())
      .then((jwks) => {
        this.jwks = createLocalJWKSet(jwks as any);
        this.lastFetchTime = Date.now();
      })
      .finally(() => {
        this.fetchPromise = null;
      });

    await this.fetchPromise;
  }

  /**
   * Verifica un JWT usando JWKS.
   * Soporta ES256, RS256 y cualquier algoritmo soportado por `jose`.
   */
  async verifyToken<T extends JWTPayload = JWTPayload>(
    token: string,
  ): Promise<T> {
    await this.refreshJwks();

    if (!this.jwks) {
      throw new UnauthorizedException('No se pudo cargar JWKS de Supabase');
    }

    try {
      const { payload } = await jwtVerify(token, this.jwks);
      return payload as T;
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : 'Error desconocido al verificar token';
      throw new UnauthorizedException(`Token Supabase inválido: ${message}`);
    }
  }
}
