// app/api/model-lines/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
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

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, carMakerId } = await request.json();
    const newModelLine = await prisma.modelLine.create({
      data: { name, carMakerId },
    });
    return NextResponse.json(newModelLine, { status: 201 });
  } catch (error) {
    console.error('Error creating model line:', error);
    return NextResponse.json({ error: 'Error creating model line' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, name, carMakerId } = await request.json();
    const updatedModelLine = await prisma.modelLine.update({
      where: { id },
      data: { name, carMakerId },
    });
    return NextResponse.json(updatedModelLine);
  } catch (error) {
    console.error('Error updating model line:', error);
    return NextResponse.json({ error: 'Error updating model line' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const { id } = await request.json();
    await prisma.modelLine.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Model line deleted successfully' });
  } catch (error) {
    console.error('Error deleting model line:', error);
    return NextResponse.json({ error: 'Error deleting model line' }, { status: 500 });
  }
}