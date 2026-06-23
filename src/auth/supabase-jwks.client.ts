import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as https from 'https';

/**
 * JWKS client manual (sin `jose`).
 * - Descarga el JWKS (cache simple en memoria)
 * - Selecciona la key por `kid`
 * - Verifica firma con la clave pública (RS256)
 */
@Injectable()
export class SupabaseJwksClient {
    private cache: { jwks: any; fetchedAt: number } | null = null;

    private async fetchJson(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            https
                .get(url, (res) => {
                    let data = '';
                    res.on('data', (chunk) => (data += chunk));
                    res.on('end', () => {
                        try {
                            resolve(JSON.parse(data));
                        } catch (e) {
                            reject(e);
                        }
                    });
                })
                .on('error', reject);
        });
    }

    private async getJwks(): Promise<any> {
        const url = process.env.SUPABASE_JWKS_URL;
        if (!url) {
            throw new UnauthorizedException('Falta SUPABASE_JWKS_URL');
        }

        // cache 10 minutos
        if (this.cache && Date.now() - this.cache.fetchedAt < 10 * 60 * 1000) {
            return this.cache.jwks;
        }

        const jwks = await this.fetchJson(url);
        this.cache = { jwks, fetchedAt: Date.now() };
        return jwks;
    }

    async verifyToken<T extends Record<string, any>>(token: string, issuer?: string, audience?: string): Promise<T> {
        const decodedHeader = jwt.decode(token, { complete: true }) as { header?: any } | null;
        const kid = decodedHeader?.header?.kid;

        if (!kid) {
            throw new UnauthorizedException('Token inválido: falta kid');
        }

        const jwks = await this.getJwks();
        const keys = Array.isArray(jwks?.keys) ? jwks.keys : [];
        const jwk = keys.find((k: any) => k.kid === kid);

        if (!jwk) {
            throw new UnauthorizedException('JWKS inválido: no existe la clave para el kid');
        }

        // jsonwebtoken soporta JWK con la forma { key: PEM, ... }
        // Para RSA, construimos PEM desde n/e suele ser necesario; en este MVP manual
        // usamos la ruta alternativa: Supabase suele entregar jwk con `x5c`.
        // Preferimos x5c[0] si existe.
        const x5c: string[] | undefined = jwk.x5c;
        let publicKeyPem: string | undefined;

        if (x5c && x5c.length > 0) {
            const cert = x5c[0];
            publicKeyPem = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----`;
        }

        if (!publicKeyPem) {
            throw new UnauthorizedException('JWKS: no se encontró x5c para construir la clave pública');
        }

        try {
            const verified = jwt.verify(token, publicKeyPem, {
                algorithms: ['RS256'],
                issuer,
                audience,
            }) as T;
            return verified;
        } catch (e) {
            throw new UnauthorizedException('Token Supabase inválido');
        }
    }
}



