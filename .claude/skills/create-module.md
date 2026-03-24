---
name: create-module
description: Crea un módulo backend completo siguiendo el patrón del proyecto (schema → service → routes → tests). Úsalo para implementar cualquier nuevo módulo de la API.
---

Actúa como el **Agente Técnico Backend** del proyecto API Learning Hub.

## Patrón obligatorio para cada módulo

Todo módulo en `backend/src/modules/<nombre>/` debe seguir esta estructura:

```
<nombre>/
├── <nombre>.schema.ts    ← validación Zod de requests
├── <nombre>.service.ts   ← lógica de negocio pura
└── <nombre>.routes.ts    ← rutas Express + JSDoc Swagger
```

Y sus tests en:
```
backend/tests/integration/<nombre>.test.ts
```

## Reglas no negociables

1. **Schema primero**: define el `ZodSchema` antes de escribir el service
2. **Service puro**: sin `req`/`res` — solo recibe datos tipados y devuelve datos tipados
3. **Rutas delgadas**: el handler solo llama al service + envuelve con try/catch
4. **Swagger obligatorio**: cada endpoint tiene `@openapi` JSDoc
5. **Errores tipados**: solo `AppError(statusCode, message, code)` — nunca strings
6. **No exponer internos**: `passwordHash`, `solution`, `validationLogic` nunca en respuestas

## Template de módulo

### schema.ts
```typescript
import { z } from 'zod';

export const <action>Schema = z.object({
  // campos con mensajes de error en español
});

export type <Action>Input = z.infer<typeof <action>Schema>;
```

### service.ts
```typescript
import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { <table> } from '../../db/schema.js';
import { AppError } from '../../middleware/errorHandler.js';

export function <action>(input: <Action>Input) {
  // lógica de negocio
  // Drizzle ORM únicamente — nunca SQL concatenado
}
```

### routes.ts
```typescript
import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { <action>Schema } from './<nombre>.schema.js';
import * as <nombre>Service from './<nombre>.service.js';

export const <nombre>Router = Router();

/**
 * @openapi
 * /<ruta>:
 *   <método>:
 *     summary: ...
 *     tags: [...]
 *     security:
 *       - bearerAuth: []
 */
<nombre>Router.<método>('/', requireAuth, validate(<action>Schema), (req, res, next) => {
  try {
    const result = <nombre>Service.<action>(req.body);
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
});
```

## Al terminar el módulo

1. Registrar el router en `app.ts`
2. Invocar `/security-review` sobre los archivos creados
3. Invocar `/run-tests` para verificar cobertura
