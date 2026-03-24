/**
 * Este archivo se ejecuta ANTES de cargar cualquier modulo de la aplicacion.
 * Establece las variables de entorno necesarias para que env.ts pase la
 * validacion de Zod y para que db/index.ts use SQLite en memoria.
 *
 * El orden importa: vitest.config.ts lo lista en `setupFiles`, que se
 * evalua antes de que los test files importen los modulos del proyecto.
 */

// ─── Base de datos en memoria ─────────────────────────────────────────────────
process.env['DATABASE_URL'] = ':memory:';

// ─── JWT — secretos de longitud minima exigida por Zod (32 chars) ─────────────
process.env['JWT_SECRET']          = 'test-jwt-secret-at-least-32-chars!!';
process.env['JWT_REFRESH_SECRET']  = 'test-refresh-secret-at-least-32!!';
process.env['JWT_EXPIRES_IN']      = '15m';
process.env['JWT_REFRESH_EXPIRES_IN'] = '7d';

// ─── Otros ────────────────────────────────────────────────────────────────────
process.env['NODE_ENV']    = 'test';
process.env['PORT']        = '3002';
process.env['CORS_ORIGIN'] = 'http://localhost:5173';

// ─── Rate limiting desactivado en tests ───────────────────────────────────────
// Subimos el limite muy alto para que nunca dispare en la suite de tests.
process.env['RATE_LIMIT_AUTH_MAX']     = '10000';
process.env['RATE_LIMIT_MAX_REQUESTS'] = '10000';
