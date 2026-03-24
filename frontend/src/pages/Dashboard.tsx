import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiClient } from '../api/client';
import { useAuthStore } from '../store/authStore.ts';
import type { Module, UserStats, PracticeQueueItem, ApiResponse } from '../types';
import { Spinner, Button, Card } from '../components/ui';
import { StatsGrid, ModuleCard } from '../components/progress';
import styles from './Dashboard.module.css';

// ─── Local state shape ─────────────────────────────────────────────────────────
interface DashboardState {
  modules: Module[];
  practiceQueue: PracticeQueueItem[];
  stats: UserStats;
  loading: boolean;
  error: string | null;
}

function buildStats(modules: Module[], queue: PracticeQueueItem[]): UserStats {
  const unlocked = modules.filter((m) => m.isUnlocked ?? true).length;
  const completedModules = modules.filter((m) => (m.progress ?? 0) >= 100).length;

  // Approximate: each completed module ~80% of 25 exercises avg = 20, 10 pts each
  const exercisesCompleted = completedModules * 20;
  const totalPoints = exercisesCompleted * 10;

  return {
    exercisesCompleted,
    totalPoints,
    streakDays: 0, // No endpoint yet — default to 0
    modulesUnlocked: unlocked,
    practiceQueueSize: queue.length,
  };
}

const INITIAL_STATS: UserStats = {
  exercisesCompleted: 0,
  totalPoints: 0,
  streakDays: 0,
  modulesUnlocked: 0,
  practiceQueueSize: 0,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const [state, setState] = useState<DashboardState>({
    modules: [],
    practiceQueue: [],
    stats: INITIAL_STATS,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const [modulesRes, queueRes] = await Promise.all([
          apiClient.get<ApiResponse<Module[]>>('/modules'),
          apiClient.get<ApiResponse<PracticeQueueItem[]>>('/practice/queue').catch(() => ({
            data: { data: [] as PracticeQueueItem[] },
          })),
        ]);

        if (cancelled) return;

        const modules = modulesRes.data.data;
        const queue = queueRes.data.data;
        const stats = buildStats(modules, queue);

        setState({
          modules,
          practiceQueue: queue,
          stats,
          loading: false,
          error: null,
        });
      } catch (err: unknown) {
        if (cancelled) return;
        let message = 'Error al cargar los datos. Por favor intenta más tarde.';
        if (axios.isAxiosError(err)) {
          const status = err.response?.status;
          if (status !== undefined && status >= 500) {
            message = 'Error del servidor. Por favor intenta más tarde.';
          } else if (status === 404) {
            message = 'No encontrado.';
          } else if (err.response?.data?.error?.message) {
            const raw = String(err.response.data.error.message).slice(0, 200);
            message = raw.replace(/[<>"'`]/g, '').trim() || 'Error al procesar la solicitud.';
          }
        }
        setState((prev) => ({ ...prev, loading: false, error: message }));
      }
    }

    void fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Render: loading ──
  if (state.loading) {
    return (
      <main className={styles.page}>
        <div className={styles.center}>
          <Spinner size="lg" />
          <p className={styles.loadingText}>Cargando tu dashboard...</p>
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

  const hasPracticeQueue = state.practiceQueue.length > 0;
  // Group by lessonId to link the drill CTA to the first pending lesson
  const firstQueuedLessonId = hasPracticeQueue
    ? state.practiceQueue[0]?.lessonId
    : null;

  return (
    <main className={styles.page}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.welcomeTitle}>
            Bienvenido, <span className={styles.username}>{user?.username ?? 'estudiante'}</span>
          </h1>
          <p className={styles.welcomeSub}>Continua tu aprendizaje donde lo dejaste.</p>
        </div>
        {hasPracticeQueue && (
          <div className={styles.queueBadge}>
            <span className={styles.queueDot} />
            <span className={styles.queueText}>
              {state.practiceQueue.length} ejercicio
              {state.practiceQueue.length !== 1 ? 's' : ''} pendientes de repaso
            </span>
          </div>
        )}
      </header>

      {/* ── Stats ── */}
      <section className={styles.section} aria-labelledby="stats-heading">
        <h2 id="stats-heading" className={styles.sectionTitle}>Tu progreso</h2>
        <StatsGrid stats={state.stats} />
      </section>

      {/* ── Practice queue CTA ── */}
      {hasPracticeQueue && firstQueuedLessonId && (
        <section className={styles.section} aria-labelledby="queue-heading">
          <h2 id="queue-heading" className={styles.sectionTitle}>Cola de practica</h2>
          <Card
            title="Tienes ejercicios pendientes de repaso"
            description="El sistema de repeticion espaciada ha seleccionado ejercicios para reforzar tu memoria a largo plazo."
          >
            <div className={styles.queueCta}>
              <p className={styles.queueCount}>
                <strong>{state.practiceQueue.length}</strong> ejercicio
                {state.practiceQueue.length !== 1 ? 's' : ''} en cola
              </p>
              <Button
                onClick={() => navigate(`/drill/${firstQueuedLessonId}`)}
                size="md"
              >
                Empezar repaso
              </Button>
            </div>
          </Card>
        </section>
      )}

      {/* ── Modules grid ── */}
      <section className={styles.section} aria-labelledby="modules-heading">
        <h2 id="modules-heading" className={styles.sectionTitle}>Modulos</h2>
        {state.modules.length === 0 ? (
          <p className={styles.emptyText}>No hay modulos disponibles aun.</p>
        ) : (
          <div className={styles.modulesGrid}>
            {state.modules.map((mod) => (
              <ModuleCard key={mod.id} module={mod} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
