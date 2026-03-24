import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Learning Hub',
      version: '1.0.0',
      description: `
API REST educativa para aprender conceptos de APIs.
Todos los endpoints estan documentados con ejemplos practicos.

**Como autenticarse:**
1. Registrate en \`POST /auth/register\`
2. Obtén tu token en \`POST /auth/login\`
3. Usa el token en el header: \`Authorization: Bearer <token>\`
      `,
      contact: {
        name: 'API Learning Hub',
      },
    },
    servers: [
      { url: 'http://localhost:3001/api', description: 'Desarrollo local' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenido del endpoint /auth/login',
        },
      },
    },
  },
  apis: ['./src/modules/**/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
