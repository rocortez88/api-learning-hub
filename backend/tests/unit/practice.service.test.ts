/**
 * Unit tests — practice.service.ts
 * Cubre: getPracticeQueue, getReviewItems
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { randomUUID } from 'crypto';
import {
  createTestApp,
  clearAllTables,
  seedBasicExercise,
} from '../helpers/setup.js';
import { getPracticeQueue, getReviewItems } from '../../src/modules/practice/practice.service.js';
import { db } from '../../src/db/index.js';
import {
  users,
  modules,
  lessons,
  exercises,
  spacedRepetition,
} from '../../src/db/schema.js';

// Inicializar DB en memoria y migrar tablas una sola vez
createTestApp();

beforeEach(() => {
  clearAllTables();
});

// ─── Helpers locales ──────────────────────────────────────────────────────────

/** Inserta una fila en `users` y devuelve su id. */
function seedUser(suffix = ''): string {
  const id = randomUUID();
  db.insert(users).values({
    id,
    email:        `user${suffix}${id.slice(0, 6)}@test.com`,
    username:     `user${suffix}${id.slice(0, 6)}`,
    passwordHash: '$2b$12$hashhashhashhashhashhashhashhashhashhash',
    role:         'student',
  }).run();
  return id;
}

/** Inserta una fila en `spaced_repetition` y devuelve su id. */
function insertSR(opts: {
  userId: string;
  exerciseId: string;
  nextReviewAt: string;
  intervalDays?: number;
  repetitions?: number;
}): string {
  const id = randomUUID();
  db.insert(spacedRepetition).values({
    id,
    userId:       opts.userId,
    exerciseId:   opts.exerciseId,
    nextReviewAt: opts.nextReviewAt,
    intervalDays: opts.intervalDays ?? 1,
    easeFactor:   2.5,
    repetitions:  opts.repetitions ?? 1,
  }).run();
  return id;
}

/** Inserta module → lesson → exercise y devuelve sus ids. */
function seedExercise(opts: { slug?: string; order?: number; hintsJson?: string }): {
  exerciseId: string;
  lessonId: string;
} {
  const moduleId   = randomUUID();
  const lessonId   = randomUUID();
  const exerciseId = randomUUID();
  const slug       = opts.slug ?? `module-${moduleId}`;
  const order      = opts.order ?? 1;

  db.insert(modules).values({
    id:          moduleId,
    slug,
    title:       'Module ' + slug,
    description: 'Desc',
    level:       1,
    order,
  }).run();

  db.insert(lessons).values({
    id:        lessonId,
    moduleId,
    title:     'Lesson',
    contentMd: '# Lesson',
    order:     1,
    type:      'exercise_set',
  }).run();

  db.insert(exercises).values({
    id:               exerciseId,
    lessonId,
    type:             'quiz',
    prompt:           'Prompt?',
    solution:         'a',
    validationLogic:  JSON.stringify({ type: 'exact_match', answer: 'a' }),
    difficulty:       'easy',
    points:           10,
    hintsJson:        opts.hintsJson ?? JSON.stringify(['H1', 'H2', 'H3']),
    order:            1,
  }).run();

  return { exerciseId, lessonId };
}

// ─── getPracticeQueue ─────────────────────────────────────────────────────────

