import { eq, and, gt, asc } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { exercises, attempts, spacedRepetition } from '../../db/schema.js';
import { AppError } from '../../middleware/errorHandler.js';
import { generateId } from '../../utils/crypto.js';
import type { SubmitAttemptInput } from './attempts.schema.js';

// ─── Types for validationLogic ────────────────────────────────────────────────

interface ExactMatchLogic {
  type: 'exact_match';
  answer: string;
}

interface IncludesKeywordsLogic {
  type: 'includes_keywords';
  keywords: string[];
  caseSensitive: boolean;
}

interface MinimumLengthLogic {
  type: 'minimum_length';
  minLength: number;
}

interface AlwaysPassLogic {
  type: 'always_pass';
}

type ValidationLogic =
  | ExactMatchLogic
  | IncludesKeywordsLogic
  | MinimumLengthLogic
  | AlwaysPassLogic;

// ─── Validation ───────────────────────────────────────────────────────────────

function validateAnswer(
  submittedCode: string,
  logic: ValidationLogic,
): { passed: boolean; result: string } {
  switch (logic.type) {
    case 'exact_match': {
      const passed = submittedCode.trim().toLowerCase() === logic.answer.trim().toLowerCase();
      return {
        passed,
        result: passed
          ? 'Respuesta correcta.'
          : 'Respuesta incorrecta. Revisa tu selección e inténtalo de nuevo.',
      };
    }

    case 'includes_keywords': {
      const text = logic.caseSensitive ? submittedCode : submittedCode.toLowerCase();

      const missingKeywords = logic.keywords.filter((kw) => {
        const keyword = logic.caseSensitive ? kw : kw.toLowerCase();
        return !text.includes(keyword);
      });

      const passed = missingKeywords.length === 0;
      return {
        passed,
        result: passed
          ? 'Respuesta correcta. Contiene todos los conceptos clave.'
          : 'Tu respuesta está incompleta. Revisa el concepto e incluye más detalle.',
      };
    }

    case 'minimum_length': {
      const length = submittedCode.trim().length;
      const passed = length >= logic.minLength;
      return {
        passed,
        result: passed
          ? 'Respuesta aceptada.'
          : `La respuesta es demasiado corta (${length} caracteres). Se requieren al menos ${logic.minLength}.`,
      };
    }

    case 'always_pass': {
      return { passed: true, result: 'Ejercicio completado.' };
    }

    default: {
      return { passed: false, result: 'Tipo de validación desconocido.' };
    }
  }
}

// ─── SM-2 Algorithm ───────────────────────────────────────────────────────────

interface SM2Record {
  repetitions: number;
  intervalDays: number;
  easeFactor: number;
}

function applySM2(current: SM2Record, quality: number): SM2Record & { nextReviewAt: string } {
  let { repetitions, intervalDays, easeFactor } = current;

  if (quality < 3) {
    repetitions = 0;
    intervalDays = 1;
    easeFactor = Math.max(1.3, easeFactor - 0.2);
  } else {
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }

    easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

    repetitions += 1;
  }

  const nextReviewAt = new Date(Date.now() + intervalDays * 24 * 60 * 60 * 1000).toISOString();

  return { repetitions, intervalDays, easeFactor, nextReviewAt };
}

// ─── Service ──────────────────────────────────────────────────────────────────

export interface AttemptResult {
  attemptId: string;
  passed: boolean;
  result: string;
  points: number;
  nextReviewAt: string;
  solution?: string;
  nextExerciseId?: string | null;
}

export async function submitAttempt(
  exerciseId: string,
  userId: string,
  input: SubmitAttemptInput,
): Promise<AttemptResult> {
  // 1. Fetch exercise
  const exercise = db.select().from(exercises).where(eq(exercises.id, exerciseId)).get();

  if (!exercise) {
    throw new AppError(404, 'Ejercicio no encontrado', 'EXERCISE_NOT_FOUND');
  }

  // 2. Parse and apply validation logic
  let logic: ValidationLogic;
  try {
    logic = JSON.parse(exercise.validationLogic) as ValidationLogic;
  } catch {
    throw new AppError(500, 'Error al procesar la lógica de validación', 'VALIDATION_LOGIC_ERROR');
  }

  const { passed, result } = validateAnswer(input.submittedCode, logic);

  // 3. Persist attempt
  const attemptId = generateId();
  db.insert(attempts)
    .values({
      id: attemptId,
      userId,
      exerciseId,
      submittedCode: input.submittedCode,
      result,
      passed,
      timeSpentMs: input.timeSpentMs ?? null,
      hintUsedLevel: input.hintUsedLevel,
    })
    .run();

  // 4. Apply SM-2 and upsert spacedRepetition record
  const quality = passed ? Math.max(2, 5 - input.hintUsedLevel) : 0;

  const existingSR = db
    .select()
    .from(spacedRepetition)
    .where(and(eq(spacedRepetition.userId, userId), eq(spacedRepetition.exerciseId, exerciseId)))
    .get();

  const current: SM2Record = existingSR
    ? {
        repetitions: existingSR.repetitions,
        intervalDays: existingSR.intervalDays,
        easeFactor: existingSR.easeFactor,
      }
    : { repetitions: 0, intervalDays: 1, easeFactor: 2.5 };

  const updated = applySM2(current, quality);

  if (existingSR) {
    db.update(spacedRepetition)
      .set({
        repetitions: updated.repetitions,
        intervalDays: updated.intervalDays,
        easeFactor: updated.easeFactor,
        nextReviewAt: updated.nextReviewAt,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(spacedRepetition.id, existingSR.id))
      .run();
  } else {
    db.insert(spacedRepetition)
      .values({
        id: generateId(),
        userId,
        exerciseId,
        nextReviewAt: updated.nextReviewAt,
        intervalDays: updated.intervalDays,
        easeFactor: updated.easeFactor,
        repetitions: updated.repetitions,
      })
      .run();
  }

  // 5. Return result — include solution only on pass
  const response: AttemptResult = {
    attemptId,
    passed,
    result,
    points: passed ? exercise.points : 0,
    nextReviewAt: updated.nextReviewAt,
  };

  if (passed) {
    response.solution = exercise.solution;
  }

  // 6. Find next exercise in same lesson by order
  const nextExercise = db
    .select({ id: exercises.id })
    .from(exercises)
    .where(and(eq(exercises.lessonId, exercise.lessonId), gt(exercises.order, exercise.order)))
    .orderBy(asc(exercises.order))
    .limit(1)
    .get();

  response.nextExerciseId = nextExercise?.id ?? null;

  return response;
}
