import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { swaggerSpec } from './config/swagger.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { modulesRouter } from './modules/modules/modules.routes.js';
import { exercisesRouter } from './modules/exercises/exercises.routes.js';
import attemptsRouter from './modules/attempts/attempts.routes.js';
import practiceRouter from './modules/practice/practice.routes.js';

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
  app.use('/api/auth', authRouter);
  app.use('/api/modules', modulesRouter);
  app.use('/api/exercises', exercisesRouter);
  app.use('/api/exercises/:id/attempt', attemptsRouter); // POST /api/exercises/:id/attempt
  app.use('/api/practice', practiceRouter);

  // ─── Error handler global (debe ir al final) ──────────────────────────────
  app.use(errorHandler);

  return app;
}
