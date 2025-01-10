'use client';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    if (path === '/menu/practicas') {
      localStorage.setItem('currentPage', '1');
    }
    router.push(path);
  };

  return (
    <div className={styles.container}>
      {/* Logo */}
      <div className={styles.logoContainer}>
        <img src="/robleAustral.png" alt="Logo" className={styles.logo} />
      </div>

      {/* Opciones del menú */}
      <div className={styles.optionsContainer}>
        <div
          className={styles.option}
          onClick={() => handleNavigation('/menu/practicas')}
        >
          Ver Prácticas
        </div>
        <div
          className={styles.option}
          onClick={() => handleNavigation('/menu/practicasIniciales')}
        >
          Práct. Iniciales
        </div>
        <div
          className={styles.option}
          onClick={() => handleNavigation('/menu/practicasProfesionales')}
        >
          Práct. Prof.
        </div>
        <div
          className={styles.option}
          onClick={() => handleNavigation('/')}
        >
          Salir
        </div>
      </div>
    </div>
  );
}
