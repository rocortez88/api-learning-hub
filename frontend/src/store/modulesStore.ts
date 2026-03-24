import { create } from 'zustand';
import type { Module, ModuleWithLessons, PracticeQueueItem } from '../types';

const MODULES_TTL = 5 * 60 * 1000; // 5 minutes
const QUEUE_TTL   = 2 * 60 * 1000; // 2 minutes

function isStale(cachedAt: number | null, ttl: number): boolean {
  return cachedAt === null || Date.now() - cachedAt > ttl;
}

interface ModulesStore {
  modulesList: Module[] | null;
  modulesListCachedAt: number | null;
  modulesBySlug: Record<string, { data: ModuleWithLessons; cachedAt: number }>;
  practiceQueue: PracticeQueueItem[] | null;
  practiceQueueCachedAt: number | null;

  setModulesList: (modules: Module[]) => void;
  setModuleBySlug: (slug: string, module: ModuleWithLessons) => void;
  setPracticeQueue: (queue: PracticeQueueItem[]) => void;
  invalidate: () => void;
  invalidateBySlug: (slug: string) => void;

  isModulesListStale: () => boolean;
  isModuleBySlugStale: (slug: string) => boolean;
  isPracticeQueueStale: () => boolean;
}

export const useModulesStore = create<ModulesStore>()((set, get) => ({
  modulesList: null,
  modulesListCachedAt: null,
  modulesBySlug: {},
  practiceQueue: null,
  practiceQueueCachedAt: null,

  setModulesList: (modules) =>
    set({ modulesList: modules, modulesListCachedAt: Date.now() }),

  setModuleBySlug: (slug, module) =>
    set((s) => ({
      modulesBySlug: {
        ...s.modulesBySlug,
        [slug]: { data: module, cachedAt: Date.now() },
      },
    })),

  setPracticeQueue: (queue) =>
    set({ practiceQueue: queue, practiceQueueCachedAt: Date.now() }),

  invalidate: () =>
    set({
      modulesList: null,
      modulesListCachedAt: null,
      modulesBySlug: {},
      practiceQueue: null,
      practiceQueueCachedAt: null,
    }),

  invalidateBySlug: (slug) =>
    set((s) => {
      const next = { ...s.modulesBySlug };
      delete next[slug];
      return { modulesBySlug: next };
    }),

  isModulesListStale: () => isStale(get().modulesListCachedAt, MODULES_TTL),
  isModuleBySlugStale: (slug) => {
    const entry = get().modulesBySlug[slug];
    return !entry || isStale(entry.cachedAt, MODULES_TTL);
  },
  isPracticeQueueStale: () => isStale(get().practiceQueueCachedAt, QUEUE_TTL),
}));
