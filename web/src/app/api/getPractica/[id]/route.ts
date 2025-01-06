// src/app/api/getPractica/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/libs/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    // Esperar a que los parámetros sean resueltos antes de usarlos
    const { id } = await params;  // Usamos await para resolver los parámetros

    // Convertir `id` a número para la consulta
    const practicaId = parseInt(id, 10);

    if (isNaN(practicaId)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    // Buscar la práctica con el ID especificado
    const practica = await prisma.forms.findUnique({
      where: { id: practicaId },
    });

    if (!practica) {
      return NextResponse.json(
        { error: 'Práctica no encontrada' },
        { status: 404 }
      );
    }

    // Retornar la práctica encontrada
    return NextResponse.json({
      message: 'Práctica obtenida con éxito',
      practica,
    });
  } catch (error) {
    console.error('Error al obtener la práctica:', error);
    return NextResponse.json(
      { error: 'Error al obtener la práctica' },
      { status: 500 }
    );
  }
}
