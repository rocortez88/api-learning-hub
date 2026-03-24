import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { exercises } from '../../db/schema.js';
import { AppError } from '../../middleware/errorHandler.js';

// ─── Types ────────────────────────────────────────────────────────────────────

/** The public validation info exposed to the client — never includes the answer. */
type PublicValidation =
  | { type: 'exact_match'; options: { key: string; text: string }[] }
  | { type: 'minimum_length'; minLength: number }
  | { type: string };

/**
 * Extracts public-safe validation metadata from the raw `validationLogic` JSON.
 * Rules:
 *  - quiz + options present  → return type + options array (no answer key)
 *  - minimum_length          → return type + minLength
 *  - anything else           → return type only
 */
function extractPublicValidation(
  exerciseType: string,
  validationLogicJson: string,
): PublicValidation {
  let parsed: Record<string, unknown>;

  try {
    parsed = JSON.parse(validationLogicJson) as Record<string, unknown>;
  } catch {
    // Malformed JSON — return a safe fallback
    return { type: 'unknown' };
  }

  const type = typeof parsed.type === 'string' ? parsed.type : 'unknown';

  if (exerciseType === 'quiz' && Array.isArray(parsed.options)) {
    return {
      type: 'exact_match' as const,
      options: (parsed.options as { key: string; text: string }[]).map((opt) => ({
        key: opt.key,
        text: opt.text,
      })),
    };
  }

  if (type === 'minimum_length' && typeof parsed.minLength === 'number') {
    return { type, minLength: parsed.minLength };
  }

  return { type };
}

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Returns an exercise by id with public-safe fields.
 * `solution` and the full `validationLogic` are never exposed.
 * Throws AppError 404 if the exercise does not exist.
 */
export function getExerciseById(id: string) {
  const exercise = db
    .select()
    .from(exercises)
    .where(eq(exercises.id, id))
    .get();

  if (!exercise) {
    throw new AppError(404, 'Ejercicio no encontrado', 'EXERCISE_NOT_FOUND');
  }

  // Parse hints — default to empty array on malformed JSON
  let hints: unknown[] = [];
  try {
    const parsed = JSON.parse(exercise.hintsJson);
    hints = Array.isArray(parsed) ? parsed : [];
  } catch {
    hints = [];
  }

  const validation = extractPublicValidation(exercise.type, exercise.validationLogic);

  return {
    id:          exercise.id,
    lessonId:    exercise.lessonId,
    type:        exercise.type,
    prompt:      exercise.prompt,
    starterCode: exercise.starterCode,
    difficulty:  exercise.difficulty,
    points:      exercise.points,
    order:       exercise.order,
    createdAt:   exercise.createdAt,
    hints,
    validation,
  };
}
