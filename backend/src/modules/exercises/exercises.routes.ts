import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import * as exercisesService from './exercises.service.js';

export const exercisesRouter = Router();

/**
 * @openapi
 * /exercises/{id}:
 *   get:
 *     tags: [Ejercicios]
 *     summary: Obtener un ejercicio por ID
 *     description: |
 *       Devuelve los datos públicos de un ejercicio: enunciado, código inicial, pistas
 *       y metadatos de validación seguros. Nunca expone la solución ni la lógica de
 *       validación completa.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: ex_01
 *         description: Identificador único del ejercicio
 *     responses:
 *       200:
 *         description: Ejercicio obtenido exitosamente
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
 *                     lessonId:
 *                       type: string
 *                     type:
 *                       type: string
 *                       enum: [quiz, observe, fill_blank, build, debug, challenge]
 *                     prompt:
 *                       type: string
 *                     starterCode:
 *                       type: string
 *                       nullable: true
 *                     difficulty:
 *                       type: string
 *                       enum: [easy, medium, hard]
 *                     points:
 *                       type: integer
 *                       example: 10
 *                     order:
 *                       type: integer
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     hints:
 *                       type: array
 *                       description: Hasta 3 pistas progresivas
 *                       items:
 *                         type: string
 *                     validation:
 *                       type: object
 *                       description: Metadatos de validación seguros (sin respuesta correcta)
 *                       properties:
 *                         type:
 *                           type: string
 *                           example: exact_match
 *                         options:
 *                           type: array
 *                           description: Solo presente en ejercicios tipo quiz
 *                           items:
 *                             type: object
 *                             properties:
 *                               key:
 *                                 type: string
 *                               text:
 *                                 type: string
 *                         minLength:
 *                           type: integer
 *                           description: Solo presente cuando type es minimum_length
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Ejercicio no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
exercisesRouter.get(
  '/:id',
  requireAuth,
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = exercisesService.getExerciseById(req.params['id'] ?? '');
      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  },
);
