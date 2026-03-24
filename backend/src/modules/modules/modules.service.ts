import { asc, eq } from 'drizzle-orm';
import { db, sqlite } from '../../db/index.js';
import { modules } from '../../db/schema.js';
import { AppError } from '../../middleware/errorHandler.js';

// ─── Raw query result types ───────────────────────────────────────────────────

interface ModuleProgressRow {
  moduleId: string;
  total: number;
  passed: number;
}

interface LessonStatsRow {
  id: string;
  moduleId: string;
  title: string;
  contentMd: string;
  order: number;
  type: string;
  createdAt: string;
  exerciseCount: number;
  totalPoints: number;
  completedExercises: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Computes progress 0-100 from passed / total exercise counts. */
function toProgress(passed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((passed / total) * 100);
}

// ─── Prepared statements ──────────────────────────────────────────────────────

const stmtModuleProgress = sqlite.prepare(`
  SELECT
    m.id            AS moduleId,
    COUNT(DISTINCT e.id) AS total,
    COUNT(DISTINCT pa.exercise_id) AS passed
  FROM modules m
  LEFT JOIN lessons l   ON l.module_id  = m.id
  LEFT JOIN exercises e ON e.lesson_id  = l.id
  LEFT JOIN (
    SELECT DISTINCT exercise_id
    FROM   attempts
    WHERE  user_id = ? AND passed = 1
  ) pa ON pa.exercise_id = e.id
  GROUP BY m.id
`);

const stmtLessonStats = sqlite.prepare(`
  SELECT
    l.id,
    l.module_id   AS moduleId,
    l.title,
    l.content_md  AS contentMd,
    l."order",
    l.type,
    l.created_at  AS createdAt,
    COUNT(DISTINCT e.id)          AS exerciseCount,
    COALESCE(SUM(e.points), 0)    AS totalPoints,
    COUNT(DISTINCT pa.exercise_id) AS completedExercises
  FROM lessons l
  LEFT JOIN exercises e ON e.lesson_id = l.id
  LEFT JOIN (
    SELECT DISTINCT exercise_id
    FROM   attempts
    WHERE  user_id = ? AND passed = 1
  ) pa ON pa.exercise_id = e.id
  WHERE l.module_id = ?
  GROUP BY l.id
  ORDER BY l."order" ASC
`);

// ─── Service functions ────────────────────────────────────────────────────────

/**
 * Returns all modules with isUnlocked and progress computed for the given user.
 * - Module without prerequisite → always unlocked.
 * - Module with prerequisite → unlocked when prereq progress >= 80 %.
 */
export function getAllModulesForUser(userId: string) {
  const allModules = db.select().from(modules).orderBy(asc(modules.order)).all();

  // Build progress map  { moduleId → progress% }
  const progressRows = stmtModuleProgress.all(userId) as ModuleProgressRow[];
  const progressMap = new Map(
    progressRows.map((r) => [r.moduleId, toProgress(r.passed, r.total)]),
  );

  return allModules.map((mod) => {
    const progress = progressMap.get(mod.id) ?? 0;
    const isUnlocked = mod.unlockedByModuleId === null
      ? true
      : (progressMap.get(mod.unlockedByModuleId) ?? 0) >= 80;

    return { ...mod, isUnlocked, progress };
  });
}

/**
 * Returns a single module by slug with lesson stats (exerciseCount, totalPoints,
 * completedExercises) computed for the given user.
 */
export function getModuleBySlugForUser(slug: string, userId: string) {
  const module = db
    .select()
    .from(modules)
    .where(eq(modules.slug, slug))
    .get();

  if (!module) {
    throw new AppError(404, 'Módulo no encontrado', 'MODULE_NOT_FOUND');
  }

  const lessons = stmtLessonStats.all(userId, module.id) as LessonStatsRow[];

  const totalExercises = lessons.reduce((s, l) => s + l.exerciseCount, 0);
  const passedExercises = lessons.reduce((s, l) => s + l.completedExercises, 0);
  const progress = toProgress(passedExercises, totalExercises);

  return {
    ...module,
    isUnlocked: module.unlockedByModuleId === null ? true : progress >= 0, // simplest: always show content
    progress,
    lessons,
  };
}
