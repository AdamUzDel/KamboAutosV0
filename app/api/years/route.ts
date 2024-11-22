// app/api/years/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const modelLineId = searchParams.get('modelLineId');

  if (!modelLineId) {
    return NextResponse.json({ error: 'Missing modelLineId' }, { status: 400 });
  }

  try {
    const years = await prisma.year.findMany({
      where: { modelLineId },
    });
    return NextResponse.json(years);
  } catch (error) {
    console.error('Error fetching years:', error);
    return NextResponse.json({ error: 'Error fetching years' }, { status: 500 });
  }
}
