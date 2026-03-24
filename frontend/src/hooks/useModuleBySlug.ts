import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiClient } from '../api/client';
import { useModulesStore } from '../store/modulesStore';
import type { ModuleWithLessons, ApiResponse } from '../types';

interface UseModuleBySlugResult {
  module: ModuleWithLessons | null;
  loading: boolean;
  error: string | null;
  notFound: boolean;
}

export function useModuleBySlug(slug: string | undefined): UseModuleBySlugResult {
  const entry = useModulesStore((s) => (slug ? s.modulesBySlug[slug] : undefined));

  const [loading, setLoading] = useState(() => {
    if (!slug) return false;
    return useModulesStore.getState().isModuleBySlugStale(slug);
  });
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const s = useModulesStore.getState();
    if (!s.isModuleBySlugStale(slug)) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setNotFound(false);

    async function fetchModule() {
      try {
        const res = await apiClient.get<ApiResponse<ModuleWithLessons>>(`/modules/${slug}`);
        if (cancelled) return;
        useModulesStore.getState().setModuleBySlug(slug!, res.data.data);
        setLoading(false);
      } catch (err: unknown) {
        if (cancelled) return;
        if (axios.isAxiosError(err)) {
          const status = err.response?.status;
          if (status === 404) {
            setNotFound(true);
            setLoading(false);
            return;
          }
          if (status !== undefined && status >= 500) {
            setError('Error del servidor. Por favor intenta más tarde.');
            setLoading(false);
            return;
          }
          if (err.response?.data?.error?.message) {
            const raw = String(err.response.data.error.message).slice(0, 200);
            setError(raw.replace(/[<>"'`]/g, '').trim() || 'Error al procesar la solicitud.');
            setLoading(false);
            return;
          }
        }
        setError('Error al cargar los datos. Por favor intenta más tarde.');
        setLoading(false);
      }
    }

    void fetchModule();
    return () => {
      cancelled = true;
    };
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    module: entry?.data ?? null,
    loading,
    error,
    notFound,
  };
}
