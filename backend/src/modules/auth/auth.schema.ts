import { z } from 'zod';

export const registerSchema = z.object({
  email: z
    .string({ required_error: 'El email es requerido' })
    .email('Formato de email invalido')
    .toLowerCase(),
  username: z
    .string({ required_error: 'El username es requerido' })
    .min(3, 'El username debe tener al menos 3 caracteres')
    .max(20, 'El username no puede superar 20 caracteres')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'El username solo puede contener letras, numeros y guiones bajos',
    ),
  password: z
    .string({ required_error: 'La contraseña es requerida' })
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(72, 'La contraseña no puede superar 72 caracteres'),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'El email es requerido' })
    .email('Formato de email invalido')
    .toLowerCase(),
  password: z
    .string({ required_error: 'La contraseña es requerida' }),
});

export const refreshSchema = z.object({
  refreshToken: z
    .string({ required_error: 'El refreshToken es requerido' })
    .min(1, 'El refreshToken no puede estar vacio'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput    = z.infer<typeof loginSchema>;
export type RefreshInput  = z.infer<typeof refreshSchema>;
