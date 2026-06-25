import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SupabaseJwtStrategy } from './supabase-jwt.strategy';
import { SupabaseJwksClient } from './supabase-jwks.client';
import { SupabaseUserSyncService } from './supabase-user-sync.service';


@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecretjwtkey',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN ? Number(process.env.JWT_EXPIRES_IN) : 3600 },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, SupabaseJwtStrategy, SupabaseJwksClient, SupabaseUserSyncService],

  exports: [AuthService],
})
export class AuthModule { }

