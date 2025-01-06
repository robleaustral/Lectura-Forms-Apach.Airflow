'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Usamos useSearchParams para acceder a los parámetros de la URL
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'; // Importación de íconos de flechas
import styles from './page.module.css';

interface Practica {
  id: number;
  nombre_empresa: string;
  created_at: string;
}

export default function Home() {
  const [practicas, setPracticas] = useState<Practica[]>([]);  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true); // Control de si hay más páginas
  const router = useRouter();
  const searchParams = useSearchParams(); // Usamos useSearchParams para leer parámetros de la URL
  
  // Recuperamos el valor del parámetro "page" desde la URL o de localStorage
  const pageFromUrl = searchParams.get('page');
  const savedPage = localStorage.getItem('currentPage');
  
  const [page, setPage] = useState<number>(pageFromUrl ? Number(pageFromUrl) : savedPage ? Number(savedPage) : 1); // Página actual
  
  useEffect(() => {
    const fetchPracticas = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/getPracticaInicial?page=${page}`);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        setPracticas(data.practicas);

        // Si el número de prácticas devueltas es menor que 10, ya no hay más páginas
        if (data.practicas.length < 10) {
          setHasMore(false); // No hay más prácticas
        } else {
          setHasMore(true); // Asegurarse de que hay más páginas si se cargan 10 prácticas
        }
      } catch (err) {
        console.error('Error al obtener las prácticas:', err);
        setError('No se pudieron cargar las prácticas. Inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchPracticas();
  }, [page]); // Dependencia en la página

  const handleNavigation = (id: number) => {
    router.push(`/menu/practicasIniciales/${id}`);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1); // No permitir ir a una página anterior que no exista
      window.scrollTo(0, 0); // Mueve el scroll al inicio de la página
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      setPage(page + 1); // Avanzar a la siguiente página solo si hay más
      window.scrollTo(0, 0); // Mueve el scroll al inicio de la página
    }
  };

  const handleExit = () => {
    router.push('/menu'); // Redirige al menú
  };

  // Cambiar la URL de la página cuando se cambie la página actual
  useEffect(() => {
    // Guardar la página en localStorage cada vez que se cambie
    localStorage.setItem('page', String(page));
    router.replace(`/menu/practicasIniciales?page=${page}`);
  }, [page, router]);

  if (loading) {
    return <p className={styles.loading}>Cargando prácticas...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {practicas.map((practica) => (
          <div
            key={practica.id}
            className={styles.card}
            onClick={() => handleNavigation(practica.id)}
          >
            <h2>{practica.nombre_empresa}</h2>
            <p>Fecha: {new Date(practica.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
      
      {/* Mensaje de "No hay más páginas disponibles" */}
      {!hasMore && practicas.length === 0 && (
        <p className={styles.noMore}>No se encontraron prácticas.</p>
      )}

      {!hasMore && practicas.length < 10 && (
        <p className={styles.noMore}>No hay más páginas disponibles.</p>
      )}

      <div className={styles.pagination}>
        <button onClick={handlePrevPage} disabled={page === 1} className={styles.paginationButton}>
          <FiArrowLeft size={24} />
        </button>
        <button onClick={handleNextPage} disabled={!hasMore} className={styles.paginationButton}>
          <FiArrowRight size={24} />
        </button>
      </div>

      {/* Botón de "Salir" */}
      <button onClick={handleExit} className={styles.exitButton}>
        Salir
      </button>
    </div>
  );
}
