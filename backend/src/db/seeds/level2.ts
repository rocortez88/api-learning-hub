/**
 * NIVEL 2 — REST
 * 3 lecciones · 40 ejercicios
 *
 * Lección 1: Recursos y endpoints          →  8 ejercicios
 * Lección 2: CRUD completo con fetch()     → 16 ejercicios
 * Lección 3: Query params y body           → 16 ejercicios
 */

import type { SeedModule } from './types.js';

export const level2: SeedModule = {
  module: {
    slug: 'rest-api',
    title: 'REST API',
    description: 'Domina el estilo REST: recursos, endpoints, CRUD completo, query params y cuerpo de peticiones.',
    level: 2,
    order: 2,
    unlockedByModuleId: 'fundamentos',
  },

  lessons: [
    // ═══════════════════════════════════════════════════════════════════════
    // LECCIÓN 1 — Recursos y Endpoints (8 ejercicios)
    // ═══════════════════════════════════════════════════════════════════════
    {
      lesson: {
        title: 'Recursos y Endpoints',
        order: 1,
        type: 'theory',
        contentMd: `
# Recursos y Endpoints en REST

REST (Representational State Transfer) organiza la API en torno a **recursos**.
Un recurso es cualquier entidad de tu sistema: usuario, producto, orden, etc.

## ¿Qué es un Endpoint?

Un endpoint es la URL específica para acceder a un recurso:

\`\`\`
https://api.tienda.com/products        → colección de productos
https://api.tienda.com/products/42     → producto específico (ID 42)
https://api.tienda.com/users/5/orders  → órdenes del usuario 5
\`\`\`

## Reglas de diseño REST

| Regla | ✅ Correcto | ❌ Incorrecto |
|-------|-----------|--------------|
| Sustantivos, no verbos | /users | /getUsers, /createUser |
| Plural para colecciones | /products | /product |
| Jerarquía con / | /users/5/orders | /getUserOrders?id=5 |
| Minúsculas con guion | /blog-posts | /BlogPosts, /blog_posts |
| El verbo va en el método HTTP | DELETE /users/5 | POST /deleteUser/5 |

## Estructura estándar de una API REST

\`\`\`
GET    /users          → lista todos los usuarios
POST   /users          → crea un usuario
GET    /users/:id      → obtiene un usuario específico
PUT    /users/:id      → reemplaza un usuario
PATCH  /users/:id      → actualiza parcialmente un usuario
DELETE /users/:id      → elimina un usuario
\`\`\`
        `,
      },
      exercises: [
        {
          order: 1,
          type: 'quiz',
          difficulty: 'easy',
          points: 10,
          prompt: '¿Cuál de estos endpoints sigue correctamente las convenciones REST?',
          starterCode: null,
          solution: 'c',
          validationLogic: JSON.stringify({
            type: 'exact_match',
            answer: 'c',
            options: [
              { key: 'a', text: 'POST /createProduct' },
              { key: 'b', text: 'GET /getUser/5' },
              { key: 'c', text: 'DELETE /products/42' },
              { key: 'd', text: 'POST /deleteOrder/7' },
            ],
            explanation: 'REST usa sustantivos (products) no verbos (deleteProduct). El verbo va en el método HTTP. DELETE /products/42 es correcto.',
          }),
          hintsJson: JSON.stringify([
            'REST usa sustantivos en las URLs. Los verbos van en el método HTTP (GET, POST, DELETE...).',
            'Eliminar = método DELETE + URL con el recurso y su ID.',
            'La respuesta C: DELETE /products/42 es REST correcto.',
          ]),
        },
        {
          order: 2,
          type: 'quiz',
          difficulty: 'easy',
          points: 10,
          prompt: '¿Qué endpoint usarías para obtener todos los comentarios del post con ID 7?',
          starterCode: null,
          solution: 'b',
          validationLogic: JSON.stringify({
            type: 'exact_match',
            answer: 'b',
            options: [
              { key: 'a', text: 'GET /getCommentsByPost?id=7' },
              { key: 'b', text: 'GET /posts/7/comments' },
              { key: 'c', text: 'GET /comments/post/7' },
              { key: 'd', text: 'POST /posts/7/comments/get' },
            ],
            explanation: 'En REST, los recursos anidados se expresan con jerarquía: /posts/7/comments indica "comentarios del post 7". Limpio y semántico.',
          }),
          hintsJson: JSON.stringify([
            'Los recursos relacionados se expresan con jerarquía: /padre/:id/hijo',
            '/posts/7/comments = "comentarios que pertenecen al post 7"',
            'La respuesta es B.',
          ]),
        },
        {
          order: 3,
          type: 'observe',
          difficulty: 'easy',
          points: 10,
          prompt: `Analiza esta API de una librería y responde:

\`\`\`
GET    /books              → [{ id:1, title:"El Quijote" }, ...]
GET    /books/1            → { id:1, title:"El Quijote", author:"Cervantes" }
POST   /books              → crea un libro
PUT    /books/1            → reemplaza el libro 1
DELETE /books/1            → elimina el libro 1
GET    /authors/3/books    → libros del autor 3
\`\`\`

Preguntas:
1. ¿Qué método y URL usarías para actualizar SOLO el precio del libro 5?
2. ¿Qué devuelve GET /books sin ID vs GET /books/1?
3. ¿Por qué PUT reemplaza todo el recurso y no solo un campo?`,
          starterCode: null,
          solution: '1. PATCH /books/5 (actualización parcial, solo el precio)\n2. GET /books devuelve la colección completa (array). GET /books/1 devuelve un solo libro (objeto).\n3. PUT reemplaza porque representa el estado completo del recurso. Si solo mandas el precio, los otros campos se perderían.',
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['PATCH', '/books/5', 'colección', 'array', 'reemplaza'],
            caseSensitive: false,
            explanation: 'PATCH actualiza parcialmente. GET sin ID devuelve colección. PUT reemplaza el recurso completo.',
          }),
          hintsJson: JSON.stringify([
            'Actualización PARCIAL = PATCH. Reemplazo TOTAL = PUT.',
            '/books (sin ID) = colección (array). /books/1 (con ID) = un recurso (objeto).',
            'PUT: si envías solo el precio, el servidor reemplaza TODOS los campos con lo que mandaste.',
          ]),
        },
        {
          order: 4,
          type: 'fill_blank',
          difficulty: 'easy',
          points: 10,
          prompt: 'Completa los endpoints REST para una API de una tienda de ropa:',
          starterCode: '// Obtener todas las categorías\n___ /___\n\n// Obtener la categoría con ID 3\n___ /___/___\n\n// Crear una prenda nueva en la categoría 3\n___ /categories/___/___\n\n// Eliminar la prenda con ID 15\n___ /___/___',
          solution: '// Obtener todas las categorías\nGET /categories\n\n// Obtener la categoría con ID 3\nGET /categories/3\n\n// Crear una prenda nueva en la categoría 3\nPOST /categories/3/items\n\n// Eliminar la prenda con ID 15\nDELETE /items/15',
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['GET /categories', 'GET /categories/3', 'POST', 'DELETE /items/15'],
            caseSensitive: false,
            explanation: 'Cada operación CRUD tiene su verbo HTTP y URL con sustantivos en plural.',
          }),
          hintsJson: JSON.stringify([
            'Colección = plural sin ID. Ítem específico = plural con /ID.',
            'Crear = POST al endpoint padre. Eliminar = DELETE con /ID.',
            'Recursos anidados: /categories/3/items = items de la categoría 3.',
          ]),
        },
        {
          order: 5,
          type: 'debug',
          difficulty: 'medium',
          points: 15,
          prompt: `Un desarrollador diseñó esta API. Identifica todos los errores de diseño REST (hay 4) y explica cómo corregirlos:

\`\`\`
GET    /getProducts
POST   /createNewProduct
GET    /product/5
DELETE /products/DeleteItem/8
\`\`\``,
          starterCode: '// Endpoint actual → Problema → Corrección\n// GET /getProducts → ??? → ???\n// POST /createNewProduct → ??? → ???\n// GET /product/5 → ??? → ???\n// DELETE /products/DeleteItem/8 → ??? → ???',
          solution: '// GET /getProducts → verbo en la URL, no REST → GET /products\n// POST /createNewProduct → verbo en la URL → POST /products\n// GET /product/5 → singular en vez de plural → GET /products/5\n// DELETE /products/DeleteItem/8 → verbo en la URL + ruta confusa → DELETE /products/8',
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['GET /products', 'POST /products', 'GET /products/5', 'DELETE /products/8'],
            caseSensitive: false,
            explanation: 'Los 4 errores: verbos en URLs (getProducts, createNewProduct, DeleteItem) y singular en vez de plural (product).',
          }),
          hintsJson: JSON.stringify([
            'Error 1 y 2: REST no usa verbos en la URL. "get", "create", "Delete" no deberían estar ahí.',
            'Error 3: las colecciones van en plural. /product → /products.',
            'Error 4: /DeleteItem es un verbo. El verbo ya está en el método HTTP DELETE.',
          ]),
        },
        {
          order: 6,
          type: 'build',
          difficulty: 'medium',
          points: 20,
          prompt: 'Diseña la estructura completa de endpoints REST para una API de un blog con: posts, comentarios y autores. Incluye al menos 12 endpoints con su verbo HTTP.',
          starterCode: '// API Blog — Endpoints REST\n// Formato: VERBO /ruta → descripción\n\n// Posts\n\n// Comentarios (anidados en posts)\n\n// Autores',
          solution: '// API Blog — Endpoints REST\n// Posts\nGET    /posts              → lista todos los posts\nPOST   /posts              → crea un post\nGET    /posts/:id          → obtiene un post\nPUT    /posts/:id          → reemplaza un post\nPATCH  /posts/:id          → actualiza campos del post\nDELETE /posts/:id          → elimina un post\n\n// Comentarios (anidados en posts)\nGET    /posts/:id/comments → comentarios de un post\nPOST   /posts/:id/comments → agrega un comentario\nDELETE /posts/:id/comments/:commentId → elimina un comentario\n\n// Autores\nGET    /authors            → lista autores\nGET    /authors/:id        → un autor\nGET    /authors/:id/posts  → posts de un autor',
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['GET /posts', 'POST /posts', 'DELETE', '/comments', '/authors'],
            caseSensitive: false,
            explanation: 'Un buen diseño REST incluye CRUD completo para el recurso principal y rutas anidadas para recursos relacionados.',
          }),
          hintsJson: JSON.stringify([
            'Para cada recurso: GET (listar), POST (crear), GET/:id, PUT/:id, PATCH/:id, DELETE/:id.',
            'Los comentarios son subrecurso de posts: /posts/:id/comments',
            'Los posts de un autor: /authors/:id/posts (recurso anidado).',
          ]),
        },
        {
          order: 7,
          type: 'quiz',
          difficulty: 'medium',
          points: 10,
          prompt: '¿Cuál es la diferencia clave entre PUT y PATCH?',
          starterCode: null,
          solution: 'a',
          validationLogic: JSON.stringify({
            type: 'exact_match',
            answer: 'a',
            options: [
              { key: 'a', text: 'PUT reemplaza el recurso completo; PATCH actualiza solo los campos enviados' },
              { key: 'b', text: 'PUT es más rápido que PATCH' },
              { key: 'c', text: 'PATCH crea si no existe, PUT solo actualiza' },
              { key: 'd', text: 'Son exactamente iguales, es solo convención de nombre' },
            ],
            explanation: 'PUT: envías el recurso completo y lo reemplaza. PATCH: envías solo los campos que quieres cambiar. Si usas PUT y olvidas un campo, ese campo se borra.',
          }),
          hintsJson: JSON.stringify([
            'Imagina que un usuario tiene: name, email, age. Si usas PUT con solo {email}, ¿qué pasa con name y age?',
            'PUT reemplaza TODO. PATCH solo modifica lo que mandas.',
            'La respuesta es A.',
          ]),
        },
        {
          order: 8,
          type: 'challenge',
          difficulty: 'hard',
          points: 30,
          prompt: `Reto de diseño: Una empresa de e-commerce quiere una API REST. Diseña los endpoints para:
- Productos (con categorías como subrecurso)
- Órdenes de compra (con items como subrecurso)
- Usuarios (con su historial de órdenes)

Reglas:
1. Mínimo 15 endpoints
2. Todos deben seguir convenciones REST
3. Explica brevemente qué hace cada uno`,
          starterCode: '// API E-commerce — Diseño REST\n// Diseña los endpoints aquí',
          solution: '// Productos\nGET    /products                    → lista productos (paginado)\nPOST   /products                    → crea producto (admin)\nGET    /products/:id                → detalle de producto\nPATCH  /products/:id                → actualiza producto\nDELETE /products/:id                → elimina producto\nGET    /products/:id/categories     → categorías del producto\nPOST   /products/:id/categories     → agrega categoría al producto\n\n// Órdenes\nGET    /orders                      → todas las órdenes\nPOST   /orders                      → crea orden\nGET    /orders/:id                  → detalle de orden\nPATCH  /orders/:id                  → actualiza estado\nGET    /orders/:id/items            → items de la orden\nPOST   /orders/:id/items            → agrega item\nDELETE /orders/:id/items/:itemId    → elimina item\n\n// Usuarios\nGET    /users/:id/orders            → historial de órdenes del usuario',
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['GET /products', 'POST /orders', '/items', '/users', 'PATCH'],
            caseSensitive: false,
            explanation: 'Diseño REST completo con recursos principales y anidados. Sustantivos en plural, verbos HTTP correctos, jerarquía clara.',
          }),
          hintsJson: JSON.stringify([
            'Empieza con el CRUD básico de cada recurso: GET, POST, GET/:id, PATCH/:id, DELETE/:id',
            'Los subrecursos van anidados: /orders/:id/items, /users/:id/orders',
            'Mínimo 15 endpoints: 5 por recurso principal × 3 recursos = 15.',
          ]),
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // LECCIÓN 2 — CRUD completo con fetch() (16 ejercicios)
    // ═══════════════════════════════════════════════════════════════════════
    {
      lesson: {
        title: 'CRUD completo con fetch()',
        order: 2,
        type: 'exercise_set',
        contentMd: `
# CRUD completo: GET, POST, PUT, PATCH, DELETE

Con fetch() puedes ejecutar cualquier operación CRUD pasando opciones en el segundo argumento.

## GET — Leer
\`\`\`javascript
const response = await fetch('/api/products');
const products = await response.json();
\`\`\`

## POST — Crear
\`\`\`javascript
const response = await fetch('/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Laptop', price: 999 })
});
const newProduct = await response.json();
\`\`\`

## PUT — Reemplazar
\`\`\`javascript
const response = await fetch('/api/products/5', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Laptop Pro', price: 1299, stock: 10 })
});
\`\`\`

## PATCH — Actualizar parcialmente
\`\`\`javascript
const response = await fetch('/api/products/5', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ price: 899 })  // solo cambia el precio
});
\`\`\`

## DELETE — Eliminar
\`\`\`javascript
const response = await fetch('/api/products/5', {
  method: 'DELETE',
  headers: { 'Authorization': 'Bearer token' }
});
// DELETE generalmente devuelve 204 (sin cuerpo)
\`\`\`
        `,
      },
      exercises: [
        {
          order: 1,
          type: 'quiz',
          difficulty: 'easy',
          points: 10,
          prompt: 'Al hacer un POST para crear un recurso, ¿dónde van los datos del nuevo recurso?',
          starterCode: null,
          solution: 'b',
          validationLogic: JSON.stringify({
            type: 'exact_match',
            answer: 'b',
            options: [
              { key: 'a', text: 'En la URL como query params: POST /users?name=Ana' },
              { key: 'b', text: 'En el cuerpo (body) de la petición como JSON' },
              { key: 'c', text: 'En los headers de la petición' },
              { key: 'd', text: 'En la URL como parte del path: POST /users/Ana' },
            ],
            explanation: 'En POST, PUT y PATCH, los datos van en el body (cuerpo) de la petición, serializado como JSON con JSON.stringify().',
          }),
          hintsJson: JSON.stringify([
            'Los datos sensibles o grandes no van en la URL.',
            'fetch() tiene una opción llamada "body" para enviar datos.',
            'La respuesta es B: en el body como JSON.',
          ]),
        },
        {
          order: 2,
          type: 'quiz',
          difficulty: 'easy',
          points: 10,
          prompt: '¿Por qué es necesario usar JSON.stringify() al enviar datos con fetch()?',
          starterCode: null,
          solution: 'c',
          validationLogic: JSON.stringify({
            type: 'exact_match',
            answer: 'c',
            options: [
              { key: 'a', text: 'Para encriptar los datos antes de enviarlos' },
              { key: 'b', text: 'Para comprimir los datos y que viajen más rápido' },
              { key: 'c', text: 'Porque el body debe ser texto y JSON.stringify() convierte un objeto JS a texto JSON' },
              { key: 'd', text: 'Es opcional, puedes pasar el objeto directamente' },
            ],
            explanation: 'El body de HTTP es texto (string). JSON.stringify() convierte { name: "Ana" } en la cadena \'{"name":"Ana"}\' para que viaje por la red.',
          }),
          hintsJson: JSON.stringify([
            'HTTP solo puede transportar texto, no objetos de JavaScript.',
            'JSON.stringify convierte: { name: "Ana" } → \'{"name":"Ana"}\'',
            'La respuesta es C.',
          ]),
        },
        {
          order: 3,
          type: 'observe',
          difficulty: 'easy',
          points: 10,
          prompt: `Analiza este POST y explica qué hace cada parte:

\`\`\`javascript
const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Mi primer post',
    body: 'Contenido del post',
    userId: 1
  })
});

const newPost = await response.json();
console.log(newPost.id); // 101
\`\`\`

¿Para qué sirve method: 'POST'? ¿Por qué el header Content-Type es application/json? ¿Qué hace JSON.stringify()? ¿Por qué el ID es 101?`,
          starterCode: null,
          solution: "method: 'POST' indica que estamos creando un recurso. Content-Type: application/json avisa al servidor que el body es JSON. JSON.stringify() convierte el objeto JS a texto JSON para enviarlo. El ID es 101 porque JSONPlaceholder tiene 100 posts; el nuevo sería el 101.",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['POST', 'crear', 'Content-Type', 'JSON.stringify', 'texto'],
            caseSensitive: false,
            explanation: 'method=POST para crear. Content-Type avisa formato del body. JSON.stringify convierte objeto a texto. ID 101 porque es el siguiente después de los 100 existentes.',
          }),
          hintsJson: JSON.stringify([
            'method: "POST" le dice al servidor que vas a crear algo.',
            'Content-Type es como el "idioma" del body: le dices al servidor cómo interpretar los datos.',
            'JSON.stringify convierte { key: value } a \'{"key":"value"}\' (texto transmisible por HTTP).',
          ]),
        },
        {
          order: 4,
          type: 'fill_blank',
          difficulty: 'easy',
          points: 10,
          prompt: 'Completa el fetch para crear un nuevo usuario:',
          starterCode: "const response = await fetch('https://api.ejemplo.com/users', {\n  ___: 'POST',\n  ___: {\n    '___': 'application/json'\n  },\n  ___: ___.stringify({\n    name: 'Carlos',\n    email: 'carlos@email.com'\n  })\n});\nconst user = await response.___();",
          solution: "const response = await fetch('https://api.ejemplo.com/users', {\n  method: 'POST',\n  headers: {\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({\n    name: 'Carlos',\n    email: 'carlos@email.com'\n  })\n});\nconst user = await response.json();",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['method', 'POST', 'headers', 'Content-Type', 'body', 'JSON.stringify', 'response.json'],
            caseSensitive: false,
            explanation: 'Las propiedades del segundo argumento de fetch: method, headers, body. Body necesita JSON.stringify().',
          }),
          hintsJson: JSON.stringify([
            'El segundo argumento de fetch es un objeto con: method, headers, body.',
            'method: "POST" — headers: { "Content-Type": ... } — body: JSON.stringify(...)',
            'Al final: response.json() para parsear la respuesta.',
          ]),
        },
        {
          order: 5,
          type: 'build',
          difficulty: 'easy',
          points: 15,
          prompt: 'Escribe una función `createPost(title, body, userId)` que cree un post en JSONPlaceholder usando POST.',
          starterCode: "async function createPost(title, body, userId) {\n  // POST a https://jsonplaceholder.typicode.com/posts\n}",
          solution: "async function createPost(title, body, userId) {\n  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ title, body, userId })\n  });\n\n  if (!response.ok) {\n    throw new Error(`Error al crear post: ${response.status}`);\n  }\n\n  const newPost = await response.json();\n  console.log('Post creado con ID:', newPost.id);\n  return newPost;\n}",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['method', 'POST', 'JSON.stringify', 'response.ok', 'response.json'],
            caseSensitive: false,
            explanation: 'POST con headers Content-Type y body con los datos. Siempre verificar response.ok.',
          }),
          hintsJson: JSON.stringify([
            "method: 'POST', headers: { 'Content-Type': 'application/json' }",
            "body: JSON.stringify({ title, body, userId }) — shorthand de objetos JS.",
            'Verifica response.ok antes de procesar la respuesta.',
          ]),
        },
        {
          order: 6,
          type: 'build',
          difficulty: 'medium',
          points: 15,
          prompt: 'Escribe `updatePost(id, title, body)` con PATCH para actualizar SOLO el título y cuerpo de un post existente.',
          starterCode: "async function updatePost(id, title, body) {\n  // PATCH a https://jsonplaceholder.typicode.com/posts/:id\n}",
          solution: "async function updatePost(id, title, body) {\n  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {\n    method: 'PATCH',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ title, body })\n  });\n\n  if (!response.ok) {\n    throw new Error(`Error al actualizar post ${id}: ${response.status}`);\n  }\n\n  const updatedPost = await response.json();\n  return updatedPost;\n}",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['PATCH', 'id', 'JSON.stringify', 'response.ok'],
            caseSensitive: false,
            explanation: 'PATCH con template literal para la URL dinámica. Solo se envían los campos a actualizar (title, body).',
          }),
          hintsJson: JSON.stringify([
            "Usa template literals para la URL: `https://.../posts/${id}`",
            "method: 'PATCH' — solo envías los campos que cambias.",
            'PATCH devuelve el recurso actualizado.',
          ]),
        },
        {
          order: 7,
          type: 'build',
          difficulty: 'medium',
          points: 15,
          prompt: 'Escribe `replacePost(id, postData)` con PUT para reemplazar COMPLETAMENTE un post.',
          starterCode: "async function replacePost(id, postData) {\n  // PUT a https://jsonplaceholder.typicode.com/posts/:id\n  // postData debe tener: { title, body, userId }\n}",
          solution: "async function replacePost(id, postData) {\n  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {\n    method: 'PUT',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify(postData)\n  });\n\n  if (!response.ok) {\n    throw new Error(`Error al reemplazar post ${id}: ${response.status}`);\n  }\n\n  const replaced = await response.json();\n  return replaced;\n}",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['PUT', 'id', 'JSON.stringify', 'postData'],
            caseSensitive: false,
            explanation: 'PUT reemplaza el recurso completo. Se envía el objeto entero, no solo campos individuales.',
          }),
          hintsJson: JSON.stringify([
            "method: 'PUT' — reemplaza el recurso completo.",
            'Envía el objeto postData completo con JSON.stringify(postData).',
            'PUT devuelve el recurso ya reemplazado.',
          ]),
        },
        {
          order: 8,
          type: 'build',
          difficulty: 'easy',
          points: 15,
          prompt: 'Escribe `deletePost(id)` con DELETE para eliminar un post. Maneja el caso de 204 (sin cuerpo de respuesta).',
          starterCode: "async function deletePost(id) {\n  // DELETE a https://jsonplaceholder.typicode.com/posts/:id\n  // OJO: DELETE puede devolver 204 sin cuerpo\n}",
          solution: "async function deletePost(id) {\n  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {\n    method: 'DELETE'\n  });\n\n  if (!response.ok) {\n    throw new Error(`Error al eliminar post ${id}: ${response.status}`);\n  }\n\n  // 204 No Content = sin cuerpo, no hacer response.json()\n  if (response.status === 204) {\n    console.log(`Post ${id} eliminado exitosamente.`);\n    return true;\n  }\n\n  // Algunas APIs devuelven el objeto eliminado\n  return await response.json();\n}",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['DELETE', 'id', '204', 'response.ok'],
            caseSensitive: false,
            explanation: 'DELETE no suele llevar body. El status 204 indica éxito sin contenido de respuesta; no se llama response.json() en ese caso.',
          }),
          hintsJson: JSON.stringify([
            "method: 'DELETE'. No se necesita body ni Content-Type.",
            '204 No Content = éxito sin cuerpo. No llames response.json() si el status es 204.',
            'Algunas APIs devuelven 200 con el objeto eliminado; otras devuelven 204 sin nada.',
          ]),
        },
        {
          order: 9,
          type: 'debug',
          difficulty: 'medium',
          points: 15,
          prompt: `Encuentra y corrige los 3 errores en este POST:

\`\`\`javascript
async function createUser(userData) {
  const response = await fetch('https://api.ejemplo.com/users', {
    method: 'post',
    body: userData,
    headers: {
      'Content-Type': 'text/plain'
    }
  });
  const user = response.json();
  return user;
}
\`\`\``,
          starterCode: "async function createUser(userData) {\n  const response = await fetch('https://api.ejemplo.com/users', {\n    method: 'post',\n    body: userData,\n    headers: {\n      'Content-Type': 'text/plain'\n    }\n  });\n  const user = response.json();\n  return user;\n}",
          solution: "async function createUser(userData) {\n  const response = await fetch('https://api.ejemplo.com/users', {\n    method: 'POST',                           // Error 1: debe ser mayúsculas\n    body: JSON.stringify(userData),           // Error 2: falta JSON.stringify()\n    headers: {\n      'Content-Type': 'application/json'     // Error 3: debe ser application/json\n    }\n  });\n  const user = await response.json();        // Error bonus: falta await\n  return user;\n}",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['POST', 'JSON.stringify', 'application/json', 'await response.json'],
            caseSensitive: false,
            explanation: "Los 3 errores: 1) method debe ser 'POST' (mayúsculas por convención). 2) body necesita JSON.stringify(). 3) Content-Type debe ser application/json. Bonus: falta await en response.json().",
          }),
          hintsJson: JSON.stringify([
            "Error 1: los métodos HTTP van en MAYÚSCULAS por convención: 'POST' no 'post'.",
            "Error 2: body espera un string. userData es un objeto. Usa JSON.stringify(userData).",
            "Error 3: si envías JSON, el Content-Type es 'application/json', no 'text/plain'.",
          ]),
        },
        {
          order: 10,
          type: 'debug',
          difficulty: 'medium',
          points: 15,
          prompt: `Este código intenta actualizar el email de un usuario pero reemplaza TODO el objeto accidentalmente. Arréglalo para que solo actualice el email:

\`\`\`javascript
async function updateEmail(userId, newEmail) {
  const response = await fetch(\`https://api.ejemplo.com/users/\${userId}\`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: newEmail })
  });
  return await response.json();
}
\`\`\``,
          starterCode: "async function updateEmail(userId, newEmail) {\n  const response = await fetch(`https://api.ejemplo.com/users/${userId}`, {\n    method: 'PUT',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ email: newEmail })\n  });\n  return await response.json();\n}",
          solution: "async function updateEmail(userId, newEmail) {\n  const response = await fetch(`https://api.ejemplo.com/users/${userId}`, {\n    method: 'PATCH',  // PATCH para actualización parcial, no PUT\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ email: newEmail })\n  });\n  if (!response.ok) {\n    throw new Error(`Error: ${response.status}`);\n  }\n  return await response.json();\n}",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['PATCH'],
            caseSensitive: false,
            explanation: 'Para actualizar solo el email usa PATCH (actualización parcial). PUT reemplaza TODO el recurso con solo { email }, borrando name, age, etc.',
          }),
          hintsJson: JSON.stringify([
            'PUT reemplaza el recurso completo. Si mandas solo { email }, los demás campos se borran.',
            'Para actualización parcial (un solo campo) usa PATCH.',
            "Cambia method: 'PUT' por method: 'PATCH'.",
          ]),
        },
        {
          order: 11,
          type: 'build',
          difficulty: 'hard',
          points: 20,
          prompt: 'Crea una función `apiRequest(url, method, data)` reutilizable que maneje GET, POST, PUT, PATCH y DELETE automáticamente.',
          starterCode: "async function apiRequest(url, method = 'GET', data = null) {\n  // debe manejar todos los métodos\n  // GET y DELETE no llevan body\n  // POST, PUT, PATCH llevan body JSON\n}",
          solution: "async function apiRequest(url, method = 'GET', data = null) {\n  const hasBody = ['POST', 'PUT', 'PATCH'].includes(method);\n\n  const options = {\n    method,\n    headers: {\n      ...(hasBody && { 'Content-Type': 'application/json' }),\n    },\n    ...(hasBody && data && { body: JSON.stringify(data) }),\n  };\n\n  const response = await fetch(url, options);\n\n  if (!response.ok) {\n    throw new Error(`${method} ${url} falló con status ${response.status}`);\n  }\n\n  // 204 No Content → sin cuerpo\n  if (response.status === 204) return null;\n\n  return await response.json();\n}",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['POST', 'PUT', 'PATCH', 'JSON.stringify', '204', 'response.ok'],
            caseSensitive: false,
            explanation: 'Una función genérica que detecta si el método necesita body (POST/PUT/PATCH) y maneja 204 sin intentar parsear JSON.',
          }),
          hintsJson: JSON.stringify([
            "Los métodos con body son: ['POST', 'PUT', 'PATCH']. Usa .includes() para detectarlos.",
            'GET y DELETE no llevan body ni Content-Type.',
            '204 No Content no tiene body, no llames .json() en ese caso.',
          ]),
        },
        {
          order: 12,
          type: 'fill_blank',
          difficulty: 'medium',
          points: 15,
          prompt: 'Completa este CRUD completo para una API de tareas (todos):',
          starterCode: "const BASE = 'https://jsonplaceholder.typicode.com';\n\n// Obtener todas las tareas\nconst getTodos = async () => {\n  const res = await ___(`${BASE}/todos`);\n  return res.___();\n};\n\n// Crear tarea\nconst createTodo = async (title) => {\n  const res = await fetch(`${BASE}/todos`, {\n    ___: '___',\n    headers: { 'Content-Type': '___' },\n    ___: ___.stringify({ title, completed: false, userId: 1 })\n  });\n  return res.json();\n};\n\n// Marcar como completada\nconst completeTodo = async (id) => {\n  const res = await fetch(`${BASE}/todos/${id}`, {\n    ___: '___',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ ___: true })\n  });\n  return res.json();\n};",
          solution: "const BASE = 'https://jsonplaceholder.typicode.com';\n\n// Obtener todas las tareas\nconst getTodos = async () => {\n  const res = await fetch(`${BASE}/todos`);\n  return res.json();\n};\n\n// Crear tarea\nconst createTodo = async (title) => {\n  const res = await fetch(`${BASE}/todos`, {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ title, completed: false, userId: 1 })\n  });\n  return res.json();\n};\n\n// Marcar como completada\nconst completeTodo = async (id) => {\n  const res = await fetch(`${BASE}/todos/${id}`, {\n    method: 'PATCH',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ completed: true })\n  });\n  return res.json();\n};",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['fetch', 'res.json', 'POST', 'application/json', 'JSON.stringify', 'PATCH', 'completed'],
            caseSensitive: false,
            explanation: 'GET no necesita options. POST crea con body completo. PATCH actualiza solo completed: true.',
          }),
          hintsJson: JSON.stringify([
            'GET solo necesita fetch(url) — sin opciones adicionales.',
            "POST: method: 'POST', headers con Content-Type, body con JSON.stringify.",
            "PATCH para cambiar solo completed: method: 'PATCH', body: JSON.stringify({ completed: true }).",
          ]),
        },
        {
          order: 13,
          type: 'debug',
          difficulty: 'hard',
          points: 20,
          prompt: `Este código tiene múltiples bugs. El desarrollador intenta hacer un sistema CRUD completo. Encuentra y corrige todos los errores:

\`\`\`javascript
const api = {
  get: (url) => fetch(url).then(r => r),

  post: (url, data) => fetch(url, {
    method: 'POST',
    body: data
  }).then(r => r.json()),

  delete: (url) => fetch(url, {
    method: 'DELETE',
    body: JSON.stringify({})
  })
};
\`\`\``,
          starterCode: "const api = {\n  get: (url) => fetch(url).then(r => r),\n\n  post: (url, data) => fetch(url, {\n    method: 'POST',\n    body: data\n  }).then(r => r.json()),\n\n  delete: (url) => fetch(url, {\n    method: 'DELETE',\n    body: JSON.stringify({})\n  })\n};",
          solution: "const api = {\n  // Bug 1: falta .then(r => r.json()) para parsear la respuesta\n  get: (url) => fetch(url).then(r => r.json()),\n\n  // Bug 2: falta el header Content-Type y JSON.stringify en body\n  post: (url, data) => fetch(url, {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify(data)\n  }).then(r => r.json()),\n\n  // Bug 3: DELETE no debe llevar body\n  delete: (url) => fetch(url, {\n    method: 'DELETE'\n  }).then(r => r.status === 204 ? null : r.json())\n};",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['r.json()', 'Content-Type', 'JSON.stringify', 'DELETE'],
            caseSensitive: false,
            explanation: "Bugs: 1) get no parsea el JSON (falta .json()). 2) post no tiene Content-Type ni JSON.stringify. 3) delete no debe llevar body: JSON.stringify({}).",
          }),
          hintsJson: JSON.stringify([
            'Bug 1: r => r devuelve el objeto Response, no los datos. Necesitas r => r.json().',
            "Bug 2: POST necesita headers: { 'Content-Type': 'application/json' } y body: JSON.stringify(data).",
            'Bug 3: DELETE no lleva body. body: JSON.stringify({}) es incorrecto.',
          ]),
        },
        {
          order: 14,
          type: 'build',
          difficulty: 'hard',
          points: 25,
          prompt: `Construye un mini gestor de tareas que use la API JSONPlaceholder. Debe tener:
- \`getTodo(id)\`: obtiene una tarea
- \`toggleComplete(id, currentStatus)\`: invierte el estado completed
- \`addTodo(title)\`: crea una tarea nueva
- \`removeTodo(id)\`: elimina una tarea
Usa async/await y maneja errores en todas las funciones.`,
          starterCode: "const BASE = 'https://jsonplaceholder.typicode.com';\n\n// Implementa las 4 funciones",
          solution: "const BASE = 'https://jsonplaceholder.typicode.com';\n\nasync function getTodo(id) {\n  const res = await fetch(`${BASE}/todos/${id}`);\n  if (!res.ok) throw new Error(`Todo ${id} no encontrado`);\n  return res.json();\n}\n\nasync function toggleComplete(id, currentStatus) {\n  const res = await fetch(`${BASE}/todos/${id}`, {\n    method: 'PATCH',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ completed: !currentStatus })\n  });\n  if (!res.ok) throw new Error(`Error al actualizar todo ${id}`);\n  return res.json();\n}\n\nasync function addTodo(title) {\n  const res = await fetch(`${BASE}/todos`, {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ title, completed: false, userId: 1 })\n  });\n  if (!res.ok) throw new Error('Error al crear todo');\n  const todo = await res.json();\n  console.log('Tarea creada con ID:', todo.id);\n  return todo;\n}\n\nasync function removeTodo(id) {\n  const res = await fetch(`${BASE}/todos/${id}`, { method: 'DELETE' });\n  if (!res.ok) throw new Error(`Error al eliminar todo ${id}`);\n  console.log(`Tarea ${id} eliminada`);\n  return true;\n}",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['getTodo', 'PATCH', '!currentStatus', 'POST', 'DELETE', 'response.ok'],
            caseSensitive: false,
            explanation: 'CRUD completo: GET para obtener, PATCH para toggle (invierte con !currentStatus), POST para crear, DELETE para eliminar.',
          }),
          hintsJson: JSON.stringify([
            'toggleComplete usa PATCH con completed: !currentStatus (invierte el booleano).',
            'addTodo usa POST con body: { title, completed: false, userId: 1 }',
            'removeTodo usa DELETE sin body. Verifica response.ok en todas.',
          ]),
        },
        {
          order: 15,
          type: 'challenge',
          difficulty: 'hard',
          points: 30,
          prompt: `Reto: Escribe una función \`bulkOperation(ids, operation)\` que ejecute una operación en múltiples recursos en paralelo.
- operation puede ser: 'delete' o 'complete'
- Para 'delete': elimina todos los posts con esos IDs
- Para 'complete': marca como completadas todas las tareas con esos IDs
- Usa Promise.all() para ejecutar en paralelo
- Reporta cuántas operaciones fueron exitosas y cuántas fallaron`,
          starterCode: "async function bulkOperation(ids, operation) {\n  // Ejecuta en paralelo con Promise.all()\n  // Reporta éxitos y fallos\n}",
          solution: "async function bulkOperation(ids, operation) {\n  const BASE = 'https://jsonplaceholder.typicode.com';\n\n  const operations = ids.map(async (id) => {\n    try {\n      if (operation === 'delete') {\n        const res = await fetch(`${BASE}/posts/${id}`, { method: 'DELETE' });\n        return { id, success: res.ok };\n      } else if (operation === 'complete') {\n        const res = await fetch(`${BASE}/todos/${id}`, {\n          method: 'PATCH',\n          headers: { 'Content-Type': 'application/json' },\n          body: JSON.stringify({ completed: true })\n        });\n        return { id, success: res.ok };\n      }\n    } catch (error) {\n      return { id, success: false, error: error.message };\n    }\n  });\n\n  const results = await Promise.all(operations);\n  const successful = results.filter(r => r.success).length;\n  const failed = results.filter(r => !r.success).length;\n\n  console.log(`Operacion '${operation}': ${successful} exitosas, ${failed} fallidas`);\n  return results;\n}",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['Promise.all', 'map', 'DELETE', 'PATCH', 'success', 'catch'],
            caseSensitive: false,
            explanation: 'Promise.all ejecuta todas las operaciones en paralelo. .map() crea las promesas. try/catch dentro del map para manejar fallos individuales.',
          }),
          hintsJson: JSON.stringify([
            'Promise.all(array_de_promesas) ejecuta todas en paralelo y espera a que terminen.',
            'ids.map(async (id) => {...}) crea un array de promesas.',
            'try/catch dentro de cada operación para que un fallo no cancele las demás.',
          ]),
        },
        {
          order: 16,
          type: 'challenge',
          difficulty: 'hard',
          points: 35,
          prompt: `Reto maestro de CRUD: Crea una función \`syncData(localItems, remoteUrl)\` que sincronice un array local con una API remota.
Lógica:
- Items con id existente → actualizar con PATCH si cambiaron
- Items sin id → crear con POST
- IDs que están en remoto pero no en local → eliminar con DELETE
Usa JSONPlaceholder para practicar.`,
          starterCode: "async function syncData(localItems, remoteUrl) {\n  // 1. Obtén los items remotos\n  // 2. Crea los nuevos (sin id)\n  // 3. Actualiza los existentes que cambiaron\n  // 4. Elimina los que ya no están en local\n}",
          solution: "async function syncData(localItems, remoteUrl) {\n  // 1. Obtener items remotos\n  const remoteRes = await fetch(remoteUrl);\n  const remoteItems = await remoteRes.json();\n\n  const remoteIds = new Set(remoteItems.map(i => i.id));\n  const localIds = new Set(localItems.filter(i => i.id).map(i => i.id));\n\n  const results = { created: 0, updated: 0, deleted: 0, errors: 0 };\n\n  // 2. Crear items sin id\n  for (const item of localItems.filter(i => !i.id)) {\n    try {\n      await fetch(remoteUrl, {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify(item)\n      });\n      results.created++;\n    } catch { results.errors++; }\n  }\n\n  // 3. Actualizar items existentes\n  for (const item of localItems.filter(i => i.id)) {\n    try {\n      await fetch(`${remoteUrl}/${item.id}`, {\n        method: 'PATCH',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify(item)\n      });\n      results.updated++;\n    } catch { results.errors++; }\n  }\n\n  // 4. Eliminar items que ya no están en local\n  for (const remoteId of remoteIds) {\n    if (!localIds.has(remoteId)) {\n      try {\n        await fetch(`${remoteUrl}/${remoteId}`, { method: 'DELETE' });\n        results.deleted++;\n      } catch { results.errors++; }\n    }\n  }\n\n  console.log('Sync completo:', results);\n  return results;\n}",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['POST', 'PATCH', 'DELETE', 'fetch', 'results'],
            caseSensitive: false,
            explanation: 'Sincronización completa: POST para nuevos, PATCH para existentes, DELETE para los remotos que ya no están en local.',
          }),
          hintsJson: JSON.stringify([
            'Primero obtén los items remotos con GET para saber qué existe.',
            'Items sin id → POST. Items con id → PATCH. IDs remotos que no están en local → DELETE.',
            'Usa Set para comparar IDs eficientemente: localIds.has(remoteId)',
          ]),
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // LECCIÓN 3 — Query Params y Body (16 ejercicios)
    // ═══════════════════════════════════════════════════════════════════════
    {
      lesson: {
        title: 'Query Params y Body',
        order: 3,
        type: 'exercise_set',
        contentMd: `
# Query Params y Body

Las APIs aceptan datos de dos formas principales: **query params** en la URL y **body** en la petición.

## Query Params — en la URL

Se usan para filtrar, paginar y buscar. Van después del \`?\`:

\`\`\`
GET /products?category=phones&maxPrice=500&page=2&limit=20
                ↑                  ↑          ↑       ↑
            filtro 1           filtro 2   paginación  tamaño
\`\`\`

Construirlos con URLSearchParams:
\`\`\`javascript
const params = new URLSearchParams({
  category: 'phones',
  maxPrice: 500,
  page: 2,
  limit: 20
});

const url = \`https://api.tienda.com/products?\${params}\`;
// → https://api.tienda.com/products?category=phones&maxPrice=500&page=2&limit=20
\`\`\`

## Body — en la petición

Se usa para enviar datos en POST, PUT, PATCH. Siempre como JSON:

\`\`\`javascript
fetch('/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'iPhone 15',
    price: 999,
    category: 'phones'
  })
})
\`\`\`

## Cuándo usar cada uno

| Tipo | Cuándo usarlo |
|------|---------------|
| Query Params | Filtros, búsqueda, paginación, ordenamiento |
| Body | Crear, actualizar recursos (datos completos) |
| Path Params (/id) | Identificar un recurso específico |
        `,
      },
      exercises: [
        {
          order: 1,
          type: 'quiz',
          difficulty: 'easy',
          points: 10,
          prompt: '¿Para qué se usan principalmente los query params en una API REST?',
          starterCode: null,
          solution: 'b',
          validationLogic: JSON.stringify({
            type: 'exact_match',
            answer: 'b',
            options: [
              { key: 'a', text: 'Para autenticar al usuario' },
              { key: 'b', text: 'Para filtrar, buscar y paginar resultados' },
              { key: 'c', text: 'Para crear nuevos recursos' },
              { key: 'd', text: 'Para enviar contraseñas de forma segura' },
            ],
            explanation: 'Los query params se usan en GET para filtrar (?category=phones), buscar (?q=iphone), paginar (?page=2&limit=20) y ordenar (?sort=price).',
          }),
          hintsJson: JSON.stringify([
            'Los query params van en la URL después del ?. Son visibles y no van encriptados.',
            'Son perfectos para: filtrar, buscar, paginar, ordenar.',
            'La respuesta es B.',
          ]),
        },
        {
          order: 2,
          type: 'quiz',
          difficulty: 'easy',
          points: 10,
          prompt: 'Tienes la URL: `https://api.tienda.com/products?category=shoes&minPrice=50&maxPrice=200`. ¿Cuántos query params tiene?',
          starterCode: null,
          solution: 'c',
          validationLogic: JSON.stringify({
            type: 'exact_match',
            answer: 'c',
            options: [
              { key: 'a', text: '1 (category)' },
              { key: 'b', text: '2 (minPrice y maxPrice)' },
              { key: 'c', text: '3 (category, minPrice, maxPrice)' },
              { key: 'd', text: '4 (incluyendo la URL base)' },
            ],
            explanation: 'Los query params están separados por &. Hay 3: category=shoes, minPrice=50, maxPrice=200.',
          }),
          hintsJson: JSON.stringify([
            'El primer query param va después del ?',
            'Los siguientes van separados por &',
            'Cuenta los = : category=shoes (1), minPrice=50 (2), maxPrice=200 (3).',
          ]),
        },
        {
          order: 3,
          type: 'observe',
          difficulty: 'easy',
          points: 10,
          prompt: `Analiza estas dos URLs y explica la diferencia:

\`\`\`
URL A: https://api.tienda.com/products/5
URL B: https://api.tienda.com/products?id=5
\`\`\`

¿Cuándo usarías cada una? ¿Cuál es la convención REST correcta para obtener un producto específico?`,
          starterCode: null,
          solution: 'URL A: /products/5 es REST correcto para obtener un recurso específico por ID (path param).\nURL B: /products?id=5 no es REST idiomático. Los query params son para filtros, no para identificar un recurso único.\nLa convención REST usa path params (/id) para identificar recursos específicos.',
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['path', 'REST', 'filtros', 'query params', 'identificar'],
            caseSensitive: false,
            explanation: '/products/5 usa path param (REST correcto para recurso específico). ?id=5 usa query param (para filtros, no identificadores). REST prefiere path params para IDs.',
          }),
          hintsJson: JSON.stringify([
            'Path params (/5) identifican un recurso único. Query params (?id=5) son para filtrar colecciones.',
            'REST convención: GET /products/5 para UN producto. GET /products?category=shoes para FILTRAR.',
            'URL A es la correcta según REST para obtener un recurso específico.',
          ]),
        },
        {
          order: 4,
          type: 'fill_blank',
          difficulty: 'easy',
          points: 10,
          prompt: 'Construye la URL con URLSearchParams para buscar posts con userId=3 y limitar a 5 resultados:',
          starterCode: "const params = new _____({\n  ___: 3,\n  ___: 5\n});\n\nconst url = `https://jsonplaceholder.typicode.com/posts?${___}`;",
          solution: "const params = new URLSearchParams({\n  userId: 3,\n  _limit: 5\n});\n\nconst url = `https://jsonplaceholder.typicode.com/posts?${params}`;",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['URLSearchParams', 'userId', 'params'],
            caseSensitive: false,
            explanation: 'URLSearchParams construye automáticamente la cadena ?key=value&key=value. Se interpola con ${params} en el template literal.',
          }),
          hintsJson: JSON.stringify([
            'new URLSearchParams({ key: value }) construye la query string.',
            'Se interpola en la URL: `${BASE_URL}?${params}`',
            'Para JSONPlaceholder: userId filtra por autor, _limit limita resultados.',
          ]),
        },
        {
          order: 5,
          type: 'build',
          difficulty: 'easy',
          points: 15,
          prompt: 'Escribe `getPostsByUser(userId)` que use query params para obtener solo los posts de un usuario específico.',
          starterCode: "async function getPostsByUser(userId) {\n  // Usa: https://jsonplaceholder.typicode.com/posts?userId=X\n}",
          solution: "async function getPostsByUser(userId) {\n  const params = new URLSearchParams({ userId });\n  const response = await fetch(\n    `https://jsonplaceholder.typicode.com/posts?${params}`\n  );\n\n  if (!response.ok) {\n    throw new Error(`Error al obtener posts del usuario ${userId}: ${response.status}`);\n  }\n\n  const posts = await response.json();\n  console.log(`Posts del usuario ${userId}:`, posts.length);\n  return posts;\n}",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['URLSearchParams', 'userId', 'fetch', 'response.json'],
            caseSensitive: false,
            explanation: 'URLSearchParams construye la query string limpiamente. La URL queda: /posts?userId=X',
          }),
          hintsJson: JSON.stringify([
            'new URLSearchParams({ userId }) construye ?userId=X automáticamente.',
            'Template literal: `URL?${params}`',
            'Verifica response.ok y retorna el array de posts.',
          ]),
        },
        {
          order: 6,
          type: 'build',
          difficulty: 'medium',
          points: 20,
          prompt: 'Escribe `searchProducts(filters)` que acepte un objeto de filtros y los construya como query params. filters puede tener: category, minPrice, maxPrice, page, limit.',
          starterCode: "async function searchProducts(filters = {}) {\n  // filters = { category: 'phones', minPrice: 100, page: 2 }\n  // Construye la URL con solo los filtros que estén definidos\n}",
          solution: "async function searchProducts(filters = {}) {\n  // Solo incluir filtros que no sean undefined/null\n  const cleanFilters = Object.fromEntries(\n    Object.entries(filters).filter(([_, v]) => v != null)\n  );\n\n  const params = new URLSearchParams(cleanFilters);\n  const url = `https://api.tienda.com/products${params.toString() ? '?' + params : ''}`;\n\n  const response = await fetch(url);\n  if (!response.ok) throw new Error(`Error: ${response.status}`);\n  return response.json();\n}",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['URLSearchParams', 'Object.entries', 'filter', 'fetch'],
            caseSensitive: false,
            explanation: 'Filtrar los valores null/undefined antes de construir los params evita enviar parámetros vacíos a la API.',
          }),
          hintsJson: JSON.stringify([
            'Primero limpia los filtros: quita los que sean undefined o null.',
            'Object.entries(filters).filter(([k, v]) => v != null) elimina los vacíos.',
            'new URLSearchParams(cleanFilters) construye la query string con los filtros restantes.',
          ]),
        },
        {
          order: 7,
          type: 'build',
          difficulty: 'medium',
          points: 20,
          prompt: 'Escribe `getPaginatedPosts(page, limit)` que use paginación con query params y muestre información sobre la página actual y total.',
          starterCode: "async function getPaginatedPosts(page = 1, limit = 10) {\n  // usa _page y _limit en JSONPlaceholder\n  // JSONPlaceholder devuelve el total en el header X-Total-Count\n}",
          solution: "async function getPaginatedPosts(page = 1, limit = 10) {\n  const params = new URLSearchParams({ _page: page, _limit: limit });\n  const response = await fetch(\n    `https://jsonplaceholder.typicode.com/posts?${params}`\n  );\n\n  if (!response.ok) throw new Error(`Error: ${response.status}`);\n\n  const total = parseInt(response.headers.get('X-Total-Count') || '0', 10);\n  const posts = await response.json();\n  const totalPages = Math.ceil(total / limit);\n\n  console.log(`Página ${page} de ${totalPages} (${total} posts totales)`);\n  return { posts, page, totalPages, total };\n}",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['_page', '_limit', 'URLSearchParams', 'X-Total-Count', 'headers.get'],
            caseSensitive: false,
            explanation: 'JSONPlaceholder usa _page y _limit. El total viene en el header X-Total-Count. response.headers.get() lee los headers de la respuesta.',
          }),
          hintsJson: JSON.stringify([
            'JSONPlaceholder: _page=2&_limit=10 para paginación.',
            'El total de items viene en el header de respuesta: response.headers.get("X-Total-Count")',
            'totalPages = Math.ceil(total / limit)',
          ]),
        },
        {
          order: 8,
          type: 'debug',
          difficulty: 'medium',
          points: 15,
          prompt: `Este código construye la URL incorrectamente y tiene problemas con los query params. Corrígelo:

\`\`\`javascript
async function filterPosts(userId, completed) {
  const url = 'https://jsonplaceholder.typicode.com/todos' +
    '?userId=' + userId +
    '&completed=' + completed;

  const res = await fetch(url);
  return res.json();
}
\`\`\`

Problemas: ¿Qué pasa si userId es undefined? ¿Qué pasa con caracteres especiales? Reescribe usando URLSearchParams.`,
          starterCode: "async function filterPosts(userId, completed) {\n  const url = 'https://jsonplaceholder.typicode.com/todos' +\n    '?userId=' + userId +\n    '&completed=' + completed;\n\n  const res = await fetch(url);\n  return res.json();\n}",
          solution: "async function filterPosts(userId, completed) {\n  const filters = {};\n  if (userId != null) filters.userId = userId;\n  if (completed != null) filters.completed = completed;\n\n  const params = new URLSearchParams(filters);\n  const query = params.toString() ? `?${params}` : '';\n  const url = `https://jsonplaceholder.typicode.com/todos${query}`;\n\n  const res = await fetch(url);\n  if (!res.ok) throw new Error(`Error: ${res.status}`);\n  return res.json();\n}",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['URLSearchParams', 'userId != null', 'null'],
            caseSensitive: false,
            explanation: 'La concatenación manual de strings falla con undefined (genera ?userId=undefined) y no escapa caracteres especiales. URLSearchParams maneja ambos casos automáticamente.',
          }),
          hintsJson: JSON.stringify([
            "Concatenar '?userId=' + undefined produce '?userId=undefined' en la URL.",
            'URLSearchParams escapa automáticamente caracteres especiales (espacios, &, =, etc.).',
            'Verifica que el parámetro no sea null/undefined antes de agregarlo.',
          ]),
        },
        {
          order: 9,
          type: 'fill_blank',
          difficulty: 'medium',
          points: 15,
          prompt: 'Completa el código que lee los query params de la URL actual en el navegador:',
          starterCode: "// URL actual: https://miapp.com/search?q=javascript&page=2&sort=recent\n\nconst params = new ___(window.location.___); \n\nconst query = params.___('q');        // 'javascript'\nconst page = params.___('page');      // '2'\nconst sort = params.___('sort');      // 'recent'\n\nconsole.log(query, page, sort);",
          solution: "// URL actual: https://miapp.com/search?q=javascript&page=2&sort=recent\n\nconst params = new URLSearchParams(window.location.search); \n\nconst query = params.get('q');        // 'javascript'\nconst page = params.get('page');      // '2'\nconst sort = params.get('sort');      // 'recent'\n\nconsole.log(query, page, sort);",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['URLSearchParams', 'window.location.search', 'params.get'],
            caseSensitive: false,
            explanation: 'window.location.search devuelve la query string (?q=javascript&...). URLSearchParams la parsea y .get(key) obtiene cada valor.',
          }),
          hintsJson: JSON.stringify([
            'window.location.search devuelve la parte ?clave=valor de la URL actual.',
            'new URLSearchParams(window.location.search) parsea la query string.',
            '.get("clave") obtiene el valor de un parámetro específico.',
          ]),
        },
        {
          order: 10,
          type: 'build',
          difficulty: 'medium',
          points: 20,
          prompt: 'Escribe `sortPosts(sortBy, order)` que ordene posts usando query params. sortBy puede ser "id", "title" o "userId". order puede ser "asc" o "desc".',
          starterCode: "async function sortPosts(sortBy = 'id', order = 'asc') {\n  // JSONPlaceholder acepta _sort y _order como query params\n}",
          solution: "async function sortPosts(sortBy = 'id', order = 'asc') {\n  const validSortFields = ['id', 'title', 'userId'];\n  const validOrders = ['asc', 'desc'];\n\n  if (!validSortFields.includes(sortBy)) {\n    throw new Error(`Campo de ordenamiento inválido: ${sortBy}`);\n  }\n  if (!validOrders.includes(order)) {\n    throw new Error(`Orden inválido: ${order}. Usa 'asc' o 'desc'.`);\n  }\n\n  const params = new URLSearchParams({ _sort: sortBy, _order: order });\n  const response = await fetch(\n    `https://jsonplaceholder.typicode.com/posts?${params}`\n  );\n\n  if (!response.ok) throw new Error(`Error: ${response.status}`);\n  return response.json();\n}",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['_sort', '_order', 'URLSearchParams', 'includes', 'validSortFields'],
            caseSensitive: false,
            explanation: 'JSONPlaceholder usa _sort y _order. Validar los parámetros antes de usarlos previene peticiones incorrectas.',
          }),
          hintsJson: JSON.stringify([
            'JSONPlaceholder: _sort=title&_order=asc para ordenar.',
            'Valida que sortBy esté en la lista permitida antes de hacer el fetch.',
            'new URLSearchParams({ _sort: sortBy, _order: order })',
          ]),
        },
        {
          order: 11,
          type: 'build',
          difficulty: 'hard',
          points: 25,
          prompt: 'Escribe `sendFormData(url, formElement)` que lea un formulario HTML y envíe sus datos como JSON a una API.',
          starterCode: "// Dado un elemento <form>, extrae sus datos y envíalos como JSON\nasync function sendFormData(url, formElement) {\n  // FormData puede leer un formulario HTML\n  // Conviértelo a objeto JS y envíalo como JSON\n}",
          solution: "async function sendFormData(url, formElement) {\n  const formData = new FormData(formElement);\n  \n  // Convertir FormData a objeto plano\n  const data = Object.fromEntries(formData.entries());\n\n  const response = await fetch(url, {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify(data)\n  });\n\n  if (!response.ok) {\n    throw new Error(`Error al enviar formulario: ${response.status}`);\n  }\n\n  return response.json();\n}",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['FormData', 'Object.fromEntries', 'JSON.stringify', 'POST', 'Content-Type'],
            caseSensitive: false,
            explanation: 'FormData lee el formulario HTML. Object.fromEntries(formData.entries()) lo convierte a objeto plano. Luego se envía como JSON.',
          }),
          hintsJson: JSON.stringify([
            'new FormData(formElement) lee todos los campos del formulario.',
            'Object.fromEntries(formData.entries()) convierte FormData a { campo: valor }.',
            'Luego envías ese objeto con JSON.stringify en el body.',
          ]),
        },
        {
          order: 12,
          type: 'debug',
          difficulty: 'hard',
          points: 20,
          prompt: `Este código de búsqueda tiene bugs de seguridad y lógica. Identifica y corrige todos:

\`\`\`javascript
async function searchUsers(query) {
  // Bug: construye la URL de forma insegura
  const url = 'https://api.ejemplo.com/users?name=' + query;

  const res = await fetch(url);
  const users = await res.json();

  // Bug: muestra los datos sin verificar el status
  console.log('Usuarios encontrados:', users.length);
  return users;
}

// Llamada de prueba con input malicioso
searchUsers('Ana&admin=true&role=admin');
\`\`\``,
          starterCode: "async function searchUsers(query) {\n  const url = 'https://api.ejemplo.com/users?name=' + query;\n\n  const res = await fetch(url);\n  const users = await res.json();\n\n  console.log('Usuarios encontrados:', users.length);\n  return users;\n}\n\nsearchUsers('Ana&admin=true&role=admin');",
          solution: "async function searchUsers(query) {\n  // Corrección: URLSearchParams escapa correctamente los caracteres especiales\n  const params = new URLSearchParams({ name: query });\n  const url = `https://api.ejemplo.com/users?${params}`;\n  // Con URLSearchParams: ?name=Ana%26admin%3Dtrue%26role%3Dadmin (seguro)\n  // Sin URLSearchParams: ?name=Ana&admin=true&role=admin (vulnerable a inyección)\n\n  const res = await fetch(url);\n\n  // Corrección: siempre verificar el status antes de procesar\n  if (!res.ok) {\n    throw new Error(`Error en búsqueda: ${res.status}`);\n  }\n\n  const users = await res.json();\n  console.log('Usuarios encontrados:', users.length);\n  return users;\n}",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['URLSearchParams', 'res.ok', 'throw', 'Error'],
            caseSensitive: false,
            explanation: 'Bug 1: concatenación insegura permite inyección de parámetros (Ana&admin=true añade params extra). URLSearchParams escapa los caracteres. Bug 2: no verifica response.ok.',
          }),
          hintsJson: JSON.stringify([
            'Si el usuario escribe "Ana&admin=true", la URL concatenada queda: ?name=Ana&admin=true (¡inyección de params!)',
            'URLSearchParams escapa el & y = del valor: %26 y %3D, haciéndolos inofensivos.',
            'Siempre verificar if (!res.ok) antes de procesar la respuesta.',
          ]),
        },
        {
          order: 13,
          type: 'build',
          difficulty: 'hard',
          points: 25,
          prompt: 'Crea `infiniteScroll(url, onNewData)` que cargue datos paginados automáticamente cuando el usuario llega al final de la página.',
          starterCode: "function infiniteScroll(url, onNewData) {\n  let page = 1;\n  const limit = 10;\n  let loading = false;\n  let hasMore = true;\n\n  // Implementa la lógica de scroll infinito\n}",
          solution: "function infiniteScroll(url, onNewData) {\n  let page = 1;\n  const limit = 10;\n  let loading = false;\n  let hasMore = true;\n\n  async function loadPage() {\n    if (loading || !hasMore) return;\n    loading = true;\n\n    try {\n      const params = new URLSearchParams({ _page: page, _limit: limit });\n      const res = await fetch(`${url}?${params}`);\n\n      if (!res.ok) throw new Error(`Error: ${res.status}`);\n\n      const total = parseInt(res.headers.get('X-Total-Count') || '0', 10);\n      const data = await res.json();\n\n      onNewData(data);\n      page++;\n      hasMore = page * limit < total;\n    } catch (error) {\n      console.error('Error cargando página:', error);\n    } finally {\n      loading = false;\n    }\n  }\n\n  // Cargar primera página\n  loadPage();\n\n  // Observar el scroll\n  window.addEventListener('scroll', () => {\n    const nearBottom =\n      window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;\n    if (nearBottom) loadPage();\n  });\n\n  return { loadPage, stop: () => window.removeEventListener('scroll', loadPage) };\n}",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['_page', '_limit', 'URLSearchParams', 'scroll', 'loading', 'hasMore'],
            caseSensitive: false,
            explanation: 'Scroll infinito: paginación con query params, flag loading para evitar peticiones duplicadas, hasMore para saber si hay más datos, evento scroll para detectar el final.',
          }),
          hintsJson: JSON.stringify([
            'Usa loading = true/false para evitar múltiples peticiones simultáneas.',
            'X-Total-Count del header indica el total. hasMore = page * limit < total.',
            'Escucha el evento scroll y verifica si el usuario está cerca del final de la página.',
          ]),
        },
        {
          order: 14,
          type: 'challenge',
          difficulty: 'hard',
          points: 30,
          prompt: `Reto: Crea \`advancedSearch(options)\` que combine múltiples técnicas:
- Query params para filtros (category, minPrice, maxPrice)
- Paginación (_page, _limit)
- Ordenamiento (_sort, _order)
- Búsqueda por texto (q)
- Caché simple: si los mismos parámetros se usan de nuevo, devuelve el resultado guardado sin hacer otra petición`,
          starterCode: "const cache = new Map();\n\nasync function advancedSearch(options = {}) {\n  // options: { category, minPrice, maxPrice, page, limit, sort, order, q }\n  // Implementa con caché\n}",
          solution: "const cache = new Map();\n\nasync function advancedSearch(options = {}) {\n  const { category, minPrice, maxPrice, page = 1, limit = 10, sort, order = 'asc', q } = options;\n\n  const filters = {};\n  if (category) filters.category = category;\n  if (minPrice != null) filters.minPrice = minPrice;\n  if (maxPrice != null) filters.maxPrice = maxPrice;\n  if (q) filters.q = q;\n  filters._page = page;\n  filters._limit = limit;\n  if (sort) { filters._sort = sort; filters._order = order; }\n\n  const params = new URLSearchParams(filters);\n  const cacheKey = params.toString();\n\n  // Devolver desde caché si existe\n  if (cache.has(cacheKey)) {\n    console.log('Resultado desde caché:', cacheKey);\n    return cache.get(cacheKey);\n  }\n\n  const url = `https://jsonplaceholder.typicode.com/posts?${params}`;\n  const response = await fetch(url);\n\n  if (!response.ok) throw new Error(`Error: ${response.status}`);\n\n  const total = parseInt(response.headers.get('X-Total-Count') || '0', 10);\n  const data = await response.json();\n  const result = { data, total, page, totalPages: Math.ceil(total / limit) };\n\n  cache.set(cacheKey, result);\n  return result;\n}",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['URLSearchParams', 'cache', 'Map', 'cacheKey', 'cache.has', 'cache.set'],
            caseSensitive: false,
            explanation: 'URLSearchParams como clave de caché es elegante: genera un string único por combinación de parámetros. Si ya está en el Map, devuelve sin fetch.',
          }),
          hintsJson: JSON.stringify([
            'Usa params.toString() como clave del caché: es único para cada combinación de filtros.',
            'if (cache.has(cacheKey)) return cache.get(cacheKey); → devuelve sin hacer fetch.',
            'cache.set(cacheKey, result) guarda el resultado para futuras llamadas iguales.',
          ]),
        },
        {
          order: 15,
          type: 'challenge',
          difficulty: 'hard',
          points: 30,
          prompt: `Reto de diseño: ¿Cuándo usar query params vs body? Dado este escenario, decide cuál usar y justifica:

1. Buscar usuarios por nombre
2. Actualizar el email de un usuario
3. Filtrar posts por categoría y fecha
4. Enviar datos de pago (número de tarjeta, CVV)
5. Ordenar productos por precio descendente
6. Crear una cuenta nueva con email y contraseña

Para cada uno, escribe: Método HTTP + dónde van los datos + por qué.`,
          starterCode: '// Analiza cada caso:\n// 1. Buscar por nombre → ?\n// 2. Actualizar email → ?\n// 3. Filtrar posts → ?\n// 4. Datos de pago → ?\n// 5. Ordenar productos → ?\n// 6. Crear cuenta → ?',
          solution: '// 1. Buscar usuarios por nombre\n// GET /users?name=Ana → query param\n// Razón: es una operación de lectura/filtrado, los params van en la URL\n\n// 2. Actualizar email\n// PATCH /users/:id → body: { email: "nuevo@email.com" }\n// Razón: es una modificación. Los datos van en el body.\n\n// 3. Filtrar posts por categoría y fecha\n// GET /posts?category=tech&from=2024-01-01 → query params\n// Razón: filtros de lectura van en query params\n\n// 4. Datos de pago (número tarjeta, CVV)\n// POST /payments → body: { card: "...", cvv: "..." }\n// Razón: datos sensibles NUNCA en URL (quedan en logs, historial). Siempre en body.\n\n// 5. Ordenar productos por precio descendente\n// GET /products?sort=price&order=desc → query params\n// Razón: el ordenamiento es un modificador de lectura, va en query params\n\n// 6. Crear cuenta con email y contraseña\n// POST /users → body: { email: "...", password: "..." }\n// Razón: creación = POST + body. La contraseña NUNCA en URL.',
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['GET', 'query', 'body', 'POST', 'PATCH', 'sensibles', 'URL'],
            caseSensitive: false,
            explanation: 'Regla de oro: datos sensibles (contraseñas, tarjetas) NUNCA en URL. GET con filtros = query params. POST/PATCH/PUT con datos = body.',
          }),
          hintsJson: JSON.stringify([
            'Datos SENSIBLES (contraseñas, tarjetas) SIEMPRE en body, NUNCA en URL (quedan en logs).',
            'Filtros, búsqueda, ordenamiento → query params en GET.',
            'Crear/modificar recursos → body en POST/PATCH/PUT.',
          ]),
        },
        {
          order: 16,
          type: 'challenge',
          difficulty: 'hard',
          points: 40,
          prompt: `Reto maestro: Construye un cliente de API completo \`ApiClient\` con:
- Constructor que recibe la URL base y un token opcional
- Métodos: get(path, params), post(path, data), patch(path, data), delete(path)
- Interceptor de errores que reintenta automáticamente peticiones fallidas (máx 3 intentos)
- Todos los métodos deben manejar query params con URLSearchParams`,
          starterCode: "class ApiClient {\n  constructor(baseUrl, token = null) {\n    // inicializa\n  }\n\n  // Implementa los métodos\n}",
          solution: "class ApiClient {\n  constructor(baseUrl, token = null) {\n    this.baseUrl = baseUrl;\n    this.token = token;\n    this.maxRetries = 3;\n  }\n\n  _buildHeaders(hasBody = false) {\n    const headers = {};\n    if (this.token) headers['Authorization'] = `Bearer ${this.token}`;\n    if (hasBody) headers['Content-Type'] = 'application/json';\n    return headers;\n  }\n\n  async _request(url, options, retries = 0) {\n    try {\n      const response = await fetch(url, options);\n\n      // No reintentar errores 4xx (son del cliente)\n      if (!response.ok && response.status < 500) {\n        throw new Error(`Error ${response.status}: ${await response.text()}`);\n      }\n\n      // Reintentar errores 5xx\n      if (!response.ok && retries < this.maxRetries) {\n        console.warn(`Reintento ${retries + 1}/${this.maxRetries}...`);\n        await new Promise(r => setTimeout(r, 500 * (retries + 1)));\n        return this._request(url, options, retries + 1);\n      }\n\n      if (!response.ok) throw new Error(`Error tras ${this.maxRetries} intentos`);\n      if (response.status === 204) return null;\n      return response.json();\n    } catch (error) {\n      if (retries < this.maxRetries && error.name === 'TypeError') {\n        await new Promise(r => setTimeout(r, 500 * (retries + 1)));\n        return this._request(url, options, retries + 1);\n      }\n      throw error;\n    }\n  }\n\n  get(path, params = {}) {\n    const query = new URLSearchParams(\n      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null))\n    );\n    const url = `${this.baseUrl}${path}${query.toString() ? '?' + query : ''}`;\n    return this._request(url, { headers: this._buildHeaders() });\n  }\n\n  post(path, data) {\n    return this._request(`${this.baseUrl}${path}`, {\n      method: 'POST',\n      headers: this._buildHeaders(true),\n      body: JSON.stringify(data)\n    });\n  }\n\n  patch(path, data) {\n    return this._request(`${this.baseUrl}${path}`, {\n      method: 'PATCH',\n      headers: this._buildHeaders(true),\n      body: JSON.stringify(data)\n    });\n  }\n\n  delete(path) {\n    return this._request(`${this.baseUrl}${path}`, {\n      method: 'DELETE',\n      headers: this._buildHeaders()\n    });\n  }\n}",
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['class ApiClient', '_request', 'retries', 'URLSearchParams', 'POST', 'PATCH', 'DELETE'],
            caseSensitive: false,
            explanation: 'Un cliente de API reutilizable con reintentos automáticos para errores 5xx, backoff exponencial, y manejo limpio de headers y query params.',
          }),
          hintsJson: JSON.stringify([
            'Separa la lógica de reintentos en un método _request privado.',
            'Solo reintenta 5xx (errores del servidor). Los 4xx son del cliente y no deben reintentarse.',
            'Backoff exponencial: espera 500ms, luego 1000ms, luego 1500ms entre reintentos.',
          ]),
        },
      ],
    },
  ],
};
