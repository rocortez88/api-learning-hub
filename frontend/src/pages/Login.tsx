import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { z } from 'zod';
import { AuthLayout } from '../components/layout';
import { Button, Input } from '../components/ui';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/client';
import type { ApiError, ApiResponse, User } from '../types';
import styles from './Auth.module.css';

const loginSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

type FieldErrors = Partial<Record<'email' | 'password', string>>;

interface LoginResponse {
  user: User;
  accessToken: string;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((s) => s.setAuth);

  // Corrección 2: validar pathname para prevenir open redirect
  const rawFrom = (location.state as { from?: Location } | null)?.from?.pathname ?? '/dashboard';
  const from = rawFrom.startsWith('/') && !rawFrom.startsWith('//') ? rawFrom : '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError('');
    setFieldErrors({});

    // Corrección 4: validación con Zod antes de enviar
    const parsed = loginSchema.safeParse({ email: email.trim(), password });

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
      const { data } = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', {
        email: parsed.data.email.toLowerCase(),
        password: parsed.data.password,
      });

      setAuth(data.data.user, data.data.accessToken);
      navigate(from, { replace: true });
    } catch (err) {
      const axiosError = err as AxiosError<ApiError>;
      const message = axiosError.response?.data?.error?.message;
      setFormError(message ?? 'Credenciales incorrectas. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <h1 className={styles.title}>Iniciar sesión</h1>
      <p className={styles.subtitle}>Bienvenido de vuelta a API Hub</p>

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
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
          placeholder="••••••••"
          autoComplete="current-password"
          error={fieldErrors.password}
          required
        />

        {formError && (
          <p className={styles.formError} role="alert">
            {formError}
          </p>
        )}

        <Button type="submit" variant="primary" size="lg" loading={loading} style={{ width: '100%' }}>
          Entrar
        </Button>
      </form>

      <p className={styles.footer}>
        ¿No tienes cuenta?{' '}
        <Link to="/register">Regístrate gratis</Link>
      </p>
    </AuthLayout>
  );
}
