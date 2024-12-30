'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Importa useRouter para navegar
import styles from './page.module.css';

export default function Home() {
  const [practicas, setPracticas] = useState<any[]>([]);
  const router = useRouter(); // Inicializa el router

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/getTable');
        const data = await response.json();
        setPracticas(data.practicas);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleNavigation = () => {
    router.push('/menu'); // Redirige a la ruta '/menu' (ajusta según sea necesario)
  };

  return (
    <div className={styles.container}>
      {/* Botón para volver al menú */}
      <button className={styles.backButton} onClick={handleNavigation}>
        Volver al Menú
      </button>
      
      <h1>Prácticas</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del Contacto</th>
            <th>Nombre de la Empresa</th>
            <th>Cargo del Contacto</th>
            <th>Correo del Contacto</th>
            <th>Teléfono del Contacto</th>
            <th>Unidad de la Empresa</th>
            <th>Fechas Aproximadas</th>
            <th>Modalidad</th>
            <th>Sede de la Práctica</th>
            <th>Régimen de Trabajo</th>
            <th>Tema o Labores</th>
            <th>Beneficios Ofrecidos</th>
            <th>Requisitos Especiales</th>
          </tr>
        </thead>
        <tbody>
          {practicas.map((practica, index) => (
            <tr key={index}>
              <td>{practica.id}</td>
              <td>{practica.nombre_del_contacto}</td>
              <td>{practica.nombre_de_la_empresa}</td>
              <td>{practica.cargo_del_contacto}</td>
              <td>{practica.correo_electra3nico_del_contacto}</td>
              <td>{practica.tela_c_fono_del_contacto}</td>
              <td>{practica.unidad_de_la_empresa_en_donde_se_realizara__la_pra_ctica}</td>
              <td>{practica.fechas_aproximadas_de_realizacia3n_de_la_pra_ctica__no_olvide_i}</td>
              <td>{practica.modalidad}</td>
              <td>{practica.sede_de_la_pra_ctica__solo_si_requiere_presencialidad_}</td>
              <td>{practica.ra_c_gimen_de_trabajo}</td>
              <td>{practica.tema_tica_o_labores_o_desarrollar_durante_la_pra_ctica__en_lane}</td>
              <td>{practica.beneficios_ofrecidos__aporte_econa3mico___alimentacia3n__trasla}</td>
              <td>{practica.requisitos_especiales__estado_de_salud_compatible__contraindica}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
