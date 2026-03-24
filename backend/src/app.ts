import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { swaggerSpec } from './config/swagger.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  // ─── Seguridad ────────────────────────────────────────────────────────────
  app.use(helmet());
  app.use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // ─── Body parsing ─────────────────────────────────────────────────────────
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // ─── Rate limiting ────────────────────────────────────────────────────────
  app.use('/api', apiLimiter);

  // ─── Health check ─────────────────────────────────────────────────────────
  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  });

  // ─── Documentacion Swagger ────────────────────────────────────────────────
  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'API Learning Hub — Documentacion',
      swaggerOptions: {
        persistAuthorization: true,
      },
    }),
  );

  // ─── Rutas API ────────────────────────────────────────────────────────────
  // Se registraran aqui en la Fase 3 (modulos auth, users, exercises, etc.)

  // ─── Error handler global (debe ir al final) ──────────────────────────────
  app.use(errorHandler);

  return app;
}
