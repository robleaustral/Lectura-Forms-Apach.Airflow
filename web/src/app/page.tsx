'use client';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/menu');
  };

  return (
    <div className={styles.container}>
      <button
        onClick={handleStart}
        className={styles.button}
      >
        Iniciar
      </button>
    </div>
  );
}
