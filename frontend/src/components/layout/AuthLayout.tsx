import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './AuthLayout.module.css';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo} aria-label="Volver al inicio">
            <span className={styles.logoIcon} aria-hidden="true">{'</>'}</span>
            <span className={styles.logoText}>API Hub</span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
