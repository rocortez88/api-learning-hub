import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiClient } from '../api/client';
import type { Exercise, ApiResponse } from '../types';
import { Spinner, Button, Badge } from '../components/ui';
import { CodeEditor } from '../components/editor';
import { RequestViewer } from '../components/request-viewer';
import styles from './Exercise.module.css';

// ─── Types ─────────────────────────────────────────────────────────────────

interface AttemptResult {
  attemptId: string;
  passed: boolean;
  result: string;
  points: number;
  nextReviewAt: string;
  solution?: string;
  nextExerciseId?: string | null;
}

interface PageState {
  exercise: Exercise | null;
  loading: boolean;
  error: string | null;
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
  'fill-in': 'Completar código',
  build: 'Construir',
  debug: 'Debuggear',
  challenge: 'Reto',
};

/**
 * Parse the starterCode field for quiz/theory exercises.
 * Expected format: JSON array of strings, e.g. ["Opción A", "Opción B", ...]
 * Falls back to an empty array on parse errors.
 */
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

/**
 * Parse the starterCode field for observe exercises.
 * Expected format:
 *   { method, url, requestBody?, responseStatus?, responseBody?, question }
 * Falls back to null on errors.
 */
interface ObserveData {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  requestBody?: object;
  responseStatus?: number;
  responseBody?: object;
  question?: string;
}

