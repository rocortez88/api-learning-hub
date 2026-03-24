import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { apiClient } from '../../api/client';
import Button from '../ui/Button';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Si falla la petición al servidor, el logout del cliente ocurre igualmente
    } finally {
      clearAuth();
      navigate('/login', { replace: true });
    }
  }

  return (
    <header className={styles.header}>
      <nav className={`${styles.nav} container`}>
        <Link to="/dashboard" className={styles.logo} aria-label="API Hub — ir al Dashboard">
          <span className={styles.logoIcon} aria-hidden="true">{'</>'}</span>
          <span className={styles.logoText}>API Hub</span>
        </Link>

        <ul className={styles.links} role="list">
          <li>
            <Link to="/dashboard" className={styles.link}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/profile" className={styles.link}>
              Perfil
            </Link>
          </li>
        </ul>

        <div className={styles.actions}>
          {user && (
            <span className={styles.username} aria-label={`Sesión iniciada como ${user.username}`}>
              {user.username}
            </span>
          )}
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      </nav>
    </header>
  );
}
