import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database, { type Database as SQLiteDB } from 'better-sqlite3';
import { env } from '../config/env.js';
import * as schema from './schema.js';

export const sqlite: SQLiteDB = new Database(env.DATABASE_URL.replace('file:', ''));

// Habilitar WAL para mejor rendimiento en SQLite
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

export const db = drizzle(sqlite, { schema });

export type DB = typeof db;
