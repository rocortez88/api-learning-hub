import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiClient } from '../api/client';
import type { Exercise, Attempt, ApiResponse, PracticeQueueItem } from '../types';
import { Spinner, Button, Badge } from '../components/ui';
import { ProgressBar } from '../components/progress';
import styles from './Drill.module.css';

// ─── Constants ─────────────────────────────────────────────────────────────

const MAX_DRILL_EXERCISES = 10;
const AUTO_ADVANCE_MS = 1500;

// ─── Types ─────────────────────────────────────────────────────────────────

interface AttemptResult {
  attempt: Attempt;
  nextExerciseId?: string | null;
}

type DrillPhase = 'loading' | 'empty' | 'active' | 'summary';

type DrillExercise = Exercise;

interface DrillResult {
  exerciseId: string;
  passed: boolean;
  points: number;
  timeSpentMs: number;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

const DIFFICULTY_VARIANT = {
  easy: 'success',
  medium: 'warning',
  hard: 'danger',
} as const;

const TYPE_LABEL: Record<string, string> = {
  quiz: 'Teoría',
  theory: 'Teoría',
  observe: 'Observar',
  fill_blank: 'Completar código',
  build: 'Construir',
  debug: 'Debuggear',
  challenge: 'Reto',
};

function parseQuizOptions(starterCode: string | null): string[] {
  if (!starterCode) return [];
  try {
    const parsed: unknown = JSON.parse(starterCode);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === 'string');
    }
    return [];
  } catch {
    return [];
  }
}

type FillSegment = { blank: false; text: string } | { blank: true; index: number };

function parseFillSegments(code: string): FillSegment[] {
  const MARKER = '___BLANK___';
  const parts = code.split(MARKER);
  const result: FillSegment[] = [];
  parts.forEach((part, i) => {
    result.push({ blank: false, text: part });
    if (i < parts.length - 1) {
      result.push({ blank: true, index: i });
    }
  });
  return result;
}

function buildFillCode(template: string, answers: string[]): string {
  const MARKER = '___BLANK___';
  const parts = template.split(MARKER);
  return parts.reduce((acc, part, i) => {
    const answer = i < answers.length ? (answers[i] ?? '') : '';
    return acc + part + (i < parts.length - 1 ? answer : '');
  }, '');
}

