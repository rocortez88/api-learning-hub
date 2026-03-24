import { Router } from 'express';
import type { NextFunction, Request, Response } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { getPracticeQueue, getReviewItems } from './practice.service.js';
import { reviewItemsQuerySchema, type ReviewItemsQuery } from './practice.schema.js';

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
router.get('/queue', requireAuth, (req: Request, res: Response, next: NextFunction): void => {
  try {
    const userId = req.user?.sub ?? '';
    const queue = getPracticeQueue(userId);
    res.status(200).json({ data: queue.data, meta: { total: queue.total } });
  } catch (err) {
    next(err);
  }
});

/**
 * @openapi
 * /practice/review-items:
 *   get:
 *     summary: Get review items from the spaced repetition queue
 *     description: >
 *       Returns exercises due for review, with optional filtering by exerciseId
 *       and a configurable limit (1–100, default 10).
 *     tags:
 *       - Práctica
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: exerciseId
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter results to a specific exercise ID
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Maximum number of review items to return
 *     responses:
 *       200:
 *         description: Review items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 total:
 *                   type: integer
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         description: Unauthorized — missing or invalid token
 */
router.get(
  '/review-items',
  requireAuth,
  validate(reviewItemsQuerySchema, 'query'),
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const userId = req.user?.sub ?? '';
      const result = getReviewItems(userId, req.query as unknown as ReviewItemsQuery);
      res.status(200).json({ data: result.data, meta: { total: result.total } });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
