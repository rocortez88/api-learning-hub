# API Learning Hub — Plan de Mejoras

> Marcar con `[x]` al completar cada ítem. Última actualización: 2026-03-24

---

## Fase 1 — Tooling (ESLint + Prettier + Husky)

- [x] 1a. Instalar ESLint + `@typescript-eslint` en backend y frontend
- [x] 1b. Crear `eslint.config.mjs` en backend
- [x] 1c. Crear `eslint.config.mjs` en frontend
- [x] 1d. Instalar Prettier + crear `.prettierrc.json` en raíz
- [x] 1e. Instalar Husky + lint-staged en raíz
- [x] 1f. Crear hook `pre-commit` (lint-staged + typecheck)
- [x] 1g. Actualizar scripts en `package.json` raíz, backend y frontend
- [x] 1h. Agregar step de lint a `.github/workflows/ci.yml`
- [x] 1i. Crear slash commands `/check`, `/fix`, `/audit`

## Fase 2 — Bugs Críticos

- [x] 2a. `auth.ts` — `requireAuth`/`requireRole` usan `throw` sync → cambiar a `next(err)`
- [x] 2b. `auth.routes.ts` — `/auth/refresh` devuelve sin wrapper `{ data }` → agregar wrapper
- [x] 2c. `modules.service.ts` — `isUnlocked` usa `progress >= 0` → cambiar a `>= 80`
- [x] 2d. `modules.service.ts` — `sqlite.prepare()` al top-level rompe tests → lazy init
- [x] 2e. `types/index.ts` — `PracticeQueueItem` tipo incorrecto → sincronizar con backend
- [x] 2f. `setup.ts` (tests) — `registerAndLogin` usa `res.body.accessToken` → `res.body.data.accessToken`

## Fase 3 — Bugs Altos

- [x] 3a. `auth.service.ts` — operaciones de DB sin try-catch (register, logout, refresh)
- [x] 3b. `Dashboard.tsx` — `practiceQueue[0]?.lessonId` siempre undefined → `exercise.lessonId`
- [x] 3c. `useModules.ts` — fallback silencioso en `.catch()` esconde errores reales
- [x] 3d. `Drill.tsx` — `phase` queda en `'loading'` en error → agregar fase `'error'`
- [x] 3e. `practice.routes.ts` — respuesta sin wrapper `{ data }` consistente

## Fase 4 — Tests

- [x] 4a. Ejecutar `npm test` y verificar que todos los tests pasan (46/46 ✓, 3 skipped)
- [x] 4b. Verificar cobertura ≥ 80% (91.16% ✓)
- [x] 4c. Agregar unit tests básicos para servicios críticos (auth, practice, exercises) — 31 unit tests nuevos (14 auth + 8 exercises + 9 practice), total 77/77 ✓

## Fase 5 — Verificación Final

- [x] 5a. `npm run check` pasa en raíz (lint + typecheck + tests) — 0 errores, solo warnings esperados
- [x] 5b. E2E Playwright: 8/8 pasan
- [x] 5c. Build de producción sin errores (`npm run build`)
- [x] 5d. App funcional end-to-end: registro → login → módulos → ejercicio

---

## Comandos rápidos

```bash
npm run check        # lint + typecheck + tests (todo)
npm run fix          # lint --fix + format automático
npm run dev          # backend + frontend en paralelo
npm test             # solo tests backend
npm run test:e2e     # E2E Playwright
```

## Slash commands disponibles

| Comando            | Descripción                                        |
| ------------------ | -------------------------------------------------- |
| `/check`           | Corre lint + typecheck + tests en ambos workspaces |
| `/fix`             | Aplica lint --fix y Prettier en todos los archivos |
| `/audit`           | Auditoría completa: seguridad + lint + tests       |
| `/run-tests`       | Ejecuta y analiza la suite de tests                |
| `/security-review` | Auditoría de seguridad del módulo indicado         |
