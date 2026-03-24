import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiClient } from '../api/client';
import { useAuthStore } from '../store/authStore.ts';
import type { Module, UserStats, PracticeQueueItem, ApiResponse, User as FullUser } from '../types';
import { Spinner, Button, Badge } from '../components/ui';
import { ProgressBar, StatsGrid } from '../components/progress';
import styles from './Profile.module.css';

// ─── Types ─────────────────────────────────────────────────────────────────

interface PageState {
  modules: Module[];
  practiceQueue: PracticeQueueItem[];
  loading: boolean;
  error: string | null;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function buildStats(modules: Module[], queue: PracticeQueueItem[]): UserStats {
  const unlocked = modules.filter((m) => m.isUnlocked ?? true).length;
  const completedModules = modules.filter((m) => (m.progress ?? 0) >= 100).length;
  const exercisesCompleted = completedModules * 20;
  const totalPoints = exercisesCompleted * 10;

  return {
    exercisesCompleted,
    totalPoints,
    streakDays: 0,
    modulesUnlocked: unlocked,
    practiceQueueSize: queue.length,
  };
}

function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    if (status !== undefined && status >= 500) {
      return 'Error del servidor. Por favor intenta más tarde.';
    }
    if (status === 404) return 'No encontrado.';
    if (err.response?.data?.error?.message) {
      const raw = String(err.response.data.error.message).slice(0, 200);
      return raw.replace(/[<>"'`]/g, '').trim() || 'Error al procesar la solicitud.';
    }
  }
  return 'Error al cargar los datos. Por favor intenta más tarde.';
}

function getInitials(username: string): string {
  const parts = username.trim().split(/\s+/);
  if (parts.length >= 2) {
    return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
  }
  return username.slice(0, 2).toUpperCase();
}

function formatDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return isoString;
  }
}

const LEVEL_LABEL: Record<number, string> = {
  1: 'Fundamentos',
  2: 'REST',
  3: 'Autenticación',
  4: 'Avanzado',
  5: 'Producción',
};

const ROLE_VARIANT = {
  student: 'info',
  admin: 'warning',
} as const;

const ROLE_LABEL = {
  student: 'Estudiante',
  admin: 'Admin',
} as const;

// ─── Component ─────────────────────────────────────────────────────────────

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const [state, setState] = useState<PageState>({
    modules: [],
    practiceQueue: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    let cancelled = false;

    async function fetchData() {
      try {
        const [modulesRes, queueRes] = await Promise.all([
          apiClient.get<ApiResponse<Module[]>>('/modules'),
          apiClient
            .get<ApiResponse<PracticeQueueItem[]>>('/practice/queue')
            .catch(() => ({ data: { data: [] as PracticeQueueItem[] } })),
        ]);

        if (cancelled) return;

        setState({
          modules: modulesRes.data.data,
          practiceQueue: queueRes.data.data,
          loading: false,
          error: null,
        });
      } catch (err: unknown) {
        if (cancelled) return;
        setState((prev) => ({
          ...prev,
          loading: false,
          error: extractErrorMessage(err),
        }));
      }
    }

    void fetchData();
    return () => {
      cancelled = true;
    };
  }, [user, navigate]);

  // ── Render: loading ──
  if (state.loading) {
    return (
      <main className={styles.page}>
        <div className={styles.center}>
          <Spinner size="lg" />
          <p className={styles.loadingText}>Cargando perfil...</p>
        </div>
      </main>
    );
  }

  // ── Render: error ──
  if (state.error) {
    return (
      <main className={styles.page}>
        <div className={styles.center}>
          <p className={styles.errorText}>{state.error}</p>
          <Button onClick={() => window.location.reload()} variant="secondary" size="sm">
            Reintentar
          </Button>
        </div>
      </main>
    );
  }

  if (!user) return null;

  const stats = buildStats(state.modules, state.practiceQueue);
  const initials = getInitials(user.username);
  const modulesSorted = [...state.modules].sort((a, b) => a.order - b.order);

  return (
    <main className={styles.page}>
      {/* ── 1. User card ── */}
      <section className={styles.section} aria-labelledby="profile-heading">
        <h1 id="profile-heading" className={styles.sectionTitle}>Mi perfil</h1>
        <div className={styles.userCard}>
          <div className={styles.avatar} aria-label={`Avatar de ${user.username}`}>
            {initials}
          </div>
          <div className={styles.userInfo}>
            <div className={styles.userNameRow}>
              <span className={styles.username}>{user.username}</span>
              <Badge variant={ROLE_VARIANT[user.role]}>
                {ROLE_LABEL[user.role]}
              </Badge>
            </div>
            <span className={styles.userEmail}>{user.email}</span>
            {(user as Partial<FullUser>).createdAt && (
              <span className={styles.userJoined}>
                Miembro desde {formatDate((user as FullUser).createdAt)}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── 2. Statistics ── */}
      <section className={styles.section} aria-labelledby="stats-heading">
        <h2 id="stats-heading" className={styles.sectionTitle}>Estadísticas</h2>
        <StatsGrid stats={stats} />
        <p className={styles.statsNote}>
          * Las estadísticas se calculan a partir de tu progreso en módulos.
          Racha de días: próximamente.
        </p>
      </section>

      {/* ── 3. Module progress ── */}
      {modulesSorted.length > 0 && (
        <section className={styles.section} aria-labelledby="modules-heading">
          <h2 id="modules-heading" className={styles.sectionTitle}>Progreso por módulo</h2>
          <div className={styles.modulesList}>
            {modulesSorted.map((mod) => {
              const isLocked = !(mod.isUnlocked ?? true);
              return (
                <div
                  key={mod.id}
                  className={`${styles.moduleRow} ${isLocked ? styles.moduleRowLocked : ''}`}
                >
                  <div className={styles.moduleRowHeader}>
                    <div className={styles.moduleRowMeta}>
                      <span className={styles.moduleLevelBadge}>
                        Nivel {mod.level}
                        {LEVEL_LABEL[mod.level] ? ` — ${LEVEL_LABEL[mod.level]}` : ''}
                      </span>
                      <span className={styles.moduleTitle}>{mod.title}</span>
                    </div>
                    <div className={styles.moduleRowRight}>
                      {isLocked ? (
                        <span className={styles.lockedLabel}>Bloqueado</span>
                      ) : (
                        <span className={styles.progressLabel}>
                          {Math.round(mod.progress ?? 0)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <ProgressBar
                    value={isLocked ? 0 : (mod.progress ?? 0)}
                    showPercent={false}
                    size="sm"
                    label={`Progreso en ${mod.title}`}
                  />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── 4. Recent attempts — Próximamente ── */}
      <section className={styles.section} aria-labelledby="history-heading">
        <h2 id="history-heading" className={styles.sectionTitle}>Historial reciente</h2>
        <div className={styles.comingSoon}>
          <span className={styles.comingSoonIcon} aria-hidden="true">🚧</span>
          <p className={styles.comingSoonText}>
            El historial de intentos estará disponible próximamente.
          </p>
        </div>
      </section>

      {/* ── Back to dashboard ── */}
      <div className={styles.footerActions}>
        <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard')}>
          ← Volver al Dashboard
        </Button>
      </div>
    </main>
  );
}
