import Practica from '@/app/components/practica';

export default function PracticaPage({ params }: { params: { id: string } }) {
  const fetchUrl = 'http://localhost:3000/api/getPractica'; // URL base del fetch
  const returnBaseUrl = '/menu/practicasProfesionales'; // URL base para el retorno

  return <Practica id={params.id} fetchUrl={fetchUrl} returnBaseUrl={returnBaseUrl} />;
}
