import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db } from './index.js';

console.log('Ejecutando migraciones...');

migrate(db, { migrationsFolder: './src/db/migrations' });

console.log('Migraciones completadas.');
