import { ReactNode } from 'react';
import Navbar from './Navbar';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className={styles.root}>
      <Navbar />
      <main className={`${styles.main} container`}>
        {children}
      </main>
    </div>
  );
}
