import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { apiClient } from '../../api/client';
import Button from '../ui/Button';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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

  function handleLinkClick() {
    setMenuOpen(false);
  }

  return (
    <header className={styles.header}>
      <nav className={`${styles.nav} container`}>
        <Link
          to="/dashboard"
          className={styles.logo}
          aria-label="API Hub — ir al Dashboard"
          onClick={handleLinkClick}
        >
          <span className={styles.logoIcon} aria-hidden="true">{'</>'}</span>
          <span className={styles.logoText}>API Hub</span>
        </Link>

        {/* Desktop links */}
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

        {/* Desktop actions */}
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

        {/* Hamburger button — mobile only */}
        <button
          type="button"
          className={styles.hamburger}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div id="mobile-menu" className={styles.mobileMenu}>
          <ul className={styles.mobileLinks} role="list">
            <li>
              <Link to="/dashboard" className={styles.mobileLink} onClick={handleLinkClick}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/profile" className={styles.mobileLink} onClick={handleLinkClick}>
                Perfil
              </Link>
            </li>
          </ul>
          <div className={styles.mobileActions}>
            {user && (
              <span className={styles.mobileUsername}>
                {user.username}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setMenuOpen(false);
                void handleLogout();
              }}
            >
              Cerrar sesión
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
