// ─── Entidades principales ────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  username: string;
  role: 'student' | 'admin';
  createdAt: string;
}

export interface Module {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: 1 | 2 | 3 | 4 | 5;
  order: number;
  unlockedByModuleId: string | null;
  isUnlocked?: boolean;
  progress?: number; // 0-100
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  contentMd: string;
  order: number;
  type: 'theory' | 'demo' | 'exercise_set';
}

export type ExerciseType = 'quiz' | 'observe' | 'fill_blank' | 'build' | 'debug' | 'challenge';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface ExerciseValidation {
  type: string;
  options?: { key: string; text: string }[];
  minLength?: number;
}

export interface Exercise {
  id: string;
  lessonId: string;
  type: ExerciseType;
  prompt: string;
  starterCode: string | null;
  difficulty: Difficulty;
  points: number;
  hints: string[];
  order: number;
  validation?: ExerciseValidation;
}

export interface Attempt {
  id: string;
  exerciseId: string;
  submittedCode: string;
  result: string | null;
  passed: boolean;
  timeSpentMs: number | null;
  hintUsedLevel: number;
  createdAt: string;
}

// ─── Respuestas de la API ─────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export interface UserStats {
  exercisesCompleted: number;
  totalPoints: number;
  streakDays: number;
  modulesUnlocked: number;
  practiceQueueSize: number;
}

// ─── Practice queue ───────────────────────────────────────────────────────────
// Refleja la estructura real del backend: /practice/queue devuelve
// { data: PracticeQueueItem[], total: number }

export interface PracticeQueueItem {
  srId: string;
  nextReviewAt: string;
  intervalDays: number;
  repetitions: number;
  exercise: {
    id: string;
    lessonId: string;
    type: ExerciseType;
    prompt: string;
    starterCode: string | null;
    difficulty: Difficulty;
    points: number;
    hints: string[];
    order: number;
  };
}

// ─── Module with lessons ───────────────────────────────────────────────────────

export interface ModuleWithLessons extends Module {
  lessons: LessonWithStats[];
}

export interface LessonWithStats extends Lesson {
  exerciseCount: number;
  totalPoints: number;
  completedExercises?: number;
}
