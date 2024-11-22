import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { status } = await request.json()

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: { status },
    })
    return NextResponse.json(updatedOrder)
  } catch (error) {
    return NextResponse.json({ message: 'Error updating order status', error }, { status: 500 })
  }
}