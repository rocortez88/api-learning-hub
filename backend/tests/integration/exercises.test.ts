/**
 * Tests de integracion — Exercises
 * Cubre: GET /api/exercises/:id
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

// ─── GET /api/exercises/:id ───────────────────────────────────────────────────

describe('GET /api/exercises/:id', () => {
  it('devuelve 401 si no hay Authorization header', async () => {
    const res = await request(app).get('/api/exercises/some-id');

    expect(res.status).toBe(401);
  });

  it('devuelve 200 con data que NO incluye solution ni validationLogic', async () => {
    const exerciseId = seedBasicExercise(db);
    const { accessToken } = await registerAndLogin(app);

    const res = await request(app)
      .get(`/api/exercises/${exerciseId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');

    const data = res.body.data as Record<string, unknown>;
    expect(data).not.toHaveProperty('solution');
    expect(data).not.toHaveProperty('validationLogic');
    expect(data).not.toHaveProperty('validation_logic');
  });

  it('devuelve 200 con data.validation.options para ejercicio tipo quiz', async () => {
    const exerciseId = seedBasicExercise(db);
    const { accessToken } = await registerAndLogin(app);

    const res = await request(app)
      .get(`/api/exercises/${exerciseId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);

    const data = res.body.data as Record<string, unknown>;
    expect(data).toHaveProperty('validation');

    const validation = data['validation'] as Record<string, unknown>;
    expect(validation).toHaveProperty('options');
    expect(Array.isArray(validation['options'])).toBe(true);

    // Las opciones no deben revelar cual es la respuesta correcta
    const options = validation['options'] as { key: string; text: string }[];
    expect(options.length).toBeGreaterThan(0);
    options.forEach((opt) => {
      expect(opt).toHaveProperty('key');
      expect(opt).toHaveProperty('text');
    });
  });

  it('devuelve 200 con data.hints como array', async () => {
    const exerciseId = seedBasicExercise(db);
    const { accessToken } = await registerAndLogin(app);

    const res = await request(app)
      .get(`/api/exercises/${exerciseId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);

    const data = res.body.data as Record<string, unknown>;
    expect(data).toHaveProperty('hints');
    expect(Array.isArray(data['hints'])).toBe(true);
    expect((data['hints'] as unknown[]).length).toBe(3);
  });

  it('devuelve 404 si el id no existe', async () => {
    const { accessToken } = await registerAndLogin(app);

    const res = await request(app)
      .get('/api/exercises/id-que-no-existe')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(404);
  });
});