function formatSeconds(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  if (m > 0) return `${m}:${String(s).padStart(2, '0')}`;
  return `${s}s`;
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

// ─── Sub-components ────────────────────────────────────────────────────────

const LETTERS = 'ABCDEFGHIJ';

interface QuizViewProps {
  options: string[];
  selected: string | null;
  onSelect: (opt: string) => void;
  disabled: boolean;
}

function QuizView({ options, selected, onSelect, disabled }: QuizViewProps) {
  return (
    <div className={styles.quizOptions} role="radiogroup">
      {options.map((opt, i) => (
        <button
          key={i}
          type="button"
          role="radio"
          aria-checked={selected === opt}
          disabled={disabled}
          className={`${styles.quizOption} ${selected === opt ? styles.quizOptionSelected : ''}`}
          onClick={() => onSelect(opt)}
        >
          <span className={styles.optionLetter}>{LETTERS[i] ?? String(i + 1)}</span>
          {opt}
        </button>
      ))}
    </div>
  );
}

interface FillInViewProps {
  segments: FillSegment[];
  answers: string[];
  onAnswerChange: (index: number, value: string) => void;
  disabled: boolean;
}

function FillInView({ segments, answers, onAnswerChange, disabled }: FillInViewProps) {
  return (
    <div className={styles.fillCode} aria-label="Código con espacios en blanco">
      {segments.map((seg, i) => {
        if (!seg.blank) {
          return <span key={i}>{seg.text}</span>;
        }
        const blankIndex = seg.index;
        return (
          <input
            key={i}
            type="text"
            className={styles.blank}
            value={answers[blankIndex] ?? ''}
            onChange={(e) => onAnswerChange(blankIndex, e.target.value)}
            disabled={disabled}
            placeholder={`blank ${blankIndex + 1}`}
            aria-label={`Espacio en blanco ${blankIndex + 1}`}
          />
        );
      })}
    </div>
  );
}

interface TextareaViewProps {
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  starterCode: string | null;
}

function TextareaView({ value, onChange, disabled, starterCode }: TextareaViewProps) {
  return (
    <div className={styles.textareaWrapper}>
      {starterCode && <pre className={styles.starterCode}>{starterCode}</pre>}
      <textarea
        className={styles.codeTextarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Escribe tu código aquí..."
        aria-label="Editor de código"
        rows={10}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
      />
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function DrillPage() {
  const navigate = useNavigate();

  // Phase control
  const [phase, setPhase] = useState<DrillPhase>('loading');
  const [loadError, setLoadError] = useState<string | null>(null);

  // Exercise queue
  const [exercises, setExercises] = useState<DrillExercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Per-exercise answer state
  const [quizSelected, setQuizSelected] = useState<string | null>(null);
  const [fillAnswers, setFillAnswers] = useState<string[]>([]);
  const [textCode, setTextCode] = useState('');

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<AttemptResult | null>(null);
  const [showingFeedback, setShowingFeedback] = useState(false);

  // Session tracking
  const [sessionResults, setSessionResults] = useState<DrillResult[]>([]);
  const [totalPointsEarned, setTotalPointsEarned] = useState(0);

  // Chronometer
  const [elapsedSecs, setElapsedSecs] = useState(0);
  const exerciseStartRef = useRef<number>(Date.now());
  const sessionStartRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.title = 'Drill | API Learning Hub';
  }, []);

  // ── Start / stop timer ──
  function startTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    setElapsedSecs(0);
    exerciseStartRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedSecs(Math.floor((Date.now() - exerciseStartRef.current) / 1000));
    }, 1000);
  }

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  // ── Load queue ──
  useEffect(() => {
    let cancelled = false;
    sessionStartRef.current = Date.now();

    async function loadQueue() {
      try {
        // Try to get the full queue (exercises with full data)
        const queueRes = await apiClient.get<ApiResponse<PracticeQueueItem[]>>('/practice/queue');
        if (cancelled) return;

        const queueItems = queueRes.data.data.slice(0, MAX_DRILL_EXERCISES);

        if (queueItems.length === 0) {
          setPhase('empty');
          return;
        }

        // Queue items already include full exercise data — no extra fetch needed
        const loaded: DrillExercise[] = queueItems.map((item) => item.exercise);

        if (loaded.length === 0) {
          setPhase('empty');
          return;
        }

        setExercises(loaded);
        setCurrentIndex(0);
        resetAnswerState(loaded[0] ?? null);
        setPhase('active');
        startTimer();
      } catch (err: unknown) {
        if (cancelled) return;
        setLoadError(extractErrorMessage(err));
        setPhase('loading'); // keep spinner off — show error via loadError
      }
    }

    void loadQueue();
    return () => {
      cancelled = true;
      stopTimer();
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    };
  }, []);

  // ── Reset answer state for a given exercise ──
  function resetAnswerState(ex: DrillExercise | null) {
    setQuizSelected(null);
    setLastResult(null);
    setSubmitError(null);
    setShowingFeedback(false);

    if (!ex) {
      setFillAnswers([]);
      setTextCode('');
      return;
    }

    if (ex.type === 'fill_blank' && ex.starterCode) {
      const blanksCount = (ex.starterCode.match(/___BLANK___/g) ?? []).length;
      setFillAnswers(Array(blanksCount).fill(''));
    } else {
      setFillAnswers([]);
    }

    if ((ex.type === 'build' || ex.type === 'debug') && ex.starterCode) {
      setTextCode(ex.starterCode);
    } else {
      setTextCode('');
    }
  }

  // ── Advance to next exercise or summary ──
  const advanceToNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= exercises.length) {
      stopTimer();
      setPhase('summary');
      return;
    }
    setCurrentIndex(nextIndex);
    const nextEx = exercises[nextIndex] ?? null;
    resetAnswerState(nextEx);
    startTimer();
  }, [currentIndex, exercises]);

  // ── Build submitted code ──
  function buildSubmittedCode(ex: DrillExercise): string {
    const type = ex.type;
    if (type === 'quiz' || type === ('theory' as string)) return quizSelected ?? '';
    if (type === 'observe') return textCode;
    if (type === 'fill_blank') return buildFillCode(ex.starterCode ?? '', fillAnswers);
    return textCode;
  }

  // ── Can submit? ──
  function canSubmit(ex: DrillExercise): boolean {
    if (submitting || showingFeedback) return false;
    const type = ex.type;
    if (type === 'quiz' || type === ('theory' as string)) return quizSelected !== null;
    if (type === 'observe') return textCode.trim().length > 0;
    if (type === 'fill_blank') return fillAnswers.every((a) => a.trim().length > 0);
    return textCode.trim().length > 0;
  }

  // ── Submit attempt ──
  async function handleSubmit() {
    const ex = exercises[currentIndex];
    if (!ex || !canSubmit(ex)) return;

    const submittedCode = buildSubmittedCode(ex);
    const timeSpentMs = Date.now() - exerciseStartRef.current;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await apiClient.post<ApiResponse<AttemptResult>>(`/exercises/${ex.id}/attempt`, {
        submittedCode,
        timeSpentMs,
        hintUsedLevel: 0,
      });

      const attemptResult = res.data.data;
      setLastResult(attemptResult);
      stopTimer();

      const passed = attemptResult.attempt.passed;
      const newResult: DrillResult = {
        exerciseId: ex.id,
        passed,
        points: passed ? ex.points : 0,
        timeSpentMs,
      };

      const updatedResults = [...sessionResults, newResult];
      setSessionResults(updatedResults);
      if (passed) {
        setTotalPointsEarned((prev) => prev + ex.points);
      }

      setShowingFeedback(true);

      if (passed) {
        // Auto-advance after 1.5s on correct answer
        autoAdvanceRef.current = setTimeout(() => {
          setShowingFeedback(false);
          advanceToNext();
        }, AUTO_ADVANCE_MS);
      }
    } catch (err: unknown) {
      setSubmitError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  // ── Skip / advance manually on failure ──
  function handleSkip() {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    setShowingFeedback(false);
    advanceToNext();
  }

  // ── Fill-in answer update ──
  function handleFillChange(index: number, value: string) {
    setFillAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  // ── Retry only failed exercises ──
  function handleRetryFailed() {
    const failedIds = new Set(sessionResults.filter((r) => !r.passed).map((r) => r.exerciseId));
    const failedExercises = exercises.filter((ex) => failedIds.has(ex.id));
    if (failedExercises.length === 0) return;

    setExercises(failedExercises);
    setCurrentIndex(0);
    setSessionResults([]);
    setTotalPointsEarned(0);
    resetAnswerState(failedExercises[0] ?? null);
    sessionStartRef.current = Date.now();
    setPhase('active');
    startTimer();
  }

  // ── Derived values ──
  const ex = exercises[currentIndex] ?? null;
  const totalExercises = exercises.length;
  const progressPercent = totalExercises > 0 ? (currentIndex / totalExercises) * 100 : 0;
  const passed = lastResult?.attempt.passed ?? false;
  const totalSessionMs = Date.now() - sessionStartRef.current;
  const failedCount = sessionResults.filter((r) => !r.passed).length;
  const correctCount = sessionResults.filter((r) => r.passed).length;

  // ── Render: loading ──
  if (phase === 'loading' && !loadError) {
    return (
      <main className={styles.page}>
        <div className={styles.center}>
          <Spinner size="lg" />
          <p className={styles.loadingText}>Cargando tu cola de práctica...</p>
        </div>
      </main>
    );
  }

  // ── Render: load error ──
  if (loadError) {
    return (
      <main className={styles.page}>
        <div className={styles.center}>
          <p className={styles.errorText}>{loadError}</p>
          <Button onClick={() => window.location.reload()} variant="secondary" size="sm">
            Reintentar
          </Button>
        </div>
      </main>
    );
  }

  // ── Render: empty queue ──
  if (phase === 'empty') {
    return (
      <main className={styles.page}>
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon} aria-hidden="true">
            🎉
          </span>
          <h2 className={styles.emptyTitle}>¡Cola vacía!</h2>
          <p className={styles.emptyDesc}>
            No tienes ejercicios pendientes de repaso por ahora. Completa más ejercicios para que el
            sistema de repetición espaciada los añada automáticamente.
          </p>
          <Button onClick={() => navigate('/dashboard')} size="md">
            Ir al Dashboard
          </Button>
        </div>
      </main>
    );
  }

  // ── Render: summary ──
  if (phase === 'summary') {
    const totalSecs = Math.round(totalSessionMs / 1000);
    return (
      <main className={styles.page}>
        <div className={styles.summary}>
          <h2 className={styles.summaryTitle}>Sesión completada</h2>

          <div className={styles.summaryStats}>
            <div className={styles.summaryStat}>
              <span className={styles.summaryStatValue}>
                {correctCount}/{totalExercises}
              </span>
              <span className={styles.summaryStatLabel}>Correctos</span>
            </div>
            <div className={styles.summaryStat}>
              <span className={`${styles.summaryStatValue} ${styles.summaryPoints}`}>
                +{totalPointsEarned}
              </span>
              <span className={styles.summaryStatLabel}>Puntos ganados</span>
            </div>
            <div className={styles.summaryStat}>
              <span className={styles.summaryStatValue}>{formatSeconds(totalSecs)}</span>
              <span className={styles.summaryStatLabel}>Tiempo total</span>
            </div>
          </div>

          <div className={styles.summaryActions}>
            {failedCount > 0 && (
              <Button onClick={handleRetryFailed} variant="secondary" size="md">
                Repetir ejercicios fallidos ({failedCount})
              </Button>
            )}
            <Button onClick={() => navigate('/dashboard')} size="md">
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // ── Render: active drill ──
  if (!ex) return null;

  const quizOptions = parseQuizOptions(ex.starterCode);
  const fillSegments: FillSegment[] =
    ex.type === 'fill_blank' && ex.starterCode ? parseFillSegments(ex.starterCode) : [];

  const isObserve = ex.type === 'observe';
  const isFill = ex.type === 'fill_blank';
  const isQuiz = ex.type === 'quiz' || ex.type === ('theory' as string);
  const isCode = ex.type === 'build' || ex.type === 'debug' || ex.type === 'challenge';

  return (
    <main className={styles.page}>
      {/* ── Session progress header ── */}
      <header className={styles.drillHeader}>
        <div className={styles.drillMeta}>
          <span className={styles.drillCounter}>
            Ejercicio {currentIndex + 1} de {totalExercises}
          </span>
          <span className={styles.drillTimer} aria-live="off">
            {formatSeconds(elapsedSecs)}
          </span>
        </div>
        <ProgressBar
          value={progressPercent}
          showPercent={false}
          size="sm"
          label={`Progreso: ${currentIndex} de ${totalExercises} ejercicios`}
        />
      </header>

      {/* ── Exercise card ── */}
      <section className={styles.exerciseCard}>
        <div className={styles.metaRow}>
          <Badge variant={DIFFICULTY_VARIANT[ex.difficulty]}>
            {ex.difficulty === 'easy' ? 'Fácil' : ex.difficulty === 'medium' ? 'Medio' : 'Difícil'}
          </Badge>
          <Badge variant="info">{TYPE_LABEL[ex.type] ?? ex.type}</Badge>
          <span className={styles.points}>{ex.points} pts</span>
        </div>

        <p className={styles.prompt}>{ex.prompt}</p>

        {/* Quiz */}
        {isQuiz && (
          <QuizView
            options={quizOptions}
            selected={quizSelected}
            onSelect={setQuizSelected}
            disabled={showingFeedback || submitting}
          />
        )}

        {/* Observe */}
        {isObserve && (
          <textarea
            className={styles.codeTextarea}
            value={textCode}
            onChange={(e) => setTextCode(e.target.value)}
            disabled={showingFeedback || submitting}
            placeholder="Escribe tu respuesta aquí..."
            aria-label="Respuesta de observación"
            rows={5}
          />
        )}

        {/* Fill in blank */}
        {isFill && ex.starterCode && (
          <FillInView
            segments={fillSegments}
            answers={fillAnswers}
            onAnswerChange={handleFillChange}
            disabled={showingFeedback || submitting}
          />
        )}

        {/* Build / Debug / Challenge */}
        {isCode && (
          <TextareaView
            value={textCode}
            onChange={setTextCode}
            disabled={showingFeedback || submitting}
            starterCode={ex.type === 'debug' ? ex.starterCode : null}
          />
        )}
      </section>

      {/* ── Submit error ── */}
      {submitError && (
        <p className={styles.errorText} role="alert">
          {submitError}
        </p>
      )}

      {/* ── Feedback banner ── */}
      {showingFeedback && lastResult && (
        <div
          className={`${styles.feedbackBanner} ${passed ? styles.feedbackPass : styles.feedbackFail}`}
          role="status"
          aria-live="polite"
        >
          <p
            className={`${styles.feedbackTitle} ${passed ? styles.feedbackTitlePass : styles.feedbackTitleFail}`}
          >
            {passed ? '¡Correcto!' : 'Incorrecto'}
          </p>
          {passed && <p className={styles.feedbackPoints}>+{ex.points} pts</p>}
          {lastResult.attempt.result && !passed && (
            <p className={styles.feedbackMessage}>{lastResult.attempt.result}</p>
          )}
          {passed && <p className={styles.feedbackAutoAdvance}>Avanzando al siguiente...</p>}
          {!passed && (
            <Button variant="secondary" size="sm" onClick={handleSkip}>
              Siguiente de todos modos
            </Button>
          )}
        </div>
      )}

      {/* ── Actions ── */}
      {!showingFeedback && (
        <div className={styles.actionsBar}>
          <Button
            variant="primary"
            size="md"
            onClick={() => void handleSubmit()}
            disabled={!canSubmit(ex)}
          >
            {submitting ? 'Enviando...' : 'Enviar'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            disabled={submitting}
          >
            Salir del Drill
          </Button>
        </div>
      )}
    </main>
  );
}
