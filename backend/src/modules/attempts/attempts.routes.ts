import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { submitAttemptSchema } from './attempts.schema.js';
import { submitAttempt } from './attempts.service.js';

const router = Router({ mergeParams: true });

/**
 * @openapi
 * /exercises/{id}/attempt:
 *   post:
 *     summary: Submit an attempt for an exercise
 *     description: >
 *       Validates the submitted code against the exercise's validation logic,
 *       persists the attempt, and updates the spaced repetition schedule for
 *       the authenticated user using the SM-2 algorithm.
 *     tags:
 *       - Attempts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Exercise ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - submittedCode
 *             properties:
 *               submittedCode:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 10000
 *                 description: The answer or code submitted by the student
 *               timeSpentMs:
 *                 type: integer
 *                 minimum: 1
 *                 description: Time spent on the exercise in milliseconds (optional)
 *               hintUsedLevel:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 3
 *                 default: 0
 *                 description: Level of hint used (0 = no hint, 1-3 = progressive hints)
 *     responses:
 *       200:
 *         description: Attempt processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     attemptId:
 *                       type: string
 *                     passed:
 *                       type: boolean
 *                     result:
 *                       type: string
 *                       description: Feedback message from validation
 *                     points:
 *                       type: integer
 *                       description: Points earned (0 if not passed)
 *                     nextReviewAt:
 *                       type: string
 *                       format: date-time
 *                       description: ISO timestamp for next spaced repetition review
 *                     solution:
 *                       type: string
 *                       description: Correct solution — only included when passed is true
 *       400:
 *         description: Validation error in request body
 *       401:
 *         description: Unauthorized — missing or invalid token
 *       404:
 *         description: Exercise not found
 */
router.post(
  '/',
  requireAuth,
  validate(submitAttemptSchema),
  (req: Request, res: Response, next: NextFunction): void => {
    const exerciseId = req.params['id'] as string;
    const userId = req.user!.sub;

    submitAttempt(exerciseId, userId, req.body as Parameters<typeof submitAttempt>[2])
      .then((data) => {
        res.status(200).json({ data });
      })
      .catch(next);
  },
);

export default router;
