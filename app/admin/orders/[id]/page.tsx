import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { OrderDetails } from '@/components/admin/OrderDetails'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AdminOrderPage({ params }: PageProps) {
  // Await the params object to get the id
  const { id } = await params

  const order = await prisma.order.findUnique({
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