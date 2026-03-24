/**
 * Tests de integracion — Modules
 * Cubre: GET /api/modules, GET /api/modules/:slug
 */

import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import {
  createTestApp,
  clearAllTables,
  registerAndLogin,
} from '../helpers/setup.js';

const { app } = createTestApp();

beforeEach(() => {
  clearAllTables();
});

// ─── GET /api/modules ─────────────────────────────────────────────────────────

describe('GET /api/modules', () => {
  it('devuelve 401 si no hay Authorization header', async () => {
    const res = await request(app).get('/api/modules');

    expect(res.status).toBe(401);
  });

  it('devuelve 200 con { data: [] } cuando la DB esta vacia', async () => {
    const { accessToken } = await registerAndLogin(app);

    const res = await request(app)
      .get('/api/modules')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data).toHaveLength(0);
  });
});

// ─── GET /api/modules/:slug ───────────────────────────────────────────────────

describe('GET /api/modules/:slug', () => {
  it('devuelve 401 si no hay Authorization header', async () => {
    const res = await request(app).get('/api/modules/fundamentos');

    expect(res.status).toBe(401);
  });

  it('devuelve 404 si el slug no existe', async () => {
    const { accessToken } = await registerAndLogin(app);

    const res = await request(app)
      .get('/api/modules/slug-que-no-existe')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(404);
  });
});
