import { createHash } from 'crypto';
import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { users, refreshTokens } from '../../db/schema.js';
import { AppError } from '../../middleware/errorHandler.js';
import { hashPassword, comparePassword, generateId } from '../../utils/crypto.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt.js';
import { env } from '../../config/env.js';
import type { RegisterInput, LoginInput } from './auth.schema.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Parses a duration string like "7d", "15m", "1h" and returns
 * the equivalent number of milliseconds.
 */
function parseDurationMs(duration: string): number {
  const match = /^(\d+)([smhd])$/.exec(duration);
  if (!match) return 7 * 24 * 60 * 60 * 1000; // fallback: 7 days

  const value = parseInt(match[1], 10);
  const unit  = match[2];

  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default:  return 7 * 24 * 60 * 60 * 1000;
  }
}

function computeRefreshExpiresAt(): string {
  const ms  = parseDurationMs(env.JWT_REFRESH_EXPIRES_IN);
  const exp = new Date(Date.now() + ms);
  return exp.toISOString();
}

/** Builds the safe public user object — never includes passwordHash. */
function toPublicUser(user: typeof users.$inferSelect) {
  const { passwordHash: _omit, ...publicUser } = user;
  return publicUser;
}

/** Issues a fresh access + refresh token pair and persists the refresh token. */
async function issueTokenPair(userId: string, role: 'student' | 'admin') {
  const accessToken  = signAccessToken({ sub: userId, role });
  const refreshToken = signRefreshToken(userId);

  const tokenHash = hashToken(refreshToken);
  const expiresAt = computeRefreshExpiresAt();

  try {
    db.insert(refreshTokens).values({
      id:        generateId(),
      userId,
      tokenHash,
      expiresAt,
    }).run();
  } catch {
    throw new AppError(500, 'Error interno del servidor', 'INTERNAL_ERROR');
  }

  return { accessToken, refreshToken };
}

// ─── Service functions ────────────────────────────────────────────────────────

export async function register(input: RegisterInput) {
  // 1. Check email uniqueness
  const existingEmail = db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, input.email))
    .get();

  if (existingEmail) {
    throw new AppError(409, 'Credenciales invalidas', 'CONFLICT');
  }

  // 2. Check username uniqueness
  const existingUsername = db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, input.username))
    .get();

  if (existingUsername) {
    throw new AppError(409, 'Credenciales invalidas', 'CONFLICT');
  }

  // 3. Hash password and create user
  const passwordHash = await hashPassword(input.password);
  const userId = generateId();

  db.insert(users).values({
    id:           userId,
    email:        input.email,
    username:     input.username,
    passwordHash,
  }).run();

  // 4. Fetch the created user (to get server-set defaults like role, createdAt)
  const user = db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .get();

  if (!user) {
    throw new AppError(500, 'Error interno del servidor', 'INTERNAL_ERROR');
  }

  // 5. Issue tokens
  const tokens = await issueTokenPair(userId, user.role);

  return {
    user: toPublicUser(user),
    ...tokens,
  };
}

export async function login(input: LoginInput) {
  // 1. Lookup user by email — generic error to avoid user enumeration
  const user = db
    .select()
    .from(users)
    .where(eq(users.email, input.email))
    .get();

  if (!user) {
    throw new AppError(401, 'Credenciales invalidas', 'INVALID_CREDENTIALS');
  }

  // 2. Verify password
  const passwordMatch = await comparePassword(input.password, user.passwordHash);

  if (!passwordMatch) {
    throw new AppError(401, 'Credenciales invalidas', 'INVALID_CREDENTIALS');
  }

  // 3. Issue tokens
  const tokens = await issueTokenPair(user.id, user.role);

  return {
    user: toPublicUser(user),
    ...tokens,
  };
}

export function logout(refreshToken: string): void {
  const tokenHash = hashToken(refreshToken);

  const record = db
    .select({ id: refreshTokens.id })
    .from(refreshTokens)
    .where(eq(refreshTokens.tokenHash, tokenHash))
    .get();

  // Silently succeed if the token doesn't exist — idempotent logout
  if (!record) return;

  db.update(refreshTokens)
    .set({ revoked: true })
    .where(eq(refreshTokens.id, record.id))
    .run();
}

export async function refresh(token: string) {
  // 1. Verify JWT signature and expiry
  let payload: { sub: string };
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw new AppError(401, 'Refresh token invalido o expirado', 'INVALID_REFRESH_TOKEN');
  }

  // 2. Look up the hashed token in DB
  const tokenHash = hashToken(token);

  const record = db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.tokenHash, tokenHash))
    .get();

  if (!record) {
    throw new AppError(401, 'Refresh token no encontrado', 'INVALID_REFRESH_TOKEN');
  }

  // 3. Reject revoked tokens — posible robo detectado: revocar toda la familia
  if (record.revoked) {
    db.update(refreshTokens)
      .set({ revoked: true })
      .where(eq(refreshTokens.userId, record.userId))
      .run();
    throw new AppError(401, 'Refresh token invalido o expirado', 'INVALID_REFRESH_TOKEN');
  }

  // 4. Reject expired tokens (double-check DB value alongside JWT exp)
  if (new Date(record.expiresAt) < new Date()) {
    throw new AppError(401, 'Refresh token invalido o expirado', 'INVALID_REFRESH_TOKEN');
  }

  // 5. Fetch associated user
  const user = db
    .select()
    .from(users)
    .where(eq(users.id, payload.sub))
    .get();

  if (!user) {
    throw new AppError(401, 'Refresh token invalido o expirado', 'INVALID_REFRESH_TOKEN');
  }

  // 6. Token rotation: revoke old token
  db.update(refreshTokens)
    .set({ revoked: true })
    .where(eq(refreshTokens.id, record.id))
    .run();

  // 7. Issue a fresh token pair
  const tokens = await issueTokenPair(user.id, user.role);

  return {
    user: toPublicUser(user),
    ...tokens,
  };
}
