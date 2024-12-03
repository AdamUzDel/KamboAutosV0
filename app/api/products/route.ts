import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categoryId = searchParams.get('categoryId')

  try {
    const products = await prisma.part.findMany({
      where: categoryId ? { categoryId: categoryId } : {},
      include: { category: true, modifications: true, modelLine: true }
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const {
    name,
    description,
    price,
    stockQuantity,
    image,
    categoryName,
    modificationName,
    year,
    modelLineName,
    carMakerName,
  } = await request.json();

  try {
    const carMaker = await prisma.carMaker.findFirst({
      where: { name: carMakerName },
    });
    if (!carMaker) {
      return NextResponse.json({ error: 'CarMaker not found' }, { status: 404 });
    }

    const modelLine = await prisma.modelLine.findFirst({
      where: { name: modelLineName, carMakerId: carMaker.id },
    });
    if (!modelLine) {
      return NextResponse.json({ error: 'ModelLine not found for the specified CarMaker' }, { status: 404 });
    }

    const yearRecord = await prisma.year.findFirst({
      where: { year: Number(year), modelLineId: modelLine.id },
    });
    if (!yearRecord) {
      return NextResponse.json({ error: 'Year not found for the specified model line' }, { status: 404 });
    }

    const modification = await prisma.modification.findFirst({
      where: { name: modificationName, yearId: yearRecord.id },
    });
    if (!modification) {
      return NextResponse.json({ error: 'Modification not found for the specified year' }, { status: 404 });
    }

    const category = await prisma.category.findFirst({
      where: { name: categoryName },
    });
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const product = await prisma.part.create({
      data: {
        name,
        description,
        price: Number(price),
        stockQuantity: Number(stockQuantity),
        image,
        categoryId: category.id,
        modelLineId: modelLine.id,
        modifications: {
          connect: [{ id: modification.id }],
        },
      },
      include: { category: true, modifications: true, modelLine: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error creating product', error: error instanceof Error ? error.message : error  }, { status: 500 });
  }
}