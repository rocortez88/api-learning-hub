/**
 * Tests de integracion — Practice Queue
 * Cubre: GET /api/practice/queue
 */

import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { eq, and } from 'drizzle-orm';
import {
  createTestApp,
  clearAllTables,
  registerAndLogin,
  seedBasicExercise,
} from '../helpers/setup.js';
import { spacedRepetition } from '../../src/db/schema.js';

const { app, db } = createTestApp();

beforeEach(() => {
  clearAllTables();
});

// ─── GET /api/practice/queue ──────────────────────────────────────────────────

describe('GET /api/practice/queue', () => {
  it('devuelve 401 si no hay Authorization header', async () => {
    const res = await request(app).get('/api/practice/queue');

    expect(res.status).toBe(401);
  });

  it('devuelve 200 con cola vacia { data: [], total: 0 } en DB limpia', async () => {
    const { accessToken } = await registerAndLogin(app);

    const res = await request(app)
      .get('/api/practice/queue')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toHaveLength(0);
    expect(res.body).toHaveProperty('meta');
    expect(res.body.meta).toHaveProperty('total', 0);
  });

  it('devuelve 200 con el ejercicio en cola tras un intento fallido backdateado', async () => {
    const exerciseId = seedBasicExercise(db);
    const { accessToken, userId } = await registerAndLogin(app);

    // 1. Hacer un intento fallido para que SM-2 cree el registro spaced_repetition
    await request(app)
      .post(`/api/exercises/${exerciseId}/attempt`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ submittedCode: 'x' });

    // 2. Retroceder nextReviewAt al pasado directamente en la DB
    //    (SM-2 tras fallo pone intervalDays=1, es decir manana — forzamos a ayer)
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    db.update(spacedRepetition)
      .set({ nextReviewAt: pastDate })
      .where(
        and(
          eq(spacedRepetition.userId, userId),
          eq(spacedRepetition.exerciseId, exerciseId),
        ),
      )
      .run();

    // 3. Consultar la cola — el ejercicio debe aparecer
    const res = await request(app)
      .get('/api/practice/queue')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.meta.total).toBe(1);

    const item = res.body.data[0] as Record<string, unknown>;
    expect(item).toHaveProperty('exercise');
    const exercise = item['exercise'] as Record<string, unknown>;
    expect(exercise['id']).toBe(exerciseId);
  });
});
