---
name: audit
description: Auditoría completa del proyecto. Lanza agentes en paralelo para revisar backend, frontend, tests y seguridad. Genera reporte consolidado.
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

## Reporte consolidado

```
=== AUDITORÍA API LEARNING HUB ===
Fecha: [fecha]

🔒 SEGURIDAD:    [PASS/FAIL] — N problemas encontrados
🧪 TESTS:        [PASS/FAIL] — N/N passing, cobertura XX%
📐 LINT:         [PASS/FAIL] — N errores
🔍 DEPENDENCIAS: [PASS/FAIL] — N vulnerabilidades altas
```

Para cada problema: archivo, línea, severidad, descripción y fix propuesto.
