import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout, ProtectedRoute } from './components/layout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ModulePage from './pages/Module';
import ExercisePage from './pages/Exercise';
import DrillPage from './pages/Drill';
import Profile from './pages/Profile';

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
              <ModulePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/modules/:moduleSlug/lessons/:lessonId"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ExercisePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/exercises/:exerciseId"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ExercisePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/drill/:lessonId"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DrillPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
