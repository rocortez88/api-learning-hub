/**
 * Tests de integracion — Attempts
 * Cubre: POST /api/exercises/:id/attempt
 */

import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import {
  createTestApp,
  clearAllTables,
  registerAndLogin,
  seedBasicExercise,
} from '../helpers/setup.js';

const { app, db } = createTestApp();

beforeEach(() => {
  clearAllTables();
});

// ─── POST /api/exercises/:id/attempt ─────────────────────────────────────────

describe('POST /api/exercises/:id/attempt', () => {
  it('devuelve 401 si no hay Authorization header', async () => {
    const res = await request(app)
      .post('/api/exercises/some-id/attempt')
      .send({ submittedCode: 'b' });

    expect(res.status).toBe(401);
  });

  it('devuelve 200 con passed: true, solution y nextReviewAt al responder correctamente', async () => {
    const exerciseId = seedBasicExercise(db);
    const { accessToken } = await registerAndLogin(app);

    const res = await request(app)
      .post(`/api/exercises/${exerciseId}/attempt`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ submittedCode: 'b' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    const data = res.body.data as Record<string, unknown>;
    expect(data).toHaveProperty('passed', true);
    expect(data).toHaveProperty('solution');
    expect(data).toHaveProperty('nextReviewAt');
    expect(typeof data['nextReviewAt']).toBe('string');
  });

  it('devuelve 200 con passed: false y SIN campo solution al responder incorrectamente', async () => {
    const exerciseId = seedBasicExercise(db);
    const { accessToken } = await registerAndLogin(app);

    const res = await request(app)
      .post(`/api/exercises/${exerciseId}/attempt`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ submittedCode: 'x' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    const data = res.body.data as Record<string, unknown>;
    expect(data).toHaveProperty('passed', false);
    expect(data).not.toHaveProperty('solution');
  });

  it('devuelve 400 si submittedCode esta vacio', async () => {
    const exerciseId = seedBasicExercise(db);
    const { accessToken } = await registerAndLogin(app);

    const res = await request(app)
      .post(`/api/exercises/${exerciseId}/attempt`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ submittedCode: '' });

    expect(res.status).toBe(400);
  });
});