function parseObserveData(starterCode: string | null): ObserveData | null {
  if (!starterCode) return null;
  try {
    const parsed: unknown = JSON.parse(starterCode);
    if (parsed !== null && typeof parsed === 'object' && 'method' in parsed && 'url' in parsed) {
      return parsed as ObserveData;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Split a fill-in code template into segments.
 * Each `___BLANK___` becomes a { blank: true, index } entry.
 * Text between blanks becomes { blank: false, text } entries.
 */
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

/**
 * Reconstruct the submitted code by substituting blanks back into the template.
 */
function buildFillCode(template: string, answers: string[]): string {
  const MARKER = '___BLANK___';
  const parts = template.split(MARKER);
  return parts.reduce((acc, part, i) => {
    const answer = i < answers.length ? (answers[i] ?? '') : '';
    return acc + part + (i < parts.length - 1 ? answer : '');
  }, '');
}

/**
 * Safe error message extraction — never exposes raw err.message for network errors.
 */
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

// -- Quiz / Theory --

interface QuizOption {
  key: string;
  text: string;
}

interface QuizViewProps {
  options: QuizOption[];
  selected: string | null; // selected key
  onSelect: (key: string) => void;
  disabled: boolean;
}

const LETTERS = 'ABCDEFGHIJ';

function QuizView({ options, selected, onSelect, disabled }: QuizViewProps) {
  return (
    <div className={styles.quizOptions} role="radiogroup">
      {options.map((opt, i) => (
        <button
          key={opt.key}
          type="button"
          role="radio"
          aria-checked={selected === opt.key}
          disabled={disabled}
          className={`${styles.quizOption} ${selected === opt.key ? styles.quizOptionSelected : ''}`}
          onClick={() => onSelect(opt.key)}
        >
          <span className={styles.optionLetter}>{LETTERS[i] ?? String(i + 1)}</span>
          {opt.text}
        </button>
      ))}
    </div>
  );
}

// -- Observe --

interface ObserveViewProps {
  data: ObserveData;
  answer: string;
  onAnswerChange: (v: string) => void;
  disabled: boolean;
}

function ObserveView({ data, answer, onAnswerChange, disabled }: ObserveViewProps) {
  return (
    <div className={styles.observeSection}>
      <RequestViewer
        method={data.method}
        url={data.url}
        requestBody={data.requestBody}
        responseStatus={data.responseStatus}
        responseBody={data.responseBody}
      />
      {data.question && <p className={styles.observeQuestion}>{data.question}</p>}
      <textarea
        className={styles.observeTextarea}
        value={answer}
        onChange={(e) => onAnswerChange(e.target.value)}
        disabled={disabled}
        placeholder="Escribe tu respuesta aquí..."
        aria-label="Respuesta a la observación"
      />
    </div>
  );
}

// -- Fill-in --

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

// -- Build / Debug --

interface CodeEditorViewProps {
  code: string;
  onCodeChange: (v: string) => void;
  disabled: boolean;
}

function CodeEditorView({ code, onCodeChange, disabled }: CodeEditorViewProps) {
  return (
    <div className={styles.editorWrapper}>
      <CodeEditor value={code} onChange={onCodeChange} readOnly={disabled} height="360px" />
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function ExercisePage() {
  const { exerciseId, lessonId } = useParams<{ exerciseId?: string; lessonId?: string }>();
  const navigate = useNavigate();

  // Page data
  const [state, setState] = useState<PageState>({
    exercise: null,
    loading: true,
    error: null,
  });

  // User answer state — one value per exercise type
  const [quizSelected, setQuizSelected] = useState<string | null>(null);
  const [observeAnswer, setObserveAnswer] = useState('');
  const [fillAnswers, setFillAnswers] = useState<string[]>([]);
  const [editorCode, setEditorCode] = useState('');

  // Hints state
  const [revealedHints, setRevealedHints] = useState(0);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<AttemptResult | null>(null);

  // Timer — track time spent on exercise
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    document.title = 'Ejercicio | API Learning Hub';
  }, []);

  // ── Load exercise ──
  useEffect(() => {
    if (!exerciseId && !lessonId) {
      setState((prev) => ({ ...prev, loading: false, error: 'Ejercicio no encontrado.' }));
      return;
    }

    let cancelled = false;
    startTimeRef.current = Date.now();

    // Reset answer state on navigation
    setQuizSelected(null);
    setObserveAnswer('');
    setFillAnswers([]);
    setEditorCode('');
    setRevealedHints(0);
    setResult(null);
    setSubmitError(null);

    async function fetchExercise() {
      try {
        let ex: Exercise;

        if (exerciseId) {
          const res = await apiClient.get<ApiResponse<Exercise>>(`/exercises/${exerciseId}`);
          ex = res.data.data;
        } else {
          // Viene de /modules/:slug/lessons/:lessonId — carga el primer ejercicio
          const res = await apiClient.get<ApiResponse<Exercise[]>>(
            `/exercises/lessons/${lessonId}`,
          );
          const list = res.data.data;
          if (!list.length) {
            setState({
              exercise: null,
              loading: false,
              error: 'Esta lección no tiene ejercicios aún.',
            });
            return;
          }
          ex = list[0] as Exercise;
        }

        if (cancelled) return;
        setState({ exercise: ex, loading: false, error: null });

        // Pre-populate editor with starterCode for build/debug types
        const type = ex.type;
        if ((type === 'build' || type === 'debug') && ex.starterCode) {
          setEditorCode(ex.starterCode);
        }

        // Pre-populate fill_blank answer slots
        if ((type === 'fill_blank' || type === ('fill-in' as string)) && ex.starterCode) {
          const blanksCount = (ex.starterCode.match(/___BLANK___/g) ?? []).length;
          setFillAnswers(Array(blanksCount).fill(''));
        }
      } catch (err: unknown) {
        if (cancelled) return;
        setState({ exercise: null, loading: false, error: extractErrorMessage(err) });
      }
    }

    void fetchExercise();
    return () => {
      cancelled = true;
    };
  }, [exerciseId, lessonId]);

  // ── Derive fill segments (memoised by exercise id, not React.useMemo to keep it simple) ──
  const fillSegments: FillSegment[] = (() => {
    if (!state.exercise) return [];
    const type = state.exercise.type;
    if ((type === 'fill_blank' || type === ('fill-in' as string)) && state.exercise.starterCode) {
      return parseFillSegments(state.exercise.starterCode);
    }
    return [];
  })();

  // ── Build submittedCode based on exercise type ──
  function buildSubmittedCode(): string {
    if (!state.exercise) return '';
    const type = state.exercise.type;

    if (type === 'quiz' || type === ('theory' as string)) {
      return quizSelected ?? '';
    }
    if (type === 'observe') {
      return observeAnswer;
    }
    if (type === 'fill_blank' || type === ('fill-in' as string)) {
      return buildFillCode(state.exercise.starterCode ?? '', fillAnswers);
    }
    // build, debug, challenge
    return editorCode;
  }

  function canSubmit(): boolean {
    if (submitting || result?.passed) return false;
    const type = state.exercise?.type;
    if (type === 'quiz' || type === ('theory' as string)) return quizSelected !== null;
    if (type === 'observe') return observeAnswer.trim().length > 0;
    if (type === 'fill_blank' || type === ('fill-in' as string)) {
      return fillAnswers.every((a) => a.trim().length > 0);
    }
    return editorCode.trim().length > 0;
  }

  // ── Submit attempt ──
  async function handleSubmit() {
    if (!state.exercise || !canSubmit()) return;

    const submittedCode = buildSubmittedCode();
    const timeSpentMs = Date.now() - startTimeRef.current;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await apiClient.post<ApiResponse<AttemptResult>>(
        `/exercises/${state.exercise.id}/attempt`,
        { submittedCode, timeSpentMs, hintUsedLevel: revealedHints },
      );
      setResult(res.data.data);
    } catch (err: unknown) {
      setSubmitError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  // ── Retry ──
  function handleRetry() {
    setResult(null);
    setSubmitError(null);
    startTimeRef.current = Date.now();
  }

  // ── Hint reveal ──
  function handleRevealHint() {
    if (!state.exercise) return;
    if (revealedHints < state.exercise.hints.length) {
      setRevealedHints((prev) => prev + 1);
    }
  }

  // ── Fill-in answer update ──
  function handleFillChange(index: number, value: string) {
    setFillAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  // ── Render: loading ──
  if (state.loading) {
    return (
      <main className={styles.page}>
        <div className={styles.center}>
          <Spinner size="lg" />
          <p className={styles.loadingText}>Cargando ejercicio...</p>
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

  const ex = state.exercise;
  if (!ex) return null;

  const isSubmitted = result !== null;
  const passed = result?.passed ?? false;
  const interactionDisabled = submitting || (isSubmitted && passed);

  // Derived values per exercise type
  // Quiz options come from validation.options (backend strips the answer key)
  const quizOptions: { key: string; text: string }[] =
    ex.validation?.options ??
    parseQuizOptions(ex.starterCode).map((text, i) => ({ key: String(i), text }));
  const observeData = parseObserveData(ex.starterCode);

  return (
    <main className={styles.page}>
      {/* ── Back nav ── */}
      <nav className={styles.nav}>
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          ← Volver
        </Button>
      </nav>

      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.metaRow}>
          <Badge variant={DIFFICULTY_VARIANT[ex.difficulty]}>
            {ex.difficulty === 'easy' ? 'Fácil' : ex.difficulty === 'medium' ? 'Medio' : 'Difícil'}
          </Badge>
          <Badge variant="info">{TYPE_LABEL[ex.type] ?? ex.type}</Badge>
          <span className={styles.points}>{ex.points} pts</span>
        </div>
        <p className={styles.prompt}>{ex.prompt}</p>
      </header>

      {/* ── Exercise body ── */}
      <div className={styles.exerciseBody}>
        {(ex.type === 'quiz' || ex.type === ('theory' as string)) && (
          <QuizView
            options={quizOptions}
            selected={quizSelected}
            onSelect={setQuizSelected}
            disabled={interactionDisabled}
          />
        )}

        {ex.type === 'observe' && (
          <>
            {observeData ? (
              <ObserveView
                data={observeData}
                answer={observeAnswer}
                onAnswerChange={setObserveAnswer}
                disabled={interactionDisabled}
              />
            ) : (
              // Fallback: starterCode is not parseable JSON — show raw and a textarea
              <div className={styles.observeSection}>
                {ex.starterCode && <pre className={styles.fillCode}>{ex.starterCode}</pre>}
                <p className={styles.observeQuestion}>Escribe tu análisis:</p>
                <textarea
                  className={styles.observeTextarea}
                  value={observeAnswer}
                  onChange={(e) => setObserveAnswer(e.target.value)}
                  disabled={interactionDisabled}
                  placeholder="Escribe tu respuesta aquí..."
                />
              </div>
            )}
          </>
        )}

        {(ex.type === 'fill_blank' || ex.type === ('fill-in' as string)) && ex.starterCode && (
          <FillInView
            segments={fillSegments}
            answers={fillAnswers}
            onAnswerChange={handleFillChange}
            disabled={interactionDisabled}
          />
        )}

        {(ex.type === 'build' || ex.type === 'debug' || ex.type === 'challenge') && (
          <CodeEditorView
            code={editorCode}
            onCodeChange={setEditorCode}
            disabled={interactionDisabled}
          />
        )}
      </div>

      {/* ── Hints ── */}
      <div className={styles.hintsSection}>
        {ex.hints.slice(0, revealedHints).map((hint, i) => (
          <div key={i} className={styles.hint}>
            <p className={styles.hintLabel}>Pista {i + 1}</p>
            <p>{hint}</p>
          </div>
        ))}
      </div>

      {/* ── Actions bar ── */}
      {!isSubmitted || !passed ? (
        <div className={styles.actionsBar}>
          {revealedHints < ex.hints.length && !isSubmitted && (
            <Button variant="secondary" size="sm" onClick={handleRevealHint} disabled={submitting}>
              Ver pista {revealedHints + 1}/{ex.hints.length}
            </Button>
          )}
          <Button
            variant="primary"
            size="md"
            onClick={() => void handleSubmit()}
            disabled={!canSubmit()}
          >
            {submitting ? 'Enviando...' : 'Enviar respuesta'}
          </Button>
        </div>
      ) : null}

      {/* ── Submit error ── */}
      {submitError && (
        <p className={styles.errorText} role="alert" style={{ marginTop: '12px' }}>
          {submitError}
        </p>
      )}

      {/* ── Result banner ── */}
      {isSubmitted && (
        <div
          className={`${styles.resultBanner} ${passed ? styles.resultBannerPass : styles.resultBannerFail}`}
          role="status"
          aria-live="polite"
        >
          <p
            className={`${styles.resultTitle} ${passed ? styles.resultTitlePass : styles.resultTitleFail}`}
          >
            {passed ? '¡Correcto!' : 'Incorrecto'}
          </p>
          {result?.result && <p className={styles.resultMessage}>{result.result}</p>}
          {passed && <p className={styles.resultPoints}>+{ex.points} puntos</p>}
          <div className={styles.resultActions}>
            {passed && result?.nextExerciseId && (
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  if (result.nextExerciseId) {
                    navigate(`/exercises/${result.nextExerciseId}`);
                  } else {
                    navigate(-1);
                  }
                }}
              >
                Siguiente ejercicio
              </Button>
            )}
            {passed && !result?.nextExerciseId && (
              <Button variant="primary" size="md" onClick={() => navigate(-1)}>
                Volver a la lección
              </Button>
            )}
            {!passed && (
              <Button variant="secondary" size="md" onClick={handleRetry}>
                Intentar de nuevo
              </Button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
