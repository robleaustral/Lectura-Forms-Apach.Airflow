'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useAnimation } from 'framer-motion';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);
  const controls = useAnimation();
  const uachControls = useAnimation();

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;

    // Animación del logo central
    controls.start({
      opacity: 1,
      x: isMobile ? -100 : -220,
      y: isMobile ? -100 : -200,
      scale: isMobile ? 1.8 : 0.7,
      transition: { duration: 2.5 },
    });

    // Animación del logo de la UACh
    uachControls.start({
      opacity: 1,
      x: 0,
      transition: { delay: 1.5, duration: 1.5 },
    });

    const timeout = setTimeout(() => {
      setShowContent(true);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [controls, uachControls]);

  const handleStart = () => {
    router.push('/menu');
  };

  return (
    <div className={styles.container}>
      {/* Animación del logo central */}
      <motion.div
        className={styles.intro}
        initial={{ opacity: 0, x: 0, y: -100,scale: 3.0 }}
        animate={controls}
        transition={{ duration: 3 }}
      >
        <img
          src="/robleAustral.png"
          alt="Logo"
          className={styles.logo}
        />
      </motion.div>

      {/* Logo UACh con animación */}
      <motion.div
        className={styles.uachLogoContainer}
        initial={{ opacity: 0, x: 100 }}
        animate={uachControls}
      >
        <img
          src="/Uach.png"
          alt="Logo UACh"
          className={styles.uachLogo}
        />
      </motion.div>

      {/* Contenido */}
      {showContent && (
        <motion.div
          className={styles.content}
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
