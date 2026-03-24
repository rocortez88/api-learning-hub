/**
 * Tests de integracion — Auth
 * Cubre: POST /api/auth/register, login, logout, refresh
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

// ─── POST /api/auth/register ──────────────────────────────────────────────────

describe('POST /api/auth/register', () => {
  it('devuelve 201 con accessToken, refreshToken y user sin passwordHash', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'alice@example.com', username: 'alice', password: 'Password123!' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).not.toHaveProperty('passwordHash');
    expect(res.body.user).not.toHaveProperty('password_hash');
    expect(res.body.user.email).toBe('alice@example.com');
    expect(res.body.user.username).toBe('alice');
  });

  it('devuelve 409 si el email ya existe', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'dup@example.com', username: 'user1', password: 'Password123!' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'dup@example.com', username: 'user2', password: 'Password123!' });

    expect(res.status).toBe(409);
  });

  it('devuelve 409 si el username ya existe', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'first@example.com', username: 'sameuser', password: 'Password123!' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'second@example.com', username: 'sameuser', password: 'Password123!' });

    expect(res.status).toBe(409);
  });

  it('devuelve 400 si el password tiene menos de 8 caracteres', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'bob@example.com', username: 'bob', password: 'short' });

    expect(res.status).toBe(400);
  });

  it('devuelve 400 si el email es invalido', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'not-an-email', username: 'bob2', password: 'Password123!' });

    expect(res.status).toBe(400);
  });

  it('devuelve 400 si el username contiene caracteres especiales', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'carol@example.com', username: 'user@name', password: 'Password123!' });

    expect(res.status).toBe(400);
  });
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

describe('POST /api/auth/login', () => {
  it('devuelve 200 con tokens tras registro previo', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'dave@example.com', username: 'dave', password: 'Password123!' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'dave@example.com', password: 'Password123!' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  });

  it('devuelve 401 con mensaje generico si el email no existe', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'noexiste@example.com', password: 'Password123!' });

    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe('Credenciales invalidas');
  });

  it('devuelve 401 con el mismo mensaje generico si el password es incorrecto', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'eve@example.com', username: 'eve', password: 'CorrectPass1!' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'eve@example.com', password: 'WrongPass99!' });

    expect(res.status).toBe(401);
    expect(res.body.error.message).toBe('Credenciales invalidas');
  });
});

// ─── POST /api/auth/logout ────────────────────────────────────────────────────

describe('POST /api/auth/logout', () => {
  it('devuelve 401 si no hay Authorization header', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .send({ refreshToken: 'irrelevant' });

    expect(res.status).toBe(401);
  });

  it('devuelve 204 con token valido', async () => {
    const { accessToken, refreshToken } = await registerAndLogin(app);

    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ refreshToken });

    expect(res.status).toBe(204);
  });

  it('devuelve 204 en un segundo logout con el mismo refreshToken (idempotente)', async () => {
    const { accessToken, refreshToken } = await registerAndLogin(app);

    await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ refreshToken });

    // Segundo intento — debe seguir siendo 204, no 401 ni 500
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ refreshToken });

    expect(res.status).toBe(204);
  });
});

// ─── POST /api/auth/refresh ───────────────────────────────────────────────────

describe('POST /api/auth/refresh', () => {
  it('devuelve 200 con nuevos tokens al enviar un refreshToken valido', async () => {
    const { refreshToken } = await registerAndLogin(app);

    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  });

  it('devuelve 401 si el refreshToken es un JWT invalido', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: 'not-a-jwt' });

    expect(res.status).toBe(401);
  });

  it('devuelve 401 si se usa el refreshToken viejo tras una rotacion', async () => {
    const { refreshToken: oldToken } = await registerAndLogin(app);

    // Primera rotacion — consume el token viejo
    await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: oldToken });

    // Intentar usar el token viejo de nuevo debe fallar
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: oldToken });

    expect(res.status).toBe(401);
  });
});
