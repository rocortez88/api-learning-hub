import { useNavigate } from 'react-router-dom';
import type { Module } from '../../types';
import { Badge, Button } from '../ui';
import ProgressBar from './ProgressBar';
import styles from './ModuleCard.module.css';

type ModuleStatus = 'locked' | 'in_progress' | 'completed';

interface ModuleCardProps {
  module: Module & { progress?: number };
  className?: string;
}

function getStatus(module: Module & { progress?: number }): ModuleStatus {
  if (!module.isUnlocked) return 'locked';
  const progress = module.progress ?? 0;
  if (progress >= 100) return 'completed';
  return 'in_progress';
}

const LEVEL_LABEL: Record<number, string> = {
  1: 'Nivel 1',
  2: 'Nivel 2',
  3: 'Nivel 3',
  4: 'Nivel 4',
  5: 'Nivel 5',
};

const LEVEL_BADGE_VARIANT = {
  1: 'level1',
  2: 'level2',
  3: 'level3',
  4: 'level4',
  5: 'level5',
} as const;

const STATUS_LABEL: Record<ModuleStatus, string> = {
  locked: 'Bloqueado',
  in_progress: 'En progreso',
  completed: 'Completado',
};

const STATUS_BADGE_VARIANT: Record<ModuleStatus, 'danger' | 'warning' | 'success'> = {
  locked: 'danger',
  in_progress: 'warning',
  completed: 'success',
};

export default function ModuleCard({ module, className = '' }: ModuleCardProps) {
  const navigate = useNavigate();
  const status = getStatus(module);
  const progress = module.progress ?? 0;
  const isLocked = status === 'locked';

  function handleCta() {
    navigate(`/modules/${module.slug}`);
  }

  return (
    <article className={`${styles.card} ${isLocked ? styles.locked : ''} ${className}`}>
      <div className={styles.header}>
        <div className={styles.badges}>
          <Badge variant={LEVEL_BADGE_VARIANT[module.level]}>
            {LEVEL_LABEL[module.level]}
          </Badge>
          <Badge variant={STATUS_BADGE_VARIANT[status]}>
            {STATUS_LABEL[status]}
          </Badge>
        </div>
        {isLocked && (
          <span className={styles.lockIcon} aria-label="Módulo bloqueado">🔒</span>
        )}
      </div>

      <h3 className={styles.title}>{module.title}</h3>
      <p className={styles.description}>{module.description}</p>

      <div className={styles.progress}>
        <ProgressBar
          value={progress}
          label="Progreso"
          showPercent
          size="sm"
        />
      </div>

      <div className={styles.footer}>
        <Button
          variant={isLocked ? 'ghost' : status === 'completed' ? 'secondary' : 'primary'}
          size="sm"
          disabled={isLocked}
          onClick={isLocked ? undefined : handleCta}
        >
          {isLocked ? 'Bloqueado' : status === 'completed' ? 'Repasar' : 'Continuar'}
        </Button>
      </div>
    </article>
  );
}
