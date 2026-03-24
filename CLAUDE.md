# API Learning Hub — CLAUDE.md

## Descripcion del Proyecto

Aplicacion web educativa e interactiva para aprender APIs desde cero hasta nivel avanzado.
El enfoque principal es la **practica insistente**: cada concepto se refuerza con multiples
ejercicios progresivos, modos de repaso y retos reales.

**Rol de Claude:** Experto en APIs actuando como arquitecto, desarrollador y educador.

---

## Stack Tecnologico

| Capa | Tecnologia | Razon |
|------|-----------|-------|
| Frontend | React + Vite | Rapido, moderno, sin overhead |
| Backend | Node.js + Express | Ideal para ensenar APIs REST reales |
| Base de datos | SQLite (dev) / PostgreSQL (prod) | Simple localmente, escalable en produccion |
| ORM / Migraciones | Drizzle ORM | Ligero, type-safe, excelente DX |
| Autenticacion | JWT + refresh tokens | Estandar real de la industria |
| Documentacion API | Swagger / OpenAPI 3.0 | Auto-generada desde el codigo |
| Validacion | Zod | Schema validation en backend y frontend |
| Seguridad headers | Helmet.js | OWASP best practices |
| Rate limiting | express-rate-limit | Proteccion y leccion practica |
| Tests backend | Vitest + Supertest | Unit + integration |
| Tests E2E | Playwright | Flujos completos de usuario |
| Contenedores | Docker + Docker Compose | Un comando para levantar todo |
| CI/CD | GitHub Actions | Lint, tests, build, deploy |

---

## Estructura del Proyecto

```
api-learning-hub/
├── CLAUDE.md
├── docker-compose.yml
├── .env.example
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── backend/
│   ├── src/
│   │   ├── app.ts               # Express app setup
│   │   ├── server.ts            # Entry point
│   │   ├── config/
│   │   │   ├── env.ts           # Variables de entorno validadas con Zod
│   │   │   └── swagger.ts       # Configuracion OpenAPI
│   │   ├── db/
│   │   │   ├── index.ts         # Conexion Drizzle
│   │   │   ├── schema.ts        # Schema completo de tablas
│   │   │   └── migrations/      # Migraciones versionadas
│   │   ├── modules/
│   │   │   ├── auth/            # Login, registro, JWT, refresh
│   │   │   ├── users/           # Perfil y progreso del usuario
│   │   │   ├── modules/         # Modulos educativos
│   │   │   ├── exercises/       # Ejercicios y validacion de respuestas
│   │   │   ├── attempts/        # Historial de intentos
│   │   │   └── practice/        # Logica de repeticion espaciada
│   │   ├── middleware/
│   │   │   ├── auth.ts          # JWT verification
│   │   │   ├── rateLimiter.ts   # Rate limiting por ruta
│   │   │   ├── validate.ts      # Zod request validation
│   │   │   └── errorHandler.ts  # Global error handler
│   │   └── utils/
│   │       ├── jwt.ts
│   │       └── crypto.ts
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── package.json
│   ├── tsconfig.json
│   └── drizzle.config.ts
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── api/                 # Cliente HTTP (fetch wrapper tipado)
│   │   ├── components/
│   │   │   ├── ui/              # Componentes base (Button, Card, Badge)
│   │   │   ├── editor/          # Editor de codigo interactivo
│   │   │   ├── request-viewer/  # Visualizador de request/response
│   │   │   ├── exercise/        # Componentes de ejercicios
│   │   │   └── progress/        # Barra de progreso y estadisticas
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Module.tsx       # Vista de modulo educativo
│   │   │   ├── Exercise.tsx     # Ejercicio individual
│   │   │   ├── Drill.tsx        # Modo rafaga de ejercicios
│   │   │   └── Profile.tsx
│   │   ├── store/               # Estado global (Zustand)
│   │   ├── hooks/               # Custom hooks
│   │   └── types/               # TypeScript types compartidos
│   ├── tests/
│   │   └── e2e/                 # Playwright tests
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── docs/
    ├── curriculum.md            # Mapa completo del curriculum
    ├── exercises-spec.md        # Especificacion de ejercicios
    └── api-reference.md         # Referencia interna del proyecto
```

---

## Schema de Base de Datos

```sql
-- Usuarios y autenticacion
users                (id, email, username, password_hash, role, created_at)
refresh_tokens       (id, user_id, token_hash, expires_at, revoked)

-- Contenido educativo
modules              (id, slug, title, description, level, order, unlocked_by_module_id)
lessons              (id, module_id, title, content_md, order, type)
exercises            (id, lesson_id, type, prompt, starter_code, solution,
                      validation_logic, difficulty, points, hints_json)

-- Progreso y practica
user_progress        (id, user_id, module_id, lesson_id, completed_at, score)
attempts             (id, user_id, exercise_id, submitted_code, result,
                      passed, time_spent_ms, hint_used_level, created_at)
spaced_repetition    (id, user_id, exercise_id, next_review_at, interval_days,
                      ease_factor, repetitions)
```

---

## Schema Multi-Agente

```
ORQUESTADOR PRINCIPAL (Claude Code — sesion activa)
│
├── AGENTE EDUCATIVO
│   ├── Disenar curriculum por niveles
│   ├── Redactar contenido de lecciones
│   ├── Crear ejercicios (minimo 5 tipos por concepto)
│   ├── Definir logica de progresion y desbloqueo
│   └── Implementar repeticion espaciada
│
└── AGENTE TECNICO
    ├── Sub-agente: Backend/API
    │   ├── Endpoints REST de la plataforma
    │   ├── Endpoints de practica para los estudiantes
    │   ├── Logica de validacion de ejercicios
    │   └── Documentacion Swagger auto-generada
    │
    ├── Sub-agente: Base de Datos
    │   ├── Schema Drizzle + migraciones
    │   ├── Seeds por modulo educativo
    │   ├── Queries optimizadas de progreso
    │   └── Persistencia de intentos y repeticion espaciada
    │
    ├── Sub-agente: Frontend/UX
    │   ├── UI interactiva y responsive
    │   ├── Editor de codigo en vivo (Monaco Editor)
    │   ├── Visualizador de request/response en tiempo real
    │   └── Dashboard de progreso del estudiante
    │
    ├── Sub-agente: Seguridad
    │   ├── JWT + refresh token rotation
    │   ├── RBAC (estudiante / admin)
    │   ├── Rate limiting por endpoint
    │   ├── Validacion Zod en todas las entradas
    │   ├── Helmet.js + CORS explicito
    │   └── Audit de dependencias en CI
    │
    ├── Sub-agente: Tests
    │   ├── Unit tests (logica de negocio)
    │   ├── Integration tests (endpoints con DB real)
    │   ├── E2E tests Playwright (flujos completos)
    │   └── Coverage minimo: 80%
    │
    └── Sub-agente: DevOps/Docker
        ├── Docker Compose (backend + frontend + db)
        ├── Variables de entorno (.env.example documentado)
        ├── GitHub Actions CI/CD
        └── Scripts de desarrollo (seed, migrate, dev)
```

---

## Curriculum y Ejercicios

### Estructura de cada modulo (5 tipos de ejercicio por concepto)

```
1. TEORIA RAPIDA     → Leer + quiz de 3 preguntas
2. OBSERVAR          → Ver request/response en vivo y analizar
3. COMPLETAR CODIGO  → Fill-in-the-blank interactivo
4. CONSTRUIR DESDE 0 → Editor libre con validacion automatica
5. DEBUGGEAR ERRORES → Codigo roto que el estudiante debe arreglar
6. MINI RETO FINAL   → Caso real combinando conceptos del modulo
```

### Modulos y cantidad de ejercicios

| Nivel | Modulo | Ejercicios |
|-------|--------|-----------|
| 1 | Fundamentos: que es una API, HTTP, fetch basico | 25 |
| 2 | REST: CRUD, endpoints, query params, body | 40 |
| 3 | Autenticacion: API Keys, JWT, OAuth 2.0 | 35 |
| 4 | Avanzado: rate limiting, paginacion, WebSockets, GraphQL | 45 |
| 5 | Produccion: OpenAPI, versionado, seguridad | 30 |
| **Total** | | **~175 ejercicios** |

### Mecanicas de practica insistente

| Feature | Descripcion |
|---------|-------------|
| Repeticion espaciada | Ejercicios fallados reaparecen mas tarde (algoritmo SM-2) |
| Variaciones | Mismo concepto, 8+ contextos distintos |
| Modo Drill | Rafaga de 10 ejercicios rapidos del mismo tema |
| Errores forzados | El sistema provoca errores clasicos para reconocerlos |
| Checkpoint obligatorio | 80% minimo para avanzar de modulo |
| Historial de intentos | Cuantas veces intentaste cada ejercicio |
| Pistas progresivas | 3 niveles de ayuda antes de revelar solucion |
| Modo repaso | Repaso comprimido de todo lo aprendido |

---

## Fases de Desarrollo

```
Fase 1 — Fundacion
  [ ] Estructura de carpetas + monorepo
  [ ] Docker Compose funcional
  [ ] CI/CD basico con GitHub Actions
  [ ] Variables de entorno y configuracion

Fase 2 — Base de Datos
  [ ] Schema Drizzle completo
  [ ] Migraciones iniciales
  [ ] Seeds de modulos y ejercicios nivel 1-2

Fase 3 — Backend API
  [ ] Auth (registro, login, JWT, refresh)
  [ ] CRUD de modulos, lecciones, ejercicios
  [ ] Endpoint de validacion de respuestas
  [ ] Logica de progreso y repeticion espaciada
  [ ] Swagger auto-generado

Fase 4 — Frontend
  [ ] Routing y layout principal
  [ ] Dashboard de progreso
  [ ] Visualizador request/response
  [ ] Editor de codigo (Monaco)
  [ ] Pantallas de ejercicio (todos los tipos)
  [ ] Modo Drill

Fase 5 — Contenido Educativo
  [ ] Lecciones nivel 1 y 2 completas
  [ ] 65 ejercicios con validacion
  [ ] Lecciones nivel 3, 4 y 5
  [ ] 110 ejercicios restantes

Fase 6 — Seguridad y Tests
  [ ] Rate limiting por ruta
  [ ] Validacion Zod completa
  [ ] Suite de tests (unit + integration + E2E)
  [ ] Audit de seguridad

Fase 7 — Pulido y Deploy
  [ ] Responsive y accesibilidad
  [ ] Performance (lazy loading, caching)
  [ ] Deploy en Railway / Vercel / VPS
```

---

## Convenciones de Codigo

- **TypeScript estricto** en todo el proyecto (`strict: true`)
- **Nombres en ingles** para codigo; contenido educativo en **espanol**
- **Commits en ingles** siguiendo Conventional Commits (`feat:`, `fix:`, `chore:`)
- **Un modulo = una carpeta** con `index.ts`, `routes.ts`, `service.ts`, `schema.ts`
- **Nunca secretos en codigo** — siempre via variables de entorno
- **Zod primero** — validar toda entrada externa antes de procesarla
- **Errores tipados** — nunca lanzar strings, siempre clases de error con codigo HTTP

---

## Seguridad — Reglas No Negociables

1. Passwords hasheados con `bcrypt` (min 12 rounds)
2. JWT con expiracion corta (15min) + refresh token rotation
3. Rate limiting en `/auth/*` (5 intentos/min) y `/api/*` (100 req/min)
4. Todos los inputs validados con Zod antes de llegar a la DB
5. CORS configurado explicitamente, nunca `origin: *` en produccion
6. Headers de seguridad via Helmet.js
7. Variables de entorno nunca commiteadas (`.env` en `.gitignore`)
8. `npm audit` ejecutado en cada PR via CI

---

## Comandos Principales

```bash
# Desarrollo
docker-compose up -d          # Levantar todo el stack
npm run dev                   # Backend + Frontend en modo watch

# Base de datos
npm run db:migrate            # Ejecutar migraciones pendientes
npm run db:seed               # Cargar datos de prueba
npm run db:studio             # Drizzle Studio (UI para la DB)

# Tests
npm run test                  # Unit + integration
npm run test:e2e              # Playwright E2E
npm run test:coverage         # Reporte de cobertura

# Produccion
npm run build                 # Build de produccion
npm run start                 # Iniciar servidor de produccion
```
