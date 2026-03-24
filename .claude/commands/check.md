---
name: check
description: Corre lint + typecheck + tests en backend y frontend. Úsalo antes de hacer commit o PR.
---

Actúa como el **Agente de Verificación** del proyecto API Learning Hub.

Ejecuta todos los checks de calidad en orden. Si alguno falla, detente y reporta el error.

## Pasos

### 1. Lint Backend

```bash
cd backend && npm run lint
```

### 2. Lint Frontend

```bash
cd frontend && npm run lint
```

### 3. Typecheck Backend

```bash
cd backend && npm run typecheck
```

### 4. Typecheck Frontend

```bash
cd frontend && npm run typecheck
```

### 5. Tests Backend

```bash
cd backend && npm test
```

### 6. E2E Frontend (opcional, requiere app corriendo)

```bash
cd frontend && npm run test:e2e
```

## Reporte

Al finalizar muestra:

```
✅ Lint backend:      PASS / ❌ FAIL (N errores)
✅ Lint frontend:     PASS / ❌ FAIL (N errores)
✅ Typecheck backend: PASS / ❌ FAIL
✅ Typecheck frontend:PASS / ❌ FAIL
✅ Tests backend:     PASS (N/N) / ❌ FAIL
✅ E2E:               PASS (N/N) / ❌ FAIL
```

Si hay fallos, muestra los errores y propón los fixes necesarios.
