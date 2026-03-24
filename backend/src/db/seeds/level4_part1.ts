/**
 * NIVEL 4 — AVANZADO (PARTE 1)
 * 2 lecciones · 22 ejercicios
 *
 * Lección 1: Rate Limiting y Throttling     → 10 ejercicios
 * Lección 2: Paginación y Filtrado          → 12 ejercicios
 */

import type { SeedLesson } from './types.js';

export const level4Lessons1: SeedLesson[] = [
  // ═══════════════════════════════════════════════════════════════════════
  // LECCIÓN 1 — Rate Limiting y Throttling (10 ejercicios)
  // ═══════════════════════════════════════════════════════════════════════
  {
    lesson: {
      title: 'Rate Limiting y Throttling',
      order: 1,
      type: 'theory',
      contentMd: `
# Rate Limiting y Throttling

Las APIs públicas no pueden permitir que un solo cliente haga miles de peticiones por segundo.
El **rate limiting** (límite de tasa) es el mecanismo que controla cuántas peticiones puede hacer
un cliente en un período de tiempo determinado.

## ¿Por qué existe el rate limiting?

- **Proteger el servidor** contra sobrecargas y ataques DDoS
- **Garantizar disponibilidad** para todos los clientes
- **Modelos de negocio** (plan gratuito vs. de pago con más cuota)
- **Prevenir abuso** y scraping masivo

## Headers de Rate Limiting

Cuando haces una petición a una API con rate limiting, la respuesta incluye headers
que te informan de tu estado actual:

\`\`\`
X-RateLimit-Limit: 100        → Máximo de peticiones permitidas en la ventana
X-RateLimit-Remaining: 73     → Peticiones que te quedan en esta ventana
X-RateLimit-Reset: 1711234567 → Timestamp UNIX cuando se reinicia el contador
Retry-After: 30               → Segundos que debes esperar (aparece en el error 429)
\`\`\`

## Error 429: Too Many Requests

Cuando superas el límite, el servidor responde con **HTTP 429**:

\`\`\`javascript
const res = await fetch('https://api.ejemplo.com/datos');

if (res.status === 429) {
  const retryAfter = res.headers.get('Retry-After'); // ej. "30"
  console.log(\`Límite superado. Reintenta en \${retryAfter} segundos.\`);
}
\`\`\`

## Exponential Backoff

Cuando una API falla o devuelve 429, no reintentes inmediatamente.
El **exponential backoff** aumenta el tiempo de espera entre reintentos:

\`\`\`javascript
async function fetchConReintentos(url, maxReintentos = 4) {
  for (let intento = 0; intento < maxReintentos; intento++) {
    const res = await fetch(url);

    if (res.ok) return res.json();

    if (res.status === 429 || res.status >= 500) {
      const esperaMs = Math.pow(2, intento) * 1000; // 1s, 2s, 4s, 8s
      console.log(\`Reintento \${intento + 1} en \${esperaMs}ms...\`);
      await new Promise(r => setTimeout(r, esperaMs));
    } else {
      throw new Error(\`Error \${res.status}: \${res.statusText}\`);
    }
  }
  throw new Error('Máximo de reintentos alcanzado');
}
\`\`\`

## Throttling vs. Rate Limiting

| Concepto | Descripción |
|----------|-------------|
| Rate Limiting | Límite duro: bloquea al alcanzar el máximo (error 429) |
| Throttling | Límite suave: ralentiza las peticiones en lugar de bloquearlas |

> En la práctica, "rate limiting" se usa para ambos conceptos coloquialmente.
      `,
    },
    exercises: [
      // 1. Quiz
      {
        order: 1,
        type: 'quiz',
        difficulty: 'easy',
        points: 10,
        prompt: '¿Qué código de estado HTTP devuelve un servidor cuando has superado el límite de peticiones permitidas?',
        starterCode: null,
        solution: 'b',
        validationLogic: JSON.stringify({
          type: 'exact_match',
          answer: 'b',
          options: [
            { key: 'a', text: '403 Forbidden' },
            { key: 'b', text: '429 Too Many Requests' },
            { key: 'c', text: '503 Service Unavailable' },
            { key: 'd', text: '408 Request Timeout' },
          ],
          explanation: 'El código 429 Too Many Requests es el estándar (RFC 6585) para indicar que el cliente ha enviado demasiadas peticiones en un período de tiempo. El servidor puede incluir un header Retry-After indicando cuánto esperar.',
        }),
        hintsJson: JSON.stringify([
          'El código empieza por 4, lo que indica un error del cliente (no del servidor).',
          'Existe un código específico para este caso, definido en el RFC 6585.',
          'La respuesta es 429 Too Many Requests.',
        ]),
      },
      // 2. Quiz
      {
        order: 2,
        type: 'quiz',
        difficulty: 'easy',
        points: 10,
        prompt: '¿Qué indica el header X-RateLimit-Remaining en la respuesta de una API?',
        starterCode: null,
        solution: 'c',
        validationLogic: JSON.stringify({
          type: 'exact_match',
          answer: 'c',
          options: [
            { key: 'a', text: 'El número máximo de peticiones permitidas por ventana de tiempo' },
            { key: 'b', text: 'El timestamp en que se reinicia el contador de peticiones' },
            { key: 'c', text: 'El número de peticiones que aún puedes hacer en la ventana actual' },
            { key: 'd', text: 'El tiempo en segundos que debes esperar si alcanzas el límite' },
          ],
          explanation: 'X-RateLimit-Remaining informa cuántas peticiones te quedan disponibles en la ventana de tiempo actual. X-RateLimit-Limit es el máximo total, y X-RateLimit-Reset indica cuándo se reinicia.',
        }),
        hintsJson: JSON.stringify([
          'La palabra clave es "Remaining", que en inglés significa "restante" o "que queda".',
          'Hay tres headers de rate limit: Limit (máximo), Remaining (restante) y Reset (cuándo reinicia).',
          'La respuesta es C: peticiones que aún puedes hacer en la ventana actual.',
        ]),
      },
      // 3. Observe
      {
        order: 3,
        type: 'observe',
        difficulty: 'easy',
        points: 10,
        prompt: `Observa esta respuesta de una API y sus headers de rate limiting:

\`\`\`
HTTP/1.1 200 OK
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 1711234800
Content-Type: application/json
\`\`\`

Responde:
1. ¿Cuántas peticiones permite esta API por ventana de tiempo?
2. ¿Cuántas peticiones te quedan antes de ser bloqueado?
3. Si el timestamp actual es 1711234560, ¿en cuántos segundos se reinicia el contador?`,
        starterCode: null,
        solution: '1. Permite 60 peticiones por ventana de tiempo (X-RateLimit-Limit: 60).\n2. Te quedan 3 peticiones antes de recibir un error 429 (X-RateLimit-Remaining: 3).\n3. El contador se reinicia en 240 segundos: 1711234800 - 1711234560 = 240 segundos (4 minutos).',
        validationLogic: JSON.stringify({
          type: 'includes_keywords',
          keywords: ['60', '3', '240'],
          caseSensitive: false,
          explanation: 'X-RateLimit-Limit=60 (máximo), X-RateLimit-Remaining=3 (quedan 3), reset en 1711234800-1711234560=240 segundos.',
        }),
        hintsJson: JSON.stringify([
          'Lee cada header por separado: Limit es el máximo total, Remaining es lo que queda.',
          'Para calcular el tiempo hasta el reset, resta el timestamp actual al valor de X-RateLimit-Reset.',
          '60 peticiones en total, 3 restantes, y 1711234800 - 1711234560 = 240 segundos hasta el reset.',
        ]),
      },
      // 4. Observe
      {
        order: 4,
        type: 'observe',
        difficulty: 'medium',
        points: 10,
        prompt: `Analiza este código que maneja un error 429 y detecta el problema:

\`\`\`javascript
async function obtenerDatos(url) {
  const res = await fetch(url);

  if (res.status === 429) {
    const retryAfter = res.headers.get('Retry-After');
    console.log('Límite alcanzado, esperando...');
    await new Promise(r => setTimeout(r, retryAfter)); // ← ¿Hay un problema aquí?
    return obtenerDatos(url); // reintento
  }

  return res.json();
}
\`\`\`

¿Qué error tiene este código? ¿Cómo lo corregirías?`,
        starterCode: null,
        solution: 'El problema es que setTimeout espera milisegundos, pero Retry-After devuelve segundos como string. La línea correcta sería: await new Promise(r => setTimeout(r, Number(retryAfter) * 1000)). Además, la recursión sin límite de reintentos puede causar un bucle infinito si la API sigue devolviendo 429.',
        validationLogic: JSON.stringify({
          type: 'includes_keywords',
          keywords: ['milisegundos', 'segundos', '1000', 'string'],
          caseSensitive: false,
          explanation: 'setTimeout espera milisegundos, pero Retry-After es un string en segundos. Hay que convertirlo: Number(retryAfter) * 1000.',
        }),
        hintsJson: JSON.stringify([
          'setTimeout() trabaja con milisegundos. ¿En qué unidad viene el header Retry-After?',
          'El header Retry-After devuelve un string con segundos (ej. "30"). Necesitas convertirlo y multiplicar.',
          'La corrección es: setTimeout(r, Number(retryAfter) * 1000). También considera limitar los reintentos.',
        ]),
      },
      // 5. Fill Blank
      {
        order: 5,
        type: 'fill_blank',
        difficulty: 'easy',
        points: 15,
        prompt: `Completa el código para leer los headers de rate limiting de una respuesta:

\`\`\`javascript
const res = await fetch('https://api.ejemplo.com/datos');

const limite = res.headers.get('______');         // máximo de peticiones
const restantes = res.headers.get('______');      // peticiones restantes
const reset = res.headers.get('______');          // cuándo reinicia

console.log(\`Usadas: \${limite - restantes}/\${limite}\`);
console.log(\`Reset en: \${new Date(reset * 1000).toLocaleTimeString()}\`);
\`\`\``,
        starterCode: `const res = await fetch('https://api.ejemplo.com/datos');

const limite = res.headers.get('______');
const restantes = res.headers.get('______');
const reset = res.headers.get('______');

console.log(\`Usadas: \${limite - restantes}/\${limite}\`);`,
        solution: `const res = await fetch('https://api.ejemplo.com/datos');

const limite = res.headers.get('X-RateLimit-Limit');
const restantes = res.headers.get('X-RateLimit-Remaining');
const reset = res.headers.get('X-RateLimit-Reset');

console.log(\`Usadas: \${limite - restantes}/\${limite}\`);`,
        validationLogic: JSON.stringify({
          type: 'includes_keywords',
          keywords: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
          caseSensitive: false,
          explanation: 'Los tres headers estándar son X-RateLimit-Limit, X-RateLimit-Remaining y X-RateLimit-Reset.',
        }),
        hintsJson: JSON.stringify([
          'Los headers de rate limiting siguen la convención X-RateLimit-[Concepto].',
          'Los tres conceptos son: Limit (máximo), Remaining (restante) y Reset (cuándo reinicia).',
          'Los valores exactos son: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset.',
        ]),
      },
      // 6. Fill Blank
      {
        order: 6,
        type: 'fill_blank',
        difficulty: 'medium',
        points: 15,
        prompt: `Completa la función de exponential backoff. El tiempo de espera debe ser 2^intento segundos:

\`\`\`javascript
async function fetchSeguro(url, maxReintentos = 4) {
  for (let intento = 0; intento < maxReintentos; intento++) {
    const res = await fetch(url);

    if (res.ok) return res.json();

    if (res.status === ___ || res.status >= 500) {
      const esperaMs = Math.pow(___, intento) * ____;
      await new Promise(r => setTimeout(r, esperaMs));
    } else {
      throw new Error(\`Error \${res.status}\`);
    }
  }
  throw new Error('Máximo de reintentos alcanzado');
}
\`\`\``,
        starterCode: `async function fetchSeguro(url, maxReintentos = 4) {
  for (let intento = 0; intento < maxReintentos; intento++) {
    const res = await fetch(url);

    if (res.ok) return res.json();

    if (res.status === ___ || res.status >= 500) {
      const esperaMs = Math.pow(___, intento) * ____;
      await new Promise(r => setTimeout(r, esperaMs));
    } else {
      throw new Error(\`Error \${res.status}\`);
    }
  }
  throw new Error('Máximo de reintentos alcanzado');
}`,
        solution: `async function fetchSeguro(url, maxReintentos = 4) {
  for (let intento = 0; intento < maxReintentos; intento++) {
    const res = await fetch(url);

    if (res.ok) return res.json();

    if (res.status === 429 || res.status >= 500) {
      const esperaMs = Math.pow(2, intento) * 1000;
      await new Promise(r => setTimeout(r, esperaMs));
    } else {
      throw new Error(\`Error \${res.status}\`);
    }
  }
  throw new Error('Máximo de reintentos alcanzado');
}`,
        validationLogic: JSON.stringify({
          type: 'includes_keywords',
          keywords: ['429', 'Math.pow', '2', '1000'],
          caseSensitive: false,
          explanation: 'El status de rate limit es 429. La fórmula de backoff es Math.pow(2, intento) * 1000 para convertir segundos a milisegundos.',
        }),
        hintsJson: JSON.stringify([
          'El código de rate limit es 429. La base del exponente es 2 (duplica cada vez).',
          'Math.pow(2, intento) da 1, 2, 4, 8... pero setTimeout necesita milisegundos.',
          'Los valores son: 429, Math.pow(2, intento) y 1000 (para convertir de segundos a ms).',
        ]),
      },
      // 7. Build
      {
        order: 7,
        type: 'build',
        difficulty: 'medium',
        points: 20,
        prompt: `Escribe una función \`verificarLimite(headers)\` que reciba los headers de una respuesta y devuelva un objeto con:
- \`limite\`: número máximo de peticiones
- \`restantes\`: peticiones restantes
- \`resetEn\`: segundos hasta que se reinicia (calculado desde el timestamp actual)
- \`alertar\`: true si quedan menos de 10 peticiones

Ejemplo de uso:
\`\`\`javascript
const res = await fetch('https://api.ejemplo.com/datos');
const info = verificarLimite(res.headers);
// { limite: 100, restantes: 7, resetEn: 45, alertar: true }
\`\`\``,
        starterCode: `function verificarLimite(headers) {
  // Tu código aquí
}`,
        solution: `function verificarLimite(headers) {
  const limite = Number(headers.get('X-RateLimit-Limit'));
  const restantes = Number(headers.get('X-RateLimit-Remaining'));
  const resetTimestamp = Number(headers.get('X-RateLimit-Reset'));
  const ahora = Math.floor(Date.now() / 1000);
  const resetEn = Math.max(0, resetTimestamp - ahora);

  return {
    limite,
    restantes,
    resetEn,
    alertar: restantes < 10,
  };
}`,
        validationLogic: JSON.stringify({
          type: 'includes_keywords',
          keywords: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset', 'restantes', 'alertar'],
          caseSensitive: false,
          explanation: 'La función debe leer los tres headers X-RateLimit, calcular segundos hasta el reset y marcar alerta si restantes < 10.',
        }),
        hintsJson: JSON.stringify([
          'Usa headers.get() para leer cada header. Conviértelos a Number() porque llegan como strings.',
          'Para calcular resetEn: timestamp del reset - timestamp actual (Date.now() / 1000 en segundos).',
          'El campo alertar es simplemente: restantes < 10.',
        ]),
      },
      // 8. Build
      {
        order: 8,
        type: 'build',
        difficulty: 'medium',
        points: 20,
        prompt: `Crea una función \`fetchConBackoff(url, opciones)\` que:
1. Intente hacer fetch hasta 3 veces
2. Si recibe 429, espere el tiempo indicado en el header \`Retry-After\` (en segundos) antes de reintentar
3. Si no hay header Retry-After, use 5 segundos por defecto
4. Si agota los intentos, lance un Error con el mensaje "Servicio no disponible tras 3 intentos"`,
        starterCode: `async function fetchConBackoff(url, opciones = {}) {
  // Tu código aquí
}`,
        solution: `async function fetchConBackoff(url, opciones = {}) {
  const MAX_INTENTOS = 3;

  for (let intento = 1; intento <= MAX_INTENTOS; intento++) {
    const res = await fetch(url, opciones);

    if (res.ok) return res;

    if (res.status === 429) {
      if (intento === MAX_INTENTOS) break;
      const retryAfter = res.headers.get('Retry-After');
      const esperaMs = (retryAfter ? Number(retryAfter) : 5) * 1000;
      await new Promise(r => setTimeout(r, esperaMs));
    } else {
      throw new Error(\`Error \${res.status}: \${res.statusText}\`);
    }
  }

  throw new Error('Servicio no disponible tras 3 intentos');
}`,
        validationLogic: JSON.stringify({
          type: 'includes_keywords',
          keywords: ['429', 'Retry-After', '1000', 'intentos', 'setTimeout'],
          caseSensitive: false,
          explanation: 'La función debe detectar 429, leer Retry-After, convertir a ms y reintentar. Después de 3 intentos, lanza un error.',
        }),
        hintsJson: JSON.stringify([
          'Usa un bucle for con un contador de intentos. Comprueba res.status === 429.',
          'Recuerda que Retry-After viene en segundos y setTimeout necesita milisegundos (multiplica por 1000).',
          'Si no hay header Retry-After usa 5 por defecto: const espera = (retryAfter ? Number(retryAfter) : 5) * 1000.',
        ]),
      },
      // 9. Debug
      {
        order: 9,
        type: 'debug',
        difficulty: 'medium',
        points: 20,
        prompt: `Este código implementa retry con backoff pero tiene dos bugs. Encuéntralos y corrígelos:

\`\`\`javascript
async function fetchConReintentos(url) {
  for (let i = 0; i <= 3; i++) {          // Bug 1
    try {
      const res = await fetch(url);
      if (res.ok) return res.json();

      if (res.status === 429) {
        const espera = Math.pow(2, i) * 100;  // Bug 2
        await new Promise(r => setTimeout(r, espera));
      }
    } catch (err) {
      if (i === 3) throw err;
    }
  }
}
\`\`\``,
        starterCode: `async function fetchConReintentos(url) {
  for (let i = 0; i <= 3; i++) {          // Bug 1
    try {
      const res = await fetch(url);
      if (res.ok) return res.json();

      if (res.status === 429) {
        const espera = Math.pow(2, i) * 100;  // Bug 2
        await new Promise(r => setTimeout(r, espera));
      }
    } catch (err) {
      if (i === 3) throw err;
    }
  }
}`,
        solution: `async function fetchConReintentos(url) {
  for (let i = 0; i < 3; i++) {           // Bug 1 corregido: < en lugar de <=
    try {
      const res = await fetch(url);
      if (res.ok) return res.json();

      if (res.status === 429) {
        const espera = Math.pow(2, i) * 1000;  // Bug 2 corregido: 1000ms no 100ms
        await new Promise(r => setTimeout(r, espera));
      }
    } catch (err) {
      if (i === 2) throw err;              // también corregido el índice límite
    }
  }
}`,
        validationLogic: JSON.stringify({
          type: 'includes_keywords',
          keywords: ['< 3', '1000', 'i < 3'],
          caseSensitive: false,
          explanation: 'Bug 1: i <= 3 hace 4 iteraciones (0,1,2,3) en lugar de 3. Bug 2: multiplicar por 100 da centésimas de segundo, lo correcto es 1000 (milisegundos = segundos).',
        }),
        hintsJson: JSON.stringify([
          'Bug 1: Cuenta cuántas veces itera el bucle con <= 3 empezando desde 0. ¿Son 3 o 4 iteraciones?',
          'Bug 2: setTimeout usa milisegundos. Math.pow(2, 0) * 100 = 100ms = 0.1 segundos. ¿Es razonable para un backoff?',
          'Correcciones: cambiar <= por < en el bucle, y multiplicar por 1000 en lugar de 100.',
        ]),
      },
      // 10. Challenge
      {
        order: 10,
        type: 'challenge',
        difficulty: 'medium',
        points: 30,
        prompt: `Reto: Implementa un cliente HTTP con gestión inteligente de rate limits.

Crea una clase \`ApiClient\` con un método \`get(url)\` que:
1. Antes de cada petición, compruebe si quedan peticiones disponibles (guarda el estado internamente)
2. Si no quedan peticiones, espere hasta que se reinicie el contador (usando X-RateLimit-Reset)
3. Actualice el estado interno de rate limit con cada respuesta
4. Implemente exponential backoff para errores 429 inesperados (máximo 3 reintentos)

El cliente debe funcionar así:
\`\`\`javascript
const cliente = new ApiClient();
const datos1 = await cliente.get('https://api.ejemplo.com/items');
const datos2 = await cliente.get('https://api.ejemplo.com/users');
// El cliente gestiona automáticamente los límites
\`\`\``,
        starterCode: `class ApiClient {
  constructor() {
    // Inicializa el estado de rate limiting
  }

  async get(url) {
    // Tu implementación aquí
  }
}`,
        solution: `class ApiClient {
  constructor() {
    this.restantes = Infinity;
    this.resetTimestamp = 0;
  }

  async _esperarSiNecesario() {
    if (this.restantes <= 0) {
      const ahora = Math.floor(Date.now() / 1000);
      const esperaSegundos = Math.max(0, this.resetTimestamp - ahora);
      if (esperaSegundos > 0) {
        console.log(\`Rate limit alcanzado. Esperando \${esperaSegundos}s...\`);
        await new Promise(r => setTimeout(r, esperaSegundos * 1000));
      }
      this.restantes = Infinity;
    }
  }

  _actualizarEstado(headers) {
    const restantes = headers.get('X-RateLimit-Remaining');
    const reset = headers.get('X-RateLimit-Reset');
    if (restantes !== null) this.restantes = Number(restantes);
    if (reset !== null) this.resetTimestamp = Number(reset);
  }

  async get(url, intento = 0) {
    await this._esperarSiNecesario();

    const res = await fetch(url);
    this._actualizarEstado(res.headers);

    if (res.ok) return res.json();

    if (res.status === 429 && intento < 3) {
      const espera = Math.pow(2, intento) * 1000;
      await new Promise(r => setTimeout(r, espera));
      return this.get(url, intento + 1);
    }

    throw new Error(\`Error \${res.status}: \${res.statusText}\`);
  }
}`,
        validationLogic: JSON.stringify({
          type: 'minimum_length',
          minLength: 100,
          explanation: 'El reto requiere una clase con gestión de estado interno de rate limiting, espera proactiva y backoff reactivo.',
        }),
        hintsJson: JSON.stringify([
          'Guarda this.restantes y this.resetTimestamp en el constructor. Actualízalos tras cada respuesta.',
          'Antes de hacer fetch, comprueba if (this.restantes <= 0) y espera hasta el timestamp de reset.',
          'Para el backoff, usa un parámetro de intento en el método get() y llámalo recursivamente: this.get(url, intento + 1).',
        ]),
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // LECCIÓN 2 — Paginación y Filtrado (12 ejercicios)
  // ═══════════════════════════════════════════════════════════════════════
  {
    lesson: {
      title: 'Paginación y Filtrado',
      order: 2,
      type: 'exercise_set',
      contentMd: `
# Paginación y Filtrado

Cuando una API tiene miles de registros, devolver todos de una vez es ineficiente.
La **paginación** divide los resultados en páginas manejables.

## Paginación Offset (la más común)

Usa \`page\` y \`limit\` (o \`offset\`) como query params:

\`\`\`javascript
// Página 1: registros 1-10
fetch('https://api.ejemplo.com/usuarios?page=1&limit=10')

// Página 2: registros 11-20
fetch('https://api.ejemplo.com/usuarios?page=2&limit=10')

// Equivalente con offset
fetch('https://api.ejemplo.com/usuarios?offset=10&limit=10')
\`\`\`

La respuesta suele incluir metadatos de paginación:

\`\`\`json
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 10,
    "total": 347,
    "totalPages": 35,
    "hasNext": true,
    "hasPrev": true
  }
}
\`\`\`

## Paginación por Cursor

Más eficiente para grandes conjuntos de datos en tiempo real:

\`\`\`javascript
// Primera página
const res1 = await fetch('https://api.ejemplo.com/tweets?limit=20');
const { data, nextCursor } = await res1.json();
// nextCursor: "eyJpZCI6MTIzNH0="

// Siguiente página usando el cursor
const res2 = await fetch(\`https://api.ejemplo.com/tweets?limit=20&cursor=\${nextCursor}\`);
\`\`\`

El cursor es opaco (generalmente base64) y apunta a un registro específico.
Evita el problema de offset cuando se insertan/eliminan registros entre páginas.

## Link Headers

Algunas APIs usan el header \`Link\` para indicar las URLs de navegación:

\`\`\`
Link: <https://api.ejemplo.com/items?page=3&limit=10>; rel="next",
      <https://api.ejemplo.com/items?page=1&limit=10>; rel="prev",
      <https://api.ejemplo.com/items?page=35&limit=10>; rel="last"
\`\`\`

## Filtrado y Ordenación

\`\`\`javascript
// Filtrar por campo
fetch('/api/productos?categoria=electronica&precio_max=500')

// Ordenar resultados
fetch('/api/productos?sort=precio&order=asc')

// Búsqueda por texto
fetch('/api/productos?q=laptop')

// Combinando todo
fetch('/api/productos?categoria=electronica&precio_max=500&sort=precio&order=asc&page=1&limit=20')
\`\`\`

## Iterar todas las páginas

\`\`\`javascript
async function obtenerTodo(urlBase) {
  const todosLosItems = [];
  let pagina = 1;
  let hayMas = true;

  while (hayMas) {
    const res = await fetch(\`\${urlBase}?page=\${pagina}&limit=100\`);
    const { data, pagination } = await res.json();

    todosLosItems.push(...data);
    hayMas = pagination.hasNext;
    pagina++;
  }

  return todosLosItems;
}
\`\`\`
      `,
    },
    exercises: [
      // 1. Quiz
      {
        order: 1,
        type: 'quiz',
        difficulty: 'easy',
        points: 10,
        prompt: '¿Cuál es la principal ventaja de la paginación por cursor sobre la paginación por offset?',
        starterCode: null,
        solution: 'b',
        validationLogic: JSON.stringify({
          type: 'exact_match',
          answer: 'b',
          options: [
            { key: 'a', text: 'El cursor es más fácil de implementar en el servidor' },
            { key: 'b', text: 'El cursor es consistente cuando se insertan o eliminan registros entre páginas' },
            { key: 'c', text: 'El cursor permite filtrar resultados por múltiples campos' },
            { key: 'd', text: 'El cursor siempre devuelve más registros por página' },
          ],
          explanation: 'Con offset, si alguien inserta un registro entre la página 1 y 2, el offset se desplaza y puedes ver duplicados o saltarte registros. El cursor apunta a un elemento específico, por lo que es inmune a estas inserciones.',
        }),
        hintsJson: JSON.stringify([
          'Piensa en qué pasa si se añade un nuevo usuario entre que cargas la página 1 y la página 2 con offset.',
          'Con offset=10, si se inserta un nuevo registro antes, el offset "se mueve" y puede haber duplicados.',
          'La respuesta es B: el cursor es consistente ante cambios en los datos entre páginas.',
        ]),
      },
      // 2. Quiz
      {
        order: 2,
        type: 'quiz',
        difficulty: 'easy',
        points: 10,
        prompt: 'Una API devuelve el header: `Link: <https://api.com/items?page=4>; rel="next"`. ¿Qué significa rel="next"?',
        starterCode: null,
        solution: 'a',
        validationLogic: JSON.stringify({
          type: 'exact_match',
          answer: 'a',
          options: [
            { key: 'a', text: 'La URL indicada contiene la siguiente página de resultados' },
            { key: 'b', text: 'La URL indicada es el siguiente endpoint de la API' },
            { key: 'c', text: 'Hay 4 elementos en la siguiente página' },
            { key: 'd', text: 'El servidor recomienda usar esa URL en lugar de la actual' },
          ],
          explanation: 'El header Link con rel="next" es un estándar (RFC 5988) que indica la URL de la siguiente página. También se usan rel="prev", rel="first" y rel="last" para la navegación completa.',
        }),
        hintsJson: JSON.stringify([
          '"rel" significa "relation" (relación). Describe la relación de la URL con la respuesta actual.',
          'El estándar Link headers define rel="next" como el recurso siguiente en una secuencia.',
          'La respuesta es A: la URL del header Link con rel="next" apunta a la siguiente página.',
        ]),
      },
      // 3. Observe
      {
        order: 3,
        type: 'observe',
        difficulty: 'easy',
        points: 10,
        prompt: `Observa esta respuesta de una API paginada:

\`\`\`json
{
  "data": [
    { "id": 21, "nombre": "Producto A" },
    { "id": 22, "nombre": "Producto B" }
  ],
  "pagination": {
    "page": 3,
    "limit": 2,
    "total": 50,
    "totalPages": 25,
    "hasNext": true,
    "hasPrev": true
  }
}
\`\`\`

Responde:
1. ¿Cuántos registros tiene la API en total?
2. ¿Qué query params necesitas para obtener la página siguiente?
3. ¿En qué posición absoluta están los registros mostrados (1º, 2º, etc.)?`,
        starterCode: null,
        solution: '1. La API tiene 50 registros en total (total: 50).\n2. Para la siguiente página: ?page=4&limit=2 (la página actual es 3, la siguiente es 4).\n3. Los registros mostrados son el 5º y 6º en posición absoluta: (página 3 - 1) × 2 = offset 4, luego registros en posición 5 y 6.',
        validationLogic: JSON.stringify({
          type: 'includes_keywords',
          keywords: ['50', 'page=4', '5', '6'],
          caseSensitive: false,
          explanation: 'Total=50 registros, siguiente página es page=4&limit=2, y los registros están en posición absoluta 5 y 6 ((3-1)*2 + 1 y 2).',
        }),
        hintsJson: JSON.stringify([
          'El total de registros lo indica el campo "total" en el objeto pagination.',
          'La página actual es 3, así que la siguiente es 4. Mantén el mismo limit.',
          'Posición absoluta = (página - 1) × limit + índice. Para página 3, limit 2: posiciones 5 y 6.',
        ]),
      },
      // 4. Observe
      {
        order: 4,
        type: 'observe',
        difficulty: 'medium',
        points: 10,
        prompt: `Analiza esta llamada a una API con filtros y explica qué devuelve:

\`\`\`javascript
const url = 'https://api.tienda.com/productos' +
  '?categoria=ropa' +
  '&precio_min=20' +
  '&precio_max=100' +
  '&sort=precio' +
  '&order=desc' +
  '&page=2' +
  '&limit=15' +
  '&q=camiseta';

const res = await fetch(url);
const datos = await res.json();
\`\`\`

Describe con detalle:
1. ¿Qué tipo de productos devuelve?
2. ¿Cómo están ordenados?
3. ¿Cuántos resultados ves en esta respuesta y cuáles en términos de posición global?`,
        starterCode: null,
        solution: '1. Devuelve productos de la categoría "ropa", con precio entre 20 y 100, que coincidan con la búsqueda "camiseta".\n2. Están ordenados por precio de mayor a menor (sort=precio, order=desc).\n3. Se muestran hasta 15 resultados (limit=15). Al ser la página 2, son los productos del 16 al 30 en posición global (offset = (2-1) × 15 = 15).',
        validationLogic: JSON.stringify({
          type: 'includes_keywords',
          keywords: ['ropa', 'camiseta', 'precio', 'desc', '15', '16'],
          caseSensitive: false,
          explanation: 'La query filtra por categoría ropa, búsqueda camiseta, precio 20-100, ordenado por precio descendente. Página 2 = registros 16 al 30.',
        }),
        hintsJson: JSON.stringify([
          'Analiza cada query param por separado: categoria, precio_min, precio_max, q son filtros; sort y order son ordenación; page y limit son paginación.',
          'order=desc significa de mayor a menor. Los productos más caros aparecen primero.',
          'Página 2 con limit 15: offset = (2-1) × 15 = 15, así que son los registros del 16 al 30.',
        ]),
      },
      // 5. Fill Blank
      {
        order: 5,
        type: 'fill_blank',
        difficulty: 'easy',
        points: 15,
        prompt: `Completa las URLs para hacer las peticiones correctas:

\`\`\`javascript
// 1. Obtener la página 3 con 20 resultados por página
const urlPagina3 = 'https://api.ejemplo.com/articulos?______&______';

// 2. Filtrar productos de categoría "libros" ordenados por título ascendente
const urlFiltrada = 'https://api.ejemplo.com/productos?______&______&______';

// 3. Buscar usuarios con el término "juan" en la página 1
const urlBusqueda = 'https://api.ejemplo.com/usuarios?______&limit=10';
\`\`\``,
        starterCode: `// 1. Obtener la página 3 con 20 resultados por página
const urlPagina3 = 'https://api.ejemplo.com/articulos?______&______';

// 2. Filtrar productos de categoría "libros" ordenados por título ascendente
const urlFiltrada = 'https://api.ejemplo.com/productos?______&______&______';

// 3. Buscar usuarios con el término "juan" en la página 1
const urlBusqueda = 'https://api.ejemplo.com/usuarios?______&limit=10';`,
        solution: `// 1. Obtener la página 3 con 20 resultados por página
const urlPagina3 = 'https://api.ejemplo.com/articulos?page=3&limit=20';

// 2. Filtrar productos de categoría "libros" ordenados por título ascendente
const urlFiltrada = 'https://api.ejemplo.com/productos?categoria=libros&sort=titulo&order=asc';

// 3. Buscar usuarios con el término "juan" en la página 1
const urlBusqueda = 'https://api.ejemplo.com/usuarios?q=juan&limit=10';`,
        validationLogic: JSON.stringify({
          type: 'includes_keywords',
          keywords: ['page=3', 'limit=20', 'categoria=libros', 'sort=titulo', 'order=asc', 'q=juan'],
          caseSensitive: false,
          explanation: 'Paginación usa page y limit; filtrado usa nombres de campo como categoria; búsqueda usa q; ordenación usa sort y order.',
        }),
        hintsJson: JSON.stringify([
          'Para paginación: page= indica la página, limit= indica cuántos por página.',
          'Para filtrar usa el nombre del campo como param. Para ordenar: sort=campo y order=asc|desc.',
          'Para búsqueda de texto el parámetro convencional es q= (de "query").',
        ]),
      },
      // 6. Fill Blank
      {
        order: 6,
        type: 'fill_blank',
        difficulty: 'medium',
        points: 15,
        prompt: `Completa la función que itera todas las páginas de una API:

\`\`\`javascript
async function obtenerTodos(urlBase) {
  const resultado = [];
  let pagina = ___;
  let hayMas = ___;

  while (______) {
    const res = await fetch(\`\${urlBase}?page=\${pagina}&limit=50\`);
    const { data, pagination } = await res.json();

    resultado.push(______);
    hayMas = pagination.______;
    pagina++;
  }

  return resultado;
}
\`\`\``,
        starterCode: `async function obtenerTodos(urlBase) {
  const resultado = [];
  let pagina = ___;
  let hayMas = ___;

  while (______) {
    const res = await fetch(\`\${urlBase}?page=\${pagina}&limit=50\`);
    const { data, pagination } = await res.json();

    resultado.push(______);
    hayMas = pagination.______;
    pagina++;
  }

  return resultado;
}`,
        solution: `async function obtenerTodos(urlBase) {
  const resultado = [];
  let pagina = 1;
  let hayMas = true;

  while (hayMas) {
    const res = await fetch(\`\${urlBase}?page=\${pagina}&limit=50\`);
    const { data, pagination } = await res.json();

    resultado.push(...data);
    hayMas = pagination.hasNext;
    pagina++;
  }

  return resultado;
}`,
        validationLogic: JSON.stringify({
          type: 'includes_keywords',
          keywords: ['pagina = 1', 'hayMas = true', 'while (hayMas)', '...data', 'hasNext'],
          caseSensitive: false,
          explanation: 'La función empieza en página 1, itera mientras hayMas sea true, usa spread (...data) para añadir todos los elementos, y usa pagination.hasNext para saber si continuar.',
        }),
        hintsJson: JSON.stringify([
          'La primera página siempre es 1. El bucle continúa mientras hayMas sea true.',
          'Para añadir todos los elementos de data al array usa el spread operator: resultado.push(...data).',
          'La condición de parada es pagination.hasNext — cuando sea false, el bucle termina.',
        ]),
      },
      // 7. Fill Blank
      {
        order: 7,
        type: 'fill_blank',
        difficulty: 'medium',
        points: 15,
        prompt: `Completa este código de paginación por cursor:

\`\`\`javascript
async function obtenerSiguientePagina(urlBase, cursor = null) {
  // Construir la URL con o sin cursor
  const params = new URLSearchParams({ limit: '20' });
  if (______) {
    params.append('______', cursor);
  }

  const res = await fetch(\`\${urlBase}?\${params.toString()}\`);
  const { data, ______ } = await res.json();

  return {
    items: data,
    siguienteCursor: ______,
    hayMas: ______ !== null,
  };
}
\`\`\``,
        starterCode: `async function obtenerSiguientePagina(urlBase, cursor = null) {
  const params = new URLSearchParams({ limit: '20' });
  if (______) {
    params.append('______', cursor);
  }

  const res = await fetch(\`\${urlBase}?\${params.toString()}\`);
  const { data, ______ } = await res.json();

  return {
    items: data,
    siguienteCursor: ______,
    hayMas: ______ !== null,
  };
}`,
        solution: `async function obtenerSiguientePagina(urlBase, cursor = null) {
  const params = new URLSearchParams({ limit: '20' });
  if (cursor !== null) {
    params.append('cursor', cursor);
  }

  const res = await fetch(\`\${urlBase}?\${params.toString()}\`);
  const { data, nextCursor } = await res.json();

  return {
    items: data,
    siguienteCursor: nextCursor,
    hayMas: nextCursor !== null,
  };
}`,
        validationLogic: JSON.stringify({
          type: 'includes_keywords',
          keywords: ['cursor !== null', 'cursor', 'nextCursor', 'hayMas'],
          caseSensitive: false,
          explanation: 'La condición para añadir el cursor es cursor !== null. El campo del response suele llamarse nextCursor. hayMas se determina si nextCursor no es null.',
        }),
        hintsJson: JSON.stringify([
          'Solo añade el cursor a la URL si tienes uno: if (cursor !== null).',
          'La primera llamada no tiene cursor (null). Las siguientes usan el nextCursor de la respuesta anterior.',
          'hayMas es true cuando nextCursor no es null — indica que hay más datos por cargar.',
        ]),
      },
      // 8. Build
      {
        order: 8,
        type: 'build',
        difficulty: 'medium',
        points: 20,
        prompt: `Escribe una función \`buscarProductos(filtros)\` que construya y ejecute una petición a \`https://api.tienda.com/productos\` con los siguientes filtros opcionales:
- \`categoria\`: string
- \`precioMin\` y \`precioMax\`: números
- \`busqueda\`: texto de búsqueda (param: q)
- \`pagina\`: número (por defecto 1)
- \`porPagina\`: número (por defecto 20)
- \`ordenarPor\`: campo de ordenación
- \`orden\`: 'asc' o 'desc' (por defecto 'asc')

Solo incluye en la URL los parámetros que estén definidos (no undefined/null).`,
        starterCode: `async function buscarProductos(filtros = {}) {
  // Tu código aquí
}`,
        solution: `async function buscarProductos(filtros = {}) {
  const {
    categoria,
    precioMin,
    precioMax,
    busqueda,
    pagina = 1,
    porPagina = 20,
    ordenarPor,
    orden = 'asc',
  } = filtros;

  const params = new URLSearchParams();

  if (categoria) params.append('categoria', categoria);
  if (precioMin !== undefined && precioMin !== null) params.append('precio_min', precioMin);
  if (precioMax !== undefined && precioMax !== null) params.append('precio_max', precioMax);
  if (busqueda) params.append('q', busqueda);
  params.append('page', pagina);
  params.append('limit', porPagina);
  if (ordenarPor) {
    params.append('sort', ordenarPor);
    params.append('order', orden);
  }

  const res = await fetch(\`https://api.tienda.com/productos?\${params.toString()}\`);
  return res.json();
}`,
        validationLogic: JSON.stringify({
          type: 'includes_keywords',
          keywords: ['URLSearchParams', 'params.append', 'categoria', 'precio', 'page', 'limit', 'sort'],
          caseSensitive: false,
          explanation: 'Usa URLSearchParams para construir la query string de forma segura. Solo añade parámetros que tengan valor definido.',
        }),
        hintsJson: JSON.stringify([
          'Usa new URLSearchParams() para construir la query string. Es más seguro que concatenar strings.',
          'Comprueba si cada filtro existe antes de añadirlo: if (categoria) params.append(...).',
          'La búsqueda de texto va en el param "q". Precio en precio_min/precio_max. Ordenación en sort y order.',
        ]),
      },
      // 9. Build
      {
        order: 9,
        type: 'build',
        difficulty: 'medium',
        points: 20,
        prompt: `Implementa una función \`parsearLinkHeader(linkHeader)\` que reciba el valor del header Link y devuelva un objeto con las URLs de navegación.

Ejemplo de entrada:
\`\`\`
'<https://api.com/items?page=2>; rel="next", <https://api.com/items?page=10>; rel="last"'
\`\`\`

Ejemplo de salida esperada:
\`\`\`javascript
{
  next: 'https://api.com/items?page=2',
  last: 'https://api.com/items?page=10',
  prev: null,
  first: null
}
\`\`\``,
        starterCode: `function parsearLinkHeader(linkHeader) {
  // Tu código aquí
}`,
        solution: `function parsearLinkHeader(linkHeader) {
  const resultado = { next: null, prev: null, first: null, last: null };

  if (!linkHeader) return resultado;

  const partes = linkHeader.split(',');

  for (const parte of partes) {
    const match = parte.trim().match(/<([^>]+)>;\s*rel="([^"]+)"/);
    if (match) {
      const url = match[1];
      const rel = match[2];
      if (rel in resultado) {
        resultado[rel] = url;
      }
    }
  }

  return resultado;
}`,
        validationLogic: JSON.stringify({
          type: 'includes_keywords',
          keywords: ['next', 'prev', 'first', 'last', 'split', 'match', 'rel'],
          caseSensitive: false,
          explanation: 'La función debe parsear el header Link, separar por coma y extraer la URL y el valor rel de cada parte usando una expresión regular.',
        }),
        hintsJson: JSON.stringify([
          'El header Link tiene entradas separadas por comas. Usa split(",") para dividirlas.',
          'Cada entrada tiene el formato: <URL>; rel="tipo". Una regex como /<([^>]+)>;\\s*rel="([^"]+)"/ la parsea.',
          'El resultado inicial tiene todos los rels en null. Solo sobreescribe los que encuentres en el header.',
        ]),
      },
      // 10. Build
      {
        order: 10,
        type: 'build',
        difficulty: 'medium',
        points: 20,
        prompt: `Crea una función \`cargarTodasLasPaginas(url)\` que use el header Link para navegar automáticamente por todas las páginas y devuelva todos los elementos.

La API devuelve el header:
\`\`\`
Link: <https://api.com/items?page=2>; rel="next"
\`\`\`

Y el body es un array JSON directamente: \`[{id: 1, ...}, {id: 2, ...}]\``,
        starterCode: `async function cargarTodasLasPaginas(url) {
  // Tu código aquí
}`,
        solution: `async function cargarTodasLasPaginas(url) {
  const todos = [];
  let urlActual = url;

  while (urlActual) {
    const res = await fetch(urlActual);
    const datos = await res.json();
    todos.push(...datos);

    const linkHeader = res.headers.get('Link');
    const siguienteUrl = extraerUrlNext(linkHeader);
    urlActual = siguienteUrl;
  }

  return todos;
}

function extraerUrlNext(linkHeader) {
  if (!linkHeader) return null;
  const match = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
  return match ? match[1] : null;
}`,
        validationLogic: JSON.stringify({
          type: 'includes_keywords',
          keywords: ['Link', 'next', 'push', 'while', 'headers.get'],
          caseSensitive: false,
          explanation: 'La función debe leer el header Link de cada respuesta, extraer la URL rel="next" y continuar hasta que no haya más.',
        }),
        hintsJson: JSON.stringify([
          'El bucle continúa mientras haya una URL de "next". Lee el header Link con res.headers.get("Link").',
          'Extrae la URL next del header usando una regex o la función del ejercicio anterior.',
          'Cuando el header Link no incluya rel="next", urlActual será null y el bucle terminará.',
        ]),
      },
      // 11. Debug
      {
        order: 11,
        type: 'debug',
        difficulty: 'medium',
        points: 20,
        prompt: `Este código intenta cargar todas las páginas de una API pero tiene tres bugs. Encuéntralos:

\`\`\`javascript
async function cargarTodo(urlBase) {
  const items = [];
  let pagina = 0;              // Bug 1
  let total = 1;

  while (items.length < total) {
    const res = await fetch(\`\${urlBase}?page=\${pagina}&limit=10\`);
    const { data, pagination } = await res.json();

    items.push(data);          // Bug 2
    total = pagination.total;
    // Bug 3: falta algo aquí
  }

  return items;
}
\`\`\``,
        starterCode: `async function cargarTodo(urlBase) {
  const items = [];
  let pagina = 0;              // Bug 1
  let total = 1;

  while (items.length < total) {
    const res = await fetch(\`\${urlBase}?page=\${pagina}&limit=10\`);
    const { data, pagination } = await res.json();

    items.push(data);          // Bug 2
    total = pagination.total;
    // Bug 3: falta algo aquí
  }

  return items;
}`,
        solution: `async function cargarTodo(urlBase) {
  const items = [];
  let pagina = 1;              // Bug 1 corregido: las páginas empiezan en 1
  let total = 1;

  while (items.length < total) {
    const res = await fetch(\`\${urlBase}?page=\${pagina}&limit=10\`);
    const { data, pagination } = await res.json();

    items.push(...data);       // Bug 2 corregido: usar spread para añadir elementos
    total = pagination.total;
    pagina++;                  // Bug 3 corregido: incrementar la página
  }

  return items;
}`,
        validationLogic: JSON.stringify({
          type: 'includes_keywords',
          keywords: ['pagina = 1', '...data', 'pagina++'],
          caseSensitive: false,
          explanation: 'Bug 1: las páginas empiezan en 1, no en 0. Bug 2: push(data) añade el array como elemento; push(...data) añade cada elemento. Bug 3: falta incrementar pagina++.',
        }),
        hintsJson: JSON.stringify([
          'Bug 1: ¿Las APIs REST suelen empezar sus páginas en 0 o en 1?',
          'Bug 2: items.push(data) añade el array completo como un único elemento. Para añadir cada item individualmente usa el spread: push(...data).',
          'Bug 3: si no incrementas pagina, el bucle siempre pide la misma página → bucle infinito.',
        ]),
      },
      // 12. Challenge
      {
        order: 12,
        type: 'challenge',
        difficulty: 'medium',
        points: 30,
        prompt: `Reto: Implementa una función \`buscarEnTodasLasPaginas(urlBase, textoBuscado)\` que:

1. Recorra todas las páginas de la API (usando page y limit=50)
2. Filtre los elementos cuyo campo \`nombre\` incluya el textoBuscado (case-insensitive)
3. Se detenga en cuanto encuentre 10 coincidencias (búsqueda anticipada)
4. Devuelva un objeto con:
   - \`resultados\`: array con las coincidencias encontradas
   - \`paginasConsultadas\`: número de páginas que tuvo que revisar
   - \`completado\`: boolean que indica si revisó todas las páginas o se detuvo antes

\`\`\`javascript
const res = await buscarEnTodasLasPaginas('https://api.com/productos', 'camisa');
// { resultados: [...10 items], paginasConsultadas: 3, completado: false }
\`\`\``,
        starterCode: `async function buscarEnTodasLasPaginas(urlBase, textoBuscado) {
  // Tu código aquí
}`,
        solution: `async function buscarEnTodasLasPaginas(urlBase, textoBuscado) {
  const resultados = [];
  const termino = textoBuscado.toLowerCase();
  let pagina = 1;
  let hayMas = true;
  let completado = true;

  while (hayMas && resultados.length < 10) {
    const res = await fetch(\`\${urlBase}?page=\${pagina}&limit=50\`);
    const { data, pagination } = await res.json();

    for (const item of data) {
      if (item.nombre.toLowerCase().includes(termino)) {
        resultados.push(item);
        if (resultados.length >= 10) {
          completado = false;
          hayMas = false;
          break;
        }
      }
    }

    hayMas = hayMas && pagination.hasNext;
    pagina++;
  }

  return {
    resultados,
    paginasConsultadas: pagina - 1,
    completado,
  };
}`,
        validationLogic: JSON.stringify({
          type: 'minimum_length',
          minLength: 120,
          explanation: 'El reto requiere paginación con búsqueda anticipada, filtrado case-insensitive y seguimiento del estado de la búsqueda.',
        }),
        hintsJson: JSON.stringify([
          'Usa toLowerCase() tanto en textoBuscado como en item.nombre para la comparación case-insensitive.',
          'La condición del while debe verificar ambas cosas: que haya más páginas Y que no hayas alcanzado 10 resultados.',
          'completado empieza en true y solo cambia a false si interrumpes la búsqueda antes de revisar todas las páginas.',
        ]),
      },
    ],
  },
];
