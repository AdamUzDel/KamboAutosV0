// app/api/car-makers/route.ts
import { NextRequest, NextResponse } from 'next/server';
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

export async function POST(request: NextRequest) {
  try {
    const { name, logo } = await request.json();
    const newCarMaker = await prisma.carMaker.create({
      data: { name, logo },
    });
    return NextResponse.json(newCarMaker, { status: 201 });
  } catch (error) {
    console.error('Error creating car maker:', error);
    return NextResponse.json({ error: 'Error creating car maker' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, logo } = await request.json();
    const updatedCarMaker = await prisma.carMaker.update({
      where: { id },
      data: { name, logo },
    });
    return NextResponse.json(updatedCarMaker);
  } catch (error) {
    console.error('Error updating car maker:', error);
    return NextResponse.json({ error: 'Error updating car maker' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await prisma.carMaker.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Car maker deleted successfully' });
  } catch (error) {
    console.error('Error deleting car maker:', error);
    return NextResponse.json({ error: 'Error deleting car maker' }, { status: 500 });
  }
}
