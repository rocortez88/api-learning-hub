import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║        API Learning Hub — Backend          ║
╠════════════════════════════════════════════╣
║  Entorno  : ${env.NODE_ENV.padEnd(30)}║
║  Puerto   : ${String(env.PORT).padEnd(30)}║
║  Docs API : http://localhost:${env.PORT}/api/docs${' '.repeat(13 - String(env.PORT).length)}║
║  Health   : http://localhost:${env.PORT}/health${' '.repeat(17 - String(env.PORT).length)}║
╚════════════════════════════════════════════╝
  `);
});
