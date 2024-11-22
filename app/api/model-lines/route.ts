// app/api/model-lines/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const carMakerId = searchParams.get('carMakerId');

  if (!carMakerId) {
    return NextResponse.json({ error: 'Missing carMakerId' }, { status: 400 });
  }

  try {
    const modelLines = await prisma.modelLine.findMany({
      where: { carMakerId },
    });
    return NextResponse.json(modelLines);
  } catch (error) {
    console.error('Error fetching model lines:', error);
    return NextResponse.json({ error: 'Error fetching model lines' }, { status: 500 });
  }
}
