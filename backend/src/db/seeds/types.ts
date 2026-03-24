export interface SeedExercise {
  order: number;
  type: 'quiz' | 'observe' | 'fill_blank' | 'build' | 'debug' | 'challenge';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  prompt: string;
  starterCode: string | null;
  solution: string;
  validationLogic: string;
  hintsJson: string;
}

export interface SeedLesson {
  lesson: {
    title: string;
    order: number;
    type: 'theory' | 'demo' | 'exercise_set';
    contentMd: string;
  };
  exercises: SeedExercise[];
}

export interface SeedModule {
  module: {
    slug: string;
    title: string;
    description: string;
    level: number;
    order: number;
    unlockedByModuleId: string | null;
  };
  lessons: SeedLesson[];
}
