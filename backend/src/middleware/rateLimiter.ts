import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

// Limiter general para todas las rutas /api
export const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: `Demasiadas solicitudes. Limite: ${env.RATE_LIMIT_MAX_REQUESTS} por minuto.`,
    },
  },
});

// Limiter estricto para rutas de autenticacion
export const authLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_AUTH_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      message: `Demasiados intentos de autenticacion. Limite: ${env.RATE_LIMIT_AUTH_MAX} por minuto.`,
    },
  },
});
