-- API Learning Hub — Migración inicial
-- Generado para Drizzle ORM con SQLite
-- Ejecutar con: npm run db:migrate

PRAGMA foreign_keys = ON;

-- ─── Usuarios y autenticacion ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `users` (
  `id`            TEXT PRIMARY KEY NOT NULL,
  `email`         TEXT NOT NULL UNIQUE,
  `username`      TEXT NOT NULL UNIQUE,
  `password_hash` TEXT NOT NULL,
  `role`          TEXT NOT NULL DEFAULT 'student' CHECK(`role` IN ('student', 'admin')),
  `created_at`    TEXT NOT NULL DEFAULT (datetime('now')),
  `updated_at`    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS `refresh_tokens` (
  `id`          TEXT PRIMARY KEY NOT NULL,
  `user_id`     TEXT NOT NULL REFERENCES `users`(`id`) ON DELETE CASCADE,
  `token_hash`  TEXT NOT NULL UNIQUE,
  `expires_at`  TEXT NOT NULL,
  `revoked`     INTEGER NOT NULL DEFAULT 0,
  `created_at`  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─── Contenido educativo ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `modules` (
  `id`                    TEXT PRIMARY KEY NOT NULL,
  `slug`                  TEXT NOT NULL UNIQUE,
  `title`                 TEXT NOT NULL,
  `description`           TEXT NOT NULL,
  `level`                 INTEGER NOT NULL,
  `order`                 INTEGER NOT NULL,
  `unlocked_by_module_id` TEXT,
  `created_at`            TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS `lessons` (
  `id`         TEXT PRIMARY KEY NOT NULL,
  `module_id`  TEXT NOT NULL REFERENCES `modules`(`id`) ON DELETE CASCADE,
  `title`      TEXT NOT NULL,
  `content_md` TEXT NOT NULL,
  `order`      INTEGER NOT NULL,
  `type`       TEXT NOT NULL CHECK(`type` IN ('theory', 'demo', 'exercise_set')),
  `created_at` TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS `exercises` (
  `id`                TEXT PRIMARY KEY NOT NULL,
  `lesson_id`         TEXT NOT NULL REFERENCES `lessons`(`id`) ON DELETE CASCADE,
  `type`              TEXT NOT NULL CHECK(`type` IN ('quiz','observe','fill_blank','build','debug','challenge')),
  `prompt`            TEXT NOT NULL,
  `starter_code`      TEXT,
  `solution`          TEXT NOT NULL,
  `validation_logic`  TEXT NOT NULL,
  `difficulty`        TEXT NOT NULL DEFAULT 'easy' CHECK(`difficulty` IN ('easy','medium','hard')),
  `points`            INTEGER NOT NULL DEFAULT 10,
  `hints_json`        TEXT NOT NULL DEFAULT '[]',
  `order`             INTEGER NOT NULL,
  `created_at`        TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─── Progreso del estudiante ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `user_progress` (
  `id`           TEXT PRIMARY KEY NOT NULL,
  `user_id`      TEXT NOT NULL REFERENCES `users`(`id`) ON DELETE CASCADE,
  `module_id`    TEXT NOT NULL REFERENCES `modules`(`id`),
  `lesson_id`    TEXT REFERENCES `lessons`(`id`),
  `completed_at` TEXT,
  `score`        INTEGER DEFAULT 0,
  `created_at`   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS `attempts` (
  `id`              TEXT PRIMARY KEY NOT NULL,
  `user_id`         TEXT NOT NULL REFERENCES `users`(`id`) ON DELETE CASCADE,
  `exercise_id`     TEXT NOT NULL REFERENCES `exercises`(`id`),
  `submitted_code`  TEXT NOT NULL,
  `result`          TEXT,
  `passed`          INTEGER NOT NULL DEFAULT 0,
  `time_spent_ms`   INTEGER,
  `hint_used_level` INTEGER DEFAULT 0,
  `created_at`      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─── Repeticion espaciada ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `spaced_repetition` (
  `id`             TEXT PRIMARY KEY NOT NULL,
  `user_id`        TEXT NOT NULL REFERENCES `users`(`id`) ON DELETE CASCADE,
  `exercise_id`    TEXT NOT NULL REFERENCES `exercises`(`id`),
  `next_review_at` TEXT NOT NULL,
  `interval_days`  REAL NOT NULL DEFAULT 1,
  `ease_factor`    REAL NOT NULL DEFAULT 2.5,
  `repetitions`    INTEGER NOT NULL DEFAULT 0,
  `updated_at`     TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─── Indices para rendimiento ─────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_lessons_module_id     ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_exercises_lesson_id   ON exercises(lesson_id);
CREATE INDEX IF NOT EXISTS idx_attempts_user_id      ON attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_attempts_exercise_id  ON attempts(exercise_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_id      ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_sr_user_next_review   ON spaced_repetition(user_id, next_review_at);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user   ON refresh_tokens(user_id);
