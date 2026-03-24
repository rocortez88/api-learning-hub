import { z } from 'zod';

export const submitAttemptSchema = z.object({
  submittedCode: z
    .string()
    .min(1, 'El código enviado no puede estar vacío')
    .max(10000, 'El código enviado excede el límite de 10000 caracteres'),

  timeSpentMs: z
    .number()
    .int('timeSpentMs debe ser un entero')
    .positive('timeSpentMs debe ser un número positivo')
    .max(3_600_000, 'timeSpentMs no puede superar 1 hora')
    .optional(),

  hintUsedLevel: z
    .number()
    .int('hintUsedLevel debe ser un entero')
    .min(0, 'hintUsedLevel debe estar entre 0 y 3')
    .max(3, 'hintUsedLevel debe estar entre 0 y 3')
    .default(0),
});

export type SubmitAttemptInput = z.infer<typeof submitAttemptSchema>;
