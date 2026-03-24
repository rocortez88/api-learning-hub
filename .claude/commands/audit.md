---
name: audit
description: Auditoría completa del proyecto. Lanza agentes en paralelo para revisar backend, frontend, tests, seguridad y contratos frontend↔backend. Genera reporte consolidado.
---

Actúa como el **Orquestador de Auditoría** del proyecto API Learning Hub.

Lanza los siguientes agentes en paralelo y consolida sus resultados:

## Agentes a lanzar (en paralelo)

### Agente 1 — Seguridad

Ejecuta `/security-review` sobre los módulos críticos:

- `backend/src/modules/auth/`
- `backend/src/middleware/auth.ts`
- `backend/src/middleware/rateLimiter.ts`

### Agente 2 — Tests

Ejecuta `/run-tests` y reporta:

- Tests que fallan
- Cobertura actual vs mínimo 80%

### Agente 3 — Lint + Typecheck

```bash
npm run check
```

### Agente 4 — Dependencias

```bash
cd backend && npm audit --audit-level=high
cd frontend && npm audit --audit-level=high
```

### Agente 5 — Contratos frontend↔backend

Revisa que los tipos TypeScript del frontend coincidan con las respuestas reales del backend.

Para cada endpoint que el frontend consume, verifica:

1. **Forma de la respuesta**: ¿el frontend espera `{ data: T }` y el backend devuelve eso?
2. **Campos de tipos locales**: busca interfaces locales en páginas y hooks (ej. `interface AttemptResult`, `interface PageState`) y compara contra el servicio backend correspondiente.
3. **Parámetros de ruta**: ¿`useParams` lee el mismo nombre que define la ruta en `App.tsx`? (ej. `:exerciseId` vs `:lessonId`)
4. **Validaciones de formato**: busca regex o guards sobre IDs — deben aceptar UUIDs (`[0-9a-f-]{36}`), no solo dígitos (`\d+`).

Archivos a revisar:

- `frontend/src/pages/*.tsx` — interfaces locales y `useParams`
- `frontend/src/hooks/*.ts` — tipos de respuesta de API
- `frontend/src/types/index.ts` — tipos compartidos
- `backend/src/modules/*/*.service.ts` — forma real de los datos retornados
- `backend/src/modules/*/*.routes.ts` — estructura de respuesta (`res.json({ data: ... })`)

### Agente 6 — Flujo funcional (checklist)

Verifica estáticamente (sin levantar servidor) que los siguientes flujos estén correctamente conectados:

1. **Registro → Login**: `POST /api/auth/register` y `POST /api/auth/login` devuelven `{ data: { accessToken, refreshToken, user } }` y el frontend los consume correctamente.
2. **Módulos**: `GET /api/modules` devuelve array, frontend mapea `isUnlocked` y navega a `/modules/:slug`.
3. **Lección → Ejercicio**: la ruta `/modules/:moduleSlug/lessons/:lessonId` en `App.tsx` usa el componente correcto y el componente lee `lessonId` (no `exerciseId`) para llamar al endpoint `/api/exercises/lessons/:lessonId`.
4. **Submit de intento**: `POST /api/exercises/:id/attempt` devuelve `{ attemptId, passed, result, points, nextReviewAt }` y el frontend no intenta acceder a `.attempt.passed` (campo inexistente).
5. **Practice queue**: `GET /api/practice/queue` devuelve `{ data: [...], total: N }` y el frontend accede a `res.body.data` (no `res.body.data.data`).

---

## Reporte consolidado

```
=== AUDITORÍA API LEARNING HUB ===
Fecha: [fecha]

🔒 SEGURIDAD:         [PASS/FAIL] — N problemas encontrados
🧪 TESTS:             [PASS/FAIL] — N/N passing, cobertura XX%
📐 LINT:              [PASS/FAIL] — N errores
🔍 DEPENDENCIAS:      [PASS/FAIL] — N vulnerabilidades altas
🔗 CONTRATOS FE↔BE:   [PASS/FAIL] — N desajustes encontrados
✅ FLUJO FUNCIONAL:   [PASS/FAIL] — N flujos con problemas
```

Para cada problema: archivo, línea, severidad, descripción y fix propuesto.
