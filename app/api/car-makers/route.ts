// app/api/car-makers/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const carMakers = await prisma.carMaker.findMany();
    return NextResponse.json(carMakers);
  } catch (error) {
    console.error('Error fetching car makers:', error);
    return NextResponse.json({ error: 'Error fetching car makers' }, { status: 500 });
  }
}
