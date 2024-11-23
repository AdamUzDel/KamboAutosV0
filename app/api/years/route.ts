// app/api/years/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
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

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { year, modelLineId } = await request.json();
    const newYear = await prisma.year.create({
      data: { year: parseInt(year), modelLineId },
    });
    return NextResponse.json(newYear, { status: 201 });
  } catch (error) {
    console.error('Error creating year:', error);
    return NextResponse.json({ error: 'Error creating year' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, year, modelLineId } = await request.json();
    const updatedYear = await prisma.year.update({
      where: { id },
      data: { year: parseInt(year), modelLineId },
    });
    return NextResponse.json(updatedYear);
  } catch (error) {
    console.error('Error updating year:', error);
    return NextResponse.json({ error: 'Error updating year' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { id } = await request.json();
    await prisma.year.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Year deleted successfully' });
  } catch (error) {
    console.error('Error deleting year:', error);
    return NextResponse.json({ error: 'Error deleting year' }, { status: 500 });
  }
}