import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  showPercent?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function getColorClass(value: number): string {
  if (value >= 80) return styles.green ?? '';
  if (value >= 50) return styles.yellow ?? '';
  return styles.red ?? '';
}

export default function ProgressBar({
  value,
  label,
  showPercent = true,
  size = 'md',
  className = '',
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const colorClass = getColorClass(clamped);

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {(label || showPercent) && (
        <div className={styles.meta}>
          {label && <span className={styles.label}>{label}</span>}
          {showPercent && (
            <span className={styles.percent}>{Math.round(clamped)}%</span>
          )}
        </div>
      )}
      <div
        className={`${styles.track} ${styles[size]}`}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progreso'}
      >
        <div
          className={`${styles.fill} ${colorClass}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
