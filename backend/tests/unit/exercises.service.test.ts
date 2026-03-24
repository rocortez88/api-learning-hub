/**
 * Unit tests — exercises.service.ts
 * Foco: lógica interna de extractPublicValidation (vía getExerciseById)
 *       y casos edge de parsing de JSON en hints.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { randomUUID } from 'crypto';

import { createTestApp, clearAllTables } from '../helpers/setup.js';
import { db } from '../../src/db/index.js';
import { modules, lessons, exercises } from '../../src/db/schema.js';
import { getExerciseById } from '../../src/modules/exercises/exercises.service.js';
import { AppError } from '../../src/middleware/errorHandler.js';

// Garantiza migración y crea la app (solo necesitamos la DB migrada)
createTestApp();

beforeEach(() => {
  clearAllTables();
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Inserta módulo → lección → ejercicio con los valores dados.
 * Devuelve el exerciseId.
 */
function insertExercise(overrides: {
  type?: 'quiz' | 'observe' | 'fill_blank' | 'build' | 'debug' | 'challenge';
  validationLogic: string;
  hintsJson?: string;
  solution?: string;
}): string {
  const moduleId   = randomUUID();
  const lessonId   = randomUUID();
  const exerciseId = randomUUID();

  db.insert(modules).values({
    id:          moduleId,
    slug:        `slug-${moduleId}`,
    title:       'Test Module',
    description: 'Módulo de prueba',
    level:       1,
    order:       1,
  }).run();

  db.insert(lessons).values({
    id:        lessonId,
    moduleId,
    title:     'Test Lesson',
    contentMd: '# Test',
    order:     1,
    type:      'exercise_set',
  }).run();

  db.insert(exercises).values({
    id:              exerciseId,
    lessonId,
    type:            overrides.type ?? 'quiz',
    prompt:          '¿Pregunta de prueba?',
    solution:        overrides.solution ?? 'answer',
    validationLogic: overrides.validationLogic,
    difficulty:      'easy',
    points:          10,
    hintsJson:       overrides.hintsJson ?? '[]',
    order:           1,
  }).run();

  return exerciseId;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('getExerciseById', () => {
  // 1. ID inexistente → AppError 404
  it('lanza AppError 404 con code EXERCISE_NOT_FOUND si el id no existe', () => {
    expect(() => getExerciseById('id-que-no-existe')).toThrow(AppError);

    try {
      getExerciseById('id-que-no-existe');
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      const appErr = err as AppError;
      expect(appErr.statusCode).toBe(404);
      expect(appErr.code).toBe('EXERCISE_NOT_FOUND');
    }
  });

  // 2. Tipo quiz con validationLogic completo → exact_match + options sin answer
  it('devuelve validation.type exact_match con options (sin clave answer) para tipo quiz', () => {
    const exerciseId = insertExercise({
      type: 'quiz',
      validationLogic: JSON.stringify({
        type:    'exact_match',
        answer:  'b',
        options: [
          { key: 'a', text: 'Opción A' },
          { key: 'b', text: 'Opción B' },
        ],
      }),
    });

    const result = getExerciseById(exerciseId);
    const validation = result.validation as Record<string, unknown>;

    expect(validation['type']).toBe('exact_match');
    expect(Array.isArray(validation['options'])).toBe(true);

    const options = validation['options'] as { key: string; text: string }[];
    expect(options).toHaveLength(2);

    // La clave `answer` no debe estar en ninguna opción
    options.forEach((opt) => {
      expect(opt).not.toHaveProperty('answer');
      expect(opt).toHaveProperty('key');
      expect(opt).toHaveProperty('text');
    });

    // La clave `answer` tampoco debe estar en validation
    expect(validation).not.toHaveProperty('answer');
  });

  // 3. Tipo minimum_length → devuelve type + minLength
  it('devuelve validation.type minimum_length con minLength para tipo build', () => {
    const exerciseId = insertExercise({
      type: 'build',
      validationLogic: JSON.stringify({
        type:      'minimum_length',
        minLength: 10,
      }),
    });

    const result = getExerciseById(exerciseId);
    const validation = result.validation as Record<string, unknown>;

    expect(validation['type']).toBe('minimum_length');
    expect(validation['minLength']).toBe(10);
  });

  // 4. Tipo desconocido → devuelve solo type, sin propiedades extra
  it('devuelve solo type para validationLogic de tipo desconocido', () => {
    const exerciseId = insertExercise({
      type: 'debug',
      validationLogic: JSON.stringify({ type: 'custom_check' }),
    });

    const result = getExerciseById(exerciseId);
    const validation = result.validation as Record<string, unknown>;

    expect(validation['type']).toBe('custom_check');
    // No debe tener propiedades adicionales más allá de type
    const keys = Object.keys(validation);
    expect(keys).toEqual(['type']);
  });

  // 5. validationLogic JSON malformado → fallback { type: 'unknown' }
  it('devuelve validation.type unknown si validationLogic es JSON malformado', () => {
    const exerciseId = insertExercise({
      validationLogic: 'not-valid-json',
    });

    const result = getExerciseById(exerciseId);
    const validation = result.validation as Record<string, unknown>;

    expect(validation['type']).toBe('unknown');
  });

  // 6. hintsJson malformado → hints es []
  it('devuelve hints como array vacío si hintsJson es JSON malformado', () => {
    const exerciseId = insertExercise({
      validationLogic: JSON.stringify({ type: 'custom_check' }),
      hintsJson: 'not-valid-json',
    });

    const result = getExerciseById(exerciseId);

    expect(Array.isArray(result.hints)).toBe(true);
    expect(result.hints).toEqual([]);
  });

  // 7. hintsJson es objeto válido pero no array → hints es []
  it('devuelve hints como array vacío si hintsJson es un objeto (no array)', () => {
    const exerciseId = insertExercise({
      validationLogic: JSON.stringify({ type: 'custom_check' }),
      hintsJson: '{"foo":"bar"}',
    });

    const result = getExerciseById(exerciseId);

    expect(Array.isArray(result.hints)).toBe(true);
    expect(result.hints).toEqual([]);
  });

  // 8. Verifica campos retornados: sin solution ni validationLogic, con campos esperados
  it('no expone solution ni validationLogic raw, y retorna todos los campos públicos', () => {
    const exerciseId = insertExercise({
      type: 'quiz',
      validationLogic: JSON.stringify({
        type:    'exact_match',
        answer:  'a',
        options: [{ key: 'a', text: 'Única opción' }],
      }),
      hintsJson: JSON.stringify(['Pista 1', 'Pista 2']),
      solution:  'a',
    });

    const result = getExerciseById(exerciseId) as Record<string, unknown>;

    // Campos que NO deben estar
    expect(result).not.toHaveProperty('solution');
    expect(result).not.toHaveProperty('validationLogic');
    expect(result).not.toHaveProperty('validation_logic');

    // Campos que SÍ deben estar
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('lessonId');
    expect(result).toHaveProperty('type');
    expect(result).toHaveProperty('prompt');
    expect(result).toHaveProperty('difficulty');
    expect(result).toHaveProperty('points');
    expect(result).toHaveProperty('order');
    expect(result).toHaveProperty('hints');
    expect(result).toHaveProperty('validation');

    // Verificación de valores básicos
    expect(result['id']).toBe(exerciseId);
    expect(result['type']).toBe('quiz');
    expect(Array.isArray(result['hints'])).toBe(true);
    expect((result['hints'] as unknown[]).length).toBe(2);
  });
});
