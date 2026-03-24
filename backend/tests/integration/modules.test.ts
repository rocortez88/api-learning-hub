/**
 * Tests de integracion — Modules
 * Cubre: GET /api/modules, GET /api/modules/:slug
 */

import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { randomUUID } from 'crypto';
import {
  createTestApp,
  clearAllTables,
  registerAndLogin,
} from '../helpers/setup.js';
import { modules } from '../../src/db/schema.js';

const { app, db } = createTestApp();

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

  // NOTA: El schema actual (moduleParamsSchema) solo valida min(1) en el slug,
  // por lo que cualquier cadena no vacia pasa la validacion y llega al servicio.
  // Un slug con formato invalido (e.g. solo numeros) devuelve 404 si no existe
  // en la DB — el servicio no distingue "formato invalido" de "no encontrado".
  // Este test documenta el comportamiento actual.
  it('devuelve 404 para slug con formato no convencional (solo numeros) que no existe en la DB', async () => {
    const { accessToken } = await registerAndLogin(app);

    const res = await request(app)
      .get('/api/modules/12345')
      .set('Authorization', `Bearer ${accessToken}`);

    // El schema min(1) acepta "12345" como valido; como no existe en la DB → 404.
    expect(res.status).toBe(404);
  });

  it('devuelve 200 con { data } al consultar un slug existente', async () => {
    // Insertar un modulo directamente en la DB de test
    db.insert(modules).values({
      id:          randomUUID(),
      slug:        'fundamentos-test',
      title:       'Fundamentos Test',
      description: 'Modulo de prueba para test de slug existente',
      level:       1,
      order:       99,
    }).run();

    const { accessToken } = await registerAndLogin(app);

    const res = await request(app)
      .get('/api/modules/fundamentos-test')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    const data = res.body.data as Record<string, unknown>;
    expect(data).toHaveProperty('slug', 'fundamentos-test');
    expect(data).toHaveProperty('title', 'Fundamentos Test');
  });
});
