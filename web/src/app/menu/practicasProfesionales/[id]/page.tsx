'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react'; // Importar React's `use`
import styles from './page.module.css';
interface Practica {
  id: number;
  nombre_empresa: string;
  tipo_practica: string;
  nombre_contacto: string;
  cargo_contacto: string;
  correo_contacto: string;
  telefono_contacto: string;
  fechas_practica: string;
  modalidad: string;
  regimen_trabajo: string;
  labores: string;
  beneficios: string;
  requisitos_especiales: string;
}

export default function PracticaPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params); // Resolver el Promise
  const [practica, setPractica] = useState<Practica | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPractica = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/getPractica/${resolvedParams.id}`);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        setPractica(data.practica);
      } catch (err) {
        console.error('Error al obtener la práctica:', err);
        setError('No se pudo cargar la práctica. Inténtalo de nuevo más tarde.');
      }
    };

    fetchPractica();
  }, [resolvedParams.id]);

  // Si hay un error
  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  // Si no se encuentra la práctica
  if (!practica) {
    return <p className={styles.loading}>Cargando práctica...</p>;
  }

  return (
    <div className={styles.container}>
      <h1>{practica.nombre_empresa}</h1>
      <p><strong>Tipo de práctica:</strong> {practica.tipo_practica}</p>
      <p><strong>Contacto:</strong> {practica.nombre_contacto} ({practica.cargo_contacto})</p>
      <p><strong>Correo:</strong> {practica.correo_contacto}</p>
      <p><strong>Teléfono:</strong> {practica.telefono_contacto}</p>
      <p><strong>Fechas:</strong> {practica.fechas_practica}</p>
      <p><strong>Modalidad:</strong> {practica.modalidad}</p>
      <p><strong>Régimen de trabajo:</strong> {practica.regimen_trabajo}</p>
      <p><strong>Labores:</strong> {practica.labores}</p>
      <p><strong>Beneficios:</strong> {practica.beneficios}</p>
      <p><strong>Requisitos especiales:</strong> {practica.requisitos_especiales}</p>

      <button 
        onClick={() => {
          // Leer la página almacenada en localStorage
          const storedPage = localStorage.getItem('page');
          if (storedPage) {
            // Si hay una página almacenada, ir a esa página
            router.push(`/menu/practicasProfesionales?page=${storedPage}`);
          } else {
            // Si no hay página almacenada, ir a la primera página por defecto
            router.push('/menu/practicasProfesionales');
          }
        }}
      >
        Volver
      </button>
    </div>
  );
}
