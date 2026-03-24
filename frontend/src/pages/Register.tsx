import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { z } from 'zod';
import { AuthLayout } from '../components/layout';
import { Button, Input } from '../components/ui';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/client';
import type { ApiError, ApiResponse, User } from '../types';
import styles from './Auth.module.css';

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
      .max(30, 'El nombre de usuario no puede superar 30 caracteres')
      .regex(/^[a-zA-Z0-9_]+$/, 'Solo letras, números y guión bajo'),
    email: z.string().email('Correo electrónico inválido'),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(72, 'La contraseña no puede superar 72 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type FieldErrors = Partial<Record<'username' | 'email' | 'password' | 'confirmPassword', string>>;

interface RegisterResponse {
  user: User;
  accessToken: string;
}

export default function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError('');
    setFieldErrors({});

    const parsed = registerSchema.safeParse({ username, email, password, confirmPassword });

    if (!parsed.success) {
      const errors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const rawField = issue.path[0];
        if (typeof rawField === 'string') {
          const field = rawField as keyof FieldErrors;
          if (!errors[field]) errors[field] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const { data } = await apiClient.post<ApiResponse<RegisterResponse>>('/auth/register', {
        username: parsed.data.username,
        email: parsed.data.email,
        password: parsed.data.password,
      });

      setAuth(data.data.user, data.data.accessToken);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      const message = axiosError.response?.data?.error?.message;
      setFormError(message ?? 'No fue posible crear la cuenta. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <h1 className={styles.title}>Crear cuenta</h1>
      <p className={styles.subtitle}>Empieza a aprender APIs hoy</p>

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <Input
          id="username"
          label="Nombre de usuario"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="mi_usuario"
          autoComplete="username"
          error={fieldErrors.username}
          required
        />

        <Input
          id="email"
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          autoComplete="email"
          error={fieldErrors.email}
          required
        />

        <Input
          id="password"
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 8 caracteres"
          autoComplete="new-password"
          error={fieldErrors.password}
          required
        />

        <Input
          id="confirmPassword"
          label="Confirmar contraseña"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repite tu contraseña"
          autoComplete="new-password"
          error={fieldErrors.confirmPassword}
          required
        />

        {formError && (
          <p className={styles.formError} role="alert">
            {formError}
          </p>
        )}

        <Button type="submit" variant="primary" size="lg" loading={loading} style={{ width: '100%' }}>
          Crear cuenta
        </Button>
      </form>

      <p className={styles.footer}>
        ¿Ya tienes cuenta?{' '}
        <Link to="/login">Inicia sesión</Link>
      </p>
    </AuthLayout>
  );
}
