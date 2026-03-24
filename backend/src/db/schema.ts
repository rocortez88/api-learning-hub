import { sql } from 'drizzle-orm';
import {
  sqliteTable,
  text,
  integer,
  real,
} from 'drizzle-orm/sqlite-core';

// ─── Usuarios y autenticacion ─────────────────────────────────────────────

export const users = sqliteTable('users', {
  id:           text('id').primaryKey(),
  email:        text('email').notNull().unique(),
  username:     text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role:         text('role', { enum: ['student', 'admin'] }).notNull().default('student'),
  createdAt:    text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt:    text('updated_at').notNull().default(sql`(datetime('now'))`),
});

export const refreshTokens = sqliteTable('refresh_tokens', {
  id:        text('id').primaryKey(),
  userId:    text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull().unique(),
  expiresAt: text('expires_at').notNull(),
  revoked:   integer('revoked', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
});

// ─── Contenido educativo ──────────────────────────────────────────────────

export const modules = sqliteTable('modules', {
  id:                 text('id').primaryKey(),
  slug:               text('slug').notNull().unique(),
  title:              text('title').notNull(),
  description:        text('description').notNull(),
  level:              integer('level').notNull(),             // 1-5
  order:              integer('order').notNull(),
  unlockedByModuleId: text('unlocked_by_module_id'),         // null = primer modulo, libre
  createdAt:          text('created_at').notNull().default(sql`(datetime('now'))`),
});

export const lessons = sqliteTable('lessons', {
  id:        text('id').primaryKey(),
  moduleId:  text('module_id').notNull().references(() => modules.id, { onDelete: 'cascade' }),
  title:     text('title').notNull(),
  contentMd: text('content_md').notNull(),                   // Markdown educativo
  order:     integer('order').notNull(),
  type:      text('type', {
    enum: ['theory', 'demo', 'exercise_set'],
  }).notNull(),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
});

export const exercises = sqliteTable('exercises', {
  id:               text('id').primaryKey(),
  lessonId:         text('lesson_id').notNull().references(() => lessons.id, { onDelete: 'cascade' }),
  type:             text('type', {
    enum: ['quiz', 'observe', 'fill_blank', 'build', 'debug', 'challenge'],
  }).notNull(),
  prompt:           text('prompt').notNull(),                // Enunciado del ejercicio
  starterCode:      text('starter_code'),                    // Codigo inicial (opcional)
  solution:         text('solution').notNull(),              // Solucion correcta
  validationLogic:  text('validation_logic').notNull(),      // JSON con reglas de validacion
  difficulty:       text('difficulty', {
    enum: ['easy', 'medium', 'hard'],
  }).notNull().default('easy'),
  points:           integer('points').notNull().default(10),
  hintsJson:        text('hints_json').notNull().default('[]'), // JSON array de 3 pistas
  order:            integer('order').notNull(),
  createdAt:        text('created_at').notNull().default(sql`(datetime('now'))`),
});

// ─── Progreso del estudiante ──────────────────────────────────────────────

export const userProgress = sqliteTable('user_progress', {
  id:          text('id').primaryKey(),
  userId:      text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  moduleId:    text('module_id').notNull().references(() => modules.id),
  lessonId:    text('lesson_id').references(() => lessons.id),
  completedAt: text('completed_at'),
  score:       integer('score').default(0),
  createdAt:   text('created_at').notNull().default(sql`(datetime('now'))`),
});

export const attempts = sqliteTable('attempts', {
  id:             text('id').primaryKey(),
  userId:         text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  exerciseId:     text('exercise_id').notNull().references(() => exercises.id),
  submittedCode:  text('submitted_code').notNull(),
  result:         text('result'),                             // Feedback de la validacion
  passed:         integer('passed', { mode: 'boolean' }).notNull().default(false),
  timeSpentMs:    integer('time_spent_ms'),
  hintUsedLevel:  integer('hint_used_level').default(0),     // 0 = sin pistas, 1-3
  createdAt:      text('created_at').notNull().default(sql`(datetime('now'))`),
});

// ─── Repeticion espaciada (algoritmo SM-2) ────────────────────────────────

export const spacedRepetition = sqliteTable('spaced_repetition', {
  id:            text('id').primaryKey(),
  userId:        text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  exerciseId:    text('exercise_id').notNull().references(() => exercises.id),
  nextReviewAt:  text('next_review_at').notNull(),
  intervalDays:  real('interval_days').notNull().default(1),
  easeFactor:    real('ease_factor').notNull().default(2.5),  // Factor SM-2
  repetitions:   integer('repetitions').notNull().default(0),
  updatedAt:     text('updated_at').notNull().default(sql`(datetime('now'))`),
});
