import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { clientIp } from './client-ip.js';

const LIMIT = 5;
const TTL_MS = 60_000;
const hits = new Map<string, number[]>();

// Reemplaza a @nestjs/throttler (CommonJS, sin soporte para NestJS 12). Mismo límite que tenía: 5 por minuto.
// ponytail: memoria por instancia; pasar a Redis si hay más de una réplica.
@Injectable()
export class RateLimitGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();
    const key = `${context.getHandler().name}:${clientIp(req)}`;
    const now = Date.now();
    const recent = (hits.get(key) ?? []).filter((t) => now - t < TTL_MS);
    if (recent.length >= LIMIT) {
      throw new HttpException(
        'Demasiadas solicitudes, intenta más tarde',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    if (hits.size > 10_000) hits.clear();
    recent.push(now);
    hits.set(key, recent);
    return true;
  }
}
