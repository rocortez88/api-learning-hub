import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiClient } from '../api/client';
import { useModulesStore } from '../store/modulesStore';
import type { Module, PracticeQueueItem, ApiResponse } from '../types';

interface UseModulesResult {
  modules: Module[];
  practiceQueue: PracticeQueueItem[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useModules(): UseModulesResult {
  const modulesList = useModulesStore((s) => s.modulesList);
  const practiceQueue = useModulesStore((s) => s.practiceQueue);

  const [loading, setLoading] = useState(() => {
    const s = useModulesStore.getState();
    return s.isModulesListStale() || s.isPracticeQueueStale();
  });
  const [error, setError] = useState<string | null>(null);
  const [fetchKey, setFetchKey] = useState(0);

  useEffect(() => {
    const s = useModulesStore.getState();
    const modulesStale = s.isModulesListStale();
    const queueStale = s.isPracticeQueueStale();

    if (!modulesStale && !queueStale) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    async function fetchData() {
      try {
        const [modulesRes, queueRes] = await Promise.all([
          modulesStale
            ? apiClient.get<ApiResponse<Module[]>>('/modules')
            : Promise.resolve(null),
          queueStale
            ? apiClient
                .get<ApiResponse<PracticeQueueItem[]>>('/practice/queue')
                .catch(() => ({ data: { data: [] as PracticeQueueItem[] } }))
            : Promise.resolve(null),
        ]);

        if (cancelled) return;

        const { setModulesList, setPracticeQueue } = useModulesStore.getState();
        if (modulesRes) setModulesList(modulesRes.data.data);
        if (queueRes) setPracticeQueue(queueRes.data.data);

        setLoading(false);
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
        setError(message);
        setLoading(false);
      }
    }

    void fetchData();
    return () => {
      cancelled = true;
    };
  }, [fetchKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    modules: modulesList ?? [],
    practiceQueue: practiceQueue ?? [],
    loading,
    error,
    refresh: () => {
      useModulesStore.getState().invalidate();
      setFetchKey((k) => k + 1);
    },
  };
}