describe('getPracticeQueue', () => {
  it('cola vacia devuelve { data: [], total: 0 }', () => {
    const userId = seedUser();
    const result = getPracticeQueue(userId);

    expect(result).toEqual({ data: [], total: 0 });
  });

  it('ejercicio con nextReviewAt en el pasado aparece en la cola', () => {
    const userId     = seedUser('past');
    const exerciseId = seedBasicExercise(db);

    insertSR({
      userId,
      exerciseId,
      nextReviewAt: new Date(Date.now() - 1000).toISOString(),
      intervalDays: 1,
      repetitions:  1,
    });

    const result = getPracticeQueue(userId);

    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(1);

    const item = result.data[0];
    expect(item).toHaveProperty('srId');
    expect(item).toHaveProperty('nextReviewAt');
    expect(item).toHaveProperty('intervalDays', 1);
    expect(item).toHaveProperty('repetitions', 1);
    expect(item.exercise).toHaveProperty('id', exerciseId);
    expect(item.exercise).toHaveProperty('lessonId');
    expect(item.exercise).toHaveProperty('type');
    expect(item.exercise).toHaveProperty('hints');
    expect(Array.isArray(item.exercise.hints)).toBe(true);
  });

  it('ejercicio con nextReviewAt en el futuro NO aparece en la cola', () => {
    const userId     = seedUser('future');
    const exerciseId = seedBasicExercise(db);

    insertSR({
      userId,
      exerciseId,
      nextReviewAt: new Date(Date.now() + 999999).toISOString(),
    });

    const result = getPracticeQueue(userId);

    expect(result.data).toHaveLength(0);
  });

  it('respeta el limite de 10 items al haber 12 ejercicios en cola', () => {
    const userId = seedUser('limit');

    for (let i = 0; i < 12; i++) {
      const { exerciseId } = seedExercise({ slug: `mod-limit-${i}`, order: i + 1 });
      insertSR({
        userId,
        exerciseId,
        nextReviewAt: new Date(Date.now() - 1000 * (i + 1)).toISOString(),
      });
    }

    const result = getPracticeQueue(userId);

    expect(result.data).toHaveLength(10);
    expect(result.total).toBe(10);
  });

  it('hintsJson malformado devuelve exercise.hints como []', () => {
    const userId = seedUser('hints');
    const { exerciseId } = seedExercise({
      slug:      'mod-hints',
      hintsJson: 'not-json',
    });

    insertSR({
      userId,
      exerciseId,
      nextReviewAt: new Date(Date.now() - 1000).toISOString(),
    });

    const result = getPracticeQueue(userId);

    expect(result.data).toHaveLength(1);
    expect(result.data[0].exercise.hints).toEqual([]);
  });

  it('solo devuelve items del userId correcto (aislamiento por usuario)', () => {
    const otherUser  = seedUser('other');
    const exerciseId = seedBasicExercise(db);

    insertSR({
      userId:       otherUser,
      exerciseId,
      nextReviewAt: new Date(Date.now() - 1000).toISOString(),
    });

    const myUserId = seedUser('mine');
    const result   = getPracticeQueue(myUserId);

    expect(result.data).toHaveLength(0);
    expect(result.total).toBe(0);
  });
});

// ─── getReviewItems ───────────────────────────────────────────────────────────

describe('getReviewItems', () => {
  it('filtra por exerciseId y solo devuelve el ejercicio solicitado', () => {
    const userId = seedUser('filter');
    const { exerciseId: firstId }  = seedExercise({ slug: 'mod-filter-1' });
    const { exerciseId: secondId } = seedExercise({ slug: 'mod-filter-2' });

    const past = new Date(Date.now() - 1000).toISOString();
    insertSR({ userId, exerciseId: firstId,  nextReviewAt: past });
    insertSR({ userId, exerciseId: secondId, nextReviewAt: past });

    const result = getReviewItems(userId, { exerciseId: firstId, limit: 10 });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].exercise.id).toBe(firstId);
  });

  it('respeta el limit al haber mas items que el limite solicitado', () => {
    const userId = seedUser('rlimit');
    const past   = new Date(Date.now() - 1000).toISOString();

    for (let i = 0; i < 5; i++) {
      const { exerciseId } = seedExercise({ slug: `mod-rlimit-${i}` });
      insertSR({ userId, exerciseId, nextReviewAt: past });
    }

    const result = getReviewItems(userId, { limit: 3 });

    expect(result.data).toHaveLength(3);
  });

  it('sin exerciseId devuelve todos los items dentro del limit', () => {
    const userId = seedUser('all');
    const past   = new Date(Date.now() - 1000).toISOString();

    for (let i = 0; i < 3; i++) {
      const { exerciseId } = seedExercise({ slug: `mod-all-${i}` });
      insertSR({ userId, exerciseId, nextReviewAt: past });
    }

    const result = getReviewItems(userId, { limit: 10 });

    expect(result.data).toHaveLength(3);
    expect(result.total).toBe(3);
  });
});
