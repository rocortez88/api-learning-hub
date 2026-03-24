import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.ts';
import { useModules } from '../hooks/useModules';
import type { Module, UserStats, PracticeQueueItem } from '../types';
import { Spinner, Button, Card } from '../components/ui';
import { StatsGrid, ModuleCard } from '../components/progress';
import styles from './Dashboard.module.css';

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
  const { modules, practiceQueue, loading, error, refresh } = useModules();

  useEffect(() => {
    document.title = 'Dashboard | API Learning Hub';
  }, []);

  const stats = buildStats(modules, practiceQueue);

  // ── Render: loading ──
  if (loading) {
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
  if (error) {
    return (
      <main className={styles.page}>
        <div className={styles.center}>
          <p className={styles.errorText}>{error}</p>
          <Button onClick={refresh} variant="secondary" size="sm">
            Reintentar
          </Button>
        </div>
      </main>
    );
  }

  const hasPracticeQueue = practiceQueue.length > 0;
  // Group by lessonId to link the drill CTA to the first pending lesson
  const firstQueuedLessonId = hasPracticeQueue
    ? practiceQueue[0]?.lessonId
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
              {practiceQueue.length} ejercicio
              {practiceQueue.length !== 1 ? 's' : ''} pendientes de repaso
            </span>
          </div>
        )}
      </header>

      {/* ── Stats ── */}
      <section className={styles.section} aria-labelledby="stats-heading">
        <h2 id="stats-heading" className={styles.sectionTitle}>Tu progreso</h2>
        <StatsGrid stats={stats} />
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
                <strong>{practiceQueue.length}</strong> ejercicio
                {practiceQueue.length !== 1 ? 's' : ''} en cola
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
        {modules.length === 0 ? (
          <p className={styles.emptyText}>No hay modulos disponibles aun.</p>
        ) : (
          <div className={styles.modulesGrid}>
            {modules.map((mod) => (
              <ModuleCard key={mod.id} module={mod} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
