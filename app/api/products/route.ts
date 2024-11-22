// app/api/products/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const products = await prisma.part.findMany({
      include: { category: true, modifications: true, modelLine: true }
    })
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching products', error }, { status: 500 })
  }
}

// previously working code
/* export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { name, description, price, stockQuantity, categoryId, modificationIds, modelLineId } = await request.json()

  try {
    const product = await prisma.part.create({
      data: {
        name,
        description,
        price,
        stockQuantity,
        category: {
          connect: { id: categoryId }
        },
        modifications: {
          connect: modificationIds.map((id: string) => ({ id }))
        },
        modelLine: {
          connect: { id: modelLineId }
        }
      },
      include: { category: true, modifications: true, modelLine: true }
    })
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: 'Error creating product', error }, { status: 500 })
  }
} */

export async function POST(request: Request) {
  // Get the session to check for admin role
  const session = await getServerSession(authOptions);

  // Check if the user is authorized
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Parse the incoming JSON request body
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

  //console.log('Request Body:', { name, description, price, stockQuantity, categoryId, modificationIds, modelLineId });

  try {
    // Find CarMaker
    const carMaker = await prisma.carMaker.findFirst({
      where: { name: carMakerName },
    });
    if (!carMaker) {
      return NextResponse.json({ error: 'CarMaker not found' }, { status: 404 });
    }

    // Find ModelLine
    const modelLine = await prisma.modelLine.findFirst({
      where: { name: modelLineName},
    });
    if (!modelLine) {
      return NextResponse.json({ error: 'ModelLine not found for the specified CarMaker' }, { status: 404 });
    }

    // Find Year
    const yearRecord = await prisma.year.findFirst({
      where: { year },
    });
    if (!yearRecord) {
      return NextResponse.json({ error: 'Year not found for the specified model line' }, { status: 404 });
    }

    // Find Modification
    const modification = await prisma.modification.findFirst({
      where: { name: modificationName, yearId: yearRecord.id },
    });
    if (!modification) {
      return NextResponse.json({ error: 'Modification not found for the specified year' }, { status: 404 });
    }

    // Find Category
    const category = await prisma.category.findFirst({
      where: { name: categoryName },
    });
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Create the product (Part) and connect the relations
    const product = await prisma.part.create({
      data: {
        name,
        description,
        price,
        stockQuantity,
        image,
        categoryId: category.id,
        modelLineId: modelLine.id,
        modifications: {
          connect: [{ id: modification.id }],
        },
      },
      include: { category: true, modifications: true, modelLine: true },
    });

    // Return the created product with related information
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error creating product', error: error instanceof Error ? error.message : error  }, { status: 500 });
  }
}