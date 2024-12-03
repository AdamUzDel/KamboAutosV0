// app/api/products/[id]/route.ts
import { NextRequest,NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const product = await prisma.part.findUnique({
      where: { id: params.id },
      include: { category: true, modifications: true, reviews: true }
    })
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching product', error }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const {id} = await params
    const formData = await request.formData()

    const updatedProduct = await prisma.part.update({
      where: { id },
      data: {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string),
        stockQuantity: parseInt(formData.get('stockQuantity') as string),
        image: formData.get('image') as string,
        category: { connect: { id: formData.get('categoryId') as string } },
        modelLine: { connect: { id: formData.get('modelLineId') as string } },
        //year: { connect: { id: formData.get('yearId') as string } },
        modifications: {
          set: [{ id: formData.get('modificationId') as string }],
        },
      },
      include: { category: true, modifications: true, modelLine: true},
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { message: 'Error updating product', error: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.part.delete({
      where: { id: params.id }
    })
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting product', error }, { status: 500 })
  }
}

/* export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = await params;
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { name, description, price, stockQuantity, categoryId, modificationIds } = await request.json()

  try {
    const product = await prisma.part.update({
      where: { id },
      data: {
        name,
        description,
        price,
        stockQuantity,
        categoryId,
        modifications: {
          set: modificationIds.map((id: string) => ({ id }))
        }
      },
      include: { category: true, modifications: true }
    })
    return NextResponse.json(product)
  } catch (error) {
    console.error("Error updating product:", error); // Log the error
    return NextResponse.json({ message: 'Error updating product', error }, { status: 500 })
  }
} */

/* export async function PUT( request: Request, { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { name, description, price, stockQuantity, categoryId, modelLineId } = await request.json()

    const product = await prisma.part.update({
      where: { id: params.id },
      data: {
        name,
        description,
        price: parseFloat(price.toString()),
        stockQuantity: parseInt(stockQuantity.toString()),
        category: {
          connect: { id: categoryId }
        },
        modelLine: {
          connect: { id: modelLineId }
        }
      },
      include: {
        category: true,
        modelLine: {
          include: {
            carMaker: true,
            years: true
          }
        },
        modifications: true
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { message: 'Error updating product', error: (error as Error).message },
      { status: 500 }
    )
  }
} */

// was working fine
/* 
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { name, description, price, stockQuantity, categoryId, modelLineId } = await request.json()

    const product = await prisma.part.update({
      where: { id: params.id },
      data: {
        name,
        description,
        price: parseFloat(price.toString()),
        stockQuantity: parseInt(stockQuantity.toString()),
        category: {
          connect: { id: categoryId }
        },
        modelLine: {
          connect: { id: modelLineId }
        }
      },
      include: {
        category: true,
        modelLine: {
          include: {
            carMaker: true,
            years: true
          }
        },
        modifications: true
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { message: 'Error updating product', error: (error as Error).message },
      { status: 500 }
    )
  }
} */