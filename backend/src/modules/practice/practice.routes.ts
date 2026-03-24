import { Router } from 'express';
import type { NextFunction, Request, Response } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { getPracticeQueue } from './practice.service.js';

const router = Router();

/**
 * @openapi
 * /practice/queue:
 *   get:
 *     summary: Get the spaced repetition practice queue for the authenticated user
 *     description: >
 *       Returns up to 10 exercises whose next review date is due (nextReviewAt <= now),
 *       ordered by the oldest review date first. Does not include solution or
 *       validationLogic — only the data the student needs to practice.
 *     tags:
 *       - Práctica
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Practice queue retrieved successfully
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
 *                       srId:
 *                         type: string
 *                         description: Spaced repetition record ID
 *                       nextReviewAt:
 *                         type: string
 *                         format: date-time
 *                       intervalDays:
 *                         type: number
 *                       repetitions:
 *                         type: integer
 *                       exercise:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           lessonId:
 *                             type: string
 *                           type:
 *                             type: string
 *                             enum: [quiz, observe, fill_blank, build, debug, challenge]
 *                           prompt:
 *                             type: string
 *                           starterCode:
 *                             type: string
 *                             nullable: true
 *                           difficulty:
 *                             type: string
 *                             enum: [easy, medium, hard]
 *                           points:
 *                             type: integer
 *                           hints:
 *                             type: array
 *                             items:
 *                               type: string
 *                             description: Parsed array of progressive hints
 *                           order:
 *                             type: integer
 *                 total:
 *                   type: integer
 *                   description: Number of exercises in the current queue (max 10)
 *       401:
 *         description: Unauthorized — missing or invalid token
 */
router.get(
  '/queue',
  requireAuth,
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const queue = getPracticeQueue(req.user!.sub);
      res.status(200).json(queue);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
