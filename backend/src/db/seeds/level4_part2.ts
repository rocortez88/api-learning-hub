/**
 * NIVEL 4 — AVANZADO (PARTE 2)
 * 2 lecciones · 23 ejercicios
 *
 * Lección 3: WebSockets — Conexiones en Tiempo Real  → 12 ejercicios
 * Lección 4: Introducción a GraphQL                  → 11 ejercicios
 */

import type { SeedLesson } from './types.js';

export const level4Lessons2: SeedLesson[] = [
  // ═══════════════════════════════════════════════════════════════════════
  // LECCIÓN 3 — WebSockets — Conexiones en Tiempo Real (12 ejercicios)
  // ═══════════════════════════════════════════════════════════════════════
  {
    lesson: {
      title: 'WebSockets — Conexiones en Tiempo Real',
      order: 3,
      type: 'exercise_set',
      contentMd: `
# WebSockets — Conexiones en Tiempo Real

Las APIs REST siguen el modelo **petición-respuesta**: el cliente pide, el servidor responde,
y la conexión se cierra. Pero ¿qué pasa cuando necesitas actualizaciones instantáneas?
Ahí entran los **WebSockets**.

## HTTP vs WebSocket

| Característica | HTTP | WebSocket |
|----------------|------|-----------|
| Modelo | Petición-Respuesta | Bidireccional persistente |
| Conexión | Se abre y cierra en cada petición | Permanece abierta |
| Iniciativa | Solo el cliente puede pedir datos | Cliente y servidor pueden enviar cuando quieran |
| Overhead | Headers completos en cada mensaje | Headers mínimos tras el handshake |
| Protocolo | \`http://\` / \`https://\` | \`ws://\` / \`wss://\` |

## Ciclo de vida de un WebSocket

\`\`\`javascript
const ws = new WebSocket('wss://api.ejemplo.com/tiempo-real');

ws.onopen = () => {
  console.log('Conexión establecida');
  ws.send(JSON.stringify({ tipo: 'suscribir', canal: 'precios' }));
};

ws.onmessage = (evento) => {
  const datos = JSON.parse(evento.data);
  console.log('Mensaje recibido:', datos);
};

ws.onclose = (evento) => {
  console.log('Conexión cerrada, código:', evento.code);
};

ws.onerror = (error) => {
  console.error('Error en WebSocket:', error);
};
\`\`\`

## Enviar y recibir mensajes

Los mensajes siempre se transmiten como **strings**. Para enviar objetos JavaScript,
usa \`JSON.stringify()\`; para recibirlos, usa \`JSON.parse()\`:

\`\`\`javascript
// Enviar un objeto
ws.send(JSON.stringify({ accion: 'chat', texto: 'Hola a todos' }));

// Recibir y parsear
ws.onmessage = (evento) => {
  const mensaje = JSON.parse(evento.data);
  mostrarEnChat(mensaje.texto, mensaje.usuario);
};
\`\`\`

## Heartbeat / Ping-Pong

Para detectar conexiones caídas, los clientes suelen enviar un "ping" periódico:

\`\`\`javascript
const INTERVALO_PING = 30000; // cada 30 segundos

const intervalo = setInterval(() => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ tipo: 'ping' }));
  }
}, INTERVALO_PING);

ws.onclose = () => clearInterval(intervalo);
\`\`\`

## Reconexión automática con backoff

Las conexiones WebSocket pueden caerse. Una buena implementación reconecta automáticamente:

\`\`\`javascript
function conectar(url, intentoActual = 0) {
  const ws = new WebSocket(url);

  ws.onopen = () => {
    console.log('Conectado');
    intentoActual = 0; // reiniciar contador al conectar
  };

  ws.onclose = () => {
    const espera = Math.min(Math.pow(2, intentoActual) * 1000, 30000);
    console.log(\`Reconectando en \${espera / 1000}s...\`);
    setTimeout(() => conectar(url, intentoActual + 1), espera);
  };

  return ws;
}
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
        prompt: '¿Cuál es la diferencia fundamental entre HTTP y WebSocket en cuanto al modelo de comunicación?',
        starterCode: null,
        solution: 'b',
        validationLogic: JSON.stringify({
          type: 'exact_match',
          answer: 'b',
          options: [
            { key: 'a', text: 'HTTP es más rápido que WebSocket para enviar datos pequeños' },
            { key: 'b', text: 'HTTP sigue el modelo petición-respuesta y cierra la conexión, WebSocket mantiene una conexión bidireccional persistente' },
            { key: 'c', text: 'WebSocket solo funciona con datos en formato JSON' },
            { key: 'd', text: 'HTTP permite al servidor enviar datos sin que el cliente los pida' },
          ],
          explanation: 'HTTP cierra la conexión tras cada petición-respuesta. WebSocket hace un "handshake" HTTP inicial y luego mantiene el canal abierto de forma bidireccional: tanto cliente como servidor pueden enviar mensajes en cualquier momento sin esperar a una petición.',
        }),
        hintsJson: JSON.stringify([
          'Piensa en cuántas conexiones se abren: con HTTP cada petición abre y cierra una conexión.',
          'Con WebSocket, una sola conexión permanece viva durante toda la sesión.',
          'La respuesta es B: WebSocket mantiene una conexión bidireccional persistente, al contrario que el modelo petición-respuesta de HTTP.',
        ]),
      },
      // 2. Quiz
      {
        order: 2,
        type: 'quiz',
        difficulty: 'medium',
        points: 10,
        prompt: '¿Qué evento se dispara en el cliente WebSocket justo cuando la conexión con el servidor se ha establecido correctamente?',
        starterCode: null,
        solution: 'a',
        validationLogic: JSON.stringify({
          type: 'exact_match',
          answer: 'a',
          options: [
            { key: 'a', text: 'onopen' },
            { key: 'b', text: 'onconnect' },
            { key: 'c', text: 'onstart' },
            { key: 'd', text: 'onready' },
          ],
          explanation: 'El evento onopen se dispara cuando el handshake WebSocket se completa y la conexión está lista para enviar y recibir mensajes. Los otros nombres no forman parte de la API WebSocket estándar.',
        }),
        hintsJson: JSON.stringify([
          'La API WebSocket tiene cuatro eventos principales: onopen, onmessage, onclose y onerror.',
          'El evento que indica que algo "se abrió" se llama igual en muchas APIs del navegador.',
          'La respuesta es A: onopen. Se asigna así: ws.onopen = () => { ... }.',
        ]),
      },
      // 3. Observe
      {
        order: 3,
        type: 'observe',
        difficulty: 'medium',
        points: 10,
        prompt: `Analiza este código WebSocket y detecta los dos bugs que tiene:

\`\`\`javascript
const ws = new WebSocket('http://chat.ejemplo.com/sala');  // Bug 1

ws.onopen = () => {
  ws.send({ tipo: 'unirse', usuario: 'Ana' });             // Bug 2
};

ws.onmessage = (evento) => {
  const msg = JSON.parse(evento.data);
  console.log(msg.texto);
};
\`\`\`

Explica cada bug y cómo corregirlo.`,
        starterCode: null,
        solution: 'Bug 1: WebSocket usa el protocolo ws:// (o wss:// para conexiones seguras), no http://. La URL correcta sería wss://chat.ejemplo.com/sala.\nBug 2: ws.send() solo acepta strings, no objetos JavaScript. Hay que serializar con JSON.stringify(): ws.send(JSON.stringify({ tipo: "unirse", usuario: "Ana" })).',
        validationLogic: JSON.stringify({
          type: 'includes_keywords',
          keywords: ['wss', 'JSON.stringify', 'string', 'protocolo'],
          caseSensitive: false,
          explanation: 'Bug 1: el protocolo debe ser ws:// o wss://, no http://. Bug 2: ws.send() requiere un string, no un objeto; hay que usar JSON.stringify().',
        }),
        hintsJson: JSON.stringify([
          'Fíjate en el protocolo de la URL. WebSocket tiene su propio esquema de URL, diferente a HTTP.',
          'El método ws.send() no serializa objetos automáticamente. Solo acepta strings, ArrayBuffer o Blob.',
          'Bug 1: cambia http:// por wss://. Bug 2: envuelve el objeto en JSON.stringify().',
        ]),
      },
      // 4. Observe
      {
        order: 4,
        type: 'observe',
        difficulty: 'medium',
        points: 10,
        prompt: `El servidor WebSocket de un chat te envía los siguientes mensajes JSON. Analízalos y describe qué hace cada uno:

\`\`\`json
// Mensaje 1
{ "tipo": "bienvenida", "sala": "general", "usuarios": 24 }

// Mensaje 2
{ "tipo": "mensaje", "usuario": "Carlos", "texto": "¡Hola!", "timestamp": 1711240000 }

// Mensaje 3
{ "tipo": "pong", "timestamp": 1711240030 }

// Mensaje 4
{ "tipo": "error", "codigo": 4001, "razon": "Sala llena" }
\`\`\`

¿Qué campo actúa como discriminador de tipo? ¿Qué función cumple el mensaje 3?`,
        starterCode: null,
        solution: 'El campo "tipo" actúa como discriminador: permite al cliente saber cómo procesar cada mensaje sin ambigüedad. Mensaje 1: confirmación de conexión con metadatos de la sala. Mensaje 2: mensaje de chat enviado por un usuario. Mensaje 3: respuesta al ping del cliente (heartbeat), confirma que la conexión sigue viva; el timestamp permite calcular la latencia. Mensaje 4: error del servidor indicando que la sala está llena (código 4001 es un código de cierre personalizado).',
        validationLogic: JSON.stringify({
          type: 'includes_keywords',
          keywords: ['tipo', 'discriminador', 'pong', 'heartbeat', 'ping'],
          caseSensitive: false,
          explanation: 'El campo "tipo" es el discriminador que determina cómo procesar cada mensaje. El mensaje "pong" es la respuesta al mecanismo de heartbeat ping-pong que verifica que la conexión está viva.',
        }),
        hintsJson: JSON.stringify([
          'Busca el campo que está presente en todos los mensajes y varía entre ellos.',
          'El mensaje 3 tiene tipo "pong". ¿Qué mecanismo usa ping y pong para verificar conexiones?',
          'El discriminador es "tipo". El mensaje 3 es la respuesta al heartbeat ping-pong: confirma que la conexión sigue activa.',
        ]),
      },
      // 5. Fill Blank
      {
        order: 5,
        type: 'fill_blank',
        difficulty: 'medium',
        points: 15,
        prompt: `Completa el código para crear una conexión WebSocket y manejar sus eventos principales:

\`\`\`javascript
const ws = new ______('wss://api.ejemplo.com/tiempo-real');

ws.______ = () => {
  console.log('Conectado al servidor');
  ws.send(JSON.stringify({ tipo: 'suscribir', canal: 'noticias' }));
};

ws.______ = (evento) => {
  const datos = JSON.______(evento.______);
  console.log('Nuevo dato:', datos);
};

ws.______ = () => {
  console.log('Conexión cerrada');
};
\`\`\``,
        starterCode: `const ws = new ______('wss://api.ejemplo.com/tiempo-real');

ws.______ = () => {
  console.log('Conectado al servidor');
  ws.send(JSON.stringify({ tipo: 'suscribir', canal: 'noticias' }));
};

ws.______ = (evento) => {
  const datos = JSON.______(evento.______);
  console.log('Nuevo dato:', datos);
};

ws.______ = () => {
  console.log('Conexión cerrada');
};`,
        solution: `const ws = new WebSocket('wss://api.ejemplo.com/tiempo-real');

ws.onopen = () => {
  console.log('Conectado al servidor');
  ws.send(JSON.stringify({ tipo: 'suscribir', canal: 'noticias' }));
};

ws.onmessage = (evento) => {
  const datos = JSON.parse(evento.data);
  console.log('Nuevo dato:', datos);
};

ws.onclose = () => {
  console.log('Conexión cerrada');
};`,
        validationLogic: JSON.stringify({
          type: 'includes_keywords',
          keywords: ['WebSocket', 'onopen', 'onmessage', 'onclose', 'JSON.parse', 'evento.data'],
          caseSensitive: false,
          explanation: 'La clase es WebSocket. Los eventos son onopen (conexión lista), onmessage (mensaje recibido) y onclose (conexión cerrada). Los datos se leen con JSON.parse(evento.data).',
        }),
        hintsJson: JSON.stringify([
          'La clase global del navegador para crear conexiones WebSocket se llama igual que el protocolo.',
          'Los cuatro eventos principales son: onopen, onmessage, onclose y onerror.',
          'Los mensajes recibidos están en evento.data como string; usa JSON.parse() para convertirlos a objeto.',
        ]),
      },
      // 6. Fill Blank
      {
        order: 6,
        type: 'fill_blank',
        difficulty: 'medium',
        points: 15,
        prompt: `Completa la función que envía un mensaje JSON por WebSocket:

\`\`\`javascript
function enviarMensaje(ws, usuario, texto) {
  if (ws.______ !== WebSocket.______) {
    console.error('WebSocket no está abierto');
    return false;
  }

  const mensaje = {
    tipo: 'chat',
    usuario,
    texto,
    timestamp: ______.now(),
  };

  ws.______(JSON.______(mensaje));
  return true;
}
\`\`\``,
        starterCode: `function enviarMensaje(ws, usuario, texto) {
  if (ws.______ !== WebSocket.______) {
    console.error('WebSocket no está abierto');
    return false;
  }

  const mensaje = {
    tipo: 'chat',
    usuario,
    texto,
    timestamp: ______.now(),
  };

  ws.______(JSON.______(mensaje));
  return true;
}`,
        solution: `function enviarMensaje(ws, usuario, texto) {
  if (ws.readyState !== WebSocket.OPEN) {
    console.error('WebSocket no está abierto');
    return false;
  }

  const mensaje = {
    tipo: 'chat',
    usuario,
    texto,
    timestamp: Date.now(),
  };

  ws.send(JSON.stringify(mensaje));
  return true;
}`,
        validationLogic: JSON.stringify({
          type: 'includes_keywords',
          keywords: ['readyState', 'WebSocket.OPEN', 'Date.now', 'send', 'JSON.stringify'],
          caseSensitive: false,
          explanation: 'readyState indica el estado de la conexión; WebSocket.OPEN (valor 1) significa lista para enviar. Date.now() da el timestamp actual. ws.send() requiere JSON.stringify() para enviar objetos.',
        }),
        hintsJson: JSON.stringify([
          'La propiedad que indica el estado actual de la conexión se llama readyState.',
          'WebSocket.OPEN es la constante que indica que la conexión está abierta y lista (valor numérico 1).',
          'Los valores son: readyState, WebSocket.OPEN, Date.now(), send, JSON.stringify.',
        ]),
      },
      // 7. Fill Blank
      {
        order: 7,
        type: 'fill_blank',
        difficulty: 'hard',
        points: 15,
        prompt: `Completa este código de reconexión automática con exponential backoff:

\`\`\`javascript
function conectarConReconexion(url) {
  let intentos = 0;
  let ws;

  function conectar() {
    ws = new WebSocket(______);

    ws.onopen = () => {
      console.log('Conectado');
      intentos = ______; // reiniciar contador
    };

    ws.onclose = () => {
      const espera = Math.min(Math.______(2, intentos) * 1000, 30000);
      console.log(\`Reconectando en \${espera / 1000}s (intento \${intentos + 1})\`);
      intentos++;
      setTimeout(______, espera);
    };

    ws.onmessage = (e) => manejarMensaje(JSON.parse(e.data));
  }

  conectar();
  return () => ws.close(); // función para desconectar manualmente
}
\`\`\``,
        starterCode: `function conectarConReconexion(url) {
  let intentos = 0;
  let ws;

  function conectar() {
    ws = new WebSocket(______);

    ws.onopen = () => {
      console.log('Conectado');
      intentos = ______;
    };

    ws.onclose = () => {
      const espera = Math.min(Math.______(2, intentos) * 1000, 30000);
      console.log(\`Reconectando en \${espera / 1000}s (intento \${intentos + 1})\`);
      intentos++;
      setTimeout(______, espera);
    };

    ws.onmessage = (e) => manejarMensaje(JSON.parse(e.data));
  }

  conectar();
  return () => ws.close();
}`,
        solution: `function conectarConReconexion(url) {
  let intentos = 0;
  let ws;

  function conectar() {
    ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('Conectado');
      intentos = 0;
    };

    ws.onclose = () => {
      const espera = Math.min(Math.pow(2, intentos) * 1000, 30000);
      console.log(\`Reconectando en \${espera / 1000}s (intento \${intentos + 1})\`);
      intentos++;
      setTimeout(conectar, espera);
    };

    ws.onmessage = (e) => manejarMensaje(JSON.parse(e.data));
  }

  conectar();
  return () => ws.close();
}`,
        validationLogic: JSON.stringify({
          type: 'includes_keywords',
          keywords: ['url', 'intentos = 0', 'Math.pow', 'setTimeout', 'conectar'],
          caseSensitive: false,
          explanation: 'Se pasa la variable url al constructor. Al conectar exitosamente se reinicia intentos a 0. Math.pow(2, intentos) calcula el backoff exponencial. setTimeout(conectar, espera) programa la reconexión llamando a la misma función.',
        }),
        hintsJson: JSON.stringify([
          'Al conectarse con éxito, el contador de intentos debe volver a 0 para que el próximo backoff empiece desde 1s.',
          'La fórmula de backoff exponencial usa Math.pow(2, intentos). Math.min(..., 30000) evita esperas mayores de 30s.',
          'setTimeout necesita la función conectar (sin paréntesis) como primer argumento para programar la reconexión.',
        ]),
      },
      // 8. Build
      {
        order: 8,
        type: 'build',
        difficulty: 'medium',
        points: 20,
        prompt: `Crea una función \`crearChat(url, nombreUsuario)\` que establezca una conexión WebSocket e implemente un chat básico.

La función debe devolver un objeto con dos métodos:
- \`enviar(texto)\`: envía un mensaje de chat (tipo: "mensaje", usuario, texto, timestamp)
- \`desconectar()\`: cierra la conexión limpiamente

Cada mensaje recibido del servidor debe imprimirse en consola con el formato: \`[usuario]: texto\`

Maneja los eventos onopen, onmessage, onclose y onerror.`,
        starterCode: `function crearChat(url, nombreUsuario) {
  // Tu código aquí
}`,
        solution: `function crearChat(url, nombreUsuario) {
  const ws = new WebSocket(url);

  ws.onopen = () => {
    console.log(\`Conectado al chat como \${nombreUsuario}\`);
    ws.send(JSON.stringify({ tipo: 'unirse', usuario: nombreUsuario }));
  };

  ws.onmessage = (evento) => {
    const msg = JSON.parse(evento.data);
    if (msg.tipo === 'mensaje') {
      console.log(\`[\${msg.usuario}]: \${msg.texto}\`);
    }
  };

  ws.onclose = () => {
    console.log('Desconectado del chat');
  };

  ws.onerror = (error) => {
    console.error('Error en la conexión:', error);
  };

  return {
    enviar(texto) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          tipo: 'mensaje',
          usuario: nombreUsuario,
          texto,
          timestamp: Date.now(),
        }));
      } else {
        console.error('No conectado');
      }
    },
    desconectar() {
      ws.close();
    },
  };
}`,
        validationLogic: JSON.stringify({
          type: 'includes_keywords',
          keywords: ['WebSocket', 'onopen', 'onmessage', 'JSON.parse', 'JSON.stringify', 'enviar', 'desconectar', 'ws.close'],
          caseSensitive: false,
          explanation: 'La función crea un WebSocket, maneja los cuatro eventos y devuelve un objeto con enviar() y desconectar(). enviar() verifica readyState antes de llamar a ws.send().',
        }),
        hintsJson: JSON.stringify([
          'Crea el WebSocket al inicio de la función y configura los cuatro manejadores de eventos.',
          'El método enviar() debe comprobar ws.readyState === WebSocket.OPEN antes de llamar a ws.send().',
          'Devuelve un objeto literal con dos métodos: enviar(texto) que usa ws.send(JSON.stringify(...)) y desconectar() que llama ws.close().',
        ]),
      },
      // 9. Build
      {
        order: 9,
        type: 'build',
        difficulty: 'hard',
        points: 20,
        prompt: `Implementa una función \`crearClienteConHeartbeat(url, intervaloMs = 30000)\` que:

1. Cree una conexión WebSocket
2. Envíe un mensaje \`{ tipo: "ping", timestamp: Date.now() }\` cada \`intervaloMs\` milisegundos
3. Si recibe un mensaje de tipo "pong", calcule la latencia (timestamp actual - timestamp del ping) e imprímala
4. Limpie el intervalo cuando la conexión se cierre (evitar memory leaks)
5. Devuelva el objeto WebSocket`,
        starterCode: `function crearClienteConHeartbeat(url, intervaloMs = 30000) {
  // Tu código aquí
}`,
        solution: `function crearClienteConHeartbeat(url, intervaloMs = 30000) {
  const ws = new WebSocket(url);
  let intervalo = null;
  let ultimoPing = null;

  ws.onopen = () => {
    console.log('Conectado. Iniciando heartbeat...');

    intervalo = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ultimoPing = Date.now();
        ws.send(JSON.stringify({ tipo: 'ping', timestamp: ultimoPing }));
      }
    }, intervaloMs);
  };

  ws.onmessage = (evento) => {
    const msg = JSON.parse(evento.data);

    if (msg.tipo === 'pong' && ultimoPing !== null) {
      const latencia = Date.now() - ultimoPing;
      console.log(\`Latencia: \${latencia}ms\`);
    }
  };

  ws.onclose = () => {
    if (intervalo !== null) {
      clearInterval(intervalo);
      intervalo = null;
    }
    console.log('Conexión cerrada, heartbeat detenido');
  };

  ws.onerror = (error) => {
    console.error('Error WebSocket:', error);
  };

  return ws;
}`,
        validationLogic: JSON.stringify({
          type: 'includes_keywords',
          keywords: ['setInterval', 'clearInterval', 'ping', 'pong', 'latencia', 'Date.now', 'readyState'],
          caseSensitive: false,
          explanation: 'La función usa setInterval para enviar pings periódicos, calcula latencia al recibir pong, y limpia el intervalo en onclose para evitar memory leaks.',
        }),
        hintsJson: JSON.stringify([
          'Guarda el intervalo en una variable para poder limpiarlo después. Inicia el heartbeat dentro de onopen.',
          'Guarda el timestamp del último ping en una variable. En onmessage, si el tipo es "pong", resta el timestamp guardado de Date.now().',
          'En onclose llama clearInterval(intervalo) para evitar que el heartbeat siga corriendo después de cerrar la conexión.',
        ]),
      },
      // 10. Build
      {
        order: 10,
        type: 'build',
        difficulty: 'hard',
        points: 20,
        prompt: `Implementa \`crearClienteConReconexion(url)\` con reconexión automática y backoff exponencial:

Requisitos:
- Backoff: 1s, 2s, 4s, 8s... con un máximo de 30 segundos entre intentos
- Máximo 10 intentos de reconexión antes de rendirse
- Al conectar con éxito, resetear el contador de intentos a 0
- Exponer método \`enviar(datos)\` que serialice el objeto a JSON
- Exponer método \`cerrar()\` que detenga también la reconexión automática`,
        starterCode: `function crearClienteConReconexion(url) {
  // Tu código aquí
}`,
        solution: `function crearClienteConReconexion(url) {
  const MAX_INTENTOS = 10;
  let intentos = 0;
  let detener = false;
  let ws = null;

  function conectar() {
    if (detener) return;

    ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('Conectado');
      intentos = 0;
    };

    ws.onclose = () => {
      if (detener) return;

      if (intentos >= MAX_INTENTOS) {
        console.error('Máximo de reintentos alcanzado. Abandonando.');
        return;
      }

      const espera = Math.min(Math.pow(2, intentos) * 1000, 30000);
      console.log(\`Reconectando en \${espera / 1000}s (intento \${intentos + 1}/\${MAX_INTENTOS})\`);
      intentos++;
      setTimeout(conectar, espera);
    };

    ws.onerror = (error) => {
      console.error('Error WebSocket:', error);
    };
  }

  conectar();

  return {
    enviar(datos) {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(datos));
      } else {
        console.warn('No conectado, mensaje descartado');
      }
    },
    cerrar() {
      detener = true;
      if (ws) ws.close();
    },
  };
}`,
        validationLogic: JSON.stringify({
          type: 'includes_keywords',
          keywords: ['Math.pow', 'Math.min', 'setTimeout', 'intentos', 'detener', 'JSON.stringify', 'cerrar'],
          caseSensitive: false,
          explanation: 'La implementación usa backoff exponencial con Math.pow(2, intentos)*1000, limita a 30s con Math.min, tiene un máximo de intentos, y una bandera "detener" para parar la reconexión al llamar a cerrar().',
        }),
        hintsJson: JSON.stringify([
          'Usa una variable booleana "detener" que, cuando sea true, impida nuevas reconexiones en onclose.',
          'El backoff es Math.min(Math.pow(2, intentos) * 1000, 30000). Incrementa "intentos" antes de setTimeout.',
          'El método cerrar() debe poner detener=true y llamar ws.close(). El método enviar() debe verificar readyState === WebSocket.OPEN.',
        ]),
      },
      // 11. Debug
      {
        order: 11,
        type: 'debug',
        difficulty: 'medium',
        points: 20,
        prompt: `Este código intenta escuchar mensajes WebSocket pero no funciona correctamente. Encuentra el bug:

\`\`\`javascript
const ws = new WebSocket('wss://api.ejemplo.com/datos');

ws.onopen = () => {
  console.log('Conectado');
};

// El desarrollador intenta añadir un listener después
ws.addEventListener('message', (evento) => {
  console.log('Primer handler:', evento.data);
});

// Y luego lo sobreescribe accidentalmente
ws.onmessage = (evento) => {
  console.log('Handler principal:', JSON.parse(evento.data));
};

// Este handler nunca recibe nada
ws.addEventListener('message', (evento) => {
  actualizarInterfaz(JSON.parse(evento.data));
});
\`\`\`

¿Cuál es el problema real y cómo se debería unificar el manejo de mensajes?`,
        starterCode: `const ws = new WebSocket('wss://api.ejemplo.com/datos');

ws.onopen = () => {
  console.log('Conectado');
};

ws.addEventListener('message', (evento) => {
  console.log('Primer handler:', evento.data);
});

ws.onmessage = (evento) => {
  console.log('Handler principal:', JSON.parse(evento.data));
};

ws.addEventListener('message', (evento) => {
  actualizarInterfaz(JSON.parse(evento.data));
});`,
        solution: `const ws = new WebSocket('wss://api.ejemplo.com/datos');

ws.onopen = () => {
  console.log('Conectado');
};

// Solución: usar un único manejador onmessage que hace todo
ws.onmessage = (evento) => {
  const datos = JSON.parse(evento.data);
  console.log('Mensaje recibido:', datos);
  actualizarInterfaz(datos);
};`,
        validationLogic: JSON.stringify({
          type: 'includes_keywords',
          keywords: ['onmessage', 'JSON.parse', 'actualizarInterfaz', 'único', 'sobreescribe'],
          caseSensitive: false,
          explanation: 'El bug es mezclar ws.onmessage con addEventListener("message"). ws.onmessage y addEventListener coexisten, pero tener múltiples manejadores dispersos crea confusión. La solución limpia es un único ws.onmessage que centralice toda la lógica.',
        }),
        hintsJson: JSON.stringify([
          'Tanto ws.onmessage como addEventListener("message") funcionan, pero mezclarlos causa confusión. ¿Cuántos handlers hay en total?',
          'El problema no es técnico (todos los handlers reciben mensajes), sino de mantenibilidad: hay lógica dispersa y JSON.parse duplicado.',
          'La solución es un único ws.onmessage que parsee una sola vez y llame a todas las funciones necesarias.',
        ]),
      },
      // 12. Challenge
      {
        order: 12,
        type: 'challenge',
        difficulty: 'hard',
        points: 30,
        prompt: `Reto final: Implementa una clase \`WebSocketClient\` completa con las siguientes características:

1. **Constructor**: recibe \`url\` y \`opciones\` (intervaloHeartbeat: 25000ms, maxReintentos: 5)
2. **Reconexión automática** con backoff exponencial (máximo 30s entre intentos)
3. **Heartbeat**: envía ping cada \`intervaloHeartbeat\` ms; si no hay pong en 5s, considera la conexión muerta y reconecta
4. **Cola de mensajes pendientes**: si se llama a \`enviar()\` mientras no hay conexión, el mensaje se encola y se envía al reconectar
5. **Método \`enviar(datos)\`**: serializa a JSON y envía (o encola)
6. **Método \`cerrar()\`**: cierra definitivamente sin reconectar

La clase debe manejar todos los eventos del ciclo de vida.`,
        starterCode: `class WebSocketClient {
  constructor(url, opciones = {}) {
    // Tu código aquí
  }

  enviar(datos) {
    // Tu código aquí
  }

  cerrar() {
    // Tu código aquí
  }
}`,
        solution: `class WebSocketClient {
  constructor(url, opciones = {}) {
    this.url = url;
    this.intervaloHeartbeat = opciones.intervaloHeartbeat ?? 25000;
    this.maxReintentos = opciones.maxReintentos ?? 5;

    this.ws = null;
    this.intentos = 0;
    this.cerradoDefinitivamente = false;
    this.colaMensajes = [];

    this._intervaloHeartbeat = null;
    this._timeoutPong = null;

    this._conectar();
  }

  _conectar() {
    if (this.cerradoDefinitivamente) return;

    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('Conectado');
      this.intentos = 0;
      this._iniciarHeartbeat();

      // Enviar mensajes pendientes en la cola
      while (this.colaMensajes.length > 0) {
        const msg = this.colaMensajes.shift();
        this.ws.send(JSON.stringify(msg));
      }
    };

    this.ws.onmessage = (evento) => {
      const datos = JSON.parse(evento.data);
      if (datos.tipo === 'pong') {
        clearTimeout(this._timeoutPong);
        this._timeoutPong = null;
      }
    };

    this.ws.onclose = () => {
      this._detenerHeartbeat();
      if (!this.cerradoDefinitivamente) {
        this._programarReconexion();
      }
    };

    this.ws.onerror = (error) => {
      console.error('Error WebSocket:', error);
    };
  }

  _iniciarHeartbeat() {
    this._intervaloHeartbeat = setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ tipo: 'ping', timestamp: Date.now() }));

        this._timeoutPong = setTimeout(() => {
          console.warn('Sin pong — reconectando...');
          this.ws.close();
        }, 5000);
      }
    }, this.intervaloHeartbeat);
  }

  _detenerHeartbeat() {
    clearInterval(this._intervaloHeartbeat);
    clearTimeout(this._timeoutPong);
    this._intervaloHeartbeat = null;
    this._timeoutPong = null;
  }

  _programarReconexion() {
    if (this.intentos >= this.maxReintentos) {
      console.error('Máximo de reintentos alcanzado');
      return;
    }
    const espera = Math.min(Math.pow(2, this.intentos) * 1000, 30000);
    console.log(\`Reconectando en \${espera / 1000}s...\`);
    this.intentos++;
    setTimeout(() => this._conectar(), espera);
  }

  enviar(datos) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(datos));
    } else {
      console.warn('Sin conexión, mensaje encolado');
      this.colaMensajes.push(datos);
    }
  }

  cerrar() {
    this.cerradoDefinitivamente = true;
    this._detenerHeartbeat();
    if (this.ws) this.ws.close();
  }
}`,
        validationLogic: JSON.stringify({
          type: 'minimum_length',
          minLength: 120,
          explanation: 'La implementación completa requiere: constructor con opciones, reconexión con backoff exponencial, heartbeat con timeout de pong, cola de mensajes pendientes, y métodos enviar() y cerrar().',
        }),
        hintsJson: JSON.stringify([
          'Empieza con el constructor inicializando todas las variables de estado: ws, intentos, cerradoDefinitivamente, colaMensajes, y los timers.',
          'El heartbeat necesita dos timers: setInterval para enviar pings y setTimeout para detectar ausencia de pong. El pong debe cancelar el timeout.',
          'En onopen, tras conectar, recorre la colaMensajes con un bucle while y envía cada mensaje pendiente antes de limpiar la cola.',
        ]),
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // LECCIÓN 4 — Introducción a GraphQL (11 ejercicios)
  // ═══════════════════════════════════════════════════════════════════════
  {
    lesson: {
      title: 'Introducción a GraphQL',
      order: 4,
      type: 'theory',
      contentMd: `
# Introducción a GraphQL

REST ha sido el estándar durante años, pero tiene limitaciones: overfetching
(recibes más datos de los que necesitas) y underfetching (necesitas varios endpoints
para obtener datos relacionados). **GraphQL** es una alternativa diseñada para resolver estos problemas.

## ¿Qué es GraphQL?

GraphQL es un **lenguaje de consulta para APIs** desarrollado por Facebook (ahora Meta) en 2012
y publicado en 2015. A diferencia de REST, en GraphQL:

- Hay **un solo endpoint**: generalmente \`POST /graphql\`
- El cliente **especifica exactamente** qué campos necesita
- Puedes obtener **datos relacionados en una sola consulta**

## Queries vs Mutations

| Operación | Equivalente REST | Descripción |
|-----------|-----------------|-------------|
| \`query\` | GET | Leer datos (solo lectura) |
| \`mutation\` | POST / PUT / DELETE | Modificar datos |
| \`subscription\` | WebSocket | Datos en tiempo real |

## Anatomy de una Query

\`\`\`graphql
query ObtenerUsuario($id: ID!) {
  usuario(id: $id) {
    id
    nombre
    email
    publicaciones {
      titulo
      fecha
    }
  }
}
\`\`\`

Variables:
\`\`\`json
{ "id": "42" }
\`\`\`

## Hacer una petición GraphQL con fetch

\`\`\`javascript
async function consultaGraphQL(query, variables = {}) {
  const res = await fetch('https://api.ejemplo.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${token}\`,
    },
    body: JSON.stringify({ query, variables }),
  });

  const { data, errors } = await res.json();

  if (errors) {
    throw new Error(errors[0].message);
  }

  return data;
}
\`\`\`

## Respuesta GraphQL

\`\`\`json
{
  "data": {
    "usuario": {
      "id": "42",
      "nombre": "Ana García",
      "email": "ana@ejemplo.com",
      "publicaciones": [
        { "titulo": "Mi primer post", "fecha": "2024-01-15" }
      ]
    }
  }
}
\`\`\`

## Respuesta con errores

GraphQL puede devolver **datos parciales junto con errores**:

\`\`\`json
{
  "data": {
    "usuario": null
  },
  "errors": [
    {
      "message": "Usuario no encontrado",
      "locations": [{ "line": 2, "column": 3 }],
      "path": ["usuario"]
    }
  ]
}
\`\`\`

> Importante: HTTP puede devolver 200 aunque haya errores GraphQL. Siempre comprueba el campo \`errors\`.

## Mutations

\`\`\`graphql
mutation CrearPublicacion($titulo: String!, $contenido: String!) {
  crearPublicacion(titulo: $titulo, contenido: $contenido) {
    id
    titulo
    creadoEn
  }
}
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
        prompt: '¿Qué método HTTP se usa habitualmente para enviar consultas (queries) a un endpoint GraphQL?',
        starterCode: null,
        solution: 'b',
        validationLogic: JSON.stringify({
          type: 'exact_match',
          answer: 'b',
          options: [
            { key: 'a', text: 'GET, igual que en REST para peticiones de lectura' },
            { key: 'b', text: 'POST, tanto para queries como para mutations' },
            { key: 'c', text: 'PUT para queries y POST para mutations' },
            { key: 'd', text: 'QUERY, un método HTTP específico de GraphQL' },
          ],
          explanation: 'GraphQL usa POST para todas las operaciones (queries, mutations y subscriptions) porque el cuerpo de la petición JSON contiene la consulta y las variables. Aunque técnicamente es posible usar GET para queries simples, el estándar ampliamente adoptado es POST.',
        }),
        hintsJson: JSON.stringify([
          'GraphQL envía la consulta en el cuerpo (body) de la petición HTTP, no en la URL.',
          'Para enviar un body JSON se necesita un método que soporte cuerpo de petición.',
          'La respuesta es B: POST. Se envía { query: "...", variables: {...} } en el body JSON.',
        ]),
      },
      // 2. Quiz
      {
        order: 2,
        type: 'quiz',
        difficulty: 'medium',
        points: 10,
        prompt: '¿Qué es una "mutation" en GraphQL?',
        starterCode: null,
        solution: 'c',
        validationLogic: JSON.stringify({
          type: 'exact_match',
          answer: 'c',
          options: [
            { key: 'a', text: 'Una consulta que devuelve datos en tiempo real mediante WebSocket' },
            { key: 'b', text: 'Una consulta de solo lectura que obtiene datos del servidor' },
            { key: 'c', text: 'Una operación que modifica datos en el servidor (crear, actualizar o eliminar)' },
            { key: 'd', text: 'Un tipo de error que ocurre cuando la consulta tiene sintaxis incorrecta' },
          ],
          explanation: 'Una mutation en GraphQL es una operación que modifica el estado del servidor: crear, actualizar o eliminar datos. Es el equivalente a POST, PUT, PATCH y DELETE en REST. Las queries son de solo lectura; las subscriptions son para datos en tiempo real.',
        }),
        hintsJson: JSON.stringify([
          'El nombre "mutation" (mutación) hace referencia a cambiar o transformar algo.',
          'En REST, los métodos POST, PUT, PATCH y DELETE modifican datos. ¿Cuál de las opciones refleja eso?',
          'La respuesta es C: una mutation modifica datos en el servidor (crear, actualizar o eliminar).',
        ]),
      },
      // 3. Observe
      {
        order: 3,
        type: 'observe',
        difficulty: 'medium',
        points: 10,
        prompt: `Compara esta consulta GraphQL con su equivalente REST y explica las ventajas:

**GraphQL (una sola petición):**
\`\`\`graphql
query {
  usuario(id: "5") {
    nombre
    publicaciones {
      titulo
      comentarios {
        texto
        autor { nombre }
      }
    }
  }
}
\`\`\`

**REST equivalente (múltiples peticiones):**
\`\`\`
GET /usuarios/5
GET /usuarios/5/publicaciones
GET /publicaciones/101/comentarios
GET /publicaciones/102/comentarios
GET /usuarios/88/perfil   (autor del comentario)
\`\`\`

¿Cuántas peticiones necesita REST vs GraphQL? ¿Qué problema de REST soluciona GraphQL aquí?`,
        starterCode: null,
        solution: 'GraphQL necesita 1 sola petición. REST necesita al menos 5 peticiones (y podría ser más dependiendo de cuántas publicaciones y comentarios haya — es un problema de N+1). GraphQL soluciona dos problemas: 1) Underfetching: en REST necesitas hacer múltiples peticiones para obtener datos relacionados. 2) El problema N+1: si hay N publicaciones, REST necesita N peticiones adicionales para sus comentarios. GraphQL resuelve esto en una sola consulta anidada.',
        validationLogic: JSON.stringify({
          type: 'includes_keywords',
          keywords: ['1', 'underfetching', 'N+1', 'múltiples', 'anidada'],
          caseSensitive: false,
          explanation: 'GraphQL usa 1 petición frente a las múltiples de REST. Resuelve el underfetching (datos relacionados en una consulta) y el problema N+1 (peticiones adicionales por cada elemento relacionado).',
        }),
        hintsJson: JSON.stringify([
          'Cuenta cuántas líneas GET hay en el ejemplo REST. Imagina que el usuario tiene 10 publicaciones.',
          'El "problema N+1" ocurre cuando necesitas 1 petición por cada elemento en una lista. ¿Ves ese patrón en el REST?',
          'GraphQL necesita 1 petición. REST necesita mínimo 5 (y más con más datos). Resuelve el underfetching y el problema N+1.',
        ]),
      },
      // 4. Observe
      {
        order: 4,
        type: 'observe',
        difficulty: 'medium',
        points: 10,
        prompt: `Analiza esta respuesta GraphQL y explica qué ha ocurrido:

\`\`\`json
{
  "data": {
    "usuario": {
      "nombre": "Pedro López",
      "publicaciones": null
    }
  },
  "errors": [
    {
      "message": "No tienes permiso para ver las publicaciones de este usuario",
      "path": ["usuario", "publicaciones"],
      "extensions": {
        "code": "FORBIDDEN",
        "httpStatus": 403
      }
    }
  ]
}
\`\`\`

1. ¿Cuál es el código de estado HTTP probable de esta respuesta?
2. ¿Qué datos se pudieron obtener y cuáles no?
3. ¿Por qué esto es diferente a cómo REST manejaría este error?`,
        starterCode: null,
        solution: '1. El código HTTP probable es 200 OK, aunque haya errores. GraphQL devuelve 200 incluso con errores parciales; el error real está en el campo "errors" del JSON.\n2. Se obtuvo el nombre ("Pedro López") pero no las publicaciones (devuelve null con un error de autorización).\n3. En REST, un 403 Forbidden haría que no recibieras ningún dato de ese endpoint. En GraphQL puedes recibir datos parciales: lo que tienes permiso de ver + errores para lo que no tienes permiso. Esto se llama "partial success".',
        validationLogic: JSON.stringify({
          type: 'includes_keywords',
          keywords: ['200', 'parcial', 'null', 'errors', 'FORBIDDEN'],
          caseSensitive: false,
          explanation: 'GraphQL devuelve HTTP 200 aunque haya errores. Los datos accesibles se devuelven normalmente y los inaccesibles se reemplazan con null + error en el campo "errors". Esto permite éxito parcial, diferente al todo-o-nada de REST.',
        }),
        hintsJson: JSON.stringify([
          'GraphQL no usa los códigos HTTP de error de la misma forma que REST. ¿Qué código devuelve normalmente aunque haya errores?',
          'Mira qué campos tienen datos y cuál tiene null. El array "errors" con su "path" indica exactamente qué falló.',
          'HTTP 200 con datos parciales: nombre sí, publicaciones null. REST devolvería 403 sin ningún dato.',
        ]),
      },
      // 5. Fill Blank
      {
        order: 5,
        type: 'fill_blank',
        difficulty: 'medium',
        points: 15,
        prompt: `Completa esta query GraphQL que busca un usuario por ID y devuelve sus publicaciones:

\`\`\`graphql
______ BuscarUsuario($id: ______!) {
  usuario(______: $id) {
    id
    nombre
    email
    publicaciones(limite: 5) {
      ______
      fecha
      etiquetas
    }
  }
}
\`\`\`

Variables a enviar: \`{ "id": "42" }\``,
        starterCode: `______ BuscarUsuario($id: ______!) {
  usuario(______: $id) {
    id
    nombre
    email
    publicaciones(limite: 5) {
      ______
      fecha
      etiquetas
    }
  }
}`,
        solution: `query BuscarUsuario($id: ID!) {
  usuario(id: $id) {
    id
    nombre
    email
    publicaciones(limite: 5) {
      titulo
      fecha
      etiquetas
    }
  }
}`,
        validationLogic: JSON.stringify({
          type: 'includes_keywords',
          keywords: ['query', 'ID!', 'id: $id', 'titulo'],
          caseSensitive: false,
          explanation: 'La operación es "query". El tipo del argumento ID es el tipo escalar GraphQL para identificadores. El argumento del resolver es "id: $id". El campo que falta en publicaciones es "titulo".',
        }),
        hintsJson: JSON.stringify([
          'La palabra clave para operaciones de lectura en GraphQL es "query". El tipo escalar para IDs es "ID".',
          'Para pasar la variable $id al campo usuario, el argumento es: usuario(id: $id).',
          'Los valores son: query, ID, id: $id, titulo.',
        ]),
      },
      // 6. Fill Blank
      {
        order: 6,
        type: 'fill_blank',
        difficulty: 'medium',
        points: 15,
        prompt: `Completa la función que hace una petición a un endpoint GraphQL:

\`\`\`javascript
async function consultarGraphQL(query, variables, token) {
  const res = await fetch('https://api.ejemplo.com/______', {
    method: '______',
    headers: {
      '______': 'application/json',
      'Authorization': \`Bearer \${token}\`,
    },
    body: JSON.stringify({
      ______,
      ______,
    }),
  });

  const json = await res.______();
  if (json.______) throw new Error(json.errors[0].message);
  return json.______;
}
\`\`\``,
        starterCode: `async function consultarGraphQL(query, variables, token) {
  const res = await fetch('https://api.ejemplo.com/______', {
    method: '______',
    headers: {
      '______': 'application/json',
      'Authorization': \`Bearer \${token}\`,
    },
    body: JSON.stringify({
      ______,
      ______,
    }),
  });

  const json = await res.______();
  if (json.______) throw new Error(json.errors[0].message);
  return json.______;
}`,
        solution: `async function consultarGraphQL(query, variables, token) {
  const res = await fetch('https://api.ejemplo.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${token}\`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}`,
        validationLogic: JSON.stringify({
          type: 'includes_keywords',
          keywords: ['graphql', 'POST', 'Content-Type', 'query', 'variables', 'json()', 'errors', 'data'],
          caseSensitive: false,
          explanation: 'El endpoint es /graphql, el método es POST, el header es Content-Type: application/json. El body incluye query y variables. Se comprueba json.errors antes de devolver json.data.',
        }),
        hintsJson: JSON.stringify([
          'GraphQL siempre usa el endpoint /graphql y el método POST, sin importar si es query o mutation.',
          'El body JSON debe tener dos campos: "query" (el string GraphQL) y "variables" (el objeto de variables).',
          'La respuesta siempre tiene dos campos posibles: "data" (el resultado) y "errors" (los errores). Comprueba errors primero.',
        ]),
      },
      // 7. Fill Blank
      {
        order: 7,
        type: 'fill_blank',
        difficulty: 'hard',
        points: 15,
        prompt: `Completa esta mutation GraphQL para crear un comentario:

\`\`\`graphql
______ AgregarComentario($publicacionId: ID!, $texto: String!) {
  crearComentario(
    ______: $publicacionId,
    ______: $texto
  ) {
    id
    texto
    autor {
      nombre
    }
    ______En
  }
}
\`\`\`

Variables: \`{ "publicacionId": "15", "texto": "¡Excelente artículo!" }\``,
        starterCode: `______ AgregarComentario($publicacionId: ID!, $texto: String!) {
  crearComentario(
    ______: $publicacionId,
    ______: $texto
  ) {
    id
    texto
    autor {
      nombre
    }
    ______En
  }
}`,
        solution: `mutation AgregarComentario($publicacionId: ID!, $texto: String!) {
  crearComentario(
    publicacionId: $publicacionId,
    texto: $texto
  ) {
    id
    texto
    autor {
      nombre
    }
    creadoEn
  }
}`,
        validationLogic: JSON.stringify({
          type: 'includes_keywords',
          keywords: ['mutation', 'publicacionId', 'texto: $texto', 'creadoEn'],
          caseSensitive: false,
          explanation: 'La palabra clave es "mutation". Los argumentos del resolver mapean las variables: publicacionId: $publicacionId, texto: $texto. El campo de timestamp se llama convencionalmente "creadoEn".',
        }),
        hintsJson: JSON.stringify([
          'Para operaciones que modifican datos en GraphQL, la palabra clave es "mutation" (no "query").',
          'Los argumentos del resolver deben mapear las variables: el nombre del argumento seguido de : $nombreVariable.',
          'Los valores son: mutation, publicacionId: $publicacionId, texto: $texto, creadoEn.',
        ]),
      },
      // 8. Build
      {
        order: 8,
        type: 'build',
        difficulty: 'medium',
        points: 20,
        prompt: `Crea una función genérica \`fetchGraphQL(endpoint, query, variables, token)\` que:

1. Haga una petición POST a \`endpoint\`
2. Incluya el header \`Content-Type: application/json\`
3. Si se proporciona \`token\`, añada el header \`Authorization: Bearer {token}\`
4. Envíe \`{ query, variables }\` como body JSON
5. Si la respuesta HTTP no es OK (status >= 400), lance un error con el status
6. Si la respuesta contiene el campo \`errors\`, lance un error con el mensaje del primer error
7. Devuelva solo el campo \`data\` de la respuesta`,
        starterCode: `async function fetchGraphQL(endpoint, query, variables = {}, token = null) {
  // Tu código aquí
}`,
        solution: `async function fetchGraphQL(endpoint, query, variables = {}, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = \`Bearer \${token}\`;
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(\`Error HTTP: \${res.status} \${res.statusText}\`);
  }

  const json = await res.json();

  if (json.errors && json.errors.length > 0) {
    throw new Error(\`Error GraphQL: \${json.errors[0].message}\`);
  }

  return json.data;
}`,
        validationLogic: JSON.stringify({
          type: 'includes_keywords',
          keywords: ['Content-Type', 'POST', 'Authorization', 'Bearer', 'json.errors', 'json.data', 'res.ok'],
          caseSensitive: false,
          explanation: 'La función debe: poner Content-Type en headers, añadir Authorization solo si hay token, usar POST, verificar res.ok, verificar json.errors y devolver json.data.',
        }),
        hintsJson: JSON.stringify([
          'Crea el objeto headers primero, luego añade Authorization condicionalmente con if(token).',
          'Después de res.json(), comprueba dos cosas: res.ok para errores HTTP, y json.errors para errores GraphQL.',
          'GraphQL siempre devuelve un objeto con "data" y opcionalmente "errors". Tu función debe devolver solo json.data.',
        ]),
      },
      // 9. Build
      {
        order: 9,
        type: 'build',
        difficulty: 'hard',
        points: 20,
        prompt: `Usa la función \`fetchGraphQL\` (asume que existe) para implementar \`buscarUsuarioPorEmail(email, token)\`:

La función debe:
1. Construir una query GraphQL que busque un usuario por email
2. Solicitar los campos: id, nombre, email, rol, creadoEn
3. Pasar el email como variable (no interpolado directamente en la query)
4. Manejar el caso donde el usuario no existe (data.usuario es null) lanzando un Error "Usuario no encontrado"
5. Devolver el objeto usuario si existe

Endpoint: \`https://api.ejemplo.com/graphql\``,
        starterCode: `async function buscarUsuarioPorEmail(email, token) {
  // Tu código aquí
}`,
        solution: `async function buscarUsuarioPorEmail(email, token) {
  const query = \`
    query BuscarPorEmail($email: String!) {
      usuario(email: $email) {
        id
        nombre
        email
        rol
        creadoEn
      }
    }
  \`;

  const variables = { email };

  const data = await fetchGraphQL(
    'https://api.ejemplo.com/graphql',
    query,
    variables,
    token
  );

  if (!data.usuario) {
    throw new Error('Usuario no encontrado');
  }

  return data.usuario;
}`,
        validationLogic: JSON.stringify({
          type: 'includes_keywords',
          keywords: ['query', '$email', 'String!', 'variables', 'data.usuario', 'Usuario no encontrado'],
          caseSensitive: false,
          explanation: 'La query debe usar una variable $email: String! para evitar inyección. Las variables se pasan por separado. Se comprueba data.usuario para el caso null y se lanza un error descriptivo.',
        }),
        hintsJson: JSON.stringify([
          'Define la query como template literal. Usa $email: String! como variable para no interpolar el valor directamente.',
          'Pasa { email } como objeto variables al llamar a fetchGraphQL. Esto evita problemas de inyección.',
          'Tras obtener data, comprueba if(!data.usuario) para manejar el caso de usuario inexistente antes de hacer return data.usuario.',
        ]),
      },
      // 10. Debug
      {
        order: 10,
        type: 'debug',
        difficulty: 'hard',
        points: 20,
        prompt: `Este código intenta hacer una consulta GraphQL pero tiene dos bugs. Encuéntralos y corrígelos:

\`\`\`javascript
async function obtenerPerfil(userId) {
  const query = \`
    query ObtenerPerfil {
      usuario(id: "\${userId}") {    // Bug 1
        nombre
        email
      }
    }
  \`;

  const res = await fetch('/graphql', {
    method: 'GET',                   // Bug 2
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  return res.json();
}
\`\`\``,
        starterCode: `async function obtenerPerfil(userId) {
  const query = \`
    query ObtenerPerfil {
      usuario(id: "\${userId}") {
        nombre
        email
      }
    }
  \`;

  const res = await fetch('/graphql', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  return res.json();
}`,
        solution: `async function obtenerPerfil(userId) {
  const query = \`
    query ObtenerPerfil($id: ID!) {
      usuario(id: $id) {
        nombre
        email
      }
    }
  \`;

  const variables = { id: userId };

  const res = await fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });

  return res.json();
}`,
        validationLogic: JSON.stringify({
          type: 'includes_keywords',
          keywords: ['POST', '$id', 'variables', 'ID!'],
          caseSensitive: false,
          explanation: 'Bug 1: interpolar ${userId} en la query es una inyección GraphQL. Usar variables con $id: ID! y pasarlas separadas. Bug 2: GraphQL necesita POST, no GET, porque el body JSON no se puede enviar con GET.',
        }),
        hintsJson: JSON.stringify([
          'Bug 2 es el más evidente: GET no puede tener body. GraphQL siempre usa POST.',
          'Bug 1: interpoler ${userId} directamente en la query es como SQL injection pero para GraphQL. La solución son variables tipadas.',
          'Corrección: method: "POST", declarar $id: ID! en la query, usar id: $id en el argumento, y pasar { variables: { id: userId } } en el body.',
        ]),
      },
      // 11. Challenge
      {
        order: 11,
        type: 'challenge',
        difficulty: 'hard',
        points: 30,
        prompt: `Reto final: Implementa una clase \`GraphQLClient\` completa con:

1. **Constructor**: recibe \`endpoint\` y \`opciones\` (token opcional, headers adicionales)
2. **Método \`query(queryString, variables)\`**: ejecuta una query de lectura
3. **Método \`mutation(mutationString, variables)\`**: ejecuta una mutation
4. **Caché simple**: las queries (no mutations) se cachean por 60 segundos usando la query+variables como clave
5. **Manejo de errores**: distingue entre errores HTTP (status >= 400) y errores GraphQL (campo errors)
6. **Soporte para subscriptions**: método \`subscribe(url, subscriptionQuery, onData)\` que abre un WebSocket y llama a \`onData\` con cada mensaje; devuelve una función para cancelar la suscripción

La clase debe ser reutilizable y funcionar con cualquier servidor GraphQL.`,
        starterCode: `class GraphQLClient {
  constructor(endpoint, opciones = {}) {
    // Tu código aquí
  }

  async query(queryString, variables = {}) {
    // Tu código aquí
  }

  async mutation(mutationString, variables = {}) {
    // Tu código aquí
  }

  subscribe(wsUrl, subscriptionQuery, onData) {
    // Tu código aquí
  }
}`,
        solution: `class GraphQLClient {
  constructor(endpoint, opciones = {}) {
    this.endpoint = endpoint;
    this.token = opciones.token ?? null;
    this.headersExtra = opciones.headers ?? {};
    this._cache = new Map(); // clave -> { data, expiraEn }
  }

  _construirHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      ...this.headersExtra,
    };
    if (this.token) {
      headers['Authorization'] = \`Bearer \${this.token}\`;
    }
    return headers;
  }

  async _ejecutar(operacion, variables) {
    const res = await fetch(this.endpoint, {
      method: 'POST',
      headers: this._construirHeaders(),
      body: JSON.stringify({ query: operacion, variables }),
    });

    if (!res.ok) {
      throw new Error(\`Error HTTP \${res.status}: \${res.statusText}\`);
    }

    const json = await res.json();

    if (json.errors && json.errors.length > 0) {
      const err = new Error(\`Error GraphQL: \${json.errors[0].message}\`);
      err.graphqlErrors = json.errors;
      throw err;
    }

    return json.data;
  }

  async query(queryString, variables = {}) {
    const claveCache = JSON.stringify({ queryString, variables });
    const ahora = Date.now();

    const entrada = this._cache.get(claveCache);
    if (entrada && entrada.expiraEn > ahora) {
      return entrada.data;
    }

    const data = await this._ejecutar(queryString, variables);
    this._cache.set(claveCache, { data, expiraEn: ahora + 60000 });
    return data;
  }

  async mutation(mutationString, variables = {}) {
    // Las mutations nunca se cachean
    return this._ejecutar(mutationString, variables);
  }

  subscribe(wsUrl, subscriptionQuery, onData) {
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: 'connection_init',
      }));
      ws.send(JSON.stringify({
        type: 'subscribe',
        payload: { query: subscriptionQuery },
      }));
    };

    ws.onmessage = (evento) => {
      const msg = JSON.parse(evento.data);
      if (msg.type === 'next' && msg.payload?.data) {
        onData(msg.payload.data);
      }
    };

    ws.onerror = (error) => {
      console.error('Error en subscription WebSocket:', error);
    };

    // Devolver función de cancelación
    return () => ws.close();
  }
}`,
        validationLogic: JSON.stringify({
          type: 'minimum_length',
          minLength: 150,
          explanation: 'La implementación completa requiere: constructor con token y headers, método _ejecutar privado para compartir lógica, caché con Map y TTL de 60s en query(), mutations sin caché, y subscribe() con WebSocket que devuelve función de cancelación.',
        }),
        hintsJson: JSON.stringify([
          'Extrae la lógica HTTP en un método privado _ejecutar() que compartan query() y mutation(). Solo query() usa el caché.',
          'Para el caché, usa un Map donde la clave es JSON.stringify({queryString, variables}) y el valor es {data, expiraEn: Date.now()+60000}.',
          'subscribe() abre un WebSocket, envía la suscripción en onopen y llama a onData() en onmessage cuando msg.type === "next". Devuelve () => ws.close() para cancelar.',
        ]),
      },
    ],
  },
];
