import { ButtonHTMLAttributes } from 'react';
import Spinner from './Spinner';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${styles[size]} ${className}`}
      disabled={isDisabled}
      aria-busy={loading}
      {...rest}
    >
      {loading && <Spinner size="sm" className={styles.spinner} />}
      <span className={loading ? styles.loadingText : undefined}>{children}</span>
    </button>
  );
}
