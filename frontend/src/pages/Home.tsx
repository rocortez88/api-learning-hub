import { Link } from 'react-router-dom';
import { Badge, Button, Card } from '../components/ui';
import styles from './Home.module.css';

interface CurriculumModule {
  level: 1 | 2 | 3 | 4 | 5;
  title: string;
  description: string;
  exercises: number;
}

const CURRICULUM: CurriculumModule[] = [
  {
    level: 1,
    title: 'Fundamentos de APIs',
    description: '¿Qué es una API? HTTP, métodos, fetch básico y tu primera petición.',
    exercises: 25,
  },
  {
    level: 2,
    title: 'REST y CRUD',
    description: 'Endpoints, verbos HTTP, query params, body JSON y manejo de respuestas.',
    exercises: 40,
  },
  {
    level: 3,
    title: 'Autenticación',
    description: 'API Keys, JWT, refresh tokens y flujos OAuth 2.0 con ejemplos reales.',
    exercises: 35,
  },
  {
    level: 4,
    title: 'Conceptos Avanzados',
    description: 'Rate limiting, paginación, WebSockets y una introducción a GraphQL.',
    exercises: 45,
  },
  {
    level: 5,
    title: 'APIs en Producción',
    description: 'OpenAPI / Swagger, versionado, seguridad y buenas prácticas de despliegue.',
    exercises: 30,
  },
];

const FEATURES = [
  {
    icon: '🔁',
    title: 'Repetición espaciada',
    description: 'El algoritmo SM-2 te trae de vuelta los ejercicios justo antes de olvidarlos.',
  },
  {
    icon: '⚡',
    title: 'Modo Drill',
    description: 'Ráfagas de 10 ejercicios rápidos para dominar un concepto a fondo.',
  },
  {
    icon: '🐛',
    title: 'Aprende depurando',
    description: 'Código roto a propósito: identifica el error y corrígelo como en el trabajo real.',
  },
  {
    icon: '📊',
    title: 'Dashboard de progreso',
    description: 'Visualiza tu avance, racha diaria e historial completo de intentos.',
  },
];

export default function Home() {
  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={`${styles.hero} container`}>
        <Badge variant="info" className={styles.heroBadge}>
          175 ejercicios interactivos
        </Badge>
        <h1 className={styles.heroTitle}>
          Aprende APIs{' '}
          <span className={styles.heroAccent}>practicando de verdad</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Desde una petición <code>fetch</code> hasta autenticación JWT y WebSockets.
          Cada concepto reforzado con múltiples ejercicios progresivos.
        </p>
        <div className={styles.heroCtas}>
          <Link to="/register">
            <Button variant="primary" size="lg">
              Empezar gratis
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="ghost" size="lg">
              Ya tengo cuenta
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Features ── */}
      <section className={`${styles.features} container`} aria-labelledby="features-title">
        <h2 id="features-title" className={styles.sectionTitle}>
          Práctica insistente, aprendizaje real
        </h2>
        <div className={styles.featuresGrid}>
          {FEATURES.map((feat) => (
            <Card key={feat.title} className={styles.featureCard}>
              <div className={styles.featureIcon} aria-hidden="true">{feat.icon}</div>
              <h3 className={styles.featureTitle}>{feat.title}</h3>
              <p className={styles.featureDesc}>{feat.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Curriculum ── */}
      <section className={`${styles.curriculum} container`} aria-labelledby="curriculum-title">
        <h2 id="curriculum-title" className={styles.sectionTitle}>
          Curriculum completo
        </h2>
        <p className={styles.sectionSubtitle}>
          5 niveles progresivos · 175 ejercicios · Checkpoint del 80% para avanzar
        </p>
        <ul className={styles.moduleList} role="list">
          {CURRICULUM.map((mod) => (
            <li key={mod.level}>
              <Card className={styles.moduleCard}>
                <div className={styles.moduleHeader}>
                  <Badge variant={`level${mod.level}`}>Nivel {mod.level}</Badge>
                  <span className={styles.moduleExercises}>{mod.exercises} ejercicios</span>
                </div>
                <h3 className={styles.moduleTitle}>{mod.title}</h3>
                <p className={styles.moduleDesc}>{mod.description}</p>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      {/* ── CTA final ── */}
      <section className={`${styles.ctaSection} container`}>
        <div className={styles.ctaBox}>
          <h2 className={styles.ctaTitle}>Listo para empezar</h2>
          <p className={styles.ctaDesc}>
            Crea tu cuenta gratis y comienza con el Nivel 1 ahora mismo.
          </p>
          <Link to="/register">
            <Button variant="primary" size="lg">
              Crear cuenta gratis
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
