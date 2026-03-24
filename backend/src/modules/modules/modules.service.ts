import { asc, eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { modules, lessons } from '../../db/schema.js';
import { AppError } from '../../middleware/errorHandler.js';

/**
 * Returns all modules ordered by their `order` column ascending.
 */
export function getAllModules() {
  return db
    .select()
    .from(modules)
    .orderBy(asc(modules.order))
    .all();
}

/**
 * Returns a single module by slug, including its lessons ordered by `order` ascending.
 * Throws AppError 404 if the module does not exist.
 */
export function getModuleBySlug(slug: string) {
  const module = db
    .select()
    .from(modules)
    .where(eq(modules.slug, slug))
    .get();

  if (!module) {
    throw new AppError(404, 'Módulo no encontrado', 'MODULE_NOT_FOUND');
  }

  const moduleLessons = db
    .select()
    .from(lessons)
    .where(eq(lessons.moduleId, module.id))
    .orderBy(asc(lessons.order))
    .all();

  return {
    ...module,
    lessons: moduleLessons,
  };
}
