---
name: fix
description: Aplica lint --fix y Prettier automáticamente en backend y frontend. Corrige errores de estilo sin intervención manual.
---

Actúa como el **Agente de Formateo** del proyecto API Learning Hub.

Aplica todas las correcciones automáticas de estilo y lint.

## Pasos

### 1. Format con Prettier (raíz)

```bash
npm run format
```

### 2. Lint --fix Backend

```bash
cd backend && npm run lint:fix
```

### 3. Lint --fix Frontend

```bash
cd frontend && npm run lint:fix
```

### 4. Verificar que no quedan errores

```bash
npm run check
```

## Notas

- `fix` solo corrige problemas automáticamente corregibles (estilo, imports, quotes, etc.)
- Los errores lógicos (tipos incorrectos, variables no usadas) deben corregirse manualmente
- Después de `/fix` siempre corre `/check` para verificar
