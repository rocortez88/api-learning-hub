import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import * as modulesService from './modules.service.js';

export const modulesRouter = Router();

/**
 * @openapi
 * /modules:
 *   get:
 *     tags: [Módulos]
 *     summary: Listar todos los módulos
 *     description: Devuelve la lista completa de módulos educativos ordenados por su posición en el curriculum.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de módulos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: mod_01
 *                       slug:
 *                         type: string
 *                         example: fundamentos
 *                       title:
 *                         type: string
 *                         example: Fundamentos de APIs
 *                       description:
 *                         type: string
 *                       level:
 *                         type: integer
 *                         example: 1
 *                       order:
 *                         type: integer
 *                         example: 1
 *                       unlockedByModuleId:
 *                         type: string
 *                         nullable: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
modulesRouter.get(
  '/',
  requireAuth,
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = modulesService.getAllModules();
      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  },
);

/**
 * @openapi
 * /modules/{slug}:
 *   get:
 *     tags: [Módulos]
 *     summary: Obtener un módulo por slug
 *     description: Devuelve un módulo educativo con todas sus lecciones incluidas, ordenadas por posición.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *           example: fundamentos
 *         description: Identificador único del módulo en formato slug
 *     responses:
 *       200:
 *         description: Módulo obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     slug:
 *                       type: string
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     level:
 *                       type: integer
 *                     order:
 *                       type: integer
 *                     unlockedByModuleId:
 *                       type: string
 *                       nullable: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     lessons:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           moduleId:
 *                             type: string
 *                           title:
 *                             type: string
 *                           contentMd:
 *                             type: string
 *                           order:
 *                             type: integer
 *                           type:
 *                             type: string
 *                             enum: [theory, demo, exercise_set]
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Módulo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
modulesRouter.get(
  '/:slug',
  requireAuth,
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = modulesService.getModuleBySlug(req.params['slug'] ?? '');
      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  },
);
