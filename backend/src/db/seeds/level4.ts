/**
 * NIVEL 4 — APIs AVANZADAS
 * 4 lecciones · 45 ejercicios
 *
 * Lección 1: Rate Limiting y Throttling            → 10 ejercicios
 * Lección 2: Paginación y Filtrado                 → 12 ejercicios
 * Lección 3: WebSockets — Conexiones en Tiempo Real → 12 ejercicios
 * Lección 4: Introducción a GraphQL                → 11 ejercicios
 */

import type { SeedModule } from './types.js';
import { level4Lessons1 } from './level4_part1.js';
import { level4Lessons2 } from './level4_part2.js';

export const level4: SeedModule = {
  module: {
    slug: 'apis-avanzadas',
    title: 'APIs Avanzadas',
    description: 'Rate limiting, paginación, WebSockets y una introducción a GraphQL',
    level: 4,
    order: 4,
    unlockedByModuleId: 'autenticacion',
  },
  lessons: [...level4Lessons1, ...level4Lessons2],
};
