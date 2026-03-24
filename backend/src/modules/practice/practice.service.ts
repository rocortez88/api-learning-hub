import { eq, lte, and, asc } from 'drizzle-orm';
import type { ReviewItemsQuery } from './practice.schema.js';
import { db } from '../../db/index.js';
import { spacedRepetition, exercises } from '../../db/schema.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PracticeQueueItem {
  srId: string;
  nextReviewAt: string;
  intervalDays: number;
  repetitions: number;
  exercise: {
    id: string;
    lessonId: string;
    type: string;
    prompt: string;
    starterCode: string | null;
    difficulty: string;
    points: number;
    hints: string[];
    order: number;
  };
}

export interface PracticeQueue {
  data: PracticeQueueItem[];
  total: number;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export function getPracticeQueue(userId: string): PracticeQueue {
  const now = new Date().toISOString();

  const rows = db
    .select({
      srId: spacedRepetition.id,
      nextReviewAt: spacedRepetition.nextReviewAt,
      intervalDays: spacedRepetition.intervalDays,
      repetitions: spacedRepetition.repetitions,
      exerciseId: exercises.id,
      lessonId: exercises.lessonId,
      type: exercises.type,
      prompt: exercises.prompt,
      starterCode: exercises.starterCode,
      difficulty: exercises.difficulty,
      points: exercises.points,
      hintsJson: exercises.hintsJson,
      order: exercises.order,
    })
    .from(spacedRepetition)
    .innerJoin(exercises, eq(spacedRepetition.exerciseId, exercises.id))
    .where(and(eq(spacedRepetition.userId, userId), lte(spacedRepetition.nextReviewAt, now)))
    .orderBy(asc(spacedRepetition.nextReviewAt))
    .limit(10)
    .all();

  const data: PracticeQueueItem[] = rows.map((row) => {
    const { hintsJson, exerciseId, ...exerciseFields } = row;

    let hints: string[] = [];
    try {
      hints = JSON.parse(hintsJson) as string[];
    } catch {
      // hints stays []
    }

    return {
      srId: row.srId,
      nextReviewAt: row.nextReviewAt,
      intervalDays: row.intervalDays,
      repetitions: row.repetitions,
      exercise: {
        id: exerciseId,
        lessonId: exerciseFields.lessonId,
        type: exerciseFields.type,
        prompt: exerciseFields.prompt,
        starterCode: exerciseFields.starterCode,
        difficulty: exerciseFields.difficulty,
        points: exerciseFields.points,
        hints,
        order: exerciseFields.order,
      },
    };
  });

  return { data, total: data.length };
}

export function getReviewItems(userId: string, query: ReviewItemsQuery): PracticeQueue {
  const now = new Date().toISOString();
  const limit = query.limit;

  const baseQuery = db
    .select({
      srId: spacedRepetition.id,
      nextReviewAt: spacedRepetition.nextReviewAt,
      intervalDays: spacedRepetition.intervalDays,
      repetitions: spacedRepetition.repetitions,
      exerciseId: exercises.id,
      lessonId: exercises.lessonId,
      type: exercises.type,
      prompt: exercises.prompt,
      starterCode: exercises.starterCode,
      difficulty: exercises.difficulty,
      points: exercises.points,
      hintsJson: exercises.hintsJson,
      order: exercises.order,
    })
    .from(spacedRepetition)
    .innerJoin(exercises, eq(spacedRepetition.exerciseId, exercises.id))
    .where(
      query.exerciseId
        ? and(
            eq(spacedRepetition.userId, userId),
            lte(spacedRepetition.nextReviewAt, now),
            eq(spacedRepetition.exerciseId, query.exerciseId),
          )
        : and(eq(spacedRepetition.userId, userId), lte(spacedRepetition.nextReviewAt, now)),
    )
    .orderBy(asc(spacedRepetition.nextReviewAt))
    .limit(limit)
    .all();

  const data: PracticeQueueItem[] = baseQuery.map((row) => {
    const { hintsJson, exerciseId, ...exerciseFields } = row;

    let hints: string[] = [];
    try {
      hints = JSON.parse(hintsJson) as string[];
    } catch {
      // hints stays []
    }

    return {
      srId: row.srId,
      nextReviewAt: row.nextReviewAt,
      intervalDays: row.intervalDays,
      repetitions: row.repetitions,
      exercise: {
        id: exerciseId,
        lessonId: exerciseFields.lessonId,
        type: exerciseFields.type,
        prompt: exerciseFields.prompt,
        starterCode: exerciseFields.starterCode,
        difficulty: exerciseFields.difficulty,
        points: exerciseFields.points,
        hints,
        order: exerciseFields.order,
      },
    };
  });

  return { data, total: data.length };
}
