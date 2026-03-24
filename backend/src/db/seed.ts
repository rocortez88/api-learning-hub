/**
 * Seed principal — API Learning Hub
 *
 * Carga todos los módulos, lecciones y ejercicios en la base de datos.
 * Idempotente: si ya existe el contenido, lo omite.
 *
 * Uso: npm run db:seed
 */

import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';
import { level1 } from './seeds/level1.js';
import { level2 } from './seeds/level2.js';
import type { SeedModule } from './seeds/types.js';

const DB_PATH = process.env['DATABASE_URL']?.replace('file:', '') ?? './dev.db';

function run() {
  const sqlite = new Database(DB_PATH);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');

  // Crear tablas si no existen (sin depender de migraciones previas)
  initSchema(sqlite);

  const modules: SeedModule[] = [level1, level2];

  let totalModules = 0;
  let totalLessons = 0;
  let totalExercises = 0;

  for (const seedModule of modules) {
    const { module, lessons } = seedModule;

    // Verificar si el módulo ya existe
    const existing = sqlite
      .prepare('SELECT id FROM modules WHERE slug = ?')
      .get(module.slug) as { id: string } | undefined;

    if (existing) {
      console.log(`  ⏭  Módulo "${module.title}" ya existe, omitiendo.`);
      continue;
    }

    const moduleId = randomUUID();

    // Resolver el ID del módulo que lo desbloquea
    let unlockedByModuleId: string | null = null;
    if (module.unlockedByModuleId) {
      const prev = sqlite
        .prepare('SELECT id FROM modules WHERE slug = ?')
        .get(module.unlockedByModuleId) as { id: string } | undefined;
      unlockedByModuleId = prev?.id ?? null;
    }

    // Insertar módulo
    sqlite.prepare(`
      INSERT INTO modules (id, slug, title, description, level, "order", unlocked_by_module_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(moduleId, module.slug, module.title, module.description, module.level, module.order, unlockedByModuleId);

    totalModules++;
    console.log(`\n📦 Módulo [${module.level}]: ${module.title}`);

    for (const { lesson, exercises } of lessons) {
      const lessonId = randomUUID();

      sqlite.prepare(`
        INSERT INTO lessons (id, module_id, title, content_md, "order", type)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(lessonId, moduleId, lesson.title, lesson.contentMd, lesson.order, lesson.type);

      totalLessons++;
      console.log(`  📖 Lección: ${lesson.title}`);

      for (const ex of exercises) {
        sqlite.prepare(`
          INSERT INTO exercises
            (id, lesson_id, type, prompt, starter_code, solution, validation_logic,
             difficulty, points, hints_json, "order")
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          randomUUID(),
          lessonId,
          ex.type,
          ex.prompt,
          ex.starterCode,
          ex.solution,
          ex.validationLogic,
          ex.difficulty,
          ex.points,
          ex.hintsJson,
          ex.order,
        );
        totalExercises++;
      }

      console.log(`     ✅ ${exercises.length} ejercicios insertados`);
    }
  }

  sqlite.close();

  console.log(`
╔══════════════════════════════════════════╗
║          Seed completado                 ║
╠══════════════════════════════════════════╣
║  Módulos   : ${String(totalModules).padEnd(27)}║
║  Lecciones : ${String(totalLessons).padEnd(27)}║
║  Ejercicios: ${String(totalExercises).padEnd(27)}║
╚══════════════════════════════════════════╝
  `);
}

function initSchema(sqlite: Database.Database) {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS modules (
      id TEXT PRIMARY KEY NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      level INTEGER NOT NULL,
      "order" INTEGER NOT NULL,
      unlocked_by_module_id TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS lessons (
      id TEXT PRIMARY KEY NOT NULL,
      module_id TEXT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      content_md TEXT NOT NULL,
      "order" INTEGER NOT NULL,
      type TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS exercises (
      id TEXT PRIMARY KEY NOT NULL,
      lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      prompt TEXT NOT NULL,
      starter_code TEXT,
      solution TEXT NOT NULL,
      validation_logic TEXT NOT NULL,
      difficulty TEXT NOT NULL DEFAULT 'easy',
      points INTEGER NOT NULL DEFAULT 10,
      hints_json TEXT NOT NULL DEFAULT '[]',
      "order" INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

run();
