import prisma from '@/lib/prisma'

export async function getOrders() {
  return await prisma.order.findMany({
    include: {
      user: true,
      items: {
        include: {
          part: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function getOrderById(id: string) {
  return await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: {
        include: {
          part: true,
        },
      },
    },
  })
}