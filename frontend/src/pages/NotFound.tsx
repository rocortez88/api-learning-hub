import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFound() {
  useEffect(() => {
    document.title = '404 — Página no encontrada | API Learning Hub';
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '1.5rem',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '5rem',
          fontWeight: 800,
          color: 'var(--color-primary)',
          lineHeight: 1,
        }}
        aria-hidden="true"
      >
        404
      </p>
      <h1
        style={{
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          fontWeight: 700,
          color: 'var(--color-text)',
          margin: 0,
        }}
      >
        Página no encontrada
      </h1>
      <p
        style={{
          fontSize: '1rem',
          color: 'var(--color-text-muted)',
          maxWidth: '400px',
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        La ruta que buscas no existe o ha sido movida.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/dashboard">
          <Button variant="primary" size="md">
            Ir al Dashboard
          </Button>
        </Link>
        <Link to="/">
          <Button variant="ghost" size="md">
            Ir al inicio
          </Button>
        </Link>
      </div>
    </div>
  );
}
