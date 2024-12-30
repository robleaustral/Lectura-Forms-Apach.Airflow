import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';

export async function GET(req: Request) {
  try {
    // Obtener todos los registros de la tabla 'Practica' con todas las columnas
    const practicas = await prisma.practicauach.findMany();

    // Retornar las prácticas en la respuesta JSON
    return NextResponse.json({
      message: 'Prácticas obtenidas con éxito',
      practicas, // Incluir todos los registros de prácticas con todas las columnas
    });
  } catch (error) {
    console.error('Error al obtener prácticas:', error);
    return NextResponse.json(
      { error: 'Error al obtener prácticas' },
      { status: 500 }
    );
  }
}
