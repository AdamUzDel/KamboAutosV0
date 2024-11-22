import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

// Define an interface for the item structure
interface OrderItem {
  id: string
  quantity: number
  price: number
}

// Define an interface for the request body
interface OrderRequestBody {
  items: OrderItem[]
  total: number
  address: string
  city: string
  postalCode: string
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { items, total, address, city, postalCode }: OrderRequestBody = await request.json()

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total,
        address,
        city,
        postalCode,
        items: {
          create: items.map((item: OrderItem) => ({
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
    console.error('Error creating order:', error)
    return NextResponse.json({ message: 'Error creating order', error: (error as Error).message }, { status: 500 })
  }
}