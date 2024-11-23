import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
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

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, yearId } = await request.json();
    const newModification = await prisma.modification.create({
      data: { name, yearId },
    });
    return NextResponse.json(newModification, { status: 201 });
  } catch (error) {
    console.error('Error creating modification:', error);
    return NextResponse.json({ error: 'Error creating modification' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, name, yearId } = await request.json();
    const updatedModification = await prisma.modification.update({
      where: { id },
      data: { name, yearId },
    });
    return NextResponse.json(updatedModification);
  } catch (error) {
    console.error('Error updating modification:', error);
    return NextResponse.json({ error: 'Error updating modification' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { id } = await request.json();
    await prisma.modification.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Modification deleted successfully' });
  } catch (error) {
    console.error('Error deleting modification:', error);
    return NextResponse.json({ error: 'Error deleting modification' }, { status: 500 });
  }
}