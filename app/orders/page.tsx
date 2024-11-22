// app/orders/page.tsx
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { OrderList } from '@/components/OrderList'

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Orders</h1>
        <p>Please sign in to view your orders.</p>
      </div>
    )
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          part: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      <OrderList orders={orders} />
    </div>
  )
}