# API Learning Hub

Plataforma web para aprender APIs desde cero hasta nivel avanzado, con ejercicios prácticos, editor de código en vivo y seguimiento de progreso.

---

## Cómo correr el proyecto en tu computadora

### Requisitos previos
- [Node.js 20+](https://nodejs.org)
- [npm](https://npmjs.com) (viene incluido con Node.js)

### 1. Instalar dependencias

```bash
# Backend
cd backend
npm install

# Frontend (en otra terminal)
cd frontend
npm install
```

### 2. Configurar variables de entorno

Copia el archivo de ejemplo y renómbralo:

```bash
cp .env.example .env
```

El archivo `.env` ya tiene valores listos para desarrollo local. No necesitas cambiar nada para empezar.

### 3. Preparar la base de datos

```bash
cd backend
npm run db:migrate   # Crea las tablas
npm run db:seed      # Carga los 175 ejercicios de contenido
```

### 4. Iniciar la aplicación

```bash
# Terminal 1 — Backend
cd backend
DATABASE_URL=file:./dev.db JWT_SECRET=dev-secret-key-cambiar-en-produccion-32chars JWT_REFRESH_SECRET=dev-refresh-secret-cambiar-en-produccion-32c npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

### 5. Abrir en el navegador

| Servicio | URL |
|----------|-----|
| Aplicación | http://localhost:5173 |
| Documentación API (Swagger) | http://localhost:3001/api/docs |

---

## Correr con Docker (opción alternativa)

Si tienes [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado, puedes levantar todo con un solo comando:

```bash
# Desarrollo (con recarga automática al guardar cambios)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Producción local
docker-compose up
```

---

## Comandos útiles

```bash
# Tests
cd backend && npm run test              # Ejecutar todos los tests
cd backend && npm run test:coverage     # Ver cobertura de tests

# Base de datos
cd backend && npm run db:studio         # Abrir interfaz visual de la base de datos
cd backend && npm run db:seed           # Recargar los ejercicios de contenido

# Verificar tipos TypeScript
cd backend && npm run typecheck
cd frontend && npm run typecheck
```

---

## Estructura del proyecto

```
api-learning-hub/
├── backend/          → Servidor Node.js + Express (API REST)
├── frontend/         → Aplicación React + Vite
├── docs/             → Documentación del curriculum y ejercicios
├── .github/          → CI/CD con GitHub Actions
├── docker-compose.yml
└── .env.example      → Plantilla de variables de entorno
```

---

## Deploy en internet (Railway + Vercel)

Cuando quieras que la app sea accesible desde cualquier lugar, sigue estos pasos:

### Paso 1 — Crear cuenta en Railway (para el backend)

1. Entra a [railway.app](https://railway.app) y crea una cuenta
2. Crea un nuevo proyecto
3. Ve a **Account Settings → Tokens** y genera un token
4. Guarda ese token, lo necesitarás en el Paso 3

### Paso 2 — Crear proyecto en Vercel (para el frontend)

1. Entra a [vercel.com](https://vercel.com) y crea una cuenta
2. Crea un nuevo proyecto conectado a este repositorio de GitHub
3. Ve a **Account Settings → Tokens** y genera un token
4. En la configuración del proyecto busca tu **Project ID** y **Org ID**
5. Guarda los tres valores

### Paso 3 — Guardar las credenciales en GitHub

1. Ve a tu repositorio en GitHub
2. Entra a **Settings → Secrets and variables → Actions**
3. Añade estos 4 secretos (uno por uno):

| Nombre del secreto | Valor |
|--------------------|-------|
| `RAILWAY_TOKEN` | El token que generaste en Railway |
| `VERCEL_TOKEN` | El token que generaste en Vercel |
| `VERCEL_ORG_ID` | El Org ID de tu proyecto en Vercel |
| `VERCEL_PROJECT_ID` | El Project ID de tu proyecto en Vercel |

### Paso 4 — Conectar frontend con backend en producción

En Vercel, dentro de la configuración de tu proyecto, añade esta variable de entorno:

| Variable | Valor |
|----------|-------|
| `VITE_API_URL` | La URL de tu backend en Railway (ej: `https://tu-app.railway.app/api`) |

### Paso 5 — Deploy automático

A partir de ahora, cada vez que hagas `git push`, GitHub Actions se encarga de subir automáticamente el backend a Railway y el frontend a Vercel. No tienes que hacer nada más.

---

## Tecnologías usadas

| Parte | Tecnología |
|-------|-----------|
| Frontend | React + Vite + TypeScript |
| Backend | Node.js + Express + TypeScript |
| Base de datos (desarrollo) | SQLite |
| Base de datos (producción) | PostgreSQL |
| Autenticación | JWT + refresh tokens |
| Validación | Zod |
| Tests | Vitest + Supertest |
| Tests E2E | Playwright |
| Contenedores | Docker + Docker Compose |
| Deploy backend | Railway |
| Deploy frontend | Vercel |
