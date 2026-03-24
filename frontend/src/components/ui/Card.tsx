import { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export default function Card({ title, description, children, className = '' }: CardProps) {
  return (
    <div className={`${styles.card} ${className}`}>
      {(title || description) && (
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {description && <p className={styles.description}>{description}</p>}
        </div>
      )}
      {children && <div className={styles.body}>{children}</div>}
    </div>
  );
}
