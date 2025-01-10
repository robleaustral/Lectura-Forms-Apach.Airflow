'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useAnimation } from 'framer-motion';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    // Verificar si estamos en un dispositivo móvil
    const isMobile = window.innerWidth <= 768; 

    // Iniciar animación para el logo
    controls.start({
      opacity: 1,
      x: isMobile ? -100  : -220,  // Desplazar el logo más a la derecha en móviles
      y: isMobile ? -100 : -200,  // Mover el logo más arriba en móviles
      scale: isMobile ? 1.8 : 0.7,
      transition: { duration: 2.5 },
    });

    // Después de 2 segundos, mostrar contenido
    const timeout = setTimeout(() => {
      setShowContent(true);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [controls]);

  const handleStart = () => {
    router.push('/menu');
  };

  return (
    <div className={styles.container}>
      {/* Animación del logo */}
      <motion.div
        className={styles.intro}
        initial={{ opacity: 0, x: 0, scale: 3.0 }}
        animate={controls}
        transition={{ duration: 3 }}
      >
        <img
          src="/robleAustral.png" // Cambia esta ruta al logo en tu directorio
          alt="Logo"
          className={styles.logo}
        />
      </motion.div>

      {/* Contenido */}
      {showContent && (
        <motion.div
          className={`${styles.content}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 2 }}
        >
          <button
            onClick={handleStart}
            className={styles.button}
          >
            Iniciar
          </button>
        </motion.div>
      )}
    </div>
  );
}
