/**
 * NIVEL 3 — AUTENTICACIÓN EN APIs
 * 3 lecciones · 35 ejercicios
 *
 * Lección 1: API Keys y Autenticación Básica   → 12 ejercicios
 * Lección 2: JWT — JSON Web Tokens             → 12 ejercicios
 * Lección 3: OAuth 2.0 y Seguridad             → 11 ejercicios
 */

import type { SeedModule } from './types.js';

export const level3: SeedModule = {
  module: {
    slug: 'autenticacion',
    title: 'Autenticación en APIs',
    description: 'Aprende a proteger y acceder a APIs con API Keys, JWT y OAuth 2.0',
    level: 3,
    order: 3,
    unlockedByModuleId: 'rest-api',
  },

  lessons: [
    // ═══════════════════════════════════════════════════════════════════════
    // LECCIÓN 1 — API Keys y Autenticación Básica (12 ejercicios)
    // ═══════════════════════════════════════════════════════════════════════
    {
      lesson: {
        title: 'API Keys y Autenticación Básica',
        order: 1,
        type: 'theory',
        contentMd: `
# API Keys y Autenticación Básica

Antes de que alguien use tu API, necesitas saber **quién es** y **si tiene permiso**.
Hay dos conceptos clave que suelen confundirse:

- **Autenticación**: ¿Quién eres? (verificar identidad)
- **Autorización**: ¿Qué puedes hacer? (verificar permisos)

## API Keys

Una API Key es un token único (cadena de texto) que identifica al cliente.
Se envía en cada request para que el servidor sepa quién llama.

### Dos formas de enviar una API Key

**En el header (recomendado):**
\`\`\`javascript
fetch('https://api.ejemplo.com/data', {
  headers: {
    'Authorization': 'ApiKey mi-clave-secreta-123'
  }
})
\`\`\`

**Como query param (evitar para producción):**
\`\`\`javascript
fetch('https://api.ejemplo.com/data?api_key=mi-clave-secreta-123')
\`\`\`

> ⚠️ Las query params quedan en logs de servidores y en el historial del navegador.
> Usar siempre headers en producción.

## Basic Auth

HTTP Basic Authentication codifica \`usuario:password\` en base64 y lo envía en el header.

\`\`\`javascript
const credentials = btoa('usuario:password123'); // base64
fetch('https://api.ejemplo.com/resource', {
  headers: {
    'Authorization': \`Basic \${credentials}\`
  }
})
\`\`\`

El servidor decodifica el header y verifica las credenciales.

> ⚠️ Basic Auth SIN HTTPS es peligroso: base64 no es cifrado, se puede revertir fácilmente.
> Úsalo siempre sobre HTTPS.

## ¿Cuándo usar cada uno?

| Método | Cuándo usarlo |
|--------|--------------|
| API Key en header | Acceso de servidor a servidor, scripts internos |
| API Key en query param | Solo para demos/prototipos, nunca producción |
| Basic Auth | Herramientas internas, CI/CD, conexiones simples sobre HTTPS |
| JWT | Aplicaciones con usuarios reales, sesiones, RBAC |
        `,
      },
      exercises: [
        // 1. Quiz
        {
          order: 1,
          type: 'quiz',
          difficulty: 'easy',
          points: 10,
          prompt: '¿Cuál es la diferencia entre autenticación y autorización?',
          starterCode: null,
          solution: 'b',
          validationLogic: JSON.stringify({
            type: 'exact_match',
            answer: 'b',
            options: [
              { key: 'a', text: 'Son sinónimos, significan lo mismo' },
              { key: 'b', text: 'Autenticación verifica quién eres; autorización verifica qué puedes hacer' },
              { key: 'c', text: 'Autorización verifica quién eres; autenticación verifica qué puedes hacer' },
              { key: 'd', text: 'Autenticación solo aplica a contraseñas; autorización solo a tokens' },
            ],
            explanation: 'Autenticación = identidad ("soy Juan"). Autorización = permisos ("Juan puede leer pero no escribir"). Siempre ocurren en ese orden.',
          }),
          hintsJson: JSON.stringify([
            '"Autenticar" viene de "auténtico". Es demostrar que eres quien dices ser.',
            'Una vez identificado, la autorización decide qué acciones puedes realizar.',
            'La respuesta es B: autenticación → identidad, autorización → permisos.',
          ]),
        },
        // 2. Quiz
        {
          order: 2,
          type: 'quiz',
          difficulty: 'easy',
          points: 10,
          prompt: '¿Por qué es mala práctica enviar una API Key como query param (?api_key=xxx) en producción?',
          starterCode: null,
          solution: 'c',
          validationLogic: JSON.stringify({
            type: 'exact_match',
            answer: 'c',
            options: [
              { key: 'a', text: 'Porque los query params no funcionan con HTTPS' },
              { key: 'b', text: 'Porque el servidor no puede leerlos' },
              { key: 'c', text: 'Porque quedan expuestos en logs del servidor, historial del navegador y URLs compartidas' },
              { key: 'd', text: 'Porque los query params tienen límite de 10 caracteres' },
            ],
            explanation: 'Las URLs completas (con query params) se registran en logs de acceso de servidores, proxies y CDNs. También aparecen en el historial del navegador y pueden filtrarse si alguien comparte el enlace.',
          }),
          hintsJson: JSON.stringify([
            'Piensa en dónde aparece una URL completa. ¿En qué lugares se guarda o registra?',
            'Los servidores guardan registros (logs) de cada request recibido, incluyendo la URL completa.',
            'La respuesta es C: logs, historial del navegador y URLs compartidas.',
          ]),
        },
        // 3. Observe
        {
          order: 3,
          type: 'observe',
          difficulty: 'easy',
          points: 10,
          prompt: `Observa estas dos formas de llamar a la misma API y responde:

\`\`\`javascript
// Forma A
const resA = await fetch('https://api.clima.com/temperatura?ciudad=Madrid&api_key=sk-abc123');

// Forma B
const resB = await fetch('https://api.clima.com/temperatura?ciudad=Madrid', {
  headers: {
    'Authorization': 'ApiKey sk-abc123'
  }
});
\`\`\`

Preguntas:
1. ¿Cuál es más segura y por qué?
2. ¿Qué problema tiene la Forma A si el usuario copia la URL desde su historial?
3. ¿Aparecería la API Key en los logs del servidor con la Forma B?`,
          starterCode: null,
          solution: '1. La Forma B es más segura porque la API Key viaja en el header HTTP, que no aparece en logs de URL ni en el historial del navegador.\n2. Al copiar la URL del historial, la API Key queda expuesta en texto plano. Cualquier persona con acceso al portapapeles o al historial podría robarla.\n3. No. Los headers HTTP no se registran en los logs de acceso estándar de servidores como nginx o Apache. Solo la URL (y por tanto los query params) aparecen en esos logs.',
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['Forma B', 'header', 'historial', 'logs', 'URL'],
            caseSensitive: false,
            explanation: 'La Forma B es más segura porque usa headers. Los headers no aparecen en logs de URL ni en el historial del navegador.',
          }),
          hintsJson: JSON.stringify([
            'Compara dónde viaja cada clave: una en la URL, otra en los metadatos del request.',
            'El historial del navegador guarda URLs completas. ¿Qué pasa si la clave está en la URL?',
            'Los logs de nginx/Apache registran la URL pero no los headers. La Forma B protege la clave de los logs.',
          ]),
        },
        // 4. Observe
        {
          order: 4,
          type: 'observe',
          difficulty: 'easy',
          points: 10,
          prompt: `Analiza esta petición con Basic Auth y responde:

\`\`\`javascript
const usuario = 'admin';
const contrasena = 'supersecret';
const credenciales = btoa(\`\${usuario}:\${contrasena}\`);
// credenciales = "YWRtaW46c3VwZXJzZWNyZXQ="

const res = await fetch('https://api.empresa.com/admin/users', {
  headers: {
    'Authorization': \`Basic \${credenciales}\`
  }
});
\`\`\`

Preguntas:
1. ¿Qué hace btoa()? ¿Esto es cifrado?
2. ¿Qué ocurre si alguien intercepta este request sin HTTPS?
3. Ejecuta en tu mente: \`atob("YWRtaW46c3VwZXJzZWNyZXQ=")\` ¿Qué obtienes?`,
          starterCode: null,
          solution: '1. btoa() codifica texto a base64. NO es cifrado: es solo una codificación reversible que cualquiera puede decodificar sin clave.\n2. Sin HTTPS el request viaja en texto claro. Un atacante que intercepte el tráfico de red puede ver el header Authorization con las credenciales en base64, decodificarlas con atob() y obtener usuario y contraseña.\n3. atob("YWRtaW46c3VwZXJzZWNyZXQ=") devuelve "admin:supersecret". Exactamente las credenciales originales.',
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['base64', 'no es cifrado', 'HTTPS', 'intercepte', 'admin:supersecret'],
            caseSensitive: false,
            explanation: 'base64 es codificación, no cifrado. Sin HTTPS cualquier interceptor puede decodificar las credenciales con atob().',
          }),
          hintsJson: JSON.stringify([
            'btoa() = base64 encode. atob() = base64 decode. ¿Necesitas una clave para revertirlo?',
            'HTTPS cifra el tráfico entre cliente y servidor. Sin él, todo viaja en texto visible.',
            'atob("YWRtaW46c3VwZXJzZWNyZXQ=") → "admin:supersecret". La codificación base64 es pública y reversible.',
          ]),
        },
        // 5. Fill blank
        {
          order: 5,
          type: 'fill_blank',
          difficulty: 'easy',
          points: 15,
          prompt: 'Completa el código para hacer un request autenticado con una API Key en el header correcto:',
          starterCode: `const API_KEY = 'sk-prod-xyz789';

const response = await fetch('https://api.weather.com/forecast', {
  ___: {
    '___': \`___ \${API_KEY}\`
  }
});

const data = await response.___;
console.log(data);`,
          solution: `const API_KEY = 'sk-prod-xyz789';

const response = await fetch('https://api.weather.com/forecast', {
  headers: {
    'Authorization': \`ApiKey \${API_KEY}\`
  }
});

const data = await response.json();
console.log(data);`,
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['headers', 'Authorization', 'ApiKey', 'json()'],
            caseSensitive: false,
            explanation: 'La API Key se envía en el objeto headers con la clave "Authorization" y el valor "ApiKey <clave>". La respuesta se parsea con .json().',
          }),
          hintsJson: JSON.stringify([
            'El segundo argumento de fetch() acepta un objeto con opciones. Una de ellas es "headers".',
            'El header se llama "Authorization". El valor sigue el formato: "ApiKey <tu-clave>".',
            'Para leer el JSON de la respuesta usa response.json() que devuelve una Promise.',
          ]),
        },
        // 6. Fill blank
        {
          order: 6,
          type: 'fill_blank',
          difficulty: 'easy',
          points: 15,
          prompt: 'Completa el código para hacer un request con HTTP Basic Auth:',
          starterCode: `const usuario = 'maria';
const contrasena = 'clave456';

// Codifica las credenciales en base64
const credenciales = ___(___);

const response = await fetch('https://api.empresa.com/datos', {
  headers: {
    'Authorization': \`___ \${credenciales}\`
  }
});`,
          solution: `const usuario = 'maria';
const contrasena = 'clave456';

// Codifica las credenciales en base64
const credenciales = btoa(\`\${usuario}:\${contrasena}\`);

const response = await fetch('https://api.empresa.com/datos', {
  headers: {
    'Authorization': \`Basic \${credenciales}\`
  }
});`,
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['btoa', 'usuario', 'contrasena', 'Basic'],
            caseSensitive: false,
            explanation: 'Basic Auth: codificar "usuario:contrasena" con btoa() y enviarlo como "Basic <base64>" en el header Authorization.',
          }),
          hintsJson: JSON.stringify([
            'btoa() convierte texto a base64. El formato es: btoa("usuario:contrasena").',
            'Las credenciales deben estar separadas por dos puntos: "maria:clave456".',
            'El esquema de Basic Auth en el header es: "Basic " + credenciales_en_base64.',
          ]),
        },
        // 7. Fill blank
        {
          order: 7,
          type: 'fill_blank',
          difficulty: 'medium',
          points: 15,
          prompt: 'Completa esta función que intenta obtener datos con API Key y maneja el error 401 (no autorizado):',
          starterCode: `async function fetchDatosProtegidos(apiKey) {
  const response = await fetch('https://api.servicio.com/privado', {
    headers: {
      '___': \`ApiKey \${apiKey}\`
    }
  });

  if (response.___ === ___) {
    throw new Error('API Key inválida o sin permisos');
  }

  if (!response.___) {
    throw new Error(\`Error del servidor: \${response.status}\`);
  }

  return response.___;
}`,
          solution: `async function fetchDatosProtegidos(apiKey) {
  const response = await fetch('https://api.servicio.com/privado', {
    headers: {
      'Authorization': \`ApiKey \${apiKey}\`
    }
  });

  if (response.status === 401) {
    throw new Error('API Key inválida o sin permisos');
  }

  if (!response.ok) {
    throw new Error(\`Error del servidor: \${response.status}\`);
  }

  return response.json();
}`,
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['Authorization', '401', 'response.ok', 'json()'],
            caseSensitive: false,
            explanation: 'Authorization header con ApiKey, verificar status 401 específicamente, luego response.ok para otros errores, y response.json() para los datos.',
          }),
          hintsJson: JSON.stringify([
            'El header se llama "Authorization". El código HTTP para "no autorizado" es 401.',
            'response.ok es true cuando el status está entre 200-299. Úsalo para detectar cualquier otro error.',
            'Authorization, 401, response.ok, json() son las cuatro piezas clave.',
          ]),
        },
        // 8. Build
        {
          order: 8,
          type: 'build',
          difficulty: 'medium',
          points: 20,
          prompt: `Construye una función llamada \`apiRequest\` que:
1. Acepte un endpoint (string) y una API Key (string)
2. Haga un GET con la API Key en el header \`Authorization: ApiKey <key>\`
3. Si el status es 401, lance un Error con el mensaje "Acceso denegado: API Key inválida"
4. Si el status es 403, lance un Error con el mensaje "Acceso denegado: sin permisos"
5. Si la respuesta no es ok (otros errores), lance un Error con "Error \${status}: \${statusText}"
6. Si todo va bien, devuelva los datos JSON`,
          starterCode: `async function apiRequest(endpoint, apiKey) {
  // Tu código aquí
}

// Ejemplo de uso:
// const datos = await apiRequest('https://api.ejemplo.com/recursos', 'mi-api-key');`,
          solution: `async function apiRequest(endpoint, apiKey) {
  const response = await fetch(endpoint, {
    headers: {
      'Authorization': \`ApiKey \${apiKey}\`
    }
  });

  if (response.status === 401) {
    throw new Error('Acceso denegado: API Key inválida');
  }

  if (response.status === 403) {
    throw new Error('Acceso denegado: sin permisos');
  }

  if (!response.ok) {
    throw new Error(\`Error \${response.status}: \${response.statusText}\`);
  }

  return response.json();
}

// Ejemplo de uso:
// const datos = await apiRequest('https://api.ejemplo.com/recursos', 'mi-api-key');`,
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['Authorization', 'ApiKey', '401', '403', 'response.ok', 'json()'],
            caseSensitive: false,
            explanation: 'La función debe enviar la API Key en headers, manejar 401 y 403 con mensajes específicos, y el resto de errores con response.ok.',
          }),
          hintsJson: JSON.stringify([
            'Usa fetch(endpoint, { headers: { "Authorization": `ApiKey ${apiKey}` } }).',
            'Verifica response.status === 401 antes que response.ok, ya que 401 también haría que ok sea false.',
            'El orden correcto: verificar 401 → verificar 403 → verificar !response.ok → return response.json().',
          ]),
        },
        // 9. Build
        {
          order: 9,
          type: 'build',
          difficulty: 'medium',
          points: 20,
          prompt: `Construye una función \`basicAuthFetch\` que:
1. Reciba una URL, un usuario y una contraseña
2. Codifique las credenciales con btoa() en formato "usuario:password"
3. Haga el request con el header de Basic Auth correcto
4. Devuelva los datos JSON si el status es 200
5. Lance un error descriptivo si el status es 401`,
          starterCode: `async function basicAuthFetch(url, usuario, password) {
  // Tu código aquí
}`,
          solution: `async function basicAuthFetch(url, usuario, password) {
  const credenciales = btoa(\`\${usuario}:\${password}\`);

  const response = await fetch(url, {
    headers: {
      'Authorization': \`Basic \${credenciales}\`
    }
  });

  if (response.status === 401) {
    throw new Error(\`Credenciales inválidas para el usuario: \${usuario}\`);
  }

  if (!response.ok) {
    throw new Error(\`Error \${response.status}: \${response.statusText}\`);
  }

  return response.json();
}`,
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['btoa', 'Basic', 'Authorization', '401', 'json()'],
            caseSensitive: false,
            explanation: 'btoa() para codificar usuario:password, header Authorization con prefijo Basic, manejo de 401 y retorno de JSON.',
          }),
          hintsJson: JSON.stringify([
            'Primero construye la cadena: `${usuario}:${password}`, luego pásala a btoa().',
            'El header Authorization debe ser: "Basic " + el resultado de btoa().',
            'btoa, Basic, Authorization, 401, json() son los elementos esenciales de Basic Auth.',
          ]),
        },
        // 10. Build
        {
          order: 10,
          type: 'build',
          difficulty: 'medium',
          points: 20,
          prompt: `Crea un objeto \`apiClient\` que almacene la API Key internamente y exponga un método \`get(endpoint)\`:
1. La API Key se pasa al crear el cliente (factory function o constructor)
2. El método \`get\` hace un fetch con la API Key en el header correcto
3. El método \`get\` devuelve los datos JSON
4. Si el status no es ok, lanza un Error con el status

Ejemplo de uso esperado:
\`\`\`javascript
const cliente = crearApiClient('mi-api-key-123');
const usuarios = await cliente.get('https://api.ejemplo.com/users');
\`\`\``,
          starterCode: `function crearApiClient(apiKey) {
  // Tu código aquí
  // Devuelve un objeto con método get()
}`,
          solution: `function crearApiClient(apiKey) {
  return {
    async get(endpoint) {
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': \`ApiKey \${apiKey}\`
        }
      });

      if (!response.ok) {
        throw new Error(\`Error \${response.status}: \${response.statusText}\`);
      }

      return response.json();
    }
  };
}`,
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['apiKey', 'Authorization', 'ApiKey', 'response.ok', 'json()'],
            caseSensitive: false,
            explanation: 'El patrón factory encapsula la API Key. El método get la usa en cada request sin exponerla directamente.',
          }),
          hintsJson: JSON.stringify([
            'Una factory function retorna un objeto. El apiKey queda en el closure, accesible por los métodos del objeto retornado.',
            'El método get es async y hace fetch con la API Key en headers.',
            'El objeto retornado: { async get(endpoint) { ... fetch con headers ... } }',
          ]),
        },
        // 11. Debug
        {
          order: 11,
          type: 'debug',
          difficulty: 'medium',
          points: 20,
          prompt: `Este código intenta autenticarse con Basic Auth pero falla con error 401 en el servidor. Encuentra el error y corrígelo:

\`\`\`javascript
const usuario = 'carlos';
const contrasena = 'mi_clave_2024';

// Intento 1
const creds1 = btoa(usuario, contrasena);

// Intento 2 (fallback)
const creds2 = btoa(\`\${contrasena}:\${usuario}\`);

const response = await fetch('https://api.empresa.com/secure', {
  method: 'GET',
  headers: {
    'authorization': \`basic \${creds1}\`
  }
});
\`\`\``,
          starterCode: `// Corrige los errores:
const usuario = 'carlos';
const contrasena = 'mi_clave_2024';

// Intento 1
const creds1 = btoa(usuario, contrasena);

// Intento 2 (fallback)
const creds2 = btoa(\`\${contrasena}:\${usuario}\`);

const response = await fetch('https://api.empresa.com/secure', {
  method: 'GET',
  headers: {
    'authorization': \`basic \${creds1}\`
  }
});`,
          solution: `// Errores corregidos:
const usuario = 'carlos';
const contrasena = 'mi_clave_2024';

// Error 1: btoa() toma UN solo argumento. Debe ser "usuario:contrasena"
const creds = btoa(\`\${usuario}:\${contrasena}\`);

// Error 2: El orden correcto es usuario:contrasena (no contrasena:usuario)
// Error 3: Los headers son case-sensitive. "Authorization" y "Basic" con mayúscula

const response = await fetch('https://api.empresa.com/secure', {
  method: 'GET',
  headers: {
    'Authorization': \`Basic \${creds}\`
  }
});`,
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['btoa', 'usuario:password', 'Authorization', 'Basic'],
            caseSensitive: false,
            explanation: 'Tres errores: btoa recibe un argumento (no dos), el orden es usuario:password, y los headers HTTP siguen la convención PascalCase aunque técnicamente no son case-sensitive en HTTP/1.1.',
          }),
          hintsJson: JSON.stringify([
            'btoa() acepta exactamente UN argumento. ¿Cómo combinas usuario y contraseña en una sola cadena?',
            'El formato Basic Auth es siempre "usuario:contraseña", no al revés.',
            'Aunque HTTP headers técnicamente no son case-sensitive, usa "Authorization" y "Basic" con mayúscula inicial por convención.',
          ]),
        },
        // 12. Challenge
        {
          order: 12,
          type: 'challenge',
          difficulty: 'medium',
          points: 30,
          prompt: `Reto integrador: Construye una clase \`AuthenticatedClient\` que soporte múltiples esquemas de autenticación.

Requisitos:
1. Constructor: recibe un objeto de configuración \`{ tipo: 'apikey' | 'basic', credencial }\`
   - Si tipo es 'apikey': credencial es la API Key
   - Si tipo es 'basic': credencial es un objeto \`{ usuario, password }\`
2. Método \`get(url)\`: hace el request con el header de autenticación correcto según el tipo
3. Método \`post(url, body)\`: igual que get pero POST con el body en JSON
4. Maneja los errores 401 y 403 con mensajes claros

Ejemplo de uso:
\`\`\`javascript
const clienteKey = new AuthenticatedClient({ tipo: 'apikey', credencial: 'sk-abc123' });
const clienteBasic = new AuthenticatedClient({ tipo: 'basic', credencial: { usuario: 'admin', password: 'pass' } });

await clienteKey.get('https://api.ejemplo.com/datos');
await clienteBasic.post('https://api.ejemplo.com/crear', { nombre: 'Test' });
\`\`\``,
          starterCode: `class AuthenticatedClient {
  constructor(config) {
    // Tu código aquí
  }

  _buildAuthHeader() {
    // Construye el header según el tipo de autenticación
  }

  async get(url) {
    // Tu código aquí
  }

  async post(url, body) {
    // Tu código aquí
  }
}`,
          solution: `class AuthenticatedClient {
  constructor(config) {
    this.tipo = config.tipo;
    this.credencial = config.credencial;
  }

  _buildAuthHeader() {
    if (this.tipo === 'apikey') {
      return { 'Authorization': \`ApiKey \${this.credencial}\` };
    }
    if (this.tipo === 'basic') {
      const { usuario, password } = this.credencial;
      const encoded = btoa(\`\${usuario}:\${password}\`);
      return { 'Authorization': \`Basic \${encoded}\` };
    }
    throw new Error(\`Tipo de autenticación desconocido: \${this.tipo}\`);
  }

  async _handleResponse(response) {
    if (response.status === 401) {
      throw new Error('Autenticación fallida: credenciales inválidas');
    }
    if (response.status === 403) {
      throw new Error('Acceso denegado: sin permisos para este recurso');
    }
    if (!response.ok) {
      throw new Error(\`Error \${response.status}: \${response.statusText}\`);
    }
    return response.json();
  }

  async get(url) {
    const response = await fetch(url, {
      headers: this._buildAuthHeader()
    });
    return this._handleResponse(response);
  }

  async post(url, body) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...this._buildAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    return this._handleResponse(response);
  }
}`,
          validationLogic: JSON.stringify({
            type: 'minimum_length',
            minLength: 100,
            keywords: ['AuthenticatedClient', 'apikey', 'basic', 'btoa', 'Authorization', '401', '403'],
            caseSensitive: false,
            explanation: 'La clase debe soportar ambos tipos, construir el header correcto para cada uno, y manejar los errores de autenticación.',
          }),
          hintsJson: JSON.stringify([
            'Guarda tipo y credencial en el constructor con this. Un método privado _buildAuthHeader() puede generar el header correcto según el tipo.',
            'Para apikey: "ApiKey " + credencial. Para basic: "Basic " + btoa(usuario + ":" + password).',
            'Un método _handleResponse(response) centraliza el manejo de 401, 403 y !response.ok para no repetir código en get() y post().',
          ]),
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // LECCIÓN 2 — JWT — JSON Web Tokens (12 ejercicios)
    // ═══════════════════════════════════════════════════════════════════════
    {
      lesson: {
        title: 'JWT — JSON Web Tokens',
        order: 2,
        type: 'theory',
        contentMd: `
# JWT — JSON Web Tokens

Un JWT es un token compacto y autocontenido que permite transmitir información
verificable entre dos partes. Es el estándar de facto para autenticación en APIs modernas.

## Estructura: tres partes separadas por puntos

\`\`\`
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJuYW1lIjoiTWFyaWEiLCJleHAiOjE3MDAwMDAwMDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
│────────────────────────────────────────│──────────────────────────────────────────│──────────────────────────────────────────│
         HEADER (base64)                           PAYLOAD (base64)                         SIGNATURE (HMAC)
\`\`\`

### Header — Tipo y algoritmo
\`\`\`json
{ "alg": "HS256", "typ": "JWT" }
\`\`\`

### Payload — Los datos (claims)
\`\`\`json
{
  "sub": "123",        // subject: ID del usuario
  "name": "Maria",     // dato personalizado
  "role": "admin",     // dato personalizado
  "iat": 1700000000,   // issued at (cuándo se creó)
  "exp": 1700003600    // expiration (cuándo expira, en Unix timestamp)
}
\`\`\`

### Signature — La garantía
La firma se calcula con la clave secreta del servidor:
\`\`\`
HMACSHA256(base64(header) + "." + base64(payload), SECRET_KEY)
\`\`\`

Si alguien modifica el payload, la firma no coincide y el servidor rechaza el token.

## Flujo completo de autenticación con JWT

\`\`\`
1. Cliente  →  POST /login { email, password }  →  Servidor
2. Servidor verifica credenciales
3. Servidor  →  { accessToken, refreshToken }  →  Cliente
4. Cliente guarda los tokens
5. Cliente  →  GET /profile + Authorization: Bearer <accessToken>  →  Servidor
6. Servidor verifica la firma del JWT
7. Servidor  →  { id: 123, name: "Maria" }  →  Cliente
\`\`\`

## Access Token vs Refresh Token

| | Access Token | Refresh Token |
|--|-------------|---------------|
| Vida útil | Corta (15 min) | Larga (7-30 días) |
| Se envía en | Cada request a la API | Solo a /auth/refresh |
| Almacenamiento | Memoria (preferido) o localStorage | HttpOnly cookie |
| Si se roba | Riesgo por 15 min | Riesgo por días |

## Uso en fetch()

\`\`\`javascript
const token = localStorage.getItem('accessToken');

const response = await fetch('https://api.ejemplo.com/perfil', {
  headers: {
    'Authorization': \`Bearer \${token}\`
  }
});
\`\`\`
        `,
      },
      exercises: [
        // 1. Quiz
        {
          order: 1,
          type: 'quiz',
          difficulty: 'medium',
          points: 10,
          prompt: '¿Cuántas partes tiene un JWT y cómo están separadas?',
          starterCode: null,
          solution: 'b',
          validationLogic: JSON.stringify({
            type: 'exact_match',
            answer: 'b',
            options: [
              { key: 'a', text: 'Dos partes separadas por comas: payload y firma' },
              { key: 'b', text: 'Tres partes separadas por puntos: header, payload y signature' },
              { key: 'c', text: 'Cuatro partes separadas por guiones: tipo, algoritmo, datos y firma' },
              { key: 'd', text: 'Una sola parte cifrada que contiene todo' },
            ],
            explanation: 'Un JWT tiene exactamente tres partes separadas por puntos (.): header (algoritmo y tipo), payload (los datos/claims) y signature (la firma de verificación).',
          }),
          hintsJson: JSON.stringify([
            'Observa un JWT real: eyXXX.eyYYY.ZZZZ ¿Cuántos puntos hay?',
            'Cada punto separa una parte: la primera es el header, la segunda el payload, la tercera la firma.',
            'La respuesta es B: tres partes (header.payload.signature) separadas por puntos.',
          ]),
        },
        // 2. Quiz
        {
          order: 2,
          type: 'quiz',
          difficulty: 'medium',
          points: 10,
          prompt: '¿Por qué el access token tiene una vida útil corta (15 minutos) y el refresh token una larga (7-30 días)?',
          starterCode: null,
          solution: 'a',
          validationLogic: JSON.stringify({
            type: 'exact_match',
            answer: 'a',
            options: [
              { key: 'a', text: 'Para limitar el daño si el access token es robado: expira pronto. El refresh token está más protegido (HttpOnly cookie) y renueva el access token' },
              { key: 'b', text: 'Por razones de rendimiento: tokens cortos son más rápidos de verificar' },
              { key: 'c', text: 'Es solo convención sin razón de seguridad específica' },
              { key: 'd', text: 'Para que el usuario inicie sesión cada 15 minutos obligatoriamente' },
            ],
            explanation: 'El access token viaja en cada request (mayor exposición). Si es robado, expira en 15 min. El refresh token solo se usa para renovar y suele estar en una HttpOnly cookie, menos accesible desde JavaScript malicioso.',
          }),
          hintsJson: JSON.stringify([
            'El access token viaja en CADA request a la API. El refresh token solo viaja a /auth/refresh. ¿Cuál tiene más exposición?',
            'Si un atacante roba el access token, ¿cuánto tiempo tiene para usarlo si dura 15 min vs 30 días?',
            'La respuesta es A: tiempo de vida corto = ventana de daño limitada en caso de robo.',
          ]),
        },
        // 3. Observe
        {
          order: 3,
          type: 'observe',
          difficulty: 'medium',
          points: 10,
          prompt: `Analiza este JWT y responde las preguntas:

\`\`\`
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MiIsImVtYWlsIjoianVhbkBlamVtcGxvLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDAwOTAwfQ.firma_aqui
\`\`\`

El payload decodificado es:
\`\`\`json
{ "sub": "42", "email": "juan@ejemplo.com", "role": "admin", "iat": 1700000000, "exp": 1700000900 }
\`\`\`

Preguntas:
1. ¿Cuántos minutos dura este token? (exp - iat = 900 segundos)
2. ¿Qué claim identifica al usuario y cuál es su ID?
3. ¿Es seguro almacenar la contraseña del usuario en el payload del JWT?`,
          starterCode: null,
          solution: '1. El token dura 15 minutos (900 segundos / 60 = 15 minutos). Esto es estándar para access tokens.\n2. El claim "sub" (subject) identifica al usuario. El ID es 42.\n3. No. El payload de un JWT está codificado en base64, no cifrado. Cualquiera puede decodificarlo con atob() o jwt.io. Nunca almacenar contraseñas, números de tarjeta u otros secretos en el payload.',
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['15 minutos', 'sub', '42', 'base64', 'no cifrado'],
            caseSensitive: false,
            explanation: '900 segundos = 15 minutos. "sub" es el claim estándar para el subject (usuario). El payload es base64, no cifrado, así que nunca incluir datos sensibles.',
          }),
          hintsJson: JSON.stringify([
            '900 segundos ÷ 60 = ? minutos. iat = issued at (creación), exp = expiration.',
            '"sub" viene de "subject" (sujeto del token, el usuario). El valor es el ID: 42.',
            'Base64 se puede decodificar sin clave. Ve a jwt.io y pega el token: verás el payload en texto plano.',
          ]),
        },
        // 4. Observe
        {
          order: 4,
          type: 'observe',
          difficulty: 'medium',
          points: 10,
          prompt: `Observa este flujo de login y uso del token:

\`\`\`javascript
// Paso 1: Login
const loginRes = await fetch('https://api.app.com/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'ana@app.com', password: 'pass123' })
});
const { accessToken, refreshToken } = await loginRes.json();

// Paso 2: Usar el token
const perfilRes = await fetch('https://api.app.com/me', {
  headers: { 'Authorization': \`Bearer \${accessToken}\` }
});
const perfil = await perfilRes.json();
\`\`\`

Preguntas:
1. ¿Qué esquema de autenticación se usa en el header (Bearer, Basic, ApiKey)?
2. ¿Dónde guardarías el accessToken? ¿Y el refreshToken? ¿Por qué en lugares distintos?
3. ¿Qué debería hacer el cliente cuando recibe un 401 al usar el accessToken?`,
          starterCode: null,
          solution: '1. Se usa el esquema "Bearer". El header es: Authorization: Bearer <token>.\n2. El accessToken puede ir en memoria (variable JavaScript) para mayor seguridad, ya que no persiste entre recargas pero no es accesible a otros scripts. El refreshToken debe ir en una HttpOnly cookie (el servidor la establece), porque HttpOnly cookies no son accesibles desde JavaScript, protegiéndolas de ataques XSS.\n3. Cuando recibe 401, el cliente debe intentar refrescar el token: hacer POST /auth/refresh con el refreshToken. Si el refresh también falla (401/403), redirigir al usuario al login.',
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['Bearer', 'memoria', 'HttpOnly', 'XSS', 'refresh', '401'],
            caseSensitive: false,
            explanation: 'Bearer es el esquema JWT. Access token en memoria, refresh token en HttpOnly cookie. Un 401 activa el flujo de refresco.',
          }),
          hintsJson: JSON.stringify([
            'El esquema en "Authorization: Bearer xxx" es "Bearer". Diferente de "Basic" y "ApiKey".',
            'HttpOnly cookies no son accesibles con document.cookie ni JavaScript. Esto protege contra XSS.',
            'El flujo al recibir 401: intentar /auth/refresh → si funciona, reintentar request → si falla, ir al login.',
          ]),
        },
        // 5. Fill blank
        {
          order: 5,
          type: 'fill_blank',
          difficulty: 'medium',
          points: 15,
          prompt: 'Completa el flujo de login: hace el request, extrae el token y lo usa en el siguiente request:',
          starterCode: `async function login(email, password) {
  const res = await fetch('/auth/login', {
    method: '___',
    headers: { 'Content-Type': '___' },
    body: ___(___),
  });

  if (!res.ok) throw new Error('Login fallido');

  const { ___ } = await res.json();
  return accessToken;
}

async function fetchPerfil(token) {
  const res = await fetch('/me', {
    headers: {
      '___': \`___ \${token}\`
    }
  });
  return res.___;
}`,
          solution: `async function login(email, password) {
  const res = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error('Login fallido');

  const { accessToken } = await res.json();
  return accessToken;
}

async function fetchPerfil(token) {
  const res = await fetch('/me', {
    headers: {
      'Authorization': \`Bearer \${token}\`
    }
  });
  return res.json();
}`,
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['POST', 'application/json', 'JSON.stringify', 'accessToken', 'Authorization', 'Bearer', 'json()'],
            caseSensitive: false,
            explanation: 'Login: POST con Content-Type JSON, body con JSON.stringify, extraer accessToken. Uso: header Authorization con Bearer.',
          }),
          hintsJson: JSON.stringify([
            'El login envía datos al servidor: usa método POST y Content-Type: application/json.',
            'JSON.stringify convierte el objeto a string JSON. La respuesta tiene accessToken: desestructúralo con { accessToken }.',
            'Para usar el token: "Authorization": `Bearer ${token}`. Siempre Bearer (no Basic, no ApiKey).',
          ]),
        },
        // 6. Fill blank
        {
          order: 6,
          type: 'fill_blank',
          difficulty: 'medium',
          points: 15,
          prompt: 'Completa esta función que decodifica el payload de un JWT sin librerías (solo base64):',
          starterCode: `function decodificarJWT(token) {
  // El JWT tiene formato: header.payload.signature
  const partes = token.___(___);

  // El payload es la parte del medio (índice 1)
  const payloadBase64 = partes[___];

  // Decodificar base64 → JSON string
  const payloadJSON = ___(payloadBase64);

  // Parsear el JSON string a objeto
  return JSON.___(payloadJSON);
}`,
          solution: `function decodificarJWT(token) {
  // El JWT tiene formato: header.payload.signature
  const partes = token.split('.');

  // El payload es la parte del medio (índice 1)
  const payloadBase64 = partes[1];

  // Decodificar base64 → JSON string
  const payloadJSON = atob(payloadBase64);

  // Parsear el JSON string a objeto
  return JSON.parse(payloadJSON);
}`,
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['split', '.', '1', 'atob', 'JSON.parse'],
            caseSensitive: false,
            explanation: 'JWT: dividir por punto, tomar índice 1 (payload), decodificar con atob(), parsear con JSON.parse().',
          }),
          hintsJson: JSON.stringify([
            'Las tres partes del JWT están separadas por puntos. String.split(".") devuelve un array.',
            'El payload es la segunda parte: índice 1. atob() decodifica base64 a string.',
            'split(".")[1] para el payload, atob() para decodificar, JSON.parse() para convertir a objeto.',
          ]),
        },
        // 7. Fill blank
        {
          order: 7,
          type: 'fill_blank',
          difficulty: 'medium',
          points: 15,
          prompt: 'Completa esta función que verifica si un token JWT ha expirado:',
          starterCode: `function tokenExpirado(token) {
  // Decodificar el payload
  const payload = JSON.parse(___(token.split('.')___));

  // El claim 'exp' está en segundos desde Unix epoch
  const ahora = Math.floor(Date.now() / ___);

  // Retorna true si el token ya expiró
  return payload.___ < ___;
}`,
          solution: `function tokenExpirado(token) {
  // Decodificar el payload
  const payload = JSON.parse(atob(token.split('.')[1]));

  // El claim 'exp' está en segundos desde Unix epoch
  const ahora = Math.floor(Date.now() / 1000);

  // Retorna true si el token ya expiró
  return payload.exp < ahora;
}`,
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['atob', 'split', '[1]', '1000', 'payload.exp'],
            caseSensitive: false,
            explanation: 'Decodificar payload con atob(split(".")[1]), convertir Date.now() de ms a segundos dividiendo por 1000, comparar exp con ahora.',
          }),
          hintsJson: JSON.stringify([
            'Combina split(".") y [1] para obtener el payload en base64, luego atob() para decodificar y JSON.parse() para convertir.',
            'Date.now() retorna milisegundos. Los claims JWT usan segundos. Divide por 1000.',
            'exp < ahora significa que la fecha de expiración ya pasó. Retorna true si el token está vencido.',
          ]),
        },
        // 8. Build
        {
          order: 8,
          type: 'build',
          difficulty: 'medium',
          points: 20,
          prompt: `Construye una función \`fetchConAuth\` que:
1. Reciba una URL y un token de acceso
2. Haga el request con \`Authorization: Bearer <token>\`
3. Si el status es 401, lance un Error con el mensaje "Token expirado o inválido"
4. Si el status es 403, lance un Error con "Sin permisos para este recurso"
5. Si la respuesta es ok, devuelva los datos JSON`,
          starterCode: `async function fetchConAuth(url, token) {
  // Tu código aquí
}`,
          solution: `async function fetchConAuth(url, token) {
  const response = await fetch(url, {
    headers: {
      'Authorization': \`Bearer \${token}\`
    }
  });

  if (response.status === 401) {
    throw new Error('Token expirado o inválido');
  }

  if (response.status === 403) {
    throw new Error('Sin permisos para este recurso');
  }

  if (!response.ok) {
    throw new Error(\`Error \${response.status}: \${response.statusText}\`);
  }

  return response.json();
}`,
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['Bearer', 'Authorization', '401', '403', 'response.ok', 'json()'],
            caseSensitive: false,
            explanation: 'Bearer en el header Authorization, manejo diferenciado de 401 (token inválido) y 403 (sin permisos), retorno de JSON.',
          }),
          hintsJson: JSON.stringify([
            'El esquema para JWT es Bearer: "Authorization": `Bearer ${token}`.',
            '401 = token inválido o expirado. 403 = token válido pero sin permisos suficientes. Son errores distintos.',
            'Orden: fetch → verificar 401 → verificar 403 → verificar !ok → return json().',
          ]),
        },
        // 9. Build
        {
          order: 9,
          type: 'build',
          difficulty: 'medium',
          points: 20,
          prompt: `Construye una función \`loginYFetch\` que:
1. Primero haga POST a \`/auth/login\` con \`{ email, password }\`
2. Extraiga el \`accessToken\` de la respuesta
3. Use ese token para hacer GET a la URL destino
4. Devuelva los datos de la URL destino

Si el login falla, lanza un error descriptivo.`,
          starterCode: `async function loginYFetch(email, password, urlDestino) {
  // Paso 1: Login

  // Paso 2: Extraer token

  // Paso 3: Usar token en el request

  // Paso 4: Devolver datos
}`,
          solution: `async function loginYFetch(email, password, urlDestino) {
  // Paso 1: Login
  const loginRes = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  // Paso 2: Extraer token
  if (!loginRes.ok) {
    throw new Error(\`Login fallido: \${loginRes.status} \${loginRes.statusText}\`);
  }
  const { accessToken } = await loginRes.json();

  // Paso 3: Usar token en el request
  const dataRes = await fetch(urlDestino, {
    headers: { 'Authorization': \`Bearer \${accessToken}\` }
  });

  if (!dataRes.ok) {
    throw new Error(\`Error al obtener datos: \${dataRes.status}\`);
  }

  // Paso 4: Devolver datos
  return dataRes.json();
}`,
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['POST', 'JSON.stringify', 'accessToken', 'Bearer', 'Authorization', 'json()'],
            caseSensitive: false,
            explanation: 'Flujo completo: POST al login con JSON, extraer accessToken, usar en header Bearer, retornar datos JSON.',
          }),
          hintsJson: JSON.stringify([
            'Paso 1: fetch("/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({email, password}) })',
            'La respuesta del login contiene { accessToken }. Desestructúralo después de verificar loginRes.ok.',
            'Usar el token: fetch(urlDestino, { headers: { "Authorization": `Bearer ${accessToken}` } })',
          ]),
        },
        // 10. Build
        {
          order: 10,
          type: 'build',
          difficulty: 'medium',
          points: 20,
          prompt: `Construye una función \`refreshAccessToken\` que:
1. Reciba el refreshToken como argumento
2. Haga POST a \`/auth/refresh\` enviando \`{ refreshToken }\` en el body
3. Si el servidor responde con 200, devuelva el nuevo \`accessToken\`
4. Si responde con 401 o 403, lance un Error "Sesión expirada, inicia sesión de nuevo"
5. Si hay otro error, lance un Error con el status`,
          starterCode: `async function refreshAccessToken(refreshToken) {
  // Tu código aquí
}`,
          solution: `async function refreshAccessToken(refreshToken) {
  const response = await fetch('/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error('Sesión expirada, inicia sesión de nuevo');
  }

  if (!response.ok) {
    throw new Error(\`Error al refrescar sesión: \${response.status}\`);
  }

  const { accessToken } = await response.json();
  return accessToken;
}`,
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['POST', 'refreshToken', 'JSON.stringify', '401', 'accessToken', 'json()'],
            caseSensitive: false,
            explanation: 'POST a /auth/refresh con el refreshToken, manejar 401/403 como sesión expirada, retornar el nuevo accessToken.',
          }),
          hintsJson: JSON.stringify([
            'Envía el refreshToken en el body como JSON: JSON.stringify({ refreshToken }).',
            '401 y 403 en /auth/refresh significa que el refresh token ya no es válido. El usuario debe loguearse de nuevo.',
            'Si todo va bien, la respuesta tiene { accessToken }. Desestructúralo y retórnalo.',
          ]),
        },
        // 11. Debug
        {
          order: 11,
          type: 'debug',
          difficulty: 'medium',
          points: 20,
          prompt: `Este código intenta usar un JWT pero el servidor rechaza todos los requests con 401. Encuentra los errores:

\`\`\`javascript
const token = localStorage.getItem('jwt_token');

// Request autenticado
const res = await fetch('/api/perfil', {
  headers: {
    'Authorization': token,
    'Content-Type': 'application/json'
  }
});

// Decodificar el payload para mostrar el nombre
const partes = token.split('.');
const payload = JSON.parse(partes[2]);  // La firma
console.log('Usuario:', payload.name);
\`\`\``,
          starterCode: `// Corrige los errores:
const token = localStorage.getItem('jwt_token');

// Request autenticado
const res = await fetch('/api/perfil', {
  headers: {
    'Authorization': token,
    'Content-Type': 'application/json'
  }
});

// Decodificar el payload
const partes = token.split('.');
const payload = JSON.parse(partes[2]);
console.log('Usuario:', payload.name);`,
          solution: `// Errores corregidos:
const token = localStorage.getItem('jwt_token');

// Error 1: El header Authorization con JWT debe tener el prefijo "Bearer "
const res = await fetch('/api/perfil', {
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json'
  }
});

// Error 2: El payload es la parte del MEDIO (índice 1), no la firma (índice 2)
// Error 3: Además hay que decodificar con atob() antes de JSON.parse()
const partes = token.split('.');
const payload = JSON.parse(atob(partes[1]));
console.log('Usuario:', payload.name);`,
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['Bearer', 'atob', 'partes[1]', 'Authorization'],
            caseSensitive: false,
            explanation: 'Dos errores: falta el prefijo "Bearer " en Authorization, y el payload es el índice 1 (no 2) y debe decodificarse con atob().',
          }),
          hintsJson: JSON.stringify([
            'El header para JWT no es solo el token. Debe ser: "Bearer " + token. Sin el prefijo, el servidor no reconoce el esquema.',
            'Un JWT tiene: header(0), payload(1), signature(2). El payload con los datos del usuario está en índice 1, no 2.',
            'El payload está en base64. Necesitas atob(partes[1]) antes de JSON.parse(), no directamente JSON.parse(partes[1]).',
          ]),
        },
        // 12. Challenge
        {
          order: 12,
          type: 'challenge',
          difficulty: 'medium',
          points: 30,
          prompt: `Reto: Implementa un cliente JWT completo con manejo automático de refresh.

La función \`fetchAutenticado(url, opciones)\` debe:
1. Leer el accessToken desde localStorage ('access_token')
2. Verificar si el token ha expirado antes de usarlo (decodificando el claim \`exp\`)
3. Si expiró: llamar a \`/auth/refresh\` con el refreshToken (desde localStorage 'refresh_token'), guardar el nuevo accessToken
4. Hacer el request a la URL con el token válido
5. Si el request devuelve 401 (el token expiró en el servidor entre el paso 2 y el request): intentar el refresh una vez más
6. Devolver los datos JSON

El cliente debe ser "transparente": quien lo usa no sabe que hubo un refresh.`,
          starterCode: `async function fetchAutenticado(url, opciones = {}) {
  // Tu código aquí — implementa el flujo completo con auto-refresh
}`,
          solution: `async function fetchAutenticado(url, opciones = {}) {
  let accessToken = localStorage.getItem('access_token');

  // Verificar si el token expiró localmente
  if (accessToken) {
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const ahora = Math.floor(Date.now() / 1000);
    if (payload.exp < ahora) {
      accessToken = await refrescarToken();
    }
  }

  // Hacer el request con el token
  const response = await fetch(url, {
    ...opciones,
    headers: {
      ...opciones.headers,
      'Authorization': \`Bearer \${accessToken}\`
    }
  });

  // Si el servidor devuelve 401, intentar refresh una vez más
  if (response.status === 401) {
    accessToken = await refrescarToken();
    const retry = await fetch(url, {
      ...opciones,
      headers: {
        ...opciones.headers,
        'Authorization': \`Bearer \${accessToken}\`
      }
    });
    if (!retry.ok) throw new Error('Sesión expirada. Por favor inicia sesión de nuevo.');
    return retry.json();
  }

  if (!response.ok) {
    throw new Error(\`Error \${response.status}: \${response.statusText}\`);
  }

  return response.json();
}

async function refrescarToken() {
  const refreshToken = localStorage.getItem('refresh_token');
  const res = await fetch('/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  if (!res.ok) throw new Error('Sesión expirada. Por favor inicia sesión de nuevo.');
  const { accessToken } = await res.json();
  localStorage.setItem('access_token', accessToken);
  return accessToken;
}`,
          validationLogic: JSON.stringify({
            type: 'minimum_length',
            minLength: 120,
            keywords: ['Bearer', 'atob', 'exp', 'refresh', '401', 'localStorage', 'json()'],
            caseSensitive: false,
            explanation: 'El cliente completo verifica expiración local, hace refresh si es necesario, reintenta en 401 y es transparente para el llamador.',
          }),
          hintsJson: JSON.stringify([
            'Flujo: leer token → ¿expirado? (atob + exp < ahora) → si sí, refresh → hacer request → ¿401? → un refresh más → devolver datos.',
            'Para verificar expiración: JSON.parse(atob(token.split(".")[1])).exp < Math.floor(Date.now() / 1000)',
            'Extrae la lógica de refresh a una función aparte (refrescarToken) para poder llamarla en dos lugares sin repetir código.',
          ]),
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════════════
    // LECCIÓN 3 — OAuth 2.0 y Seguridad (11 ejercicios)
    // ═══════════════════════════════════════════════════════════════════════
    {
      lesson: {
        title: 'OAuth 2.0 y Seguridad',
        order: 3,
        type: 'theory',
        contentMd: `
# OAuth 2.0 — Autorización Delegada

OAuth 2.0 no es un protocolo de autenticación, es un protocolo de **autorización delegada**.
Permite que una aplicación acceda a recursos en nombre del usuario, sin que el usuario
entregue su contraseña a esa aplicación.

## El flujo que todos conocen

Cuando haces clic en **"Continuar con Google"**:
1. La app te redirige a Google (el servidor de autorización)
2. Google te pide permiso: "¿Permitir a AppX acceder a tu email y perfil?"
3. Tú aceptas
4. Google redirige de vuelta a la app con un **authorization code**
5. La app intercambia ese código por un **access token** (en el backend, de forma segura)
6. La app usa el access token para llamar a la API de Google en tu nombre

## Authorization Code Flow (el más seguro)

\`\`\`
Usuario → App → Servidor de Autorización (Google, GitHub, etc.)
                       ↓ "¿Das permiso?"
                    Usuario acepta
                       ↓
App recibe: authorization_code (en la URL de callback)
App intercambia (backend): code + client_secret → access_token + refresh_token
App llama a la API con access_token
\`\`\`

## Scopes — Permisos granulares

Los scopes definen exactamente qué puede hacer el access token:

\`\`\`
scope=read:email              → solo leer email
scope=read:profile write:posts → leer perfil Y escribir posts
scope=repo                    → acceso completo a repositorios (GitHub)
\`\`\`

**Principio de mínimo privilegio**: pedir solo los scopes necesarios.

## PKCE — Protección extra para apps públicas

Para apps móviles y SPAs (Single Page Apps) que no pueden guardar un client_secret
de forma segura, se usa PKCE (Proof Key for Code Exchange):

1. La app genera un \`code_verifier\` (cadena aleatoria)
2. Calcula \`code_challenge = SHA256(code_verifier)\` y lo envía al inicio del flujo
3. Al intercambiar el código, envía el \`code_verifier\` original
4. El servidor verifica que coincida con el challenge → confirma que es la misma app

## ¿Cuándo usar OAuth vs JWT simple?

| Caso | Recomendación |
|------|--------------|
| Tu propia app con tus propios usuarios | JWT simple (login/password) |
| Acceder a APIs de terceros (GitHub, Google) | OAuth 2.0 |
| App de terceros que accede a tu API | OAuth 2.0 |
| Microservicios internos | JWT simple o mTLS |
| App móvil o SPA con OAuth | OAuth + PKCE |
        `,
      },
      exercises: [
        // 1. Quiz
        {
          order: 1,
          type: 'quiz',
          difficulty: 'medium',
          points: 10,
          prompt: '¿Cuál es la ventaja principal de OAuth 2.0 sobre darle tu contraseña directamente a una aplicación de terceros?',
          starterCode: null,
          solution: 'b',
          validationLogic: JSON.stringify({
            type: 'exact_match',
            answer: 'b',
            options: [
              { key: 'a', text: 'OAuth 2.0 es más rápido que usar contraseñas' },
              { key: 'b', text: 'La app de terceros nunca ve tu contraseña; solo recibe un token con permisos limitados que puedes revocar' },
              { key: 'c', text: 'OAuth 2.0 no requiere autenticación del usuario' },
              { key: 'd', text: 'Permite usar la misma contraseña en múltiples servicios' },
            ],
            explanation: 'Con OAuth 2.0, la app tercera recibe un access token (no tu contraseña). Ese token tiene scopes limitados y puedes revocarlo en cualquier momento desde la configuración de tu cuenta.',
          }),
          hintsJson: JSON.stringify([
            'Piensa en "Iniciar sesión con Google". ¿Google le da tu contraseña a la app? ¿Qué le da en cambio?',
            'Los tokens tienen scopes (permisos limitados) y tienen expiración. Las contraseñas no.',
            'La respuesta es B: la app nunca ve tu contraseña y el token es revocable.',
          ]),
        },
        // 2. Quiz
        {
          order: 2,
          type: 'quiz',
          difficulty: 'medium',
          points: 10,
          prompt: '¿Qué es un "scope" en OAuth 2.0?',
          starterCode: null,
          solution: 'c',
          validationLogic: JSON.stringify({
            type: 'exact_match',
            answer: 'c',
            options: [
              { key: 'a', text: 'El tiempo de vida del access token' },
              { key: 'b', text: 'El identificador único del cliente OAuth' },
              { key: 'c', text: 'Los permisos específicos que el access token otorga (qué puede hacer la app)' },
              { key: 'd', text: 'La URL de callback donde se redirige al usuario' },
            ],
            explanation: 'Los scopes son los permisos granulares del token. Ejemplo: scope=read:email solo permite leer el email. Si la app pide scope=delete:everything, deberías negarte.',
          }),
          hintsJson: JSON.stringify([
            'Cuando Google te pregunta "¿Permitir a AppX acceder a tu perfil y email?", eso es mostrarte los scopes solicitados.',
            'El principio de mínimo privilegio dice: pide solo los scopes que necesitas.',
            'La respuesta es C: los scopes definen qué puede y qué no puede hacer el access token.',
          ]),
        },
        // 3. Observe
        {
          order: 3,
          type: 'observe',
          difficulty: 'medium',
          points: 10,
          prompt: `Observa esta URL de inicio de flujo OAuth 2.0 y responde:

\`\`\`
https://github.com/login/oauth/authorize
  ?client_id=Iv1.abc123def456
  &redirect_uri=https://miapp.com/auth/callback
  &scope=read:user%20user:email
  &state=xK9mP2qR7vL4nJ8w
  &response_type=code
\`\`\`

Preguntas:
1. ¿Qué permisos está solicitando esta app al usuario?
2. ¿Para qué sirve el parámetro \`state\`?
3. ¿Qué recibirá la app en la URL de callback si el usuario acepta?`,
          starterCode: null,
          solution: '1. La app solicita dos permisos (scopes): "read:user" (leer información del perfil del usuario) y "user:email" (acceder al email del usuario). El %20 es un espacio codificado en URL.\n2. El parámetro state es una cadena aleatoria que la app genera y luego verifica cuando recibe el callback. Protege contra ataques CSRF: si el state del callback no coincide con el que generaste, alguien está intentando engañarte.\n3. GitHub redirigirá a https://miapp.com/auth/callback?code=XXXXXXXXXXX&state=xK9mP2qR7vL4nJ8w. La app recibirá el authorization code (code) en la URL.',
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['read:user', 'user:email', 'CSRF', 'state', 'authorization code', 'code'],
            caseSensitive: false,
            explanation: 'read:user y user:email son los scopes. state protege contra CSRF. El callback recibirá un authorization code.',
          }),
          hintsJson: JSON.stringify([
            'scope= contiene los permisos separados por espacio (codificado como %20). Lee cada parte separada.',
            'state es un token anti-CSRF. Si alguien secuestra el callback, el state no coincidirá con el que guardaste.',
            'response_type=code significa que el callback traerá un "code" (authorization code) en los query params.',
          ]),
        },
        // 4. Observe
        {
          order: 4,
          type: 'observe',
          difficulty: 'medium',
          points: 10,
          prompt: `Observa este intercambio de código por token (paso backend de OAuth) y responde:

\`\`\`javascript
// Backend: intercambiar el authorization code por tokens
const response = await fetch('https://github.com/login/oauth/access_token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code: req.query.code,
    redirect_uri: 'https://miapp.com/auth/callback'
  })
});

const { access_token, token_type, scope } = await response.json();
\`\`\`

Preguntas:
1. ¿Por qué este intercambio se hace en el backend y no en el frontend?
2. ¿Qué pasaría si el client_secret estuviera en el código JavaScript del cliente?
3. ¿Qué es lo que se recibe en la respuesta?`,
          starterCode: null,
          solution: '1. El intercambio se hace en el backend porque requiere el client_secret. El client_secret es como la contraseña de la aplicación y nunca debe estar en código ejecutado en el navegador del usuario, ya que cualquiera podría inspeccionarlo con las DevTools del navegador.\n2. Si el client_secret estuviera en el frontend, cualquier usuario podría abrirlo con las DevTools, copiarlo y usarlo para hacer solicitudes OAuth en nombre de tu aplicación, o crear aplicaciones maliciosas que se hagan pasar por la tuya.\n3. La respuesta contiene: access_token (el token para llamar a la API de GitHub), token_type (usualmente "bearer") y scope (los permisos que efectivamente fueron concedidos).',
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['client_secret', 'backend', 'DevTools', 'access_token', 'bearer'],
            caseSensitive: false,
            explanation: 'El client_secret es confidencial y solo puede estar en el backend. La respuesta incluye access_token, token_type y scope.',
          }),
          hintsJson: JSON.stringify([
            'El client_secret es como la contraseña de tu app. ¿Dónde puede vivir de forma segura: en el servidor o en el navegador?',
            'El código JavaScript del frontend es visible para cualquier usuario con F12 → Sources. El código del backend no.',
            'La desestructuración { access_token, token_type, scope } revela qué viene en la respuesta.',
          ]),
        },
        // 5. Fill blank
        {
          order: 5,
          type: 'fill_blank',
          difficulty: 'medium',
          points: 15,
          prompt: 'Completa la URL de inicio del flujo OAuth 2.0 con GitHub (Authorization Code Flow):',
          starterCode: `function construirUrlOAuth(clientId, redirectUri, scopes) {
  const baseUrl = 'https://github.com/login/oauth/authorize';

  // Generar state aleatorio para protección CSRF
  const state = crypto.getRandomValues(new Uint8Array(16))
    .reduce((acc, b) => acc + b.toString(16).padStart(2, '0'), '');

  const params = new URLSearchParams({
    ___: clientId,
    ___: redirectUri,
    scope: ___.join('___'),
    ___: state,
    response_type: '___'
  });

  return \`\${baseUrl}?\${params.toString()}\`;
}`,
          solution: `function construirUrlOAuth(clientId, redirectUri, scopes) {
  const baseUrl = 'https://github.com/login/oauth/authorize';

  // Generar state aleatorio para protección CSRF
  const state = crypto.getRandomValues(new Uint8Array(16))
    .reduce((acc, b) => acc + b.toString(16).padStart(2, '0'), '');

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes.join(' '),
    state: state,
    response_type: 'code'
  });

  return \`\${baseUrl}?\${params.toString()}\`;
}`,
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['client_id', 'redirect_uri', 'scopes.join', 'state', 'response_type', 'code'],
            caseSensitive: false,
            explanation: 'client_id, redirect_uri, scopes separados por espacio (join(" ")), state anti-CSRF, y response_type: "code" para Authorization Code Flow.',
          }),
          hintsJson: JSON.stringify([
            'Los parámetros OAuth estándar: client_id (identificador de la app), redirect_uri (URL de callback), scope, state, response_type.',
            'Los scopes se separan por espacio: ["read:user", "user:email"].join(" ") = "read:user user:email".',
            'response_type: "code" indica Authorization Code Flow, que devuelve un código de autorización.',
          ]),
        },
        // 6. Fill blank
        {
          order: 6,
          type: 'fill_blank',
          difficulty: 'medium',
          points: 15,
          prompt: 'Completa este handler de callback OAuth que intercambia el code por un token y verifica el state:',
          starterCode: `async function handleOAuthCallback(req, savedState) {
  const { ___, ___ } = req.query;

  // Verificar el state para prevenir CSRF
  if (code !== ___) {
    throw new Error('State inválido: posible ataque CSRF');
  }

  // Intercambiar el code por un access token
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: '___',
    headers: {
      'Content-Type': '___',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      ___: code
    })
  });

  const { access_token } = await response.___;
  return access_token;
}`,
          solution: `async function handleOAuthCallback(req, savedState) {
  const { code, state } = req.query;

  // Verificar el state para prevenir CSRF
  if (state !== savedState) {
    throw new Error('State inválido: posible ataque CSRF');
  }

  // Intercambiar el code por un access token
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: code
    })
  });

  const { access_token } = await response.json();
  return access_token;
}`,
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['code', 'state', 'savedState', 'POST', 'application/json', 'json()'],
            caseSensitive: false,
            explanation: 'Extraer code y state del callback, verificar state contra el guardado, hacer POST para intercambiar el code, retornar access_token.',
          }),
          hintsJson: JSON.stringify([
            'req.query contiene los parámetros de la URL de callback: code y state.',
            'La verificación de state previene CSRF: compara el state recibido con el que guardaste antes de redirigir al usuario.',
            'El intercambio es un POST con client_id, client_secret y code. La respuesta trae access_token.',
          ]),
        },
        // 7. Fill blank
        {
          order: 7,
          type: 'fill_blank',
          difficulty: 'hard',
          points: 15,
          prompt: 'Completa la generación del code_verifier y code_challenge para PKCE:',
          starterCode: `async function generarPKCE() {
  // Generar code_verifier (43-128 caracteres aleatorios URL-safe)
  const array = new Uint8Array(32);
  crypto.___(array);
  const codeVerifier = btoa(String.fromCharCode(...array))
    .replace(/\\+/g, '-')
    .replace(/\\//g, '_')
    .___;  // Eliminar padding '='

  // Calcular code_challenge = SHA256(code_verifier) codificado en base64url
  const encoder = new TextEncoder();
  const data = encoder.___(codeVerifier);
  const hash = await crypto.subtle.digest('___', data);
  const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\\+/g, '-')
    .replace(/\\//g, '_')
    .replace(/=/g, '');

  return { ___, ___ };
}`,
          solution: `async function generarPKCE() {
  // Generar code_verifier (43-128 caracteres aleatorios URL-safe)
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const codeVerifier = btoa(String.fromCharCode(...array))
    .replace(/\\+/g, '-')
    .replace(/\\//g, '_')
    .replace(/=/g, '');  // Eliminar padding '='

  // Calcular code_challenge = SHA256(code_verifier) codificado en base64url
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\\+/g, '-')
    .replace(/\\//g, '_')
    .replace(/=/g, '');

  return { codeVerifier, codeChallenge };
}`,
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['getRandomValues', 'replace', 'encode', 'SHA-256', 'codeVerifier', 'codeChallenge'],
            caseSensitive: false,
            explanation: 'PKCE: getRandomValues para entropía, SHA-256 para el challenge, base64url (sin + / =) para la codificación.',
          }),
          hintsJson: JSON.stringify([
            'Para generar bytes aleatorios: crypto.getRandomValues(array). Para el hash: crypto.subtle.digest("SHA-256", data).',
            'base64url reemplaza + por -, / por _ y elimina el padding =. Eso hace que sea seguro en URLs.',
            'TextEncoder().encode() convierte un string a bytes (Uint8Array) para que digest() pueda procesarlo.',
          ]),
        },
        // 8. Build
        {
          order: 8,
          type: 'build',
          difficulty: 'medium',
          points: 20,
          prompt: `Construye una función \`llamarApiConOAuth\` que:
1. Reciba un access token OAuth y una URL de la API de GitHub
2. Haga el request con el header correcto para OAuth (Bearer)
3. Si el status es 401, lance "Token OAuth expirado o revocado"
4. Si el status es 403, lance "Sin permisos: el scope requerido no fue concedido"
5. Si el status es 200, devuelva los datos JSON

Además, muestra cómo llamarías a la API de GitHub para obtener el perfil del usuario autenticado (endpoint: \`https://api.github.com/user\`) y sus repositorios (endpoint: \`https://api.github.com/user/repos\`).`,
          starterCode: `async function llamarApiConOAuth(accessToken, url) {
  // Tu código aquí
}

// Ejemplo de uso — completa estos llamados:
// const perfil = await llamarApiConOAuth(token, '???');
// const repos = await llamarApiConOAuth(token, '???');`,
          solution: `async function llamarApiConOAuth(accessToken, url) {
  const response = await fetch(url, {
    headers: {
      'Authorization': \`Bearer \${accessToken}\`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  if (response.status === 401) {
    throw new Error('Token OAuth expirado o revocado');
  }

  if (response.status === 403) {
    throw new Error('Sin permisos: el scope requerido no fue concedido');
  }

  if (!response.ok) {
    throw new Error(\`Error \${response.status}: \${response.statusText}\`);
  }

  return response.json();
}

// Ejemplo de uso:
// const perfil = await llamarApiConOAuth(token, 'https://api.github.com/user');
// const repos = await llamarApiConOAuth(token, 'https://api.github.com/user/repos');`,
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['Bearer', 'Authorization', '401', '403', 'json()', 'github.com/user'],
            caseSensitive: false,
            explanation: 'OAuth usa Bearer igual que JWT. 401 = token revocado, 403 = scope insuficiente. Los endpoints de GitHub para perfil y repos.',
          }),
          hintsJson: JSON.stringify([
            'OAuth access tokens también se envían con Bearer: "Authorization": `Bearer ${accessToken}`.',
            '401 en OAuth significa que el token fue revocado o expiró. 403 significa que el token es válido pero no tiene el scope necesario.',
            'GitHub API: /user para el perfil del usuario autenticado, /user/repos para sus repositorios.',
          ]),
        },
        // 9. Build
        {
          order: 9,
          type: 'build',
          difficulty: 'hard',
          points: 20,
          prompt: `Construye la función \`iniciarFlujOAuth\` para una SPA (Single Page App) que:
1. Genere un \`state\` aleatorio y lo guarde en sessionStorage
2. Construya la URL de autorización de GitHub con los parámetros correctos
3. Incluya los scopes: 'read:user' y 'user:email'
4. Redirija al usuario a esa URL

Parámetros: \`clientId\` y \`redirectUri\``,
          starterCode: `function iniciarFlujoOAuth(clientId, redirectUri) {
  // Tu código aquí
  // Al final: window.location.href = urlOAuth;
}`,
          solution: `function iniciarFlujoOAuth(clientId, redirectUri) {
  // Generar state aleatorio para protección CSRF
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  const state = Array.from(array, b => b.toString(16).padStart(2, '0')).join('');

  // Guardar state para verificarlo en el callback
  sessionStorage.setItem('oauth_state', state);

  // Construir URL de autorización
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'read:user user:email',
    state: state,
    response_type: 'code'
  });

  const urlOAuth = \`https://github.com/login/oauth/authorize?\${params.toString()}\`;

  // Redirigir al usuario
  window.location.href = urlOAuth;
}`,
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['state', 'sessionStorage', 'client_id', 'read:user', 'user:email', 'response_type', 'window.location'],
            caseSensitive: false,
            explanation: 'state aleatorio guardado en sessionStorage, URLSearchParams con todos los parámetros OAuth, redirección con window.location.href.',
          }),
          hintsJson: JSON.stringify([
            'Genera el state con crypto.getRandomValues(), guárdalo en sessionStorage.setItem("oauth_state", state) para verificarlo en el callback.',
            'URLSearchParams acepta un objeto: { client_id, redirect_uri, scope: "read:user user:email", state, response_type: "code" }.',
            'Para redirigir: window.location.href = url. Asegúrate de guardar el state ANTES de redirigir.',
          ]),
        },
        // 10. Debug
        {
          order: 10,
          type: 'debug',
          difficulty: 'hard',
          points: 20,
          prompt: `Este handler de callback OAuth tiene errores de seguridad y lógica. Encuéntralos y corrígelos:

\`\`\`javascript
async function callbackOAuth(req, res) {
  const { code, state } = req.query;

  // Verificar state (comentado porque "siempre falla")
  // if (state !== req.session.oauthState) throw new Error('CSRF');

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: JSON.stringify({
      client_id: 'Iv1.abc123',
      client_secret: 'ghp_secreto_hardcodeado_aqui',
      code: code
    })
  });

  const { access_token } = await tokenRes.json();

  // Redirigir con el token en la URL
  res.redirect(\`/dashboard?token=\${access_token}\`);
}
\`\`\``,
          starterCode: `// Corrige los errores de seguridad y lógica:
async function callbackOAuth(req, res) {
  const { code, state } = req.query;

  // Error 1: verificación de state comentada
  // if (state !== req.session.oauthState) throw new Error('CSRF');

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: JSON.stringify({
      client_id: 'Iv1.abc123',
      client_secret: 'ghp_secreto_hardcodeado_aqui',  // Error 2
      code: code
    })
  });

  const { access_token } = await tokenRes.json();

  // Error 3: token en la URL
  res.redirect(\`/dashboard?token=\${access_token}\`);
}`,
          solution: `// Errores corregidos:
async function callbackOAuth(req, res) {
  const { code, state } = req.query;

  // Error 1 CORREGIDO: La verificación de state es OBLIGATORIA para prevenir CSRF
  if (state !== req.session.oauthState) {
    return res.status(403).json({ error: 'State inválido: posible ataque CSRF' });
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',  // Faltaba este header
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,         // Error 2 CORREGIDO: usar variable de entorno
      client_secret: process.env.GITHUB_CLIENT_SECRET, // Error 2 CORREGIDO: nunca hardcodear secretos
      code: code
    })
  });

  const { access_token } = await tokenRes.json();

  // Error 3 CORREGIDO: guardar en sesión, no exponer en URL
  req.session.accessToken = access_token;
  res.redirect('/dashboard');
}`,
          validationLogic: JSON.stringify({
            type: 'includes_keywords',
            keywords: ['state', 'oauthState', 'process.env', 'GITHUB_CLIENT_SECRET', 'session', 'redirect'],
            caseSensitive: false,
            explanation: 'Tres errores de seguridad: CSRF sin verificar, client_secret hardcodeado y token expuesto en URL.',
          }),
          hintsJson: JSON.stringify([
            'La verificación de state no "siempre falla" si se implementa bien. Sin ella, cualquier atacante puede completar un flujo OAuth en tu nombre.',
            'Secretos en código fuente = error crítico. Usa process.env.GITHUB_CLIENT_SECRET. Los secrets en variables de entorno no van al repositorio.',
            'Un token en la URL (?token=xxx) queda en logs del servidor, historial del navegador y headers Referer. Guárdalo en la sesión del servidor.',
          ]),
        },
        // 11. Challenge
        {
          order: 11,
          type: 'challenge',
          difficulty: 'hard',
          points: 30,
          prompt: `Reto final de autenticación: Diseña e implementa un módulo \`auth.js\` que exponga tres funciones y soporte tanto JWT propio como OAuth.

**Funciones requeridas:**

1. \`loginConCredenciales(email, password)\`
   - POST a /auth/login con las credenciales
   - Guarda accessToken en memoria (variable del módulo, no localStorage)
   - Guarda refreshToken en localStorage
   - Devuelve los datos del usuario del payload JWT

2. \`fetchAutenticado(url, opciones)\`
   - Usa el accessToken en memoria
   - Si no hay token o expiró, intenta refresh automático
   - Envía el request con Authorization: Bearer
   - En caso de 401 después del refresh, lanza error de sesión expirada

3. \`cerrarSesion()\`
   - Limpia el accessToken de memoria
   - Elimina el refreshToken de localStorage
   - Hace POST a /auth/logout (con el token actual) para invalidar en el servidor

Escribe el módulo completo con las tres funciones. Explica brevemente las decisiones de seguridad tomadas.`,
          starterCode: `// auth.js — Módulo de autenticación
// Tu implementación aquí

// Estado privado del módulo (no expuesto globalmente)
let _accessToken = null;

export async function loginConCredenciales(email, password) {
  // ...
}

export async function fetchAutenticado(url, opciones = {}) {
  // ...
}

export async function cerrarSesion() {
  // ...
}`,
          solution: `// auth.js — Módulo de autenticación

// Estado privado: el accessToken vive en memoria (no en localStorage ni cookies)
// Razón de seguridad: no persiste entre recargas (menor superficie de ataque)
// y no es accesible desde otras pestañas ni scripts externos.
let _accessToken = null;

// Helper: decodificar payload JWT sin librerías
function _decodePayload(token) {
  return JSON.parse(atob(token.split('.')[1]));
}

// Helper: verificar si un token ha expirado
function _tokenExpirado(token) {
  const { exp } = _decodePayload(token);
  return exp < Math.floor(Date.now() / 1000);
}

// Helper: refrescar el access token usando el refresh token
async function _refresh() {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) throw new Error('Sesión expirada: inicia sesión de nuevo');

  const res = await fetch('/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });

  if (!res.ok) {
    localStorage.removeItem('refresh_token');
    _accessToken = null;
    throw new Error('Sesión expirada: inicia sesión de nuevo');
  }

  const { accessToken } = await res.json();
  _accessToken = accessToken;
  return accessToken;
}

export async function loginConCredenciales(email, password) {
  const res = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    throw new Error('Credenciales inválidas');
  }

  const { accessToken, refreshToken } = await res.json();

  // accessToken en memoria (no en localStorage)
  _accessToken = accessToken;

  // refreshToken en localStorage (persiste entre recargas)
  // Idealmente sería una HttpOnly cookie manejada por el servidor
  localStorage.setItem('refresh_token', refreshToken);

  // Devolver datos del usuario desde el payload JWT
  return _decodePayload(accessToken);
}

export async function fetchAutenticado(url, opciones = {}) {
  // Si no hay token o expiró, intentar refresh
  if (!_accessToken || _tokenExpirado(_accessToken)) {
    await _refresh();
  }

  const response = await fetch(url, {
    ...opciones,
    headers: {
      ...opciones.headers,
      'Authorization': \`Bearer \${_accessToken}\`
    }
  });

  // Si el servidor devuelve 401, intentar un refresh y reintentar una vez
  if (response.status === 401) {
    await _refresh();
    const retry = await fetch(url, {
      ...opciones,
      headers: {
        ...opciones.headers,
        'Authorization': \`Bearer \${_accessToken}\`
      }
    });
    if (!retry.ok) throw new Error('Sesión expirada: inicia sesión de nuevo');
    return retry.json();
  }

  if (!response.ok) {
    throw new Error(\`Error \${response.status}: \${response.statusText}\`);
  }

  return response.json();
}

export async function cerrarSesion() {
  // Intentar notificar al servidor para invalidar el token
  if (_accessToken) {
    await fetch('/auth/logout', {
      method: 'POST',
      headers: { 'Authorization': \`Bearer \${_accessToken}\` }
    }).catch(() => {}); // Si falla, seguimos limpiando localmente
  }

  // Limpiar estado local
  _accessToken = null;
  localStorage.removeItem('refresh_token');
}`,
          validationLogic: JSON.stringify({
            type: 'minimum_length',
            minLength: 150,
            keywords: ['_accessToken', 'localStorage', 'Bearer', 'refresh', 'atob', 'exp', 'cerrarSesion'],
            caseSensitive: false,
            explanation: 'El módulo completo: accessToken en memoria, refreshToken en localStorage, auto-refresh, cierre de sesión limpio en cliente y servidor.',
          }),
          hintsJson: JSON.stringify([
            'El patrón módulo con _accessToken (variable privada con underscore) encapsula el estado. Las funciones exportadas son la API pública.',
            'Extrae helpers privados: _decodePayload(), _tokenExpirado(), _refresh(). Reutiliza _refresh() en fetchAutenticado() y loginConCredenciales().',
            'cerrarSesion(): llama a /auth/logout con .catch(() => {}) para no fallar si el servidor no responde, luego limpia _accessToken y localStorage.',
          ]),
        },
      ],
    },
  ],
};
