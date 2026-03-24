/**
 * Helper compartido para tests de integracion.
 *
 * Estrategia de DB:
 *   - Las variables de entorno (DATABASE_URL=:memory:) ya estan fijadas
 *     por env.setup.ts, que vitest ejecuta antes de cargar cualquier modulo.
 *   - Al importar db/index.js con DATABASE_URL=':memory:', better-sqlite3
 *     abre una base de datos en memoria.
 *   - Ejecutamos el SQL de migracion sobre esa conexion para crear las tablas.
 *   - Exportamos la misma instancia `db` que usan los servicios, de modo que
 *     seedBasicExercise y clearAllTables operan sobre la misma DB real.
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import type { Application } from 'express';
import request from 'supertest';

// Importamos la instancia singleton de Drizzle — la misma que usan los servicios
import { db } from '../../src/db/index.js';
// Importamos los schemas para poder hacer insert/delete tipados
import {
  users,
  refreshTokens,
  modules,
  lessons,
  exercises,
  attempts,
  spacedRepetition,
  userProgress,
} from '../../src/db/schema.js';
// Necesitamos la conexion SQLite subyacente para ejecutar el SQL de migracion
// drizzle-orm/better-sqlite3 expone el driver via .$client
import { createApp } from '../../src/app.js';

// ─── Inicializacion de la DB en memoria ───────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const MIGRATION_PATH = resolve(
  __dirname,
  '../../src/db/migrations/0000_initial.sql',
);

let _initialized = false;

/**
 * Ejecuta la migracion inicial sobre la DB en memoria.
 * Solo se ejecuta una vez por proceso de vitest (las tablas persisten entre
 * tests del mismo worker; `clearAllTables` limpia los datos entre cada test).
 */
function ensureMigrated(): void {
  if (_initialized) return;

  const sql = readFileSync(MIGRATION_PATH, 'utf-8');

  // La instancia db de Drizzle ORM expone la conexion better-sqlite3 en .session.client
  const client = (db as unknown as {
    session: { client: { exec: (sql: string) => void } };
  }).session.client;
  client.exec(sql);

  _initialized = true;
}

// ─── createTestApp ─────────────────────────────────────────────────────────────

export interface TestContext {
  app: Application;
  db: typeof db;
}

/**
 * Crea la app Express de test y garantiza que la DB en memoria esta migrada.
 * Devuelve la app y la misma instancia db que usan los servicios.
 */
export function createTestApp(): TestContext {
  ensureMigrated();
  const app = createApp();
  return { app, db };
}

// ─── clearAllTables ───────────────────────────────────────────────────────────

/**
 * Elimina todas las filas de todas las tablas.
 * Llamar en `beforeEach` para garantizar aislamiento entre tests.
 */
export function clearAllTables(): void {
  // El orden importa por las foreign keys: primero hijos, luego padres
  db.delete(spacedRepetition).run();
  db.delete(attempts).run();
  db.delete(userProgress).run();
  db.delete(exercises).run();
  db.delete(lessons).run();
  db.delete(modules).run();
  db.delete(refreshTokens).run();
  db.delete(users).run();
}

// ─── registerAndLogin ─────────────────────────────────────────────────────────

interface RegisterOverrides {
  email?: string;
  username?: string;
  password?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

/**
 * Registra un usuario y devuelve sus tokens + id.
 * Util para preparar el estado autenticado en cada test.
 */
export async function registerAndLogin(
  app: Application,
  overrides: RegisterOverrides = {},
): Promise<AuthTokens> {
  const payload = {
    email:    overrides.email    ?? 'test@example.com',
    username: overrides.username ?? 'testuser',
    password: overrides.password ?? 'Password123!',
  };

  const res = await request(app)
    .post('/api/auth/register')
    .send(payload);

  if (res.status !== 201) {
    throw new Error(
      `registerAndLogin: registro fallo con ${res.status} — ${JSON.stringify(res.body)}`,
    );
  }

  return {
    accessToken:  res.body.accessToken  as string,
    refreshToken: res.body.refreshToken as string,
    userId:       res.body.user.id      as string,
  };
}

// ─── seedBasicExercise ────────────────────────────────────────────────────────

import { randomUUID } from 'crypto';

/**
 * Inserta un modulo → leccion → ejercicio de tipo quiz con:
 *   validationLogic: { type: 'exact_match', answer: 'b', options: [...] }
 *
 * Devuelve el `exerciseId` para usarlo en los tests.
 */
export function seedBasicExercise(database: typeof db): string {
  const moduleId   = randomUUID();
  const lessonId   = randomUUID();
  const exerciseId = randomUUID();

  database.insert(modules).values({
    id:          moduleId,
    slug:        'test-module',
    title:       'Test Module',
    description: 'Modulo de prueba para tests de integracion',
    level:       1,
    order:       1,
  }).run();

  database.insert(lessons).values({
    id:        lessonId,
    moduleId,
    title:     'Test Lesson',
    contentMd: '# Test\nContenido de prueba.',
    order:     1,
    type:      'exercise_set',
  }).run();

  database.insert(exercises).values({
    id:       exerciseId,
    lessonId,
    type:     'quiz',
    prompt:   '¿Cual es la opcion correcta?',
    solution: 'b',
    validationLogic: JSON.stringify({
      type:    'exact_match',
      answer:  'b',
      options: [
        { key: 'a', text: 'Opcion A — incorrecta' },
        { key: 'b', text: 'Opcion B — correcta' },
        { key: 'c', text: 'Opcion C — incorrecta' },
      ],
    }),
    difficulty: 'easy',
    points:     10,
    hintsJson:  JSON.stringify(['Pista 1', 'Pista 2', 'Pista 3']),
    order:      1,
  }).run();

  return exerciseId;
}
