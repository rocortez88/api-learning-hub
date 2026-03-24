/**
 * NIVEL 1 — FUNDAMENTOS
 * 3 lecciones · 25 ejercicios
 *
 * Lección 1: ¿Qué es una API?          → 5 ejercicios
 * Lección 2: HTTP: verbos, status, headers → 10 ejercicios
 * Lección 3: Tu primer GET con fetch()  → 10 ejercicios
 */

import type { SeedModule } from './types.js';

export const level1: SeedModule = {
  module: {
    slug: 'fundamentos',
    title: 'Fundamentos de APIs',
    description: 'Aprende qué es una API, cómo funciona HTTP y haz tu primera llamada real con fetch().',
    level: 1,
    order: 1,
    unlockedByModuleId: null,
  },

  lessons: [
    // ═══════════════════════════════════════════════════════════════════════
    // LECCIÓN 1 — ¿Qué es una API? (5 ejercicios)
    // ═══════════════════════════════════════════════════════════════════════
    {
      lesson: {
        title: '¿Qué es una API?',
        order: 1,
        type: 'theory',
        contentMd: `
# ¿Qué es una API?

**API** significa **Application Programming Interface** (Interfaz de Programación de Aplicaciones).

Una API es un **contrato** entre dos programas: uno define qué puede hacer y cómo pedírselo,
el otro lo usa sin necesidad de saber cómo funciona por dentro.

## La analogía del restaurante

Imagina que estás en un restaurante:
- **Tú** eres la aplicación cliente (quien pide).
- **El mesero** es la API (el intermediario).
- **La cocina** es el servidor (quien procesa y responde).

Tú no entras a la cocina. Le pides al mesero, él lleva la orden, y te trae el resultado.

## ¿Por qué existen las APIs?

- Para que dos sistemas se comuniquen sin conocer sus internos.
- Para reutilizar funcionalidades (pagar con Stripe, enviar email con SendGrid, etc.).
- Para separar el frontend del backend.

## Tipos de APIs más comunes

| Tipo | Descripción |
|------|-------------|
| REST | Basada en HTTP, recursos identificados por URLs |
| GraphQL | El cliente pide exactamente los datos que necesita |
| WebSockets | Comunicación en tiempo real bidireccional |
        `,
      },
      exercises: [
        {
          order: 1,
          type: 'quiz',
          difficulty: 'easy',
          points: 10,
          prompt: '¿Qué significa la sigla API?',
          starterCode: null,
          solution: 'c',
          validationLogic: JSON.stringify({
            type: 'exact_match',
            answer: 'c',
            options: [
              { key: 'a', text: 'Automated Programming Interface' },
              { key: 'b', text: 'Advanced Protocol Integration' },
              { key: 'c', text: 'Application Programming Interface' },
              { key: 'd', text: 'Automated Process Integration' },
            ],
            explanation: 'API = Application Programming Interface. Es la interfaz que permite que dos aplicaciones se comuniquen entre sí.',
          }),
          hintsJson: JSON.stringify([
            'Piensa en las palabras: Aplicación, Programación, Interfaz.',
            'La "I" final siempre es "Interface" (Interfaz).',
            'La respuesta correcta es la opción C.',
          ]),
        },
        {
          order: 2,
          type: 'quiz',
          difficulty: 'easy',
          points: 10,
          prompt: 'En la analogía del restaurante, ¿qué representa la cocina?',
          starterCode: null,
          solution: 'b',
          validationLogic: JSON.stringify({
            type: 'exact_match',
            answer: 'b',
            options: [
              { key: 'a', text: 'El cliente (tú)' },
              { key: 'b', text: 'El servidor (quien procesa y responde)' },
              { key: 'c', text: 'La API (el intermediario)' },
              { key: 'd', text: 'La base de datos' },
            ],
            explanation: 'La cocina representa el servidor: procesa las solicitudes internamente y devuelve el resultado. Tú (cliente) nunca entras a la cocina directamente.',
          }),
          hintsJson: JSON.stringify([
            'El mesero es la API. El cliente eres tú. ¿Quién queda?',
            'La cocina procesa la orden internamente. ¿Qué hace el servidor?',
            'La respuesta es B: el servidor.',
          ]),
        },
        {
          order: 3,
          type: 'observe',
          difficulty: 'easy',
          points: 10,
          prompt: `Observa esta interacción real con la API de GitHub y responde: ¿Quién es el cliente, quién es la API y qué devuelve el servidor?

\`\`\`
PETICIÓN (Cliente → Servidor):
GET https://api.github.com/users/octocat

RESPUESTA (Servidor → Cliente):
{
  "login": "octocat",
  "id": 583231,
  "name": "The Octocat",
  "public_repos": 8,
  "followers": 9000
}
\`\`\`

Escribe tu análisis en el formato:
Cliente: [quién hace la petición]
API: [la URL base de la API]
Dato obtenido: [qué información respondió el servidor]`,
          starterCode: null,
          solution: 'Cliente: tu aplicación / navegador\nAPI: api.github.com\nDato obtenido: información del perfil del usuario octocat',
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['cliente', 'api.github.com', 'octocat'],
            caseSensitive: false,
            explanation: 'El cliente es quien hace la petición GET. La API es api.github.com. El servidor devolvió los datos del perfil de octocat.',
          }),
          hintsJson: JSON.stringify([
            'El cliente es quien inicia la comunicación haciendo la petición GET.',
            'La API vive en la URL: api.github.com',
            'El servidor respondió con datos del usuario: login, name, public_repos, followers...',
          ]),
        },
        {
          order: 4,
          type: 'fill_blank',
          difficulty: 'easy',
          points: 10,
          prompt: `Completa los espacios en blanco con las palabras correctas:
Una API actúa como ___ entre el cliente y el servidor.
El cliente ___ datos, el servidor los ___ y ___ una respuesta.
La API define un ___ de cómo comunicarse.`,
          starterCode: 'Una API actúa como ___ entre el cliente y el servidor.\nEl cliente ___ datos, el servidor los ___ y ___ una respuesta.\nLa API define un ___ de cómo comunicarse.',
          solution: 'Una API actúa como intermediario entre el cliente y el servidor.\nEl cliente envía datos, el servidor los procesa y devuelve una respuesta.\nLa API define un contrato de cómo comunicarse.',
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['intermediario', 'envía', 'procesa', 'devuelve', 'contrato'],
            caseSensitive: false,
            explanation: 'Las palabras clave: intermediario, envía, procesa, devuelve, contrato.',
          }),
          hintsJson: JSON.stringify([
            'Piensa en quién está "en el medio": inter-mediario.',
            'El cliente envía / manda / pide. El servidor procesa / maneja.',
            'Una API es como un contrato: define exactamente qué puedes pedir y cómo.',
          ]),
        },
        {
          order: 5,
          type: 'challenge',
          difficulty: 'easy',
          points: 20,
          prompt: `Mini reto: Identifica 3 APIs que usas en tu vida diaria sin saberlo.
Para cada una, escribe:
1. El servicio (ej: Google Maps)
2. Qué hace la API (ej: devuelve rutas y coordenadas)
3. Quién sería el "cliente" en ese caso

Escríbelas en formato de lista.`,
          starterCode: '// Ejemplo:\n// 1. Google Maps → devuelve rutas → cliente: apps de delivery\n// 2. ...\n// 3. ...',
          solution: '// Respuesta abierta — ejemplos válidos:\n// Stripe → procesa pagos → cliente: tiendas en línea\n// Spotify → devuelve canciones → cliente: apps de música\n// OpenWeather → devuelve clima → cliente: apps del tiempo\n// Twitter/X → devuelve tweets → cliente: apps sociales\n// SendGrid → envía emails → cliente: cualquier app',
          validationLogic: JSON.stringify({
            type: 'minimum_length',
            minLength: 80,
            explanation: 'Respuesta abierta. Lo importante es identificar el servicio, qué hace la API y quién es el cliente.',
          }),
          hintsJson: JSON.stringify([
            'Piensa en apps que muestran mapas, pagos, clima o redes sociales.',
            'Stripe, PayPal, Google Maps, Twitter, Spotify, OpenWeather son buenos ejemplos.',
            'Respuesta abierta: lo que importa es entender el rol cliente-API-servidor.',
          ]),
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // LECCIÓN 2 — HTTP: verbos, status codes, headers (10 ejercicios)
    // ═══════════════════════════════════════════════════════════════════════
    {
      lesson: {
        title: 'HTTP: verbos, status codes y headers',
        order: 2,
        type: 'theory',
        contentMd: `
# HTTP: El idioma de las APIs

HTTP (HyperText Transfer Protocol) es el protocolo que usan las APIs REST para comunicarse.
Cada conversación tiene dos partes: **Request** (petición) y **Response** (respuesta).

## Verbos HTTP (Métodos)

| Verbo | Significado | Ejemplo |
|-------|-------------|---------|
| GET | Obtener datos | GET /users → lista de usuarios |
| POST | Crear un recurso | POST /users → crear usuario |
| PUT | Reemplazar un recurso | PUT /users/1 → reemplazar usuario 1 |
| PATCH | Actualizar parcialmente | PATCH /users/1 → actualizar solo el email |
| DELETE | Eliminar un recurso | DELETE /users/1 → eliminar usuario 1 |

## Status Codes (Códigos de estado)

| Rango | Significado | Ejemplos |
|-------|-------------|----------|
| 2xx | Éxito | 200 OK, 201 Created, 204 No Content |
| 3xx | Redirección | 301 Moved Permanently, 304 Not Modified |
| 4xx | Error del cliente | 400 Bad Request, 401 Unauthorized, 404 Not Found |
| 5xx | Error del servidor | 500 Internal Server Error, 503 Service Unavailable |

## Headers

Los headers son **metadatos** de la petición o respuesta:

\`\`\`
Content-Type: application/json    → el cuerpo es JSON
Authorization: Bearer <token>     → token de autenticación
Accept: application/json          → acepto respuestas en JSON
Cache-Control: no-cache           → no usar caché
\`\`\`
        `,
      },
      exercises: [
        {
          order: 1,
          type: 'quiz',
          difficulty: 'easy',
          points: 10,
          prompt: '¿Qué verbo HTTP se usa para OBTENER una lista de productos de una tienda?',
          starterCode: null,
          solution: 'a',
          validationLogic: JSON.stringify({
            type: 'exact_match',
            answer: 'a',
            options: [
              { key: 'a', text: 'GET' },
              { key: 'b', text: 'POST' },
              { key: 'c', text: 'PUT' },
              { key: 'd', text: 'DELETE' },
            ],
            explanation: 'GET se usa para obtener/leer datos. Nunca modifica nada en el servidor.',
          }),
          hintsJson: JSON.stringify([
            'Este verbo solo "lee" datos, nunca los modifica.',
            'En inglés "get" significa "obtener".',
            'La respuesta es GET.',
          ]),
        },
        {
          order: 2,
          type: 'quiz',
          difficulty: 'easy',
          points: 10,
          prompt: 'Recibes el status code 404 en una respuesta. ¿Qué significa?',
          starterCode: null,
          solution: 'c',
          validationLogic: JSON.stringify({
            type: 'exact_match',
            answer: 'c',
            options: [
              { key: 'a', text: 'El servidor tuvo un error interno' },
              { key: 'b', text: 'La petición fue exitosa' },
              { key: 'c', text: 'El recurso solicitado no fue encontrado' },
              { key: 'd', text: 'No tienes permisos para acceder' },
            ],
            explanation: '404 Not Found: el recurso que pediste no existe en el servidor. Por ejemplo, buscar un usuario con ID que no existe.',
          }),
          hintsJson: JSON.stringify([
            'El 4xx indica un error del lado del cliente.',
            '404 es el error más famoso de la web. Lo ves cuando una página no existe.',
            'Not Found = No encontrado. Respuesta C.',
          ]),
        },
        {
          order: 3,
          type: 'quiz',
          difficulty: 'easy',
          points: 10,
          prompt: 'Tu API crea un nuevo usuario exitosamente. ¿Cuál es el status code más apropiado para responder?',
          starterCode: null,
          solution: 'b',
          validationLogic: JSON.stringify({
            type: 'exact_match',
            answer: 'b',
            options: [
              { key: 'a', text: '200 OK' },
              { key: 'b', text: '201 Created' },
              { key: 'c', text: '204 No Content' },
              { key: 'd', text: '200 OK también es válido' },
            ],
            explanation: '201 Created es el código correcto cuando se crea un nuevo recurso. 200 es para lecturas exitosas. 204 es para operaciones sin respuesta de cuerpo.',
          }),
          hintsJson: JSON.stringify([
            'El 2xx siempre indica éxito. Pero ¿cuál es específico para creaciones?',
            '"Created" en inglés significa "Creado".',
            'La respuesta es 201 Created.',
          ]),
        },
        {
          order: 4,
          type: 'observe',
          difficulty: 'easy',
          points: 10,
          prompt: `Analiza esta petición HTTP completa y responde las 3 preguntas:

\`\`\`http
POST /api/users HTTP/1.1
Host: api.ejemplo.com
Content-Type: application/json
Authorization: Bearer eyJhbGci...

{
  "name": "Ana García",
  "email": "ana@ejemplo.com"
}
\`\`\`

1. ¿Qué verbo HTTP se usa y qué acción representa?
2. ¿Para qué sirve el header Content-Type en esta petición?
3. ¿Para qué sirve el header Authorization?`,
          starterCode: null,
          solution: '1. POST → crear un nuevo usuario\n2. Content-Type: application/json → indica que el cuerpo de la petición está en formato JSON\n3. Authorization: Bearer → envía el token JWT para autenticar al usuario que hace la petición',
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['post', 'crear', 'content-type', 'json', 'authorization', 'token'],
            caseSensitive: false,
            explanation: 'POST crea recursos. Content-Type avisa que el cuerpo es JSON. Authorization lleva el token de autenticación.',
          }),
          hintsJson: JSON.stringify([
            'POST = crear. ¿Qué se está creando aquí?',
            'Content-Type le dice al servidor en qué formato está el cuerpo de la petición.',
            'Authorization con "Bearer" siempre lleva un token JWT para identificar al usuario.',
          ]),
        },
        {
          order: 5,
          type: 'fill_blank',
          difficulty: 'easy',
          points: 10,
          prompt: 'Completa la tabla de verbos HTTP con la acción CRUD correcta:\n\nGET → ___\nPOST → ___\nPUT → ___\nDELETE → ___',
          starterCode: 'GET → ___\nPOST → ___\nPUT → ___\nDELETE → ___',
          solution: 'GET → Leer / Obtener\nPOST → Crear\nPUT → Actualizar / Reemplazar\nDELETE → Eliminar',
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['leer', 'crear', 'actualizar', 'eliminar'],
            caseSensitive: false,
            explanation: 'GET=Leer, POST=Crear, PUT=Actualizar, DELETE=Eliminar. CRUD completo.',
          }),
          hintsJson: JSON.stringify([
            'CRUD: Create, Read, Update, Delete. ¿Cuál es cuál?',
            'GET → Read (Leer). POST → Create (Crear).',
            'PUT → Update (Actualizar). DELETE → Delete (Eliminar).',
          ]),
        },
        {
          order: 6,
          type: 'fill_blank',
          difficulty: 'medium',
          points: 15,
          prompt: `Completa los status codes correctos para cada situación:

1. El usuario no existe → ___
2. Creé el recurso exitosamente → ___
3. No enviaste el token de auth → ___
4. Tienes token pero no tienes permisos → ___
5. Error inesperado en el servidor → ___`,
          starterCode: '1. El usuario no existe → ___\n2. Creé el recurso exitosamente → ___\n3. No enviaste el token de auth → ___\n4. Tienes token pero no tienes permisos → ___\n5. Error inesperado en el servidor → ___',
          solution: '1. El usuario no existe → 404\n2. Creé el recurso exitosamente → 201\n3. No enviaste el token de auth → 401\n4. Tienes token pero no tienes permisos → 403\n5. Error inesperado en el servidor → 500',
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['404', '201', '401', '403', '500'],
            caseSensitive: false,
            explanation: '404=Not Found, 201=Created, 401=Unauthorized, 403=Forbidden, 500=Internal Server Error.',
          }),
          hintsJson: JSON.stringify([
            '4xx son errores del cliente, 5xx del servidor, 2xx éxito.',
            '401=no autenticado (sin token), 403=autenticado pero sin permisos.',
            '404=no encontrado, 201=creado, 500=error del servidor.',
          ]),
        },
        {
          order: 7,
          type: 'build',
          difficulty: 'easy',
          points: 15,
          prompt: 'Construye un objeto JavaScript que represente los headers más comunes de una petición autenticada con JSON. Debe incluir: Content-Type, Authorization y Accept.',
          starterCode: 'const headers = {\n  // escribe los headers aquí\n};',
          solution: "const headers = {\n  'Content-Type': 'application/json',\n  'Authorization': 'Bearer <tu-token>',\n  'Accept': 'application/json',\n};",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['Content-Type', 'application/json', 'Authorization', 'Bearer', 'Accept'],
            caseSensitive: false,
            explanation: 'Los headers más comunes: Content-Type para indicar formato JSON, Authorization para el token, Accept para indicar qué formato esperas recibir.',
          }),
          hintsJson: JSON.stringify([
            "Content-Type: 'application/json' le dice al servidor que envías JSON.",
            "Authorization: 'Bearer TOKEN' lleva tu token de autenticación.",
            "Accept: 'application/json' le dice al servidor que esperas JSON de vuelta.",
          ]),
        },
        {
          order: 8,
          type: 'debug',
          difficulty: 'medium',
          points: 15,
          prompt: `Este código tiene un error de verbo HTTP. El desarrollador quiere ELIMINAR el usuario con ID 5, pero usó el verbo equivocado. Corrige el error:

\`\`\`javascript
fetch('https://api.ejemplo.com/users/5', {
  method: 'GET',
  headers: { 'Authorization': 'Bearer token123' }
});
\`\`\``,
          starterCode: "fetch('https://api.ejemplo.com/users/5', {\n  method: 'GET',\n  headers: { 'Authorization': 'Bearer token123' }\n});",
          solution: "fetch('https://api.ejemplo.com/users/5', {\n  method: 'DELETE',\n  headers: { 'Authorization': 'Bearer token123' }\n});",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['DELETE'],
            caseSensitive: false,
            explanation: 'Para eliminar un recurso se usa el verbo DELETE, no GET. GET solo lee datos.',
          }),
          hintsJson: JSON.stringify([
            'GET es para leer, no para eliminar. ¿Qué verbo elimina?',
            'La tabla CRUD: Delete → DELETE.',
            'Cambia "GET" por "DELETE".',
          ]),
        },
        {
          order: 9,
          type: 'debug',
          difficulty: 'medium',
          points: 15,
          prompt: `Tu API devuelve status 401 cuando el usuario hace login con credenciales correctas. El desarrollador dice "el servidor tiene un bug". ¿Realmente es un bug del servidor o del cliente? Explica qué significa 401 y cómo arreglar la petición:

\`\`\`javascript
// Petición que falla con 401
fetch('https://api.ejemplo.com/profile', {
  method: 'GET'
  // ← aquí falta algo importante
});
\`\`\``,
          starterCode: "// Petición que falla con 401\nfetch('https://api.ejemplo.com/profile', {\n  method: 'GET'\n  // ← aquí falta algo importante\n});",
          solution: "// 401 = Unauthorized → falta el token de autenticación\n// No es bug del servidor, es error del cliente (falta el header Authorization)\nfetch('https://api.ejemplo.com/profile', {\n  method: 'GET',\n  headers: {\n    'Authorization': 'Bearer <token-del-usuario>'\n  }\n});",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['Authorization', 'Bearer', '401'],
            caseSensitive: false,
            explanation: '401 Unauthorized significa que la petición no tiene token de autenticación. Es error del cliente, no del servidor. Se arregla agregando el header Authorization.',
          }),
          hintsJson: JSON.stringify([
            '401 = el servidor no sabe quién eres. ¿Qué falta para identificarte?',
            'El header Authorization lleva el token. ¿Lo tiene esta petición?',
            'Agrega: headers: { Authorization: "Bearer TU_TOKEN" }',
          ]),
        },
        {
          order: 10,
          type: 'challenge',
          difficulty: 'medium',
          points: 25,
          prompt: `Reto final de la lección: Tienes una API REST de una biblioteca. Mapea cada operación a su verbo HTTP correcto Y el status code de respuesta exitosa:

1. Ver todos los libros disponibles → verbo: ___ / status éxito: ___
2. Agregar un libro nuevo → verbo: ___ / status éxito: ___
3. Actualizar el precio de un libro → verbo: ___ / status éxito: ___
4. Eliminar un libro → verbo: ___ / status éxito: ___
5. Ver los detalles de un libro específico (ID: 42) → verbo: ___ / status éxito: ___

Bonus: ¿Qué status devuelves si alguien busca el libro con ID 999 que no existe?`,
          starterCode: '1. Ver todos → verbo: ___ / status: ___\n2. Agregar → verbo: ___ / status: ___\n3. Actualizar precio → verbo: ___ / status: ___\n4. Eliminar → verbo: ___ / status: ___\n5. Ver uno → verbo: ___ / status: ___\nBonus: ___',
          solution: '1. Ver todos → verbo: GET / status: 200\n2. Agregar → verbo: POST / status: 201\n3. Actualizar precio → verbo: PATCH / status: 200\n4. Eliminar → verbo: DELETE / status: 204\n5. Ver uno → verbo: GET / status: 200\nBonus: 404 Not Found',
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['GET', 'POST', '201', 'DELETE', '404'],
            caseSensitive: false,
            explanation: 'GET=leer(200), POST=crear(201), PATCH=actualizar parcial(200), DELETE=eliminar(204), 404 para no encontrado.',
          }),
          hintsJson: JSON.stringify([
            'Repasa la tabla CRUD: GET=Read, POST=Create, PATCH=Update parcial, DELETE=Delete.',
            '200=OK, 201=Created, 204=No Content (sin cuerpo de respuesta), 404=Not Found.',
            'PATCH actualiza solo campos específicos (el precio), PUT reemplaza todo el recurso.',
          ]),
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // LECCIÓN 3 — Tu primer GET con fetch() (10 ejercicios)
    // ═══════════════════════════════════════════════════════════════════════
    {
      lesson: {
        title: 'Tu primer GET con fetch()',
        order: 3,
        type: 'exercise_set',
        contentMd: `
# Haciendo tu primera llamada a una API con fetch()

\`fetch()\` es la función nativa de JavaScript para hacer peticiones HTTP.
Devuelve una **Promesa**, lo que significa que el resultado llega después (asíncrono).

## Estructura básica

\`\`\`javascript
// Forma básica con .then()
fetch('https://api.ejemplo.com/users')
  .then(response => response.json())   // convierte la respuesta a JSON
  .then(data => console.log(data))     // usa los datos
  .catch(error => console.error(error)); // maneja errores

// Forma moderna con async/await (recomendada)
async function getUsers() {
  const response = await fetch('https://api.ejemplo.com/users');
  const data = await response.json();
  console.log(data);
}
\`\`\`

## Verificar si la respuesta fue exitosa

\`\`\`javascript
async function getUser(id) {
  const response = await fetch(\`https://api.ejemplo.com/users/\${id}\`);

  if (!response.ok) {
    throw new Error(\`Error: \${response.status}\`);
  }

  const user = await response.json();
  return user;
}
\`\`\`

## API de práctica: JSONPlaceholder

Para practicar, usaremos \`https://jsonplaceholder.typicode.com\`:
- GET /posts → lista de posts
- GET /posts/1 → un post específico
- GET /users → lista de usuarios
        `,
      },
      exercises: [
        {
          order: 1,
          type: 'quiz',
          difficulty: 'easy',
          points: 10,
          prompt: '¿Qué tipo de objeto devuelve fetch() cuando lo llamas?',
          starterCode: null,
          solution: 'b',
          validationLogic: JSON.stringify({
            type: 'exact_match',
            answer: 'b',
            options: [
              { key: 'a', text: 'Devuelve los datos directamente (el JSON)' },
              { key: 'b', text: 'Devuelve una Promesa (Promise)' },
              { key: 'c', text: 'Devuelve un objeto Response vacío' },
              { key: 'd', text: 'Devuelve undefined hasta que la petición termina' },
            ],
            explanation: 'fetch() es asíncrono y devuelve una Promise. Necesitas .then() o await para obtener el resultado cuando esté listo.',
          }),
          hintsJson: JSON.stringify([
            'fetch() es asíncrono: el resultado no llega inmediatamente.',
            'JavaScript usa Promesas para operaciones asíncronas.',
            'La respuesta es B: una Promise.',
          ]),
        },
        {
          order: 2,
          type: 'observe',
          difficulty: 'easy',
          points: 10,
          prompt: `Observa este código y la respuesta que produce. Luego explica qué hace cada línea:

\`\`\`javascript
const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
const post = await response.json();
console.log(post.title);
// Output: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit"
\`\`\`

¿Para qué sirve el primer await? ¿Y el segundo? ¿Qué hace response.json()?`,
          starterCode: null,
          solution: 'Primer await: espera a que el servidor responda y llegue la respuesta HTTP (headers + status).\nSegundo await: espera a que el cuerpo de la respuesta se convierta de texto JSON a objeto JavaScript.\nresponse.json(): lee el cuerpo de la respuesta y lo parsea como JSON.',
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['espera', 'respuesta', 'json', 'objeto', 'cuerpo'],
            caseSensitive: false,
            explanation: 'El primer await espera la respuesta HTTP. El segundo await espera que response.json() parsee el cuerpo como objeto JavaScript.',
          }),
          hintsJson: JSON.stringify([
            'El primer await espera que el servidor responda (puede tardar ms o segundos).',
            'response.json() convierte el texto JSON recibido en un objeto JavaScript.',
            'El segundo await espera que esa conversión termine (también es asíncrona).',
          ]),
        },
        {
          order: 3,
          type: 'fill_blank',
          difficulty: 'easy',
          points: 10,
          prompt: 'Completa el fetch básico para obtener el post con ID 5 de JSONPlaceholder:',
          starterCode: "const response = await ___('https://jsonplaceholder.typicode.com/___/___');\nconst post = await response.___();\nconsole.log(post);",
          solution: "const response = await fetch('https://jsonplaceholder.typicode.com/posts/5');\nconst post = await response.json();\nconsole.log(post);",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['fetch', 'posts/5', 'json()'],
            caseSensitive: false,
            explanation: 'Se usa fetch() para la petición, /posts/5 para el recurso específico, y .json() para parsear la respuesta.',
          }),
          hintsJson: JSON.stringify([
            'La función para hacer peticiones HTTP en JS nativo se llama fetch().',
            'La ruta para el post 5 es /posts/5 (recurso/id).',
            'Para convertir la respuesta a JSON usas response.json()',
          ]),
        },
        {
          order: 4,
          type: 'fill_blank',
          difficulty: 'medium',
          points: 15,
          prompt: 'Completa el manejo correcto de la respuesta verificando si fue exitosa:',
          starterCode: "const response = await fetch('https://jsonplaceholder.typicode.com/users/1');\n\nif (!response.___) {\n  throw new ___(`Error del servidor: ${response.___}`);\n}\n\nconst user = await response.___();\nreturn user;",
          solution: "const response = await fetch('https://jsonplaceholder.typicode.com/users/1');\n\nif (!response.ok) {\n  throw new Error(`Error del servidor: ${response.status}`);\n}\n\nconst user = await response.json();\nreturn user;",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['response.ok', 'Error', 'response.status', 'response.json'],
            caseSensitive: false,
            explanation: 'response.ok es true si el status está entre 200-299. response.status tiene el código numérico. response.json() parsea el cuerpo.',
          }),
          hintsJson: JSON.stringify([
            'response.ok es una propiedad booleana: true si el status es 2xx.',
            'Para lanzar un error usa: throw new Error("mensaje")',
            'response.status tiene el número del status code (ej: 404).',
          ]),
        },
        {
          order: 5,
          type: 'build',
          difficulty: 'easy',
          points: 15,
          prompt: 'Escribe una función llamada `getPosts` que use fetch() con .then() (sin async/await) para obtener todos los posts de JSONPlaceholder y mostrarlos en consola.',
          starterCode: "function getPosts() {\n  // usa fetch con .then()\n}",
          solution: "function getPosts() {\n  fetch('https://jsonplaceholder.typicode.com/posts')\n    .then(response => response.json())\n    .then(posts => console.log(posts))\n    .catch(error => console.error('Error:', error));\n}",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['fetch', '.then', 'response.json', 'catch'],
            caseSensitive: false,
            explanation: 'Con .then() encadenamos: primero parsear el JSON, luego usar los datos. .catch() maneja errores.',
          }),
          hintsJson: JSON.stringify([
            'fetch() devuelve una Promise. Usa .then() para manejarla.',
            'Encadena: fetch(url).then(r => r.json()).then(data => ...)',
            'Siempre agrega .catch() para manejar errores de red.',
          ]),
        },
        {
          order: 6,
          type: 'build',
          difficulty: 'medium',
          points: 15,
          prompt: 'Escribe la misma función `getPosts` pero usando async/await. La función debe retornar el array de posts.',
          starterCode: "async function getPosts() {\n  // usa async/await\n}",
          solution: "async function getPosts() {\n  const response = await fetch('https://jsonplaceholder.typicode.com/posts');\n  if (!response.ok) {\n    throw new Error(`Error: ${response.status}`);\n  }\n  const posts = await response.json();\n  return posts;\n}",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['async', 'await', 'fetch', 'response.json', 'return'],
            caseSensitive: false,
            explanation: 'async/await hace el código más legible. No olvidar verificar response.ok y retornar los datos.',
          }),
          hintsJson: JSON.stringify([
            'Una función async puede usar await. Declara: async function getPosts()',
            'await fetch() espera la respuesta. await response.json() espera el parseo.',
            'No olvides verificar !response.ok para manejar errores HTTP.',
          ]),
        },
        {
          order: 7,
          type: 'build',
          difficulty: 'medium',
          points: 20,
          prompt: 'Escribe una función `getUserById(id)` que obtenga un usuario específico de JSONPlaceholder. Debe manejar el caso donde el usuario no existe (404) mostrando un mensaje claro.',
          starterCode: "async function getUserById(id) {\n  // maneja también el caso 404\n}",
          solution: "async function getUserById(id) {\n  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);\n  \n  if (response.status === 404) {\n    console.log(`Usuario con ID ${id} no encontrado.`);\n    return null;\n  }\n  \n  if (!response.ok) {\n    throw new Error(`Error del servidor: ${response.status}`);\n  }\n  \n  const user = await response.json();\n  return user;\n}",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['fetch', 'id', '404', 'response.json', 'return'],
            caseSensitive: false,
            explanation: 'Usa template literals para la URL dinámica. Verifica 404 específicamente para dar mejor feedback al usuario.',
          }),
          hintsJson: JSON.stringify([
            'URL dinámica: usa template literals `https://.../${id}`',
            'Verifica response.status === 404 antes de response.ok para dar mensaje específico.',
            'Retorna null si no existe, el usuario si existe.',
          ]),
        },
        {
          order: 8,
          type: 'debug',
          difficulty: 'medium',
          points: 15,
          prompt: `Este código tiene un error clásico con async/await. Encuentra y corrige el problema:

\`\`\`javascript
async function getPost() {
  const response = fetch('https://jsonplaceholder.typicode.com/posts/1');
  const post = response.json();
  console.log(post.title); // muestra undefined
}
\`\`\``,
          starterCode: "async function getPost() {\n  const response = fetch('https://jsonplaceholder.typicode.com/posts/1');\n  const post = response.json();\n  console.log(post.title); // muestra undefined\n}",
          solution: "async function getPost() {\n  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');\n  const post = await response.json();\n  console.log(post.title); // ahora funciona\n}",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['await fetch', 'await response.json'],
            caseSensitive: false,
            explanation: 'Faltan los dos await. Sin await, response es una Promise (no un objeto Response), y post es también una Promise (no el objeto JSON).',
          }),
          hintsJson: JSON.stringify([
            'Sin await, fetch() devuelve una Promise, no la respuesta real.',
            'Sin await, response.json() también devuelve una Promise, no el objeto.',
            'Agrega await antes de fetch() y antes de response.json().',
          ]),
        },
        {
          order: 9,
          type: 'debug',
          difficulty: 'medium',
          points: 15,
          prompt: `Este código no maneja errores correctamente. Si el servidor devuelve 404, el código sigue ejecutándose como si todo estuviera bien. Arréglalo:

\`\`\`javascript
async function deletePost(id) {
  const response = await fetch(
    \`https://jsonplaceholder.typicode.com/posts/\${id}\`,
    { method: 'DELETE' }
  );
  const result = await response.json();
  console.log('Post eliminado:', result);
}
\`\`\``,
          starterCode: "async function deletePost(id) {\n  const response = await fetch(\n    `https://jsonplaceholder.typicode.com/posts/${id}`,\n    { method: 'DELETE' }\n  );\n  const result = await response.json();\n  console.log('Post eliminado:', result);\n}",
          solution: "async function deletePost(id) {\n  const response = await fetch(\n    `https://jsonplaceholder.typicode.com/posts/${id}`,\n    { method: 'DELETE' }\n  );\n  \n  if (!response.ok) {\n    throw new Error(`No se pudo eliminar el post ${id}. Status: ${response.status}`);\n  }\n  \n  console.log(`Post ${id} eliminado exitosamente.`);\n}",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['response.ok', 'throw', 'Error', 'status'],
            caseSensitive: false,
            explanation: 'Siempre verificar response.ok antes de procesar la respuesta. Si no es ok, lanzar un Error con el status code.',
          }),
          hintsJson: JSON.stringify([
            'Agrega: if (!response.ok) { throw new Error(...) } antes de procesar.',
            'DELETE exitoso devuelve 200 o 204 (sin cuerpo). Intenta no hacer .json() en un DELETE.',
            'response.ok es false para 4xx y 5xx.',
          ]),
        },
        {
          order: 10,
          type: 'challenge',
          difficulty: 'hard',
          points: 30,
          prompt: `Reto final: Escribe una función \`searchPosts(keyword)\` que:
1. Obtenga TODOS los posts de JSONPlaceholder
2. Filtre solo los posts cuyo TÍTULO contenga la keyword (case insensitive)
3. Retorne un array con los títulos y IDs de los posts encontrados
4. Si no encuentra ninguno, muestre un mensaje claro
5. Maneje errores de red correctamente

Usa: https://jsonplaceholder.typicode.com/posts`,
          starterCode: "async function searchPosts(keyword) {\n  // tu código aquí\n}",
          solution: "async function searchPosts(keyword) {\n  try {\n    const response = await fetch('https://jsonplaceholder.typicode.com/posts');\n    \n    if (!response.ok) {\n      throw new Error(`Error al obtener posts: ${response.status}`);\n    }\n    \n    const posts = await response.json();\n    const keyword_lower = keyword.toLowerCase();\n    \n    const found = posts\n      .filter(post => post.title.toLowerCase().includes(keyword_lower))\n      .map(post => ({ id: post.id, title: post.title }));\n    \n    if (found.length === 0) {\n      console.log(`No se encontraron posts con la keyword: \"${keyword}\"`);\n      return [];\n    }\n    \n    console.log(`Se encontraron ${found.length} posts:`);\n    found.forEach(p => console.log(`  [${p.id}] ${p.title}`));\n    return found;\n  } catch (error) {\n    console.error('Error de red:', error.message);\n    return [];\n  }\n}",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['fetch', 'filter', 'toLowerCase', 'includes', 'catch'],
            caseSensitive: false,
            explanation: 'La función debe: fetch todos los posts, filtrar por keyword case insensitive, retornar resultados formateados, y manejar errores con try/catch.',
          }),
          hintsJson: JSON.stringify([
            'Primero fetch todos los posts, luego filtra con .filter() en JavaScript.',
            'Para case insensitive: keyword.toLowerCase() y post.title.toLowerCase().includes()',
            'Usa try/catch para manejar errores de red.',
          ]),
        },
      ],
    },
  ],
};
