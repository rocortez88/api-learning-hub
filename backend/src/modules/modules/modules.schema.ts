import { z } from 'zod';

export const moduleParamsSchema = z.object({
  slug: z.string().min(1, 'El slug del módulo no puede estar vacío'),
});

export type ModuleParams = z.infer<typeof moduleParamsSchema>;
