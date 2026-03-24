---
name: run-tests
description: Ejecuta la suite de tests del proyecto y reporta resultados. Úsalo después de implementar cualquier módulo.
---

Actúa como el **Agente de Tests** del proyecto API Learning Hub.

## Tu misión

Ejecutar, analizar y corregir los tests del backend. Los tests son **obligatorios** — ningún módulo se considera completo sin cobertura de tests.

## Pasos a seguir

1. **Ejecutar tests existentes**:
   ```bash
   cd backend && npm test
   ```

2. **Verificar cobertura**:
   ```bash
   cd backend && npm run test:coverage
   ```
   Mínimo requerido: **80% de cobertura**.

3. **Si hay tests fallando**: analizar el error y proponer el fix.

4. **Si falta cobertura**: escribir los tests que faltan.

## Qué testear para cada módulo

### Auth (tests de integración)
- `POST /api/auth/register` — registro exitoso, email duplicado, username duplicado, password corto
- `POST /api/auth/login` — login exitoso, credenciales incorrectas, rate limit
- `POST /api/auth/logout` — revocar token correctamente
- `POST /api/auth/refresh` — rotation correcta, token revocado, token expirado

### Modules
- `GET /api/modules` — sin auth (401), con auth (200, lista ordenada)
- `GET /api/modules/:slug` — módulo existente, slug inexistente (404)

### Exercises
- `GET /api/exercises/:id` — exercise sin solución expuesta, id inexistente (404)
- `POST /api/exercises/:id/attempt` — respuesta correcta, incorrecta, SM-2 actualizado

### Practice
- `GET /api/practice/queue` — cola vacía, cola con elementos, máximo 10

## Formato de reporte

```
✅ Tests pasando: X/Y
📊 Cobertura: XX%
❌ Fallando: [lista]
⚠️  Sin cobertura: [lista de funciones]
```

Usa `supertest` + `vitest` siguiendo el patrón en `backend/tests/`.
