'use client';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();

  // Especifica que 'path' es de tipo 'string'
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.option}
        onClick={() => handleNavigation('/menu/table')}
      >
        Ver Tabla
      </div>
      <div
        className={styles.option}
        onClick={() => handleNavigation('/manage')}
      >
        Gestionar Tabla
      </div>
      <div
        className={styles.option}
        onClick={() => handleNavigation('/')}
      >
        Salir
      </div>
    </div>
  );
}
