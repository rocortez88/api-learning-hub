import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore.ts';

// Pages (se implementan en Fase 4)
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Dashboard from './pages/Dashboard.tsx';
import ModulePage from './pages/Module.tsx';
import ExercisePage from './pages/Exercise.tsx';
import DrillPage from './pages/Drill.tsx';
import Profile from './pages/Profile.tsx';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Rutas publicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas protegidas */}
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/modules/:moduleSlug" element={<PrivateRoute><ModulePage /></PrivateRoute>} />
      <Route path="/exercises/:exerciseId" element={<PrivateRoute><ExercisePage /></PrivateRoute>} />
      <Route path="/drill/:lessonId" element={<PrivateRoute><DrillPage /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
