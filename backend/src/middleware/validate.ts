import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

/**
 * Middleware de validacion con Zod.
 * Valida req.body, req.params o req.query segun el target indicado.
 *
 * Uso:
 *   router.post('/login', validate(loginSchema), authController.login)
 */
export function validate(
  schema: ZodSchema,
  target: 'body' | 'params' | 'query' = 'body',
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Datos de entrada invalidos',
          details: result.error.flatten().fieldErrors,
        },
      });
      return;
    }

    req[target] = result.data;
    next();
  };
}
