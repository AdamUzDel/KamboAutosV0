import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { items, total, address, city, postalCode } = await request.json()

  try {
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total,
        address,
        city,
        postalCode,
        items: {
          create: items.map((item: any) => ({
            partId: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: true
      }
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: 'Error creating order', error }, { status: 500 })
  }
}