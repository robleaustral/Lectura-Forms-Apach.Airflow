// src/app/api/getPracticaInicial/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';

export async function GET(request: Request) {
  try {
    // Obtener los parámetros de consulta (page) desde la URL
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10); // Página actual
    const pageSize = 10; // Tamaño de cada bloque de resultados

    // Calcular el "skip" para la paginación descendente
    const skip = (page - 1) * pageSize;

    // Obtener las prácticas de tipo 'Inicial' dentro del rango, ordenadas de forma descendente por ID
    const practicas = await prisma.forms.findMany({
      where: {
        tipo_practica: 'Inicial', // Filtrar por tipo_practica = 'Inicial'
      },
      skip, // Desplazarse 'skip' registros hacia atrás
      take: pageSize, // Tomar 10 resultados por página
      orderBy: {
        id: 'desc', // Orden descendente por ID
      },
    });

    // Si no hay más prácticas, devolver mensaje vacío
    if (practicas.length === 0) {
      return NextResponse.json({
        message: 'No se encontraron más prácticas iniciales',
        practicas: [],
      });
    }

    // Retornar las prácticas en la respuesta JSON
    return NextResponse.json({
      message: 'Prácticas iniciales obtenidas con éxito',
      practicas,
    });
  } catch (error: unknown) {
    // Manejo de errores
    if (error instanceof Error) {
      return NextResponse.json({
        message: 'Error al obtener las prácticas iniciales',
        error: error.message, // Mostrar el mensaje del error
      });
    } else {
      // Si el error no es una instancia de Error, manejarlo de forma genérica
      return NextResponse.json({
        message: 'Error desconocido',
        error: 'Un error desconocido ocurrió.',
      });
    }
  }
}
