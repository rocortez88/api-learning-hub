import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    testTimeout: 30000,
    setupFiles: ['./tests/helpers/env.setup.ts'],
    coverage: {
      exclude: [
        'src/db/seed*.ts',
        'src/db/seeds/**',
        'src/server.ts',
        'src/db/migrate.ts',
      ],
    },
  },
});
