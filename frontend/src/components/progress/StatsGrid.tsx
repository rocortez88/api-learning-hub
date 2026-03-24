import type { UserStats } from '../../types';
import styles from './StatsGrid.module.css';

interface StatItemProps {
  icon: string;
  value: number;
  label: string;
}

function StatItem({ icon, value, label }: StatItemProps) {
  return (
    <div className={styles.statItem}>
      <span className={styles.icon} aria-hidden="true">{icon}</span>
      <span className={styles.value}>{value.toLocaleString('es-ES')}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
}

interface StatsGridProps {
  stats: UserStats;
  className?: string;
}

export default function StatsGrid({ stats, className = '' }: StatsGridProps) {
  return (
    <div className={`${styles.grid} ${className}`}>
      <StatItem
        icon="✅"
        value={stats.exercisesCompleted}
        label="Ejercicios completados"
      />
      <StatItem
        icon="⭐"
        value={stats.totalPoints}
        label="Puntos totales"
      />
      <StatItem
        icon="🔥"
        value={stats.streakDays}
        label="Días de racha"
      />
      <StatItem
        icon="📚"
        value={stats.modulesUnlocked}
        label="Módulos desbloqueados"
      />
    </div>
  );
}
