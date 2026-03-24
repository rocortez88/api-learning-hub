/**
 * NIVEL 5 — APIs EN PRODUCCIÓN
 * 3 lecciones · 30 ejercicios
 *
 * Lección 1: OpenAPI y Documentación          → 10 ejercicios
 * Lección 2: Versionado y Compatibilidad      → 10 ejercicios
 * Lección 3: Seguridad Avanzada y Buenas Prácticas → 10 ejercicios
 */

import type { SeedModule } from './types.js';

export const level5Modules: SeedModule[] = [
  {
    module: {
      slug: 'apis-produccion',
      title: 'APIs en Producción',
      description: 'OpenAPI/Swagger, versionado, seguridad avanzada y buenas prácticas para producción',
      level: 5,
      order: 5,
      unlockedByModuleId: 'apis-avanzadas',
    },

    lessons: [
      // ═══════════════════════════════════════════════════════════════════════
      // LECCIÓN 1 — OpenAPI y Documentación (10 ejercicios)
      // ═══════════════════════════════════════════════════════════════════════
      {
        lesson: {
          title: 'OpenAPI y Documentación',
          order: 1,
          type: 'theory',
          contentMd: `
# OpenAPI y Documentación

**OpenAPI** (antes conocido como Swagger) es el estándar de la industria para describir APIs REST
de forma legible tanto por humanos como por máquinas. Un spec OpenAPI define todos tus endpoints,
parámetros, cuerpos de petición y respuestas en un único archivo.

## ¿Qué versión usar?

La versión actual es **OpenAPI 3.1.0** (2021). La versión 3.0.x sigue siendo muy usada.
La versión 2.0 (Swagger 2.0) está obsoleta pero aún aparece en APIs legacy.

## Archivo estándar: openapi.yaml

El archivo de especificación se llama convencionalmente \`openapi.yaml\` (o \`openapi.json\`).
Herramientas como Swagger UI, Redoc y Stoplight lo detectan automáticamente.

\`\`\`yaml
openapi: 3.0.3
info:
  title: API de Tareas
  version: 1.0.0
  description: API para gestionar tareas personales

paths:
  /tasks:
    get:
      summary: Listar todas las tareas
      responses:
        '200':
          description: Lista de tareas
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Task'

components:
  schemas:
    Task:
      type: object
      required: [id, title]
      properties:
        id:
          type: integer
        title:
          type: string
        done:
          type: boolean
          default: false
\`\`\`

## $ref: reutilizar esquemas

La directiva \`$ref\` evita repetir la definición del mismo objeto en múltiples lugares.
Apunta a un esquema definido en \`components/schemas\`.

## Integración con Express: swagger-jsdoc + swagger-ui-express

\`\`\`javascript
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.3',
    info: { title: 'Mi API', version: '1.0.0' },
  },
  apis: ['./src/routes/*.js'], // archivos con JSDoc
};

const spec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
\`\`\`

## JSDoc para Swagger

\`\`\`javascript
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/users/:id', getUserById);
\`\`\`
      `,
        },
        exercises: [
          // 1. Quiz — versión OpenAPI
          {
            order: 1,
            type: 'quiz',
            difficulty: 'medium',
            points: 10,
            prompt: '¿Cuál es la versión actual y recomendada de la especificación OpenAPI?',
            starterCode: null,
            solution: 'c',
            validationLogic: JSON.stringify({
              type: 'exact_match',
              answer: 'c',
              options: [
                { key: 'a', text: 'Swagger 2.0' },
                { key: 'b', text: 'OpenAPI 2.5' },
                { key: 'c', text: 'OpenAPI 3.1.0' },
                { key: 'd', text: 'OpenAPI 4.0' },
              ],
              explanation: 'OpenAPI 3.1.0 es la versión más reciente (2021), alineada al 100% con JSON Schema. OpenAPI 3.0.x sigue siendo ampliamente usada. Swagger 2.0 está obsoleto.',
            }),
            hintsJson: JSON.stringify([
              'OpenAPI y Swagger son el mismo estándar, pero "Swagger" solo se usa a partir de la v2 para referirse a las herramientas.',
              'La versión mayor actual es la 3, no la 2 ni la 4.',
              'La versión más reciente es 3.1.0, publicada en 2021.',
            ]),
          },
          // 2. Quiz — nombre del archivo estándar
          {
            order: 2,
            type: 'quiz',
            difficulty: 'medium',
            points: 10,
            prompt: '¿Cómo se llama convencionalmente el archivo que contiene la especificación OpenAPI de una API?',
            starterCode: null,
            solution: 'b',
            validationLogic: JSON.stringify({
              type: 'exact_match',
              answer: 'b',
              options: [
                { key: 'a', text: 'swagger.json' },
                { key: 'b', text: 'openapi.yaml' },
                { key: 'c', text: 'api-spec.yaml' },
                { key: 'd', text: 'schema.json' },
              ],
              explanation: 'El nombre convencional es openapi.yaml (o openapi.json). Herramientas como Swagger UI, Redoc y Stoplight buscan este archivo automáticamente. swagger.json era el nombre de la era Swagger 2.0.',
            }),
            hintsJson: JSON.stringify([
              'El nombre del archivo debe reflejar el estándar que usa: OpenAPI, no Swagger.',
              'Se prefiere el formato YAML por ser más legible, aunque JSON también es válido.',
              'El nombre convencional es openapi.yaml.',
            ]),
          },
          // 3. Observe — leer spec YAML e identificar endpoints
          {
            order: 3,
            type: 'observe',
            difficulty: 'medium',
            points: 10,
            prompt: `Analiza este fragmento de un spec OpenAPI y responde las preguntas:

\`\`\`yaml
openapi: 3.0.3
info:
  title: API de Productos
  version: 2.1.0

paths:
  /products:
    get:
      summary: Listar productos
      parameters:
        - in: query
          name: category
          schema:
            type: string
      responses:
        '200':
          description: OK
  /products/{id}:
    get:
      summary: Obtener producto
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Producto encontrado
        '404':
          description: No encontrado
    delete:
      summary: Eliminar producto
      responses:
        '204':
          description: Eliminado
\`\`\`

1. ¿Cuántos endpoints (combinaciones método+ruta) define este spec?
2. ¿Qué parámetro acepta GET /products y de qué tipo es?
3. ¿Qué código devuelve DELETE /products/{id} al tener éxito?`,
            starterCode: null,
            solution: '1. Define 3 endpoints: GET /products, GET /products/{id}, DELETE /products/{id}.\n2. Acepta el parámetro query "category" de tipo string (es opcional, no tiene required: true).\n3. DELETE /products/{id} devuelve 204 No Content al tener éxito (eliminación exitosa sin cuerpo de respuesta).',
            validationLogic: JSON.stringify({
              type: 'includes_keywords',
              keywords: ['3', 'category', 'string', '204'],
              caseSensitive: false,
              explanation: 'El spec define 3 endpoints (GET /products, GET /products/{id}, DELETE /products/{id}). El parámetro query es "category" de tipo string. DELETE devuelve 204.',
            }),
            hintsJson: JSON.stringify([
              'Cuenta cada combinación de método HTTP + ruta como un endpoint separado.',
              'Los parámetros en "query" se envían en la URL (?category=...). Fíjate en el campo "schema.type".',
              '204 significa "No Content": la operación tuvo éxito pero no hay cuerpo en la respuesta.',
            ]),
          },
          // 4. Observe — analizar respuestas con $ref
          {
            order: 4,
            type: 'observe',
            difficulty: 'medium',
            points: 10,
            prompt: `Observa cómo se usan los \`$ref\` en este spec y responde:

\`\`\`yaml
paths:
  /orders:
    post:
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateOrderInput'
      responses:
        '201':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'
        '400':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

components:
  schemas:
    Order:
      type: object
      properties:
        id: { type: integer }
        total: { type: number }
        items:
          type: array
          items:
            $ref: '#/components/schemas/OrderItem'
\`\`\`

1. ¿Qué ventaja tiene usar \`$ref\` en lugar de definir el schema inline?
2. ¿Cuántas veces se referencia \`OrderItem\` en este spec?
3. ¿Qué ocurriría si cambias la definición de \`Order\` en \`components/schemas\`?`,
            starterCode: null,
            solution: '1. Ventaja: evita repetir la misma definición en múltiples lugares (DRY). Si el schema cambia, solo se actualiza en un sitio y todos los $ref se actualizan automáticamente.\n2. OrderItem se referencia 1 vez: dentro de la propiedad "items" del array en el schema Order.\n3. Si cambias Order en components/schemas, el cambio se refleja automáticamente en todos los endpoints que usan $ref: \'#/components/schemas/Order\', incluyendo la respuesta 201 de POST /orders.',
            validationLogic: JSON.stringify({
              type: 'includes_keywords',
              keywords: ['DRY', 'repetir', 'automáticamente', '1'],
              caseSensitive: false,
              explanation: '$ref evita repetición (principio DRY). OrderItem se referencia 1 vez. Cambiar el schema en components se propaga automáticamente a todos los $ref.',
            }),
            hintsJson: JSON.stringify([
              '$ref significa "referencia". Piensa en el principio DRY: Don\'t Repeat Yourself.',
              'Busca todas las apariciones de $ref: \'#/components/schemas/OrderItem\' en el spec.',
              'Los $ref son como punteros: apuntan a la definición original. Un cambio en el origen afecta a todos los que apuntan a él.',
            ]),
          },
          // 5. Fill blank — completar spec OpenAPI básico
          {
            order: 5,
            type: 'fill_blank',
            difficulty: 'medium',
            points: 15,
            prompt: `Completa este spec OpenAPI para el endpoint GET /users/{id}. Rellena los huecos marcados con ___:

\`\`\`yaml
openapi: ___        # versión del estándar
info:
  title: API de Usuarios
  version: 1.0.0

paths:
  /users/{id}:
    ___:            # método HTTP
      summary: Obtener usuario por ID
      parameters:
        - in: ___   # dónde va el parámetro id
          name: id
          ___: true # ¿es obligatorio?
          schema:
            type: ___
      responses:
        '200':
          description: Usuario encontrado
        '___':      # código de "no encontrado"
          description: Usuario no encontrado
\`\`\``,
            starterCode: `openapi: ___
info:
  title: API de Usuarios
  version: 1.0.0

paths:
  /users/{id}:
    ___:
      summary: Obtener usuario por ID
      parameters:
        - in: ___
          name: id
          ___: true
          schema:
            type: ___
      responses:
        '200':
          description: Usuario encontrado
        '___':
          description: Usuario no encontrado`,
            solution: `openapi: 3.0.3
info:
  title: API de Usuarios
  version: 1.0.0

paths:
  /users/{id}:
    get:
      summary: Obtener usuario por ID
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Usuario encontrado
        '404':
          description: Usuario no encontrado`,
            validationLogic: JSON.stringify({
              type: 'includes_keywords',
              keywords: ['3.0', 'get', 'path', 'required', 'integer', '404'],
              caseSensitive: false,
              explanation: 'Los valores correctos son: versión 3.0.x, método get, parámetro in: path, required: true, type: integer, código 404 para no encontrado.',
            }),
            hintsJson: JSON.stringify([
              'La versión actual de OpenAPI es la 3.x. Los parámetros en la URL (/{id}) son de tipo "path".',
              'Los parámetros de path siempre son obligatorios (required: true). Los IDs numéricos usan type: integer.',
              '404 Not Found es el código estándar cuando un recurso no existe.',
            ]),
          },
          // 6. Fill blank — completar JSDoc para Swagger
          {
            order: 6,
            type: 'fill_blank',
            difficulty: 'medium',
            points: 15,
            prompt: `Completa el bloque JSDoc para que swagger-jsdoc genere correctamente la documentación del endpoint POST /products:

\`\`\`javascript
/**
 * @___           <- directiva de swagger-jsdoc
 * /products:
 *   ___:         <- método HTTP
 *     summary: Crear nuevo producto
 *     ___:       <- cuerpo de la petición
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: ___
 *               price:
 *                 type: number
 *     responses:
 *       ___:     <- código de creación exitosa
 *         description: Producto creado
 *       400:
 *         description: Datos inválidos
 */
router.post('/products', createProduct);
\`\`\``,
            starterCode: `/**
 * @___
 * /products:
 *   ___:
 *     summary: Crear nuevo producto
 *     ___:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: ___
 *               price:
 *                 type: number
 *     responses:
 *       ___:
 *         description: Producto creado
 *       400:
 *         description: Datos inválidos
 */
router.post('/products', createProduct);`,
            solution: `/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crear nuevo producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Producto creado
 *       400:
 *         description: Datos inválidos
 */
router.post('/products', createProduct);`,
            validationLogic: JSON.stringify({
              type: 'includes_keywords',
              keywords: ['@swagger', 'post', 'requestBody', 'string', '201'],
              caseSensitive: false,
              explanation: 'La directiva es @swagger, el método es post, el cuerpo usa requestBody, el nombre es de tipo string, y la creación exitosa devuelve 201.',
            }),
            hintsJson: JSON.stringify([
              'La directiva JSDoc que reconoce swagger-jsdoc es @swagger (no @openapi ni @api).',
              'POST /products crea un recurso nuevo. El cuerpo de la petición se define con "requestBody".',
              '201 Created es el código correcto para indicar que un recurso fue creado exitosamente.',
            ]),
          },
          // 7. Fill blank — completar validación de schema
          {
            order: 7,
            type: 'fill_blank',
            difficulty: 'hard',
            points: 15,
            prompt: `Completa esta función que valida un objeto JavaScript contra un schema OpenAPI simplificado:

\`\`\`javascript
function validarContraSchema(objeto, schema) {
  const errores = [];

  // Verificar campos requeridos
  if (schema.___) {
    for (const campo of schema.required) {
      if (___(objeto[campo])) {  // comprueba si el campo está ausente
        errores.push(\`Campo requerido faltante: \${campo}\`);
      }
    }
  }

  // Verificar tipos de cada propiedad
  if (schema.properties) {
    for (const [campo, definicion] of Object.entries(schema.___)) {
      const valor = objeto[campo];
      if (valor === undefined) continue; // ya comprobado arriba

      const tipoReal = typeof valor;
      const tipoEsperado = definicion.___;  // campo del schema que indica el tipo

      if (tipoReal !== tipoEsperado) {
        errores.push(\`\${campo}: se esperaba \${tipoEsperado}, se recibió \${tipoReal}\`);
      }
    }
  }

  return { valido: errores.___ === 0, errores };
}
\`\`\``,
            starterCode: `function validarContraSchema(objeto, schema) {
  const errores = [];

  if (schema.___) {
    for (const campo of schema.required) {
      if (___(objeto[campo])) {
        errores.push(\`Campo requerido faltante: \${campo}\`);
      }
    }
  }

  if (schema.properties) {
    for (const [campo, definicion] of Object.entries(schema.___)) {
      const valor = objeto[campo];
      if (valor === undefined) continue;

      const tipoReal = typeof valor;
      const tipoEsperado = definicion.___;

      if (tipoReal !== tipoEsperado) {
        errores.push(\`\${campo}: se esperaba \${tipoEsperado}, se recibió \${tipoReal}\`);
      }
    }
  }

  return { valido: errores.___ === 0, errores };
}`,
            solution: `function validarContraSchema(objeto, schema) {
  const errores = [];

  if (schema.required) {
    for (const campo of schema.required) {
      if (objeto[campo] === undefined) {
        errores.push(\`Campo requerido faltante: \${campo}\`);
      }
    }
  }

  if (schema.properties) {
    for (const [campo, definicion] of Object.entries(schema.properties)) {
      const valor = objeto[campo];
      if (valor === undefined) continue;

      const tipoReal = typeof valor;
      const tipoEsperado = definicion.type;

      if (tipoReal !== tipoEsperado) {
        errores.push(\`\${campo}: se esperaba \${tipoEsperado}, se recibió \${tipoReal}\`);
      }
    }
  }

  return { valido: errores.length === 0, errores };
}`,
            validationLogic: JSON.stringify({
              type: 'includes_keywords',
              keywords: ['required', 'undefined', 'properties', 'type', 'length'],
              caseSensitive: false,
              explanation: 'Los huecos son: schema.required, valor === undefined, schema.properties, definicion.type, errores.length.',
            }),
            hintsJson: JSON.stringify([
              'Para comprobar si un campo existe en un objeto en JavaScript, compara con undefined.',
              'El schema OpenAPI guarda las propiedades bajo la clave "properties" y los tipos bajo la clave "type".',
              'Para saber cuántos errores hay, usa el .length del array de errores.',
            ]),
          },
          // 8. Build — generar cliente HTTP tipado desde un spec
          {
            order: 8,
            type: 'build',
            difficulty: 'hard',
            points: 20,
            prompt: `Dado el siguiente spec OpenAPI en formato objeto JavaScript, escribe una función \`generarCliente(spec)\` que devuelva un objeto con métodos nombrados según los \`operationId\` del spec. Cada método debe hacer la llamada HTTP correcta usando fetch.

El spec de entrada tiene esta estructura:
\`\`\`javascript
const spec = {
  baseUrl: 'https://api.ejemplo.com',
  paths: {
    '/users': {
      get: { operationId: 'listarUsuarios', method: 'GET' },
      post: { operationId: 'crearUsuario', method: 'POST' }
    },
    '/users/{id}': {
      get: { operationId: 'obtenerUsuario', method: 'GET' },
      delete: { operationId: 'eliminarUsuario', method: 'DELETE' }
    }
  }
};
\`\`\`

El cliente generado debe usarse así:
\`\`\`javascript
const client = generarCliente(spec);
// client.listarUsuarios() → GET https://api.ejemplo.com/users
// client.crearUsuario({ body: {...} }) → POST con JSON body
// client.obtenerUsuario({ params: { id: 42 } }) → GET /users/42
\`\`\``,
            starterCode: `function generarCliente(spec) {
  const cliente = {};

  for (const [ruta, metodos] of Object.entries(spec.paths)) {
    for (const [_, operacion] of Object.entries(metodos)) {
      // Tu implementación aquí
    }
  }

  return cliente;
}`,
            solution: `function generarCliente(spec) {
  const cliente = {};

  for (const [ruta, metodos] of Object.entries(spec.paths)) {
    for (const [metodoHttp, operacion] of Object.entries(metodos)) {
      const { operationId } = operacion;

      cliente[operationId] = async ({ params = {}, body = null } = {}) => {
        // Reemplazar parámetros de path: /users/{id} → /users/42
        let urlFinal = ruta;
        for (const [clave, valor] of Object.entries(params)) {
          urlFinal = urlFinal.replace(\`{\${clave}}\`, valor);
        }

        const opciones = {
          method: metodoHttp.toUpperCase(),
          headers: { 'Content-Type': 'application/json' },
        };

        if (body && ['POST', 'PUT', 'PATCH'].includes(opciones.method)) {
          opciones.body = JSON.stringify(body);
        }

        const res = await fetch(spec.baseUrl + urlFinal, opciones);
        if (!res.ok) throw new Error(\`HTTP \${res.status}: \${res.statusText}\`);
        return res.status === 204 ? null : res.json();
      };
    }
  }

  return cliente;
}`,
            validationLogic: JSON.stringify({
              type: 'includes_keywords',
              keywords: ['operationId', 'replace', 'fetch', 'method', 'JSON.stringify'],
              caseSensitive: false,
              explanation: 'El cliente debe mapear operationId a funciones, reemplazar parámetros de path, usar fetch con el método correcto y serializar el body a JSON.',
            }),
            hintsJson: JSON.stringify([
              'Recorre spec.paths con for...of Object.entries(). Cada entrada tiene una ruta y un objeto con los métodos HTTP.',
              'Para reemplazar {id} en la ruta, usa String.replace() con un template literal: ruta.replace(`{${clave}}`, valor).',
              'Usa fetch(url, { method, headers, body }). Recuerda que body debe ser JSON.stringify(body) y solo se envía en POST/PUT/PATCH.',
            ]),
          },
          // 9. Build — función que valida request contra schema OpenAPI
          {
            order: 9,
            type: 'build',
            difficulty: 'hard',
            points: 20,
            prompt: `Escribe un middleware Express \`validarBodyOpenAPI(schema)\` que reciba un schema OpenAPI y devuelva un middleware que valide \`req.body\` contra ese schema. Si la validación falla, responde con 400 y la lista de errores.

Debe validar:
- Campos requeridos presentes
- Tipos correctos (string, number, boolean)
- Longitud mínima de strings (minLength)

Ejemplo de uso:
\`\`\`javascript
const schemaUsuario = {
  required: ['email', 'password'],
  properties: {
    email: { type: 'string' },
    password: { type: 'string', minLength: 8 },
    age: { type: 'number' }
  }
};

router.post('/register', validarBodyOpenAPI(schemaUsuario), registerHandler);
\`\`\``,
            starterCode: `function validarBodyOpenAPI(schema) {
  return (req, res, next) => {
    const errores = [];
    const body = req.body;

    // Validar campos requeridos

    // Validar tipos y restricciones

    if (errores.length > 0) {
      return res.status(400).json({ errors: errores });
    }

    next();
  };
}`,
            solution: `function validarBodyOpenAPI(schema) {
  return (req, res, next) => {
    const errores = [];
    const body = req.body;

    // Validar campos requeridos
    if (schema.required) {
      for (const campo of schema.required) {
        if (body[campo] === undefined || body[campo] === null) {
          errores.push({ campo, mensaje: \`El campo "\${campo}" es requerido\` });
        }
      }
    }

    // Validar tipos y restricciones
    if (schema.properties) {
      for (const [campo, definicion] of Object.entries(schema.properties)) {
        const valor = body[campo];
        if (valor === undefined || valor === null) continue;

        if (typeof valor !== definicion.type) {
          errores.push({ campo, mensaje: \`Se esperaba tipo \${definicion.type}, se recibió \${typeof valor}\` });
          continue;
        }

        if (definicion.type === 'string' && definicion.minLength && valor.length < definicion.minLength) {
          errores.push({ campo, mensaje: \`Longitud mínima: \${definicion.minLength} caracteres\` });
        }
      }
    }

    if (errores.length > 0) {
      return res.status(400).json({ errors: errores });
    }

    next();
  };
}`,
            validationLogic: JSON.stringify({
              type: 'includes_keywords',
              keywords: ['required', 'properties', 'typeof', 'minLength', 'next()', '400'],
              caseSensitive: false,
              explanation: 'El middleware debe validar campos requeridos, tipos con typeof, longitud mínima con .length, responder 400 con errores o llamar next().',
            }),
            hintsJson: JSON.stringify([
              'Un middleware Express recibe (req, res, next). Llama next() si todo es válido, o res.status(400).json(...) si hay errores.',
              'Para validar tipos en JavaScript usa typeof. Recuerda que typeof 42 === \'number\' y typeof "hola" === \'string\'.',
              'La longitud mínima de un string se comprueba con valor.length < definicion.minLength.',
            ]),
          },
          // 10. Challenge — diseñar spec OpenAPI completo
          {
            order: 10,
            type: 'challenge',
            difficulty: 'hard',
            points: 30,
            prompt: `RETO FINAL: Diseña un spec OpenAPI 3.0 completo para una API de tareas (TODO API).

La API debe soportar:
- Listar tareas (con filtro por estado: pending/done)
- Crear una tarea (título obligatorio, descripción opcional)
- Obtener una tarea por ID
- Actualizar una tarea (título, descripción, estado)
- Eliminar una tarea

Requisitos del spec:
1. Incluir la sección \`info\` completa (title, version, description)
2. Definir el schema \`Task\` en \`components/schemas\` con todos sus campos
3. Usar \`$ref\` para reutilizar el schema Task en las respuestas
4. Incluir los códigos de respuesta correctos para cada operación (200, 201, 204, 404)
5. Documentar el parámetro de filtro para el listado
6. El spec debe ser YAML válido y seguir las convenciones OpenAPI 3.0`,
            starterCode: `openapi: 3.0.3
info:
  # completar...

paths:
  # completar...

components:
  schemas:
    # completar...`,
            solution: `openapi: 3.0.3
info:
  title: TODO API
  version: 1.0.0
  description: API REST para gestionar tareas personales con soporte de filtrado por estado

paths:
  /tasks:
    get:
      summary: Listar todas las tareas
      parameters:
        - in: query
          name: status
          schema:
            type: string
            enum: [pending, done]
          description: Filtrar tareas por estado
      responses:
        '200':
          description: Lista de tareas
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Task'
    post:
      summary: Crear una nueva tarea
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateTaskInput'
      responses:
        '201':
          description: Tarea creada exitosamente
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Task'
        '400':
          description: Datos inválidos

  /tasks/{id}:
    get:
      summary: Obtener una tarea por ID
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Tarea encontrada
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Task'
        '404':
          description: Tarea no encontrada
    put:
      summary: Actualizar una tarea
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: integer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateTaskInput'
      responses:
        '200':
          description: Tarea actualizada
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Task'
        '404':
          description: Tarea no encontrada
    delete:
      summary: Eliminar una tarea
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: integer
      responses:
        '204':
          description: Tarea eliminada exitosamente
        '404':
          description: Tarea no encontrada

components:
  schemas:
    Task:
      type: object
      required: [id, title, status, createdAt]
      properties:
        id:
          type: integer
        title:
          type: string
        description:
          type: string
          nullable: true
        status:
          type: string
          enum: [pending, done]
        createdAt:
          type: string
          format: date-time
    CreateTaskInput:
      type: object
      required: [title]
      properties:
        title:
          type: string
          minLength: 1
        description:
          type: string
    UpdateTaskInput:
      type: object
      properties:
        title:
          type: string
        description:
          type: string
        status:
          type: string
          enum: [pending, done]`,
            validationLogic: JSON.stringify({
              type: 'minimum_length',
              minLength: 150,
              explanation: 'El spec debe incluir info completa, schema Task en components, uso de $ref, códigos 200/201/204/404, parámetro de filtro y YAML válido.',
            }),
            hintsJson: JSON.stringify([
              'Define primero el schema Task en components/schemas con todos los campos (id, title, description, status, createdAt). Luego úsalo con $ref en los paths.',
              'Recuerda los códigos correctos: GET→200, POST→201, DELETE→204, recurso no encontrado→404.',
              'El filtro de listado va como parámetro "in: query". Puedes restringir los valores válidos con "enum: [pending, done]".',
            ]),
          },
        ],
      },

      // ═══════════════════════════════════════════════════════════════════════
      // LECCIÓN 2 — Versionado y Compatibilidad (10 ejercicios)
      // ═══════════════════════════════════════════════════════════════════════
      {
        lesson: {
          title: 'Versionado y Compatibilidad',
          order: 2,
          type: 'exercise_set',
          contentMd: `
# Versionado y Compatibilidad de APIs

Una API en producción es usada por clientes reales. Cambiarla sin cuidado puede romper
esas integraciones. El **versionado** permite evolucionar la API sin romper a los clientes existentes.

## Estrategias de versionado

### 1. Versionado en URL (más común)
\`\`\`
GET /api/v1/users
GET /api/v2/users
\`\`\`
- Ventaja: visible, fácil de usar, cacheable
- Desventaja: contamina la URL con metadata

### 2. Versionado por header
\`\`\`
GET /api/users
Accept-Version: 2
\`\`\`
- Ventaja: URL limpia
- Desventaja: menos visible, más difícil de probar en el navegador

### 3. Versionado por media type
\`\`\`
Accept: application/vnd.miapp.v2+json
\`\`\`

## Breaking Changes vs. Non-Breaking Changes

Un **breaking change** rompe a los clientes existentes:
- Eliminar un campo de la respuesta
- Cambiar el tipo de un campo (string → number)
- Cambiar el nombre de un endpoint
- Hacer obligatorio un campo que era opcional
- Cambiar el código de respuesta de éxito

Un **non-breaking change** no rompe a los clientes:
- Añadir un campo nuevo a la respuesta
- Añadir un endpoint nuevo
- Hacer opcional un campo que era requerido
- Añadir un parámetro query opcional

## Header Sunset: deprecación con fecha

\`\`\`
HTTP/1.1 200 OK
Sunset: Sat, 31 Dec 2025 23:59:59 GMT
Deprecation: true
Link: <https://api.ejemplo.com/v2/users>; rel="successor-version"
\`\`\`

## Middleware de versionado en Express

\`\`\`javascript
function versionMiddleware(req, res, next) {
  const version = req.headers['accept-version'] ||
                  req.path.match(/\\/v(\\d+)\\//)?.[1] ||
                  '1';
  req.apiVersion = parseInt(version, 10);
  next();
}
\`\`\`
      `,
        },
        exercises: [
          // 1. Quiz — versionado URL vs header
          {
            order: 1,
            type: 'quiz',
            difficulty: 'medium',
            points: 10,
            prompt: '¿Cuál es la principal ventaja del versionado en URL (/api/v2/users) sobre el versionado por header?',
            starterCode: null,
            solution: 'a',
            validationLogic: JSON.stringify({
              type: 'exact_match',
              answer: 'a',
              options: [
                { key: 'a', text: 'Es visible, fácil de probar en el navegador y las respuestas son cacheables por proxies' },
                { key: 'b', text: 'Mantiene las URLs más limpias y semánticamente correctas' },
                { key: 'c', text: 'Es el único método aceptado por el estándar REST' },
                { key: 'd', text: 'Permite usar más de una versión en la misma petición' },
              ],
              explanation: 'El versionado en URL es visible (puedes verlo en el navegador), fácil de compartir y probar, y compatible con proxies de caché. La contra es que técnicamente "contamina" la URL con información de versión que no es parte del recurso.',
            }),
            hintsJson: JSON.stringify([
              'Piensa en qué pasa cuando copias y pegas la URL de una API v2 en el navegador o en Postman.',
              'Los proxies HTTP cachean por URL. Si la versión está en la URL, dos versiones diferentes son URLs diferentes.',
              'La respuesta correcta menciona visibilidad, facilidad de uso y caché.',
            ]),
          },
          // 2. Quiz — breaking change
          {
            order: 2,
            type: 'quiz',
            difficulty: 'medium',
            points: 10,
            prompt: '¿Cuál de estos cambios en una API es un BREAKING CHANGE que rompería a los clientes existentes?',
            starterCode: null,
            solution: 'c',
            validationLogic: JSON.stringify({
              type: 'exact_match',
              answer: 'c',
              options: [
                { key: 'a', text: 'Añadir un campo "nickname" opcional a la respuesta de GET /users/{id}' },
                { key: 'b', text: 'Crear un nuevo endpoint GET /users/{id}/stats' },
                { key: 'c', text: 'Renombrar el campo "name" a "fullName" en la respuesta de GET /users/{id}' },
                { key: 'd', text: 'Añadir un parámetro query opcional ?format=json' },
              ],
              explanation: 'Renombrar "name" a "fullName" rompe a todos los clientes que accedan a response.name (obtendrían undefined). Añadir campos opcionales, nuevos endpoints o parámetros opcionales no rompe a los clientes existentes.',
            }),
            hintsJson: JSON.stringify([
              'Un breaking change es cualquier cambio que hace que el código de un cliente existente deje de funcionar correctamente.',
              'Añadir es generalmente seguro. Eliminar o renombrar es generalmente un breaking change.',
              'Si un cliente hace response.name y tú renombras ese campo, el cliente recibirá undefined.',
            ]),
          },
          // 3. Observe — identificar breaking changes entre v1 y v2
          {
            order: 3,
            type: 'observe',
            difficulty: 'medium',
            points: 10,
            prompt: `Compara las respuestas de v1 y v2 de esta API e identifica todos los breaking changes:

**GET /api/v1/users/42** devuelve:
\`\`\`json
{
  "id": 42,
  "name": "Ana García",
  "email": "ana@ejemplo.com",
  "age": 28,
  "created_at": "2024-01-15"
}
\`\`\`

**GET /api/v2/users/42** devuelve:
\`\`\`json
{
  "id": "usr_42",
  "fullName": "Ana García",
  "contact": {
    "email": "ana@ejemplo.com"
  },
  "createdAt": "2024-01-15T00:00:00Z"
}
\`\`\`

¿Cuántos breaking changes hay? Lista cada uno con su impacto.`,
            starterCode: null,
            solution: 'Hay 5 breaking changes:\n1. id cambió de number (42) a string ("usr_42"): rompe comparaciones con === y código que espera un número.\n2. name fue renombrado a fullName: todo acceso a response.name devuelve undefined.\n3. email fue movido dentro de contact.email: acceder a response.email ya no funciona.\n4. age fue eliminado: cualquier código que use response.age obtiene undefined.\n5. created_at fue renombrado a createdAt (snake_case → camelCase): acceder a response.created_at falla.',
            validationLogic: JSON.stringify({
              type: 'includes_keywords',
              keywords: ['id', 'fullName', 'contact', 'age', 'createdAt', '5'],
              caseSensitive: false,
              explanation: 'Los 5 breaking changes son: tipo de id (number→string), name→fullName, email movido a contact.email, age eliminado, created_at→createdAt.',
            }),
            hintsJson: JSON.stringify([
              'Compara campo por campo. ¿Hay algún campo que desaparece? ¿Alguno que cambia de nombre? ¿Alguno que cambia de tipo o de posición?',
              'No olvides comparar los tipos: en v1 el id es el número 42, en v2 es el string "usr_42".',
              'Los cambios son: tipo de id, name→fullName, email anidado en contact, age eliminado, created_at→createdAt. Son 5 en total.',
            ]),
          },
          // 4. Observe — analizar estrategia de deprecación con headers Sunset
          {
            order: 4,
            type: 'observe',
            difficulty: 'medium',
            points: 10,
            prompt: `Analiza esta respuesta de una API y responde las preguntas sobre su estrategia de deprecación:

\`\`\`
HTTP/1.1 200 OK
Content-Type: application/json
Sunset: Thu, 01 Jan 2026 00:00:00 GMT
Deprecation: true
Link: <https://api.ejemplo.com/v2/products>; rel="successor-version"
Warning: 299 - "Esta versión de la API será desactivada el 1 de enero de 2026"
\`\`\`

1. ¿Qué le indica el header \`Sunset\` a los clientes que consumen esta API?
2. ¿Qué deben hacer los desarrolladores que reciben esta respuesta?
3. ¿Cómo deberías manejar estos headers en un cliente HTTP robusto?`,
            starterCode: null,
            solution: '1. El header Sunset indica la fecha exacta en que este endpoint/versión dejará de funcionar: el 1 de enero de 2026. Después de esa fecha, el servidor puede devolver 410 Gone u otro error.\n2. Los desarrolladores deben: (a) registrar una alerta para antes de esa fecha, (b) migrar al endpoint indicado en el header Link (https://api.ejemplo.com/v2/products), (c) actualizar su código antes de la fecha límite.\n3. Un cliente robusto debe: detectar el header Deprecation: true, registrar un warning con la fecha de Sunset, seguir el link del header Link para conocer el sucesor, y posiblemente notificar al equipo automáticamente.',
            validationLogic: JSON.stringify({
              type: 'includes_keywords',
              keywords: ['2026', 'migrar', 'Link', 'warning', 'deprecation'],
              caseSensitive: false,
              explanation: 'Sunset indica la fecha de desactivación (2026). Los clientes deben migrar a la URL del header Link. Un cliente robusto detecta Deprecation y registra avisos.',
            }),
            hintsJson: JSON.stringify([
              'Sunset es un header RFC estándar que indica cuándo un recurso dejará de estar disponible.',
              'El header Link con rel="successor-version" apunta a la nueva versión a la que migrar.',
              'Un buen cliente HTTP no ignora los headers de deprecación: los registra como warnings para que el equipo actúe.',
            ]),
          },
          // 5. Fill blank — completar middleware de versionado
          {
            order: 5,
            type: 'fill_blank',
            difficulty: 'medium',
            points: 15,
            prompt: `Completa este middleware Express que extrae la versión de la API desde la URL o desde el header \`Accept-Version\`:

\`\`\`javascript
function middlewareVersionado(req, res, next) {
  // Intentar extraer versión de la URL: /api/v2/...
  const versionEnUrl = req.path.match(___)?.[1];  // regex para capturar el número tras /v

  // Si no está en la URL, buscar en el header
  const versionEnHeader = req.headers[___];  // nombre del header en minúsculas

  const versionStr = versionEnUrl || versionEnHeader || '1';
  const version = ___(versionStr, 10);  // convertir a número entero

  if (___(version)) {  // comprobar que es un número válido
    return res.status(400).json({ error: 'Versión de API inválida' });
  }

  req.apiVersion = version;
  next();
}
\`\`\``,
            starterCode: `function middlewareVersionado(req, res, next) {
  const versionEnUrl = req.path.match(___)?.[1];

  const versionEnHeader = req.headers[___];

  const versionStr = versionEnUrl || versionEnHeader || '1';
  const version = ___(versionStr, 10);

  if (___(version)) {
    return res.status(400).json({ error: 'Versión de API inválida' });
  }

  req.apiVersion = version;
  next();
}`,
            solution: `function middlewareVersionado(req, res, next) {
  const versionEnUrl = req.path.match(/\\/v(\\d+)\\//)?.[1];

  const versionEnHeader = req.headers['accept-version'];

  const versionStr = versionEnUrl || versionEnHeader || '1';
  const version = parseInt(versionStr, 10);

  if (isNaN(version)) {
    return res.status(400).json({ error: 'Versión de API inválida' });
  }

  req.apiVersion = version;
  next();
}`,
            validationLogic: JSON.stringify({
              type: 'includes_keywords',
              keywords: ['/v(\\d+)/', 'accept-version', 'parseInt', 'isNaN'],
              caseSensitive: false,
              explanation: 'La regex es /\\/v(\\d+)\\//, el header es "accept-version", la conversión es parseInt(str, 10), y la comprobación es isNaN(version).',
            }),
            hintsJson: JSON.stringify([
              'Para capturar el número en /api/v2/users, usa una regex con grupo de captura: /\\/v(\\d+)\\//. El ?.[1] accede al primer grupo capturado.',
              'Los nombres de headers HTTP se normalizan a minúsculas en Express. El header es "Accept-Version" pero se accede como "accept-version".',
              'Usa parseInt(str, 10) para convertir a número entero. Si la conversión falla, parseInt devuelve NaN, que puedes detectar con isNaN().',
            ]),
          },
          // 6. Fill blank — completar header Accept-Version
          {
            order: 6,
            type: 'fill_blank',
            difficulty: 'medium',
            points: 15,
            prompt: `Completa este cliente JavaScript que usa versionado por header para consumir la API:

\`\`\`javascript
class ClienteAPI {
  constructor(baseUrl, version = 1) {
    this.baseUrl = baseUrl;
    this.version = version;
  }

  async peticion(metodo, ruta, body = null) {
    const headers = {
      'Content-Type': 'application/json',
      '___': String(this.version),  // header de versión
    };

    const opciones = {
      method: ___,
      headers,
    };

    if (body && ['POST', 'PUT', '___'].includes(metodo)) {
      opciones.body = ___;
    }

    const res = await fetch(this.baseUrl + ruta, opciones);

    if (res.status === ___) {  // versión no soportada
      throw new Error(\`La versión \${this.version} de la API ya no está soportada\`);
    }

    return res.json();
  }
}
\`\`\``,
            starterCode: `class ClienteAPI {
  constructor(baseUrl, version = 1) {
    this.baseUrl = baseUrl;
    this.version = version;
  }

  async peticion(metodo, ruta, body = null) {
    const headers = {
      'Content-Type': 'application/json',
      '___': String(this.version),
    };

    const opciones = {
      method: ___,
      headers,
    };

    if (body && ['POST', 'PUT', '___'].includes(metodo)) {
      opciones.body = ___;
    }

    const res = await fetch(this.baseUrl + ruta, opciones);

    if (res.status === ___) {
      throw new Error(\`La versión \${this.version} de la API ya no está soportada\`);
    }

    return res.json();
  }
}`,
            solution: `class ClienteAPI {
  constructor(baseUrl, version = 1) {
    this.baseUrl = baseUrl;
    this.version = version;
  }

  async peticion(metodo, ruta, body = null) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept-Version': String(this.version),
    };

    const opciones = {
      method: metodo,
      headers,
    };

    if (body && ['POST', 'PUT', 'PATCH'].includes(metodo)) {
      opciones.body = JSON.stringify(body);
    }

    const res = await fetch(this.baseUrl + ruta, opciones);

    if (res.status === 410) {
      throw new Error(\`La versión \${this.version} de la API ya no está soportada\`);
    }

    return res.json();
  }
}`,
            validationLogic: JSON.stringify({
              type: 'includes_keywords',
              keywords: ['Accept-Version', 'metodo', 'PATCH', 'JSON.stringify', '410'],
              caseSensitive: false,
              explanation: 'El header es Accept-Version, el método viene de la variable metodo, se añade PATCH al array, el body se serializa con JSON.stringify, y 410 Gone indica versión obsoleta.',
            }),
            hintsJson: JSON.stringify([
              'El header de versión convencional es "Accept-Version". Su valor es el número de versión como string.',
              'PATCH es el tercer método HTTP que envía body, junto a POST y PUT.',
              '410 Gone es el código que indica que un recurso existió pero ya no está disponible — perfecto para versiones deprecadas.',
            ]),
          },
          // 7. Fill blank — completar manejo de versión deprecada
          {
            order: 7,
            type: 'fill_blank',
            difficulty: 'hard',
            points: 15,
            prompt: `Completa este middleware Express que detecta si el cliente usa una versión deprecada y añade los headers de advertencia apropiados:

\`\`\`javascript
const VERSIONES_DEPRECADAS = {
  1: { sunsetDate: '2025-06-01', successorUrl: 'https://api.ejemplo.com/v2' },
};

function advertenciaDeprecacion(req, res, next) {
  const version = req.apiVersion; // ya extraído por middlewareVersionado

  if (VERSIONES_DEPRECADAS[___]) {
    const info = VERSIONES_DEPRECADAS[version];
    const fechaSunset = new Date(info.sunsetDate);

    // Añadir headers de deprecación
    res.set('___', 'true');   // indica que está deprecado
    res.set('___', fechaSunset.toUTCString());  // fecha de desactivación
    res.set('Link', \`<\${info.___}>; rel="successor-version"\`);  // URL del sucesor

    // Si ya pasó la fecha de sunset, rechazar con 410
    if (new Date() > ___) {
      return res.status(___).json({
        error: 'Esta versión de la API ha sido desactivada',
        migrarA: info.successorUrl,
      });
    }
  }

  next();
}
\`\`\``,
            starterCode: `const VERSIONES_DEPRECADAS = {
  1: { sunsetDate: '2025-06-01', successorUrl: 'https://api.ejemplo.com/v2' },
};

function advertenciaDeprecacion(req, res, next) {
  const version = req.apiVersion;

  if (VERSIONES_DEPRECADAS[___]) {
    const info = VERSIONES_DEPRECADAS[version];
    const fechaSunset = new Date(info.sunsetDate);

    res.set('___', 'true');
    res.set('___', fechaSunset.toUTCString());
    res.set('Link', \`<\${info.___}>; rel="successor-version"\`);

    if (new Date() > ___) {
      return res.status(___).json({
        error: 'Esta versión de la API ha sido desactivada',
        migrarA: info.successorUrl,
      });
    }
  }

  next();
}`,
            solution: `const VERSIONES_DEPRECADAS = {
  1: { sunsetDate: '2025-06-01', successorUrl: 'https://api.ejemplo.com/v2' },
};

function advertenciaDeprecacion(req, res, next) {
  const version = req.apiVersion;

  if (VERSIONES_DEPRECADAS[version]) {
    const info = VERSIONES_DEPRECADAS[version];
    const fechaSunset = new Date(info.sunsetDate);

    res.set('Deprecation', 'true');
    res.set('Sunset', fechaSunset.toUTCString());
    res.set('Link', \`<\${info.successorUrl}>; rel="successor-version"\`);

    if (new Date() > fechaSunset) {
      return res.status(410).json({
        error: 'Esta versión de la API ha sido desactivada',
        migrarA: info.successorUrl,
      });
    }
  }

  next();
}`,
            validationLogic: JSON.stringify({
              type: 'includes_keywords',
              keywords: ['version', 'Deprecation', 'Sunset', 'successorUrl', 'fechaSunset', '410'],
              caseSensitive: false,
              explanation: 'Los huecos son: version (para el lookup), "Deprecation", "Sunset", info.successorUrl, fechaSunset (para comparar), y 410 (Gone).',
            }),
            hintsJson: JSON.stringify([
              'La condición del if debe usar la variable "version" (no "req.apiVersion" de nuevo) para hacer el lookup en VERSIONES_DEPRECADAS.',
              'Los headers estándar son "Deprecation" y "Sunset". No los inventes: son RFC estándar.',
              'Si la fecha actual (new Date()) es mayor que fechaSunset, la versión expiró y debes responder 410 Gone.',
            ]),
          },
          // 8. Build — función que detecta breaking changes comparando schemas
          {
            order: 8,
            type: 'build',
            difficulty: 'hard',
            points: 20,
            prompt: `Escribe una función \`detectarBreakingChanges(schemaV1, schemaV2)\` que compare dos schemas OpenAPI y devuelva un array con todos los breaking changes detectados.

Debe detectar:
1. Campos eliminados de \`properties\`
2. Cambios de tipo en campos existentes
3. Nuevos campos añadidos a \`required\` que no estaban antes

Ejemplo:
\`\`\`javascript
const v1 = {
  required: ['id', 'name'],
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    age: { type: 'integer' }
  }
};

const v2 = {
  required: ['id', 'name', 'email'],
  properties: {
    id: { type: 'string' }, // tipo cambiado!
    name: { type: 'string' },
    email: { type: 'string' } // age eliminado, email nuevo obligatorio
  }
};

detectarBreakingChanges(v1, v2);
// Devuelve:
// [
//   { tipo: 'campo_eliminado', campo: 'age' },
//   { tipo: 'tipo_cambiado', campo: 'id', de: 'integer', a: 'string' },
//   { tipo: 'nuevo_required', campo: 'email' }
// ]
\`\`\``,
            starterCode: `function detectarBreakingChanges(schemaV1, schemaV2) {
  const cambios = [];
  const propsV1 = schemaV1.properties || {};
  const propsV2 = schemaV2.properties || {};
  const reqV1 = new Set(schemaV1.required || []);
  const reqV2 = new Set(schemaV2.required || []);

  // 1. Detectar campos eliminados y cambios de tipo

  // 2. Detectar nuevos campos required

  return cambios;
}`,
            solution: `function detectarBreakingChanges(schemaV1, schemaV2) {
  const cambios = [];
  const propsV1 = schemaV1.properties || {};
  const propsV2 = schemaV2.properties || {};
  const reqV1 = new Set(schemaV1.required || []);
  const reqV2 = new Set(schemaV2.required || []);

  // 1. Detectar campos eliminados y cambios de tipo
  for (const [campo, definicion] of Object.entries(propsV1)) {
    if (!propsV2[campo]) {
      cambios.push({ tipo: 'campo_eliminado', campo });
    } else if (propsV2[campo].type !== definicion.type) {
      cambios.push({
        tipo: 'tipo_cambiado',
        campo,
        de: definicion.type,
        a: propsV2[campo].type,
      });
    }
  }

  // 2. Detectar nuevos campos required
  for (const campo of reqV2) {
    if (!reqV1.has(campo)) {
      cambios.push({ tipo: 'nuevo_required', campo });
    }
  }

  return cambios;
}`,
            validationLogic: JSON.stringify({
              type: 'includes_keywords',
              keywords: ['campo_eliminado', 'tipo_cambiado', 'nuevo_required', 'propsV1', 'reqV1', 'reqV2'],
              caseSensitive: false,
              explanation: 'La función debe iterar propsV1 para detectar campos eliminados y tipos cambiados, y comparar reqV1 con reqV2 para detectar nuevos required.',
            }),
            hintsJson: JSON.stringify([
              'Para detectar campos eliminados, itera las propiedades de V1 y comprueba si existen en V2 con propsV2[campo].',
              'Para detectar cambios de tipo, compara propsV1[campo].type con propsV2[campo].type.',
              'Para detectar nuevos required, itera reqV2 y comprueba con reqV1.has(campo) si ya era required antes.',
            ]),
          },
          // 9. Build — cliente que maneja múltiples versiones
          {
            order: 9,
            type: 'build',
            difficulty: 'hard',
            points: 20,
            prompt: `Escribe una clase \`ClienteMultiVersion\` que gestione la migración automática entre versiones de una API. El cliente debe:

1. Intentar la petición con la versión preferida
2. Si recibe 410 Gone, intentar automáticamente con la versión anterior
3. Si recibe el header \`Link\` con \`rel="successor-version"\`, actualizar la URL base
4. Mantener un log de las versiones intentadas

\`\`\`javascript
const cliente = new ClienteMultiVersion('https://api.ejemplo.com', 2);
const datos = await cliente.get('/users');
// Intenta v2. Si devuelve 410, intenta v1 automáticamente.
console.log(cliente.versionUsada); // la versión que funcionó
console.log(cliente.migrationLog); // historial de intentos
\`\`\``,
            starterCode: `class ClienteMultiVersion {
  constructor(baseUrl, versionPreferida = 1) {
    this.baseUrl = baseUrl;
    this.versionPreferida = versionPreferida;
    this.versionUsada = null;
    this.migrationLog = [];
  }

  async get(ruta) {
    // Intentar desde la versión preferida hasta la 1
    for (let v = this.versionPreferida; v >= 1; v--) {
      // Tu implementación aquí
    }
    throw new Error('Ninguna versión disponible');
  }
}`,
            solution: `class ClienteMultiVersion {
  constructor(baseUrl, versionPreferida = 1) {
    this.baseUrl = baseUrl;
    this.versionPreferida = versionPreferida;
    this.versionUsada = null;
    this.migrationLog = [];
  }

  async get(ruta) {
    for (let v = this.versionPreferida; v >= 1; v--) {
      this.migrationLog.push({ version: v, timestamp: new Date().toISOString() });

      const res = await fetch(this.baseUrl + ruta, {
        headers: {
          'Accept-Version': String(v),
          'Content-Type': 'application/json',
        },
      });

      // Si hay header Link con successor-version, actualizar baseUrl
      const linkHeader = res.headers.get('Link');
      if (linkHeader) {
        const match = linkHeader.match(/<([^>]+)>;\s*rel="successor-version"/);
        if (match) {
          const successorUrl = new URL(match[1]);
          this.baseUrl = successorUrl.origin;
        }
      }

      if (res.status === 410) {
        this.migrationLog[this.migrationLog.length - 1].resultado = 'deprecada_410';
        continue; // intentar versión anterior
      }

      if (res.ok) {
        this.versionUsada = v;
        this.migrationLog[this.migrationLog.length - 1].resultado = 'ok';
        return res.json();
      }

      throw new Error(\`HTTP \${res.status}: \${res.statusText}\`);
    }
    throw new Error('Ninguna versión disponible');
  }
}`,
            validationLogic: JSON.stringify({
              type: 'includes_keywords',
              keywords: ['migrationLog', 'Accept-Version', '410', 'versionUsada', 'continue'],
              caseSensitive: false,
              explanation: 'El cliente debe registrar intentos en migrationLog, enviar Accept-Version, detectar 410 y continuar al siguiente, y guardar la versión exitosa en versionUsada.',
            }),
            hintsJson: JSON.stringify([
              'El bucle for debe ir de versionPreferida hasta 1 (decreciente). Usa "continue" para saltar al siguiente cuando recibes 410.',
              'Para leer el header Link de la respuesta fetch, usa res.headers.get("Link"). Luego extrae la URL con una regex.',
              'Guarda versionUsada solo cuando la respuesta es exitosa (res.ok). Añade cada intento a migrationLog con su resultado.',
            ]),
          },
          // 10. Challenge — plan de migración v1 → v2
          {
            order: 10,
            type: 'challenge',
            difficulty: 'hard',
            points: 30,
            prompt: `RETO FINAL: Diseña e implementa un plan de migración completo de v1 a v2 de una API REST.

La API actual (v1) tiene este endpoint:
\`\`\`
GET /api/v1/users/{id}
Respuesta: { "id": 42, "name": "Ana", "email": "ana@ejemplo.com", "created_at": "2024-01-15" }
\`\`\`

La nueva versión (v2) tendrá:
\`\`\`
GET /api/v2/users/{id}
Respuesta: { "id": "usr_42", "fullName": "Ana", "contact": { "email": "ana@ejemplo.com" }, "createdAt": "2024-01-15T00:00:00Z" }
\`\`\`

Tu plan debe incluir:
1. Código del router Express que sirve ambas versiones simultáneamente
2. Función transformadora que convierte datos de formato v1 a v2
3. Middleware que añade headers Deprecation y Sunset a las respuestas v1
4. Estrategia de comunicación a los clientes (qué headers y mensajes incluir)
5. Criterios para decidir cuándo desactivar definitivamente v1`,
            starterCode: `// Plan de migración v1 → v2
// Implementa los 5 puntos del reto

const express = require('express');
const router = express.Router();

// 1. Datos simulados
const usuarios = [
  { id: 42, name: 'Ana', email: 'ana@ejemplo.com', created_at: '2024-01-15' }
];

// 2. Función transformadora
function transformarV1aV2(usuarioV1) {
  // Tu implementación aquí
}

// 3. Middleware de deprecación
function deprecacionV1(req, res, next) {
  // Tu implementación aquí
}

// 4. Rutas
// Tu implementación aquí

module.exports = router;`,
            solution: `// Plan de migración v1 → v2

const express = require('express');
const router = express.Router();

// 1. Datos simulados
const usuarios = [
  { id: 42, name: 'Ana', email: 'ana@ejemplo.com', created_at: '2024-01-15' }
];

// 2. Función transformadora: convierte formato v1 a v2
function transformarV1aV2(usuarioV1) {
  return {
    id: \`usr_\${usuarioV1.id}\`,
    fullName: usuarioV1.name,
    contact: {
      email: usuarioV1.email,
    },
    createdAt: new Date(usuarioV1.created_at).toISOString(),
  };
}

// 3. Middleware que añade headers de deprecación a respuestas v1
function deprecacionV1(req, res, next) {
  const SUNSET_DATE = new Date('2026-01-01T00:00:00Z');

  res.set('Deprecation', 'true');
  res.set('Sunset', SUNSET_DATE.toUTCString());
  res.set('Link', '<https://api.ejemplo.com/api/v2/users>; rel="successor-version"');
  res.set('Warning', '299 - "La v1 de esta API será desactivada el 1 de enero de 2026. Migra a /api/v2/"');

  // Si ya pasó la fecha de sunset, devolver 410
  if (new Date() > SUNSET_DATE) {
    return res.status(410).json({
      error: 'La versión 1 de esta API ha sido desactivada.',
      migrarA: 'https://api.ejemplo.com/api/v2/',
    });
  }

  next();
}

// 4. Rutas v1 (deprecada) y v2 (actual)
router.get('/api/v1/users/:id', deprecacionV1, (req, res) => {
  const usuario = usuarios.find(u => u.id === parseInt(req.params.id, 10));
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(usuario); // devuelve formato v1 original
});

router.get('/api/v2/users/:id', (req, res) => {
  const usuario = usuarios.find(u => u.id === parseInt(req.params.id, 10));
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(transformarV1aV2(usuario)); // devuelve formato v2
});

// 5. Criterios para desactivar v1 (como comentario documentado):
// - Cuando menos del 1% del tráfico total use la v1
// - Al menos 6 meses después de anunciar la deprecación
// - Todos los clientes principales hayan confirmado la migración
// - Monitorización durante 30 días sin alertas críticas en v2

module.exports = router;`,
            validationLogic: JSON.stringify({
              type: 'minimum_length',
              minLength: 150,
              explanation: 'El plan debe incluir: función transformadora v1→v2, middleware con headers Deprecation/Sunset/Link, rutas para ambas versiones y criterios de desactivación.',
            }),
            hintsJson: JSON.stringify([
              'La función transformadora debe mapear cada campo de v1 a su equivalente en v2: id→"usr_"+id, name→fullName, email→contact.email, created_at→createdAt con toISOString().',
              'El middleware de deprecación debe añadir los headers Deprecation, Sunset, Link y Warning antes de llamar a next(). Si ya expiró, devuelve 410.',
              'Para los criterios de desactivación, piensa en métricas reales: porcentaje de tráfico, tiempo desde el anuncio, confirmaciones de clientes.',
            ]),
          },
        ],
      },

      // ═══════════════════════════════════════════════════════════════════════
      // LECCIÓN 3 — Seguridad Avanzada y Buenas Prácticas (10 ejercicios)
      // ═══════════════════════════════════════════════════════════════════════
      {
        lesson: {
          title: 'Seguridad Avanzada y Buenas Prácticas',
          order: 3,
          type: 'exercise_set',
          contentMd: `
# Seguridad Avanzada y Buenas Prácticas

Llevar una API a producción implica mucho más que hacer que funcione.
Debes protegerla contra ataques reales, configurar correctamente los headers HTTP de seguridad
y aplicar el principio de defensa en profundidad.

## Headers de seguridad HTTP

Los headers de seguridad son la primera línea de defensa. Helmet.js los configura automáticamente:

\`\`\`javascript
const helmet = require('helmet');
app.use(helmet());
\`\`\`

Los más importantes:

| Header | Propósito |
|--------|-----------|
| \`X-Frame-Options: DENY\` | Previene clickjacking (iframes maliciosos) |
| \`X-Content-Type-Options: nosniff\` | Previene MIME sniffing |
| \`Strict-Transport-Security\` | Fuerza HTTPS (HSTS) |
| \`Content-Security-Policy\` | Controla qué recursos puede cargar la página |
| \`X-XSS-Protection: 1; mode=block\` | Activa filtro XSS del navegador (legacy) |

## CORS Preflight

Cuando una aplicación web hace una petición "compleja" (PUT, DELETE, o con headers custom),
el navegador primero envía una petición **OPTIONS** para preguntar al servidor si está permitida.
Esto se llama **preflight**.

\`\`\`
OPTIONS /api/users HTTP/1.1
Origin: https://app.ejemplo.com
Access-Control-Request-Method: DELETE
Access-Control-Request-Headers: Authorization
\`\`\`

El servidor debe responder:
\`\`\`
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://app.ejemplo.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Authorization, Content-Type
\`\`\`

## SSRF: Server-Side Request Forgery

SSRF ocurre cuando un atacante consigue que tu servidor haga peticiones HTTP a URLs
que él controla, incluyendo servicios internos.

\`\`\`javascript
// ❌ VULNERABLE: acepta cualquier URL del cliente
app.post('/fetch-url', async (req, res) => {
  const data = await fetch(req.body.url); // puede ser http://localhost:6379 (Redis!)
  res.json(await data.json());
});

// ✅ SEGURO: valida la URL antes de hacer la petición
app.post('/fetch-url', async (req, res) => {
  const url = new URL(req.body.url);
  const IP_PRIVADAS = ['127.0.0.1', '::1', '10.', '192.168.', '172.16.'];
  if (IP_PRIVADAS.some(ip => url.hostname.startsWith(ip))) {
    return res.status(400).json({ error: 'URL no permitida' });
  }
  // proceder con seguridad
});
\`\`\`

## Content Security Policy (CSP)

\`\`\`javascript
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", 'cdn.ejemplo.com'],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'", 'api.ejemplo.com'],
    frameSrc: ["'none'"],
  }
}));
\`\`\`
      `,
        },
        exercises: [
          // 1. Quiz — header que previene clickjacking
          {
            order: 1,
            type: 'quiz',
            difficulty: 'medium',
            points: 10,
            prompt: '¿Qué header HTTP previene los ataques de clickjacking impidiendo que tu página sea cargada dentro de un iframe en otro sitio?',
            starterCode: null,
            solution: 'b',
            validationLogic: JSON.stringify({
              type: 'exact_match',
              answer: 'b',
              options: [
                { key: 'a', text: 'Content-Security-Policy' },
                { key: 'b', text: 'X-Frame-Options' },
                { key: 'c', text: 'Strict-Transport-Security' },
                { key: 'd', text: 'X-Content-Type-Options' },
              ],
              explanation: 'X-Frame-Options con valor DENY o SAMEORIGIN impide que la página sea embebida en iframes de otros dominios, previniendo el clickjacking. CSP también puede controlarlo con la directiva frame-ancestors, pero X-Frame-Options es el header específico para ello.',
            }),
            hintsJson: JSON.stringify([
              'Clickjacking = "secuestro de clic". El atacante pone tu página en un iframe invisible sobre un botón trampa.',
              'El header tiene "Frame" en su nombre, lo que da una pista clara de su propósito.',
              'El header es X-Frame-Options. Sus valores son DENY (nunca en iframe) o SAMEORIGIN (solo en iframes del mismo origen).',
            ]),
          },
          // 2. Quiz — CORS preflight
          {
            order: 2,
            type: 'quiz',
            difficulty: 'medium',
            points: 10,
            prompt: '¿Qué es una petición CORS "preflight" y cuándo la envía el navegador?',
            starterCode: null,
            solution: 'd',
            validationLogic: JSON.stringify({
              type: 'exact_match',
              answer: 'd',
              options: [
                { key: 'a', text: 'Una petición GET que el navegador envía antes de cualquier petición cross-origin' },
                { key: 'b', text: 'Una petición de autenticación previa que verifica el JWT antes de la petición real' },
                { key: 'c', text: 'Una petición que el servidor envía al cliente para autorizar la conexión' },
                { key: 'd', text: 'Una petición OPTIONS que el navegador envía automáticamente antes de peticiones "complejas" cross-origin' },
              ],
              explanation: 'El preflight es una petición OPTIONS que el navegador envía automáticamente antes de peticiones cross-origin que usan métodos no simples (PUT, DELETE, PATCH) o headers no estándar. El servidor debe responder indicando qué está permitido.',
            }),
            hintsJson: JSON.stringify([
              'El método HTTP usado en el preflight es OPTIONS, no GET ni POST.',
              '"Pre-flight" significa "antes del vuelo" — es una comprobación previa antes de la petición real.',
              'Solo se envía para peticiones "complejas": métodos como PUT/DELETE o headers custom como Authorization.',
            ]),
          },
          // 3. Observe — auditar API con headers de seguridad faltantes
          {
            order: 3,
            type: 'observe',
            difficulty: 'medium',
            points: 10,
            prompt: `Audita esta respuesta de una API en producción e identifica qué headers de seguridad faltan y qué riesgos representa cada ausencia:

\`\`\`
HTTP/1.1 200 OK
Content-Type: application/json
Server: Express 4.18.2
X-Powered-By: Express
Access-Control-Allow-Origin: *
\`\`\`

Analiza:
1. ¿Qué información expone esta respuesta que no debería?
2. ¿Qué problema tiene el header Access-Control-Allow-Origin?
3. Lista al menos 4 headers de seguridad que faltan y el riesgo de cada uno.`,
            starterCode: null,
            solution: '1. Expone información peligrosa: el header "Server" revela que usa Express 4.18.2 (versión exacta del framework, útil para atacantes que buscan CVEs), y "X-Powered-By" también revela el stack tecnológico.\n2. Access-Control-Allow-Origin: * permite que CUALQUIER sitio web haga peticiones a esta API desde el navegador del usuario, incluyendo sitios maliciosos. Nunca debe usarse * en producción con endpoints autenticados.\n3. Headers faltantes:\n- X-Frame-Options: sin él, la API puede ser embebida en iframes (clickjacking)\n- X-Content-Type-Options: sin él, el navegador puede interpretar respuestas como un tipo MIME diferente (MIME sniffing)\n- Strict-Transport-Security: sin él, las conexiones pueden degradarse de HTTPS a HTTP\n- Content-Security-Policy: sin él, no hay control sobre qué recursos puede cargar el cliente',
            validationLogic: JSON.stringify({
              type: 'includes_keywords',
              keywords: ['Server', 'X-Powered-By', 'Access-Control-Allow-Origin', 'X-Frame-Options', 'Strict-Transport-Security', 'Content-Security-Policy'],
              caseSensitive: false,
              explanation: 'La respuesta expone versión del servidor (Server y X-Powered-By). CORS con * es peligroso. Faltan X-Frame-Options, X-Content-Type-Options, HSTS y CSP.',
            }),
            hintsJson: JSON.stringify([
              'Mira cada header presente y pregúntate: ¿debería un atacante saber esto? Server y X-Powered-By revelan el stack.',
              'Access-Control-Allow-Origin: * significa "cualquier sitio puede leer mis respuestas desde el navegador del usuario". ¿Es eso lo que quieres?',
              'Piensa en los ataques que previene cada header: clickjacking (X-Frame-Options), MIME sniffing (X-Content-Type-Options), downgrade a HTTP (HSTS), inyección de recursos (CSP).',
            ]),
          },
          // 4. Observe — analizar ataque SSRF
          {
            order: 4,
            type: 'observe',
            difficulty: 'hard',
            points: 10,
            prompt: `Analiza este escenario de ataque SSRF y responde las preguntas:

Una API tiene este endpoint para obtener metadatos de una URL:
\`\`\`javascript
app.post('/api/preview', async (req, res) => {
  const { url } = req.body;
  const response = await fetch(url);
  const html = await response.text();
  // extrae título y descripción del HTML
  res.json({ title: extraerTitulo(html), description: extraerDescripcion(html) });
});
\`\`\`

Un atacante envía estas peticiones:
\`\`\`
POST /api/preview
{ "url": "http://169.254.169.254/latest/meta-data/iam/credentials" }

POST /api/preview
{ "url": "http://localhost:5432" }

POST /api/preview
{ "url": "http://internal-admin.empresa.local/api/users" }
\`\`\`

1. ¿Qué intenta obtener el atacante con cada petición?
2. ¿Por qué es posible este ataque?
3. ¿Qué tres medidas concretas implementarías para prevenirlo?`,
            starterCode: null,
            solution: '1. Las tres peticiones intentan:\n- 169.254.169.254: Es la IP del servicio de metadatos de AWS EC2. El atacante intenta robar las credenciales IAM del servidor en la nube.\n- localhost:5432: Puerto estándar de PostgreSQL. Intenta acceder a la base de datos interna.\n- internal-admin.empresa.local: Intenta acceder a servicios de administración interna no expuestos al exterior.\n\n2. Es posible porque el servidor hace fetch() con la URL proporcionada por el usuario sin validación. El servidor tiene acceso a la red interna y a metadatos de la nube, a diferencia del navegador del cliente.\n\n3. Medidas de prevención:\n- Validar que la URL sea HTTPS y de un dominio de lista blanca\n- Resolver el hostname a IP y verificar que no sea privada (10.x, 172.16.x, 192.168.x, 127.x, 169.254.x)\n- Usar un proxy de egreso dedicado que solo permita tráfico a internet público',
            validationLogic: JSON.stringify({
              type: 'includes_keywords',
              keywords: ['AWS', 'credenciales', 'PostgreSQL', 'interna', 'lista blanca', 'IP privada'],
              caseSensitive: false,
              explanation: '169.254.169.254 = metadatos AWS. localhost:5432 = PostgreSQL. Las medidas son: lista blanca de dominios, verificar IPs privadas, y proxy de egreso.',
            }),
            hintsJson: JSON.stringify([
              '169.254.169.254 es una IP muy especial en entornos cloud. Búscala: es el "Instance Metadata Service" de AWS.',
              'El puerto 5432 es el puerto por defecto de PostgreSQL. localhost significa que el atacante quiere acceder a servicios en el mismo servidor.',
              'Para prevenir SSRF: (1) no aceptes IPs directas, (2) resuelve hostnames a IPs y verifica rangos privados, (3) usa lista blanca de dominios permitidos.',
            ]),
          },
          // 5. Fill blank — completar configuración de Helmet.js
          {
            order: 5,
            type: 'fill_blank',
            difficulty: 'medium',
            points: 15,
            prompt: `Completa esta configuración de Helmet.js para una API Express en producción:

\`\`\`javascript
const helmet = require('helmet');

app.use(helmet({
  // Prevenir clickjacking: no permitir ningún iframe
  frameguard: {
    action: '___',  // valor para "nunca en iframe"
  },

  // Forzar HTTPS durante 1 año e incluir subdominios
  hsts: {
    maxAge: ___,        // segundos en 1 año (365 * 24 * 60 * 60)
    includeSubDomains: ___,
    preload: true,
  },

  // Desactivar la cabecera que revela el framework
  ___: false,   // opción de helmet para ocultar "X-Powered-By"

  // Permitir imágenes externas pero solo scripts propios
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'___'"],   // solo origen propio por defecto
      imgSrc: ["'self'", "___", "https:"],  // data URIs para imágenes base64
    },
  },
}));
\`\`\``,
            starterCode: `app.use(helmet({
  frameguard: {
    action: '___',
  },

  hsts: {
    maxAge: ___,
    includeSubDomains: ___,
    preload: true,
  },

  ___: false,

  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'___'"],
      imgSrc: ["'self'", "___", "https:"],
    },
  },
}));`,
            solution: `app.use(helmet({
  frameguard: {
    action: 'deny',
  },

  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },

  hidePoweredBy: false,

  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));`,
            validationLogic: JSON.stringify({
              type: 'includes_keywords',
              keywords: ['deny', '31536000', 'true', 'hidePoweredBy', 'self', 'data:'],
              caseSensitive: false,
              explanation: 'Los valores son: action: "deny", maxAge: 31536000 (365*24*60*60), includeSubDomains: true, hidePoweredBy: false, defaultSrc: ["\'self\'"], imgSrc con "data:".',
            }),
            hintsJson: JSON.stringify([
              'frameguard action "deny" significa que la página nunca puede cargarse en un iframe. "sameorigin" la permitiría solo en el mismo dominio.',
              '1 año en segundos = 365 × 24 × 60 × 60 = 31536000. HSTS con preload requiere maxAge de al menos 31536000.',
              'La opción de helmet para ocultar X-Powered-By es "hidePoweredBy". "data:" en imgSrc permite imágenes base64 embebidas.',
            ]),
          },
          // 6. Fill blank — completar validación de URL para prevenir SSRF
          {
            order: 6,
            type: 'fill_blank',
            difficulty: 'hard',
            points: 15,
            prompt: `Completa esta función que valida una URL para prevenir ataques SSRF:

\`\`\`javascript
const dns = require('dns').promises;

async function validarUrlSegura(urlStr) {
  let url;

  // Parsear la URL (lanza si es inválida)
  try {
    url = new ___(urlStr);  // constructor para parsear URLs
  } catch {
    throw new Error('URL inválida');
  }

  // Solo permitir HTTPS
  if (url.___ !== 'https:') {  // propiedad del protocolo
    throw new Error('Solo se permiten URLs HTTPS');
  }

  // Resolver hostname a IP para detectar IPs privadas
  let direcciones;
  try {
    direcciones = await dns.resolve4(url.___);  // propiedad del host sin puerto
  } catch {
    throw new Error('No se puede resolver el hostname');
  }

  const RANGOS_PRIVADOS = [
    /^127\./,
    /^10\./,
    /^172\.(1[6-9]|2\d|3[01])\./,
    /^192\.168\./,
    /^169\.254\./,  // AWS metadata
    /^::1$/,        // IPv6 localhost
  ];

  for (const ip of ___) {  // iterar las IPs resueltas
    if (RANGOS_PRIVADOS.___(patron => patron.test(ip))) {  // método de array
      throw new Error('URL apunta a una red privada (SSRF prevenido)');
    }
  }

  return true;
}
\`\`\``,
            starterCode: `async function validarUrlSegura(urlStr) {
  let url;

  try {
    url = new ___(urlStr);
  } catch {
    throw new Error('URL inválida');
  }

  if (url.___ !== 'https:') {
    throw new Error('Solo se permiten URLs HTTPS');
  }

  let direcciones;
  try {
    direcciones = await dns.resolve4(url.___);
  } catch {
    throw new Error('No se puede resolver el hostname');
  }

  const RANGOS_PRIVADOS = [
    /^127\./,
    /^10\./,
    /^172\\.(1[6-9]|2\\d|3[01])\\./,
    /^192\\.168\\./,
    /^169\\.254\\./,
    /^::1$/,
  ];

  for (const ip of ___) {
    if (RANGOS_PRIVADOS.___(patron => patron.test(ip))) {
      throw new Error('URL apunta a una red privada (SSRF prevenido)');
    }
  }

  return true;
}`,
            solution: `async function validarUrlSegura(urlStr) {
  let url;

  try {
    url = new URL(urlStr);
  } catch {
    throw new Error('URL inválida');
  }

  if (url.protocol !== 'https:') {
    throw new Error('Solo se permiten URLs HTTPS');
  }

  let direcciones;
  try {
    direcciones = await dns.resolve4(url.hostname);
  } catch {
    throw new Error('No se puede resolver el hostname');
  }

  const RANGOS_PRIVADOS = [
    /^127\./,
    /^10\./,
    /^172\\.(1[6-9]|2\\d|3[01])\\./,
    /^192\\.168\\./,
    /^169\\.254\\./,
    /^::1$/,
  ];

  for (const ip of direcciones) {
    if (RANGOS_PRIVADOS.some(patron => patron.test(ip))) {
      throw new Error('URL apunta a una red privada (SSRF prevenido)');
    }
  }

  return true;
}`,
            validationLogic: JSON.stringify({
              type: 'includes_keywords',
              keywords: ['URL', 'protocol', 'hostname', 'direcciones', 'some'],
              caseSensitive: false,
              explanation: 'Los huecos son: new URL(urlStr), url.protocol, url.hostname, direcciones (el array de IPs), y Array.some() para comprobar si alguna IP es privada.',
            }),
            hintsJson: JSON.stringify([
              'El constructor nativo de JavaScript para parsear URLs es simplemente "URL". Úsalo con "new URL(urlStr)".',
              'La propiedad que contiene el protocolo (https:, http:) es url.protocol. La que contiene solo el host sin puerto es url.hostname.',
              'Para comprobar si ALGÚN elemento de un array cumple una condición, usa Array.some(). Es lo opuesto de Array.every().',
            ]),
          },
          // 7. Fill blank — completar CSP header
          {
            order: 7,
            type: 'fill_blank',
            difficulty: 'hard',
            points: 15,
            prompt: `Completa este middleware que construye un header Content-Security-Policy personalizado según el tipo de ruta:

\`\`\`javascript
function cspDinamico(req, res, next) {
  const esRutaAPI = req.path.startsWith('/api/');
  const esRutaAdmin = req.path.startsWith('/admin/');

  let directivas;

  if (esRutaAPI) {
    // Las APIs no necesitan cargar scripts ni estilos
    directivas = {
      defaultSrc: ["'___'"],        // solo origen propio
      scriptSrc: ["'___'"],         // ningún script permitido
      frameSrc: ["'___'"],          // ningún iframe permitido
    };
  } else if (esRutaAdmin) {
    // Admin: más restrictivo, sin scripts externos
    directivas = {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'___'"],  // permite estilos inline (necesario para some admin UIs)
      frameSrc: ["'none'"],
    };
  } else {
    // Público: permite CDN conocidos
    directivas = {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", '___'],    // CDN de Bootstrap
      styleSrc: ["'self'", 'cdn.jsdelivr.net'],
      imgSrc: ["'self'", '___', 'https:'],  // data URIs
    };
  }

  // Construir el valor del header
  const cspValue = Object.entries(directivas)
    .map(([directiva, fuentes]) => {
      // Convertir camelCase a kebab-case: scriptSrc → script-src
      const nombre = directiva.replace(/([A-Z])/g, '-$1').___();  // método de string
      return \`\${nombre} \${fuentes.join(' ')}\`;
    })
    .___('; ');  // método de array para unir con separador

  res.set('___', cspValue);  // nombre del header
  next();
}
\`\`\``,
            starterCode: `function cspDinamico(req, res, next) {
  const esRutaAPI = req.path.startsWith('/api/');
  const esRutaAdmin = req.path.startsWith('/admin/');

  let directivas;

  if (esRutaAPI) {
    directivas = {
      defaultSrc: ["'___'"],
      scriptSrc: ["'___'"],
      frameSrc: ["'___'"],
    };
  } else if (esRutaAdmin) {
    directivas = {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'___'"],
      frameSrc: ["'none'"],
    };
  } else {
    directivas = {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", '___'],
      styleSrc: ["'self'", 'cdn.jsdelivr.net'],
      imgSrc: ["'self'", '___', 'https:'],
    };
  }

  const cspValue = Object.entries(directivas)
    .map(([directiva, fuentes]) => {
      const nombre = directiva.replace(/([A-Z])/g, '-$1').___();
      return \`\${nombre} \${fuentes.join(' ')}\`;
    })
    .___('; ');

  res.set('___', cspValue);
  next();
}`,
            solution: `function cspDinamico(req, res, next) {
  const esRutaAPI = req.path.startsWith('/api/');
  const esRutaAdmin = req.path.startsWith('/admin/');

  let directivas;

  if (esRutaAPI) {
    directivas = {
      defaultSrc: ["'self'"],
      scriptSrc: ["'none'"],
      frameSrc: ["'none'"],
    };
  } else if (esRutaAdmin) {
    directivas = {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      frameSrc: ["'none'"],
    };
  } else {
    directivas = {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'cdn.jsdelivr.net'],
      styleSrc: ["'self'", 'cdn.jsdelivr.net'],
      imgSrc: ["'self'", 'data:', 'https:'],
    };
  }

  const cspValue = Object.entries(directivas)
    .map(([directiva, fuentes]) => {
      const nombre = directiva.replace(/([A-Z])/g, '-$1').toLowerCase();
      return \`\${nombre} \${fuentes.join(' ')}\`;
    })
    .join('; ');

  res.set('Content-Security-Policy', cspValue);
  next();
}`,
            validationLogic: JSON.stringify({
              type: 'includes_keywords',
              keywords: ['none', 'unsafe-inline', 'cdn.jsdelivr.net', 'data:', 'toLowerCase', 'join', 'Content-Security-Policy'],
              caseSensitive: false,
              explanation: 'Los valores clave son: "none" para APIs, "unsafe-inline" para admin styles, cdn.jsdelivr.net y "data:" para público, toLowerCase() y join() para construir el header.',
            }),
            hintsJson: JSON.stringify([
              '"\'none\'" en CSP significa que no se permite ninguna fuente. Úsalo para scriptSrc en APIs que no sirven HTML.',
              '\'unsafe-inline\' permite estilos inline (<style> tags y atributos style="..."). Es necesario en algunas UIs de admin pero introduce riesgos.',
              'Para convertir camelCase a kebab-case: replace(/([A-Z])/g, \'-$1\').toLowerCase(). El método para unir un array con separador es .join(separador).',
            ]),
          },
          // 8. Build — función de sanitización de inputs
          {
            order: 8,
            type: 'build',
            difficulty: 'hard',
            points: 20,
            prompt: `Escribe una función \`sanitizarInput(valor, opciones)\` que limpie y valide entradas de usuario para prevenir XSS y ataques de inyección.

La función debe:
1. Escapar caracteres HTML peligrosos (<, >, &, ", ')
2. Limitar la longitud máxima
3. Eliminar caracteres de control (\\n, \\r, \\t en strings de una sola línea)
4. Opcionalmente permitir solo caracteres alfanuméricos

\`\`\`javascript
sanitizarInput('<script>alert("xss")</script>', { maxLength: 100 })
// → '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'

sanitizarInput('  hola mundo  ', { trim: true })
// → 'hola mundo'

sanitizarInput('user@mail.com 123', { soloAlfanumerico: true })
// → 'usermail.com 123' // elimina @ que no es alfanumérico (excepto . y espacio)
\`\`\``,
            starterCode: `function sanitizarInput(valor, opciones = {}) {
  const {
    maxLength = 1000,
    trim = true,
    soloAlfanumerico = false,
    permitirSaltoLinea = false,
  } = opciones;

  if (typeof valor !== 'string') {
    throw new TypeError('El valor debe ser un string');
  }

  let resultado = valor;

  // 1. Trim
  // 2. Limitar longitud
  // 3. Escapar HTML
  // 4. Eliminar caracteres de control
  // 5. Solo alfanumérico si se requiere

  return resultado;
}`,
            solution: `function sanitizarInput(valor, opciones = {}) {
  const {
    maxLength = 1000,
    trim = true,
    soloAlfanumerico = false,
    permitirSaltoLinea = false,
  } = opciones;

  if (typeof valor !== 'string') {
    throw new TypeError('El valor debe ser un string');
  }

  let resultado = valor;

  // 1. Trim
  if (trim) {
    resultado = resultado.trim();
  }

  // 2. Limitar longitud
  if (resultado.length > maxLength) {
    resultado = resultado.slice(0, maxLength);
  }

  // 3. Escapar HTML para prevenir XSS
  resultado = resultado
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

  // 4. Eliminar caracteres de control (salvo salto de línea si se permite)
  if (!permitirSaltoLinea) {
    resultado = resultado.replace(/[\r\n\t]/g, ' ');
  }
  resultado = resultado.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // 5. Solo alfanumérico (permite también puntos y espacios)
  if (soloAlfanumerico) {
    resultado = resultado.replace(/[^a-zA-Z0-9\\s.]/g, '');
  }

  return resultado;
}`,
            validationLogic: JSON.stringify({
              type: 'includes_keywords',
              keywords: ['&amp;', '&lt;', '&gt;', '&quot;', 'replace', 'slice', 'trim'],
              caseSensitive: false,
              explanation: 'La función debe escapar &, <, >, ", \', limitar longitud con slice(), hacer trim(), y eliminar caracteres de control con replace().',
            }),
            hintsJson: JSON.stringify([
              'El escape HTML más importante: & → &amp; (debe ser el primero para no escapar los & que tú mismo insertas), < → &lt;, > → &gt;.',
              'Para limitar la longitud, usa resultado.slice(0, maxLength). Para eliminar caracteres de control, usa replace() con una regex de rangos de caracteres de control.',
              'El orden importa: primero & → &amp;, luego < y >, luego " y \'. Si lo haces al revés, los & de las entidades se escaparán también.',
            ]),
          },
          // 9. Build — middleware de seguridad completo con logging
          {
            order: 9,
            type: 'build',
            difficulty: 'hard',
            points: 20,
            prompt: `Escribe un middleware Express \`seguridadCompleta\` que combine múltiples capas de protección y registre eventos de seguridad.

Debe incluir:
1. Detectar y bloquear IPs que hayan tenido más de 10 errores 4xx en los últimos 5 minutos
2. Añadir headers de seguridad básicos (X-Frame-Options, X-Content-Type-Options)
3. Registrar en un log de seguridad: IP, método, ruta, timestamp, y si fue bloqueada
4. Responder 429 con mensaje explicativo si la IP está bloqueada

\`\`\`javascript
// Uso:
app.use(seguridadCompleta);
app.get('/api/users', handler);
\`\`\``,
            starterCode: `// Almacén en memoria de errores por IP (en producción usarías Redis)
const erroresPorIP = new Map();

function seguridadCompleta(req, res, next) {
  const ip = req.ip || req.socket.remoteAddress;
  const ahora = Date.now();
  const VENTANA_MS = 5 * 60 * 1000; // 5 minutos
  const MAX_ERRORES = 10;

  // Tu implementación aquí

}`,
            solution: `const erroresPorIP = new Map();

function seguridadCompleta(req, res, next) {
  const ip = req.ip || req.socket.remoteAddress;
  const ahora = Date.now();
  const VENTANA_MS = 5 * 60 * 1000;
  const MAX_ERRORES = 10;

  // Limpiar errores antiguos para esta IP
  const errores = erroresPorIP.get(ip) || [];
  const erroresRecientes = errores.filter(ts => ahora - ts < VENTANA_MS);

  // 1. Comprobar si la IP está bloqueada
  if (erroresRecientes.length >= MAX_ERRORES) {
    const eventoSeguridad = {
      timestamp: new Date().toISOString(),
      ip,
      method: req.method,
      path: req.path,
      bloqueada: true,
      motivo: 'demasiados_errores_4xx',
    };
    console.warn('[SEGURIDAD]', JSON.stringify(eventoSeguridad));

    return res.status(429).json({
      error: 'Demasiados errores. Tu IP ha sido bloqueada temporalmente.',
      reintentarEn: '5 minutos',
    });
  }

  // 2. Añadir headers de seguridad básicos
  res.set('X-Frame-Options', 'DENY');
  res.set('X-Content-Type-Options', 'nosniff');

  // 3. Interceptar la respuesta para registrar errores 4xx
  const enviarOriginal = res.send.bind(res);
  res.send = function (body) {
    const eventoSeguridad = {
      timestamp: new Date().toISOString(),
      ip,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      bloqueada: false,
    };
    console.info('[ACCESO]', JSON.stringify(eventoSeguridad));

    // Si es error 4xx, registrar para el contador de bloqueo
    if (res.statusCode >= 400 && res.statusCode < 500) {
      erroresRecientes.push(ahora);
      erroresPorIP.set(ip, erroresRecientes);
    }

    return enviarOriginal(body);
  };

  next();
}`,
            validationLogic: JSON.stringify({
              type: 'includes_keywords',
              keywords: ['erroresPorIP', 'X-Frame-Options', 'X-Content-Type-Options', 'console', '429', 'statusCode'],
              caseSensitive: false,
              explanation: 'El middleware debe rastrear errores por IP en erroresPorIP, añadir headers de seguridad, registrar con console, responder 429 si supera el límite, y detectar errores 4xx por statusCode.',
            }),
            hintsJson: JSON.stringify([
              'Para detectar respuestas 4xx, necesitas interceptar res.send: guarda la función original, reemplázala por una tuya que registre el statusCode y luego llame a la original.',
              'Filtra los errores de la ventana de tiempo con: errores.filter(ts => ahora - ts < VENTANA_MS). Esto elimina los que ya expiaron.',
              'Añade los headers de seguridad ANTES de llamar a next(), para que todas las respuestas los incluyan.',
            ]),
          },
          // 10. Challenge — auditoría de seguridad completa
          {
            order: 10,
            type: 'challenge',
            difficulty: 'hard',
            points: 30,
            prompt: `RETO FINAL: Auditoría de Seguridad Completa

Tienes esta API Express en producción. Identifica y corrige TODAS las vulnerabilidades de seguridad (hay al menos 8).

\`\`\`javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json());

const CLAVE_JWT = 'mi_secreto_super_seguro_123'; // ← VULNERABILIDAD: secreto hardcodeado
const db = require('./db');

// Endpoint de login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.query(\`SELECT * FROM users WHERE email = '\${email}'\`);

  if (!user || !bcrypt.compareSync(password, user.password_hash, 6)) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const jwt_firmado = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });
  // ← VULNERABILIDAD #4: nunca imprimir credenciales en logs
  console.log(\`Credencial generada para \${email}: \${jwt_firmado}\`);
  res.json({ token: jwt_firmado });
});

// Endpoint de usuarios (requiere auth)
app.get('/users', (req, res) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, JWT_SECRET);
  const users = db.query('SELECT * FROM users');
  res.json(users);
});

// Endpoint de búsqueda
app.get('/search', async (req, res) => {
  const { q } = req.query;
  const results = await db.query(\`SELECT * FROM products WHERE name LIKE '%\${q}%'\`);
  res.json(results);
});

app.listen(3000);
\`\`\`

Para cada vulnerabilidad: nombra el tipo de ataque, explica el impacto y muestra el código corregido.`,
            starterCode: `// Análisis de seguridad y código corregido
// Encuentra y corrige las 8+ vulnerabilidades

const express = require('express');
// ... tu implementación segura aquí`,
            solution: `// AUDITORÍA DE SEGURIDAD — 8 vulnerabilidades identificadas y corregidas

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');
const app = express();

app.use(express.json());
app.use(helmet()); // FIX #1: Añadir headers de seguridad con Helmet

// FIX #2: JWT_SECRET desde variable de entorno, nunca hardcodeado
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET no definido en las variables de entorno');

// FIX #3: Rate limiting en endpoints de autenticación
const limiterAuth = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 5,
  message: { error: 'Demasiados intentos. Espera 1 minuto.' },
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// VULNERABILIDADES ORIGINALES:
// 1. JWT_SECRET hardcodeado en el código (secreto expuesto en git)
// 2. SQL injection en login: WHERE email = '<email>' → usar parámetros
// 3. bcrypt.compareSync con 6 rounds (mínimo 12 según OWASP)
// 4. Uso de console.log() para imprimir la credencial JWT (dato sensible en logs)
// 5. Token con expiración de 30 días (demasiado largo, usar 15min + refresh)
// 6. /users sin validar el header Authorization correctamente (puede crashear)
// 7. Sin rate limiting en /login (fuerza bruta ilimitada)
// 8. SQL injection en /search: LIKE '%<q>%' → usar parámetros preparados
// 9. Sin helmet (headers de seguridad ausentes)

app.post('/login', limiterAuth, async (req, res) => {
  // FIX #2: Validar input con Zod antes de usarlo
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Datos inválidos' });

  const { email, password } = parsed.data;

  // FIX #2: Usar parámetros preparados (evita SQL injection)
  const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);

  // FIX #3: bcrypt rounds >= 12 (el segundo argumento de compareSync es incorrecto en el original)
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  // FIX #5: Token con expiración corta (15 min)
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '15m' });

  // FIX #4: NUNCA loguear tokens o contraseñas
  console.log(\`Login exitoso para usuario ID: \${user.id}\`);

  res.json({ token });
});

app.get('/users', (req, res) => {
  // FIX #6: Validar el header Authorization correctamente
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }

  const users = db.query('SELECT id, email, username FROM users'); // no exponer password_hash
  res.json(users);
});

app.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q || typeof q !== 'string') return res.status(400).json({ error: 'Parámetro q requerido' });

  // FIX #8: Parámetro preparado para LIKE (evita SQL injection)
  const results = await db.query('SELECT * FROM products WHERE name ILIKE $1', [\`%\${q}%\`]);
  res.json(results);
});

app.listen(3000);`,
            validationLogic: JSON.stringify({
              type: 'minimum_length',
              minLength: 180,
              explanation: 'La auditoría debe identificar al menos 8 vulnerabilidades: JWT hardcodeado, SQL injection en login y search, bcrypt rounds bajos, console.log con token, expiry 30d, sin validación de auth header, sin rate limiting, sin helmet.',
            }),
            hintsJson: JSON.stringify([
              'Cuenta las vulnerabilidades sistemáticamente: (1) secretos hardcodeados, (2) SQL injection (hay dos), (3) bcrypt rounds, (4) console.log con secrets, (5) expiración JWT, (6) manejo del header Authorization.',
              'SQL injection ocurre cuando concatenas variables directamente en la query. Usa parámetros preparados: db.query("... WHERE email = $1", [email]).',
              'bcrypt.compareSync recibe (password, hash), no (password, hash, rounds). Los rounds se definen al hacer el hash con bcrypt.hash(password, 12). Además, usa la versión async: await bcrypt.compare().',
            ]),
          },
        ],
      },
    ],
  },
];
