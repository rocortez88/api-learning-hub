import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useModuleBySlug } from '../hooks/useModuleBySlug';
import type { LessonWithStats } from '../types';
import { Spinner, Badge, Button } from '../components/ui';
import { ProgressBar } from '../components/progress';
import styles from './Module.module.css';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const LEVEL_BADGE_VARIANT = {
  1: 'level1',
  2: 'level2',
  3: 'level3',
  4: 'level4',
  5: 'level5',
} as const;

const LESSON_TYPE_LABEL: Record<string, string> = {
  theory: 'Teoria',
  demo: 'Demo',
  exercise_set: 'Practica',
};

const LESSON_TYPE_BADGE = {
  theory: 'info',
  demo: 'warning',
  exercise_set: 'success',
} as const;

function getLessonStatus(
  lesson: LessonWithStats,
  moduleProgress: number,
  index: number,
): 'completed' | 'in_progress' | 'locked' {
  const completed = lesson.completedExercises ?? 0;
  const total = lesson.exerciseCount;

  if (total > 0 && completed >= total) return 'completed';

  // Simple heuristic: first lesson always in_progress if module is unlocked
  if (index === 0 && moduleProgress >= 0) return 'in_progress';

  // Lessons beyond the first are locked unless there is some progress
  if (completed > 0) return 'in_progress';
  if (moduleProgress > 0) return 'in_progress';

  return 'locked';
}

const STATUS_ICON: Record<string, string> = {
  completed: '✅',
  in_progress: '▶',
  locked: '🔒',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ModulePage() {
  const { moduleSlug } = useParams<{ moduleSlug: string }>();
  const navigate = useNavigate();
  const { module: mod, loading, error, notFound } = useModuleBySlug(moduleSlug);

  useEffect(() => {
    if (mod) {
      document.title = `Módulo: ${mod.title} | API Learning Hub`;
    }
  }, [mod]);

  // ── Render: loading ──
  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.center}>
          <Spinner size="lg" />
          <p className={styles.mutedText}>Cargando modulo...</p>
        </div>
      </main>
    );
  }

  // ── Render: not found ──
  if (notFound) {
    return (
      <main className={styles.page}>
        <div className={styles.center}>
          <p className={styles.errorText}>Modulo no encontrado (404).</p>
          <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard')}>
            Volver al Dashboard
          </Button>
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
          <Button onClick={() => window.location.reload()} variant="secondary" size="sm">
            Reintentar
          </Button>
        </div>
      </main>
    );
  }

  if (!mod) return null;

  const progress = mod.progress ?? 0;
  const totalLessons = mod.lessons.length;
  const totalExercises = mod.lessons.reduce((acc, l) => acc + l.exerciseCount, 0);
  const totalPoints = mod.lessons.reduce((acc, l) => acc + l.totalPoints, 0);

  return (
    <main className={styles.page}>
      {/* ── Back button ── */}
      <nav className={styles.nav}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard')}
        >
          ← Volver al Dashboard
        </Button>
      </nav>

      <div className={styles.layout}>
        {/* ── Main content ── */}
        <div className={styles.main}>
          {/* Header */}
          <header className={styles.header}>
            <div className={styles.headerBadges}>
              <Badge variant={LEVEL_BADGE_VARIANT[mod.level]}>
                Nivel {mod.level}
              </Badge>
            </div>
            <h1 className={styles.title}>{mod.title}</h1>
            <p className={styles.description}>{mod.description}</p>

            <div className={styles.progressSection}>
              <ProgressBar
                value={progress}
                label="Progreso del modulo"
                showPercent
                size="md"
              />
            </div>
          </header>

          {/* Lessons list */}
          <section aria-labelledby="lessons-heading">
            <h2 id="lessons-heading" className={styles.sectionTitle}>Lecciones</h2>

            {totalLessons === 0 ? (
              <p className={styles.mutedText}>Este modulo aun no tiene lecciones.</p>
            ) : (
              <ol className={styles.lessonList}>
                {mod.lessons.map((lesson, index) => {
                  const lessonStatus = getLessonStatus(lesson, progress, index);
                  const isLocked = lessonStatus === 'locked';

                  return (
                    <li
                      key={lesson.id}
                      className={`${styles.lessonItem} ${isLocked ? styles.lessonLocked : ''}`}
                    >
                      <div className={styles.lessonLeft}>
                        <span
                          className={styles.statusIcon}
                          aria-label={lessonStatus}
                        >
                          {STATUS_ICON[lessonStatus]}
                        </span>
                        <div className={styles.lessonInfo}>
                          <div className={styles.lessonTitleRow}>
                            <span className={styles.lessonTitle}>{lesson.title}</span>
                            <Badge
                              variant={
                                LESSON_TYPE_BADGE[lesson.type as keyof typeof LESSON_TYPE_BADGE] ??
                                'info'
                              }
                            >
                              {LESSON_TYPE_LABEL[lesson.type] ?? lesson.type}
                            </Badge>
                          </div>
                          <p className={styles.lessonMeta}>
                            {lesson.exerciseCount} ejercicio
                            {lesson.exerciseCount !== 1 ? 's' : ''} &middot;{' '}
                            {lesson.totalPoints} pts
                          </p>
                        </div>
                      </div>

                      <Button
                        variant={isLocked ? 'ghost' : 'primary'}
                        size="sm"
                        disabled={isLocked}
                        onClick={
                          isLocked
                            ? undefined
                            : () => navigate(`/modules/${mod.slug}/lessons/${lesson.id}`)
                        }
                      >
                        {isLocked ? 'Bloqueada' : lessonStatus === 'completed' ? 'Repasar' : 'Empezar'}
                      </Button>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>
        </div>

        {/* ── Sidebar / Stats summary ── */}
        <aside className={styles.sidebar} aria-label="Resumen del modulo">
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarTitle}>Resumen</h3>
            <ul className={styles.summaryList}>
              <li className={styles.summaryItem}>
                <span className={styles.summaryIcon}>📖</span>
                <span className={styles.summaryLabel}>Lecciones</span>
                <span className={styles.summaryValue}>{totalLessons}</span>
              </li>
              <li className={styles.summaryItem}>
                <span className={styles.summaryIcon}>✏️</span>
                <span className={styles.summaryLabel}>Ejercicios</span>
                <span className={styles.summaryValue}>{totalExercises}</span>
              </li>
              <li className={styles.summaryItem}>
                <span className={styles.summaryIcon}>⭐</span>
                <span className={styles.summaryLabel}>Puntos disponibles</span>
                <span className={styles.summaryValue}>{totalPoints}</span>
              </li>
              <li className={styles.summaryItem}>
                <span className={styles.summaryIcon}>📊</span>
                <span className={styles.summaryLabel}>Progreso</span>
                <span className={styles.summaryValue}>{Math.round(progress)}%</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
