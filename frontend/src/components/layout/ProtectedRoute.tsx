import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

/** Espera a que Zustand persist haya rehidratado el store desde localStorage. */
function useHydration(): boolean {
  const [hydrated, setHydrated] = useState(
    () => useAuthStore.persist.hasHydrated(),
  );

  useEffect(() => {
    if (hydrated) return;

    const unsub = useAuthStore.persist.onHydrate(() => {
      // onHydrate se dispara al inicio de la rehidratación; esperamos onFinishHydration
    });

    const unsubFinish = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    // Si el store ya estaba hidratado antes de suscribirnos (race condition), lo rechecamos
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
    }

    return () => {
      unsub();
      unsubFinish();
    };
  }, [hydrated]);

  return hydrated;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();
  const hydrated = useHydration();

  // Mientras Zustand no haya terminado de leer localStorage, no redirigimos
  if (!hydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
