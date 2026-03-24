import { z } from 'zod';

export const reviewItemsQuerySchema = z.object({
  exerciseId: z.string().min(1).optional(),
  limit: z
    .string()
    .optional()
    .transform((val) => (val !== undefined ? parseInt(val, 10) : 10))
    .pipe(
      z
        .number()
        .int('limit debe ser un entero')
        .min(1, 'limit debe ser al menos 1')
        .max(100, 'limit no puede superar 100'),
    ),
});

export type ReviewItemsQuery = z.infer<typeof reviewItemsQuerySchema>;
