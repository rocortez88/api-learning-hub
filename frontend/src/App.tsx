import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppLayout, ProtectedRoute } from './components/layout';

// Pages — static imports (lightweight, always needed)
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// Pages — lazy loaded (heavier pages)
const ModulePage = lazy(() => import('./pages/Module'));
const ExercisePage = lazy(() => import('./pages/Exercise'));
const DrillPage = lazy(() => import('./pages/Drill'));
const Profile = lazy(() => import('./pages/Profile'));

function PageLoader() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        color: 'var(--color-text-muted)',
        fontSize: '0.9375rem',
      }}
    >
      Cargando...
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Rutas publicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas protegidas — envueltas en AppLayout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/modules/:moduleSlug"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Suspense fallback={<PageLoader />}>
                <ModulePage />
              </Suspense>
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/modules/:moduleSlug/lessons/:lessonId"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Suspense fallback={<PageLoader />}>
                <ExercisePage />
              </Suspense>
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/exercises/:exerciseId"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Suspense fallback={<PageLoader />}>
                <ExercisePage />
              </Suspense>
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/drill/:lessonId"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Suspense fallback={<PageLoader />}>
                <DrillPage />
              </Suspense>
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Suspense fallback={<PageLoader />}>
                <Profile />
              </Suspense>
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback — 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
