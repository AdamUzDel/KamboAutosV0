import { Suspense } from 'react'
import { OrderTable } from '@/components/admin/OrderTable'
import { Loader } from '@/components/ui/loader'
import { getOrders } from '@/lib/orders'

export default async function AdminOrders() {
  const orders = await getOrders()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      <Suspense fallback={<Loader />}>
        <OrderTable orders={orders} />
      </Suspense>
    </div>
  )
}