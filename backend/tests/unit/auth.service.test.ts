/**
 * Unit tests — auth.service.ts
 *
 * Cubre el comportamiento de las funciones de servicio directamente,
 * sin pasar por HTTP. Los tests de integration (auth.test.ts) ya cubren
 * el contrato HTTP; aqui nos enfocamos en la logica interna del servicio.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { eq } from 'drizzle-orm';

import { createTestApp, clearAllTables } from '../helpers/setup.js';
import { db } from '../../src/db/index.js';
import { refreshTokens } from '../../src/db/schema.js';
import { register, login, logout, refresh } from '../../src/modules/auth/auth.service.js';
import { AppError } from '../../src/middleware/errorHandler.js';

// Garantiza que la DB en memoria este migrada antes de cualquier test
createTestApp();

beforeEach(() => {
  clearAllTables();
});

// ─── register ─────────────────────────────────────────────────────────────────

describe('register', () => {
  it('devuelve user sin passwordHash, accessToken y refreshToken al registrar con exito', async () => {
    const result = await register({
      email:    'alice@example.com',
      username: 'alice',
      password: 'Password123!',
    });

    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(result).toHaveProperty('user');
    expect(result.user).not.toHaveProperty('passwordHash');
    expect(result.user).not.toHaveProperty('password_hash');
    expect(result.user.email).toBe('alice@example.com');
    expect(result.user.username).toBe('alice');
    expect(typeof result.accessToken).toBe('string');
    expect(typeof result.refreshToken).toBe('string');
  });

  it('lanza AppError 409 si el email ya esta registrado', async () => {
    await register({
      email:    'dup@example.com',
      username: 'firstuser',
      password: 'Password123!',
    });

    await expect(
      register({
        email:    'dup@example.com',
        username: 'seconduser',
        password: 'Password123!',
      }),
    ).rejects.toSatisfy((err: unknown) => {
      expect(err).toBeInstanceOf(AppError);
      expect((err as AppError).statusCode).toBe(409);
      return true;
    });
  });

  it('lanza AppError 409 si el username ya esta en uso', async () => {
    await register({
      email:    'first@example.com',
      username: 'sameuser',
      password: 'Password123!',
    });

    await expect(
      register({
        email:    'second@example.com',
        username: 'sameuser',
        password: 'Password123!',
      }),
    ).rejects.toSatisfy((err: unknown) => {
      expect(err).toBeInstanceOf(AppError);
      expect((err as AppError).statusCode).toBe(409);
      return true;
    });
  });
});

// ─── login ────────────────────────────────────────────────────────────────────

describe('login', () => {
  it('devuelve user + tokens al hacer login con credenciales correctas', async () => {
    await register({
      email:    'bob@example.com',
      username: 'bob',
      password: 'Password123!',
    });

    const result = await login({ email: 'bob@example.com', password: 'Password123!' });

    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(result).toHaveProperty('user');
    expect(result.user).not.toHaveProperty('passwordHash');
    expect(result.user.email).toBe('bob@example.com');
  });

  it('lanza AppError 401 si el email no existe', async () => {
    await expect(
      login({ email: 'noexiste@example.com', password: 'Password123!' }),
    ).rejects.toSatisfy((err: unknown) => {
      expect(err).toBeInstanceOf(AppError);
      expect((err as AppError).statusCode).toBe(401);
      return true;
    });
  });

  it('lanza AppError 401 si el password es incorrecto', async () => {
    await register({
      email:    'carol@example.com',
      username: 'carol',
      password: 'CorrectPass1!',
    });

    await expect(
      login({ email: 'carol@example.com', password: 'WrongPass99!' }),
    ).rejects.toSatisfy((err: unknown) => {
      expect(err).toBeInstanceOf(AppError);
      expect((err as AppError).statusCode).toBe(401);
      return true;
    });
  });
});

// ─── logout ───────────────────────────────────────────────────────────────────

describe('logout', () => {
  it('no lanza error al hacer logout con un token existente', async () => {
    const { refreshToken } = await register({
      email:    'dave@example.com',
      username: 'dave',
      password: 'Password123!',
    });

    expect(() => logout(refreshToken)).not.toThrow();
  });

  it('no lanza error al hacer logout con un token inexistente (idempotente)', () => {
    expect(() => logout('token-que-no-existe-en-db')).not.toThrow();
  });

  it('no lanza error al llamar logout dos veces con el mismo token', async () => {
    const { refreshToken } = await register({
      email:    'eve@example.com',
      username: 'eve',
      password: 'Password123!',
    });

    logout(refreshToken);

    // Segunda llamada — debe seguir siendo silenciosa
    expect(() => logout(refreshToken)).not.toThrow();
  });
});

// ─── refresh ──────────────────────────────────────────────────────────────────

describe('refresh', () => {
  it('retorna nuevos tokens y el token original queda revocado en DB', async () => {
    const { refreshToken: originalToken, user } = await register({
      email:    'frank@example.com',
      username: 'frank',
      password: 'Password123!',
    });

    const result = await refresh(originalToken);

    // Nuevos tokens emitidos
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(result.refreshToken).not.toBe(originalToken);

    // El token original debe estar revocado en DB
    const { createHash } = await import('crypto');
    const originalHash = createHash('sha256').update(originalToken).digest('hex');

    const record = db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.tokenHash, originalHash))
      .get();

    expect(record).toBeDefined();
    expect(record!.revoked).toBe(true);

    // Sanity check: el nuevo token pertenece al mismo usuario
    expect(result.user.id).toBe(user.id);
  });

  it('lanza AppError 401 con un string invalido (no es JWT)', async () => {
    await expect(refresh('not-a-valid-jwt-string')).rejects.toSatisfy((err: unknown) => {
      expect(err).toBeInstanceOf(AppError);
      expect((err as AppError).statusCode).toBe(401);
      return true;
    });
  });

  it('lanza AppError 401 al usar un token ya revocado en DB', async () => {
    const { refreshToken } = await register({
      email:    'grace@example.com',
      username: 'grace',
      password: 'Password123!',
    });

    // Marcamos el token como revocado directamente en DB
    const { createHash } = await import('crypto');
    const tokenHash = createHash('sha256').update(refreshToken).digest('hex');

    db.update(refreshTokens)
      .set({ revoked: true })
      .where(eq(refreshTokens.tokenHash, tokenHash))
      .run();

    await expect(refresh(refreshToken)).rejects.toSatisfy((err: unknown) => {
      expect(err).toBeInstanceOf(AppError);
      expect((err as AppError).statusCode).toBe(401);
      return true;
    });
  });

  it('revoca todos los tokens del usuario (token family revocation) al detectar token revocado', async () => {
    const { refreshToken: token1, user } = await register({
      email:    'henry@example.com',
      username: 'henry',
      password: 'Password123!',
    });

    // Emitimos un segundo token para el mismo usuario haciendo login
    const { refreshToken: token2 } = await login({
      email:    'henry@example.com',
      password: 'Password123!',
    });

    // Marcamos token1 como revocado directamente en DB (simula robo)
    const { createHash } = await import('crypto');
    const token1Hash = createHash('sha256').update(token1).digest('hex');

    db.update(refreshTokens)
      .set({ revoked: true })
      .where(eq(refreshTokens.tokenHash, token1Hash))
      .run();

    // Intentar usar token1 revocado debe revocar TODOS los tokens del usuario
    await expect(refresh(token1)).rejects.toBeInstanceOf(AppError);

    // Verificar que todos los tokens del usuario quedaron revocados
    const allTokens = db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.userId, user.id))
      .all();

    expect(allTokens.length).toBeGreaterThan(0);
    const allRevoked = allTokens.every((t) => t.revoked === true);
    expect(allRevoked).toBe(true);

    // El token2 (que era valido) tambien debe estar revocado
    const token2Hash = createHash('sha256').update(token2).digest('hex');
    const token2Record = db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.tokenHash, token2Hash))
      .get();

    expect(token2Record).toBeDefined();
    expect(token2Record!.revoked).toBe(true);
  });

  it('lanza AppError 401 con JWT valido pero token no encontrado en DB', async () => {
    // Registramos un usuario y tomamos el refreshToken
    const { refreshToken } = await register({
      email:    'ivan@example.com',
      username: 'ivan',
      password: 'Password123!',
    });

    // Eliminamos todos los refresh tokens de la DB para simular el escenario
    // en que el JWT es valido pero no existe registro en la tabla
    db.delete(refreshTokens).run();

    await expect(refresh(refreshToken)).rejects.toSatisfy((err: unknown) => {
      expect(err).toBeInstanceOf(AppError);
      expect((err as AppError).statusCode).toBe(401);
      return true;
    });
  });
});
