import { z } from 'zod';

export const exerciseParamsSchema = z.object({
  id: z.string().min(1, 'El ID del ejercicio no puede estar vacío'),
});

export type ExerciseParams = z.infer<typeof exerciseParamsSchema>;
