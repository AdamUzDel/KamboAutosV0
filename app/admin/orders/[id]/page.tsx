// app/admin/orders/[id]/page.tsx
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { OrderDetails } from '@/components/admin/OrderDetails'

export default async function AdminOrderPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      items: {
        include: {
          part: true,
        },
      },
    },
  })

  if (!order) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Order Details</h1>
      <OrderDetails order={order} />
    </div>
  )
}