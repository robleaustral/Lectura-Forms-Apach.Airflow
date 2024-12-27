import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';

export async function GET(req: Request) {
  try {
    // Obtener todos los registros de la tabla 'Practica' con todas las columnas
    const practicas = await prisma.practica.findMany({
      select: {
        id: true,
        marca_timestamp: true,
        email: true,
        empresa: true,
        telefono: true,
        detalles_trabajo: true,
        ubicacion: true,
        modalidad: true,
        horas: true,
        fecha_ini: true,
        fecha_fin: true,
        estado: true,
        created_at: true,
        updated_at: true,
      },
    });

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
