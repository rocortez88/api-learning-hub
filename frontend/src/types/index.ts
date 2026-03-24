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

export interface Exercise {
  id: string;
  lessonId: string;
  type: ExerciseType;
  prompt: string;
  starterCode: string | null;
  difficulty: Difficulty;
  points: number;
  hints: string[];  // Array de 3 pistas
  order: number;
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
