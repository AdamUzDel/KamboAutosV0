// app/api/modifications/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const yearId = searchParams.get('yearId');

  if (!yearId) {
    return NextResponse.json({ error: 'Missing yearId' }, { status: 400 });
  }

  try {
    const modifications = await prisma.modification.findMany({
      where: { yearId },
    });
    return NextResponse.json(modifications);
  } catch (error) {
    console.error('Error fetching modifications:', error);
    return NextResponse.json({ error: 'Error fetching modifications' }, { status: 500 });
  }
}
