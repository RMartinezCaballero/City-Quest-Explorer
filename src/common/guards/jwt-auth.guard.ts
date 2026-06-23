import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Ojo: esta app usa una estrategia llamada `jwt`.
// Para Supabase, dejamos la estrategia bajo el mismo nombre para no romper el guard.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}

