import { Request } from 'express';

// Detrás de Cloudflare + Caddy: cf-connecting-ip trae la IP real del cliente y
// x-forwarded-for llega como "cliente, ip-de-cloudflare", así que se toma el primero.
export function clientIp(req: Request): string {
  const cf = req.headers['cf-connecting-ip'];
  if (typeof cf === 'string' && cf) return cf;
  const fwd = req.headers['x-forwarded-for'];
  const first = (Array.isArray(fwd) ? fwd[0] : fwd)?.split(',')[0].trim();
  return first || req.ip || 'unknown';
}
