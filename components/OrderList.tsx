// components/OrderList.tsx
import { Order, OrderItem } from '@prisma/client'
import { formatDate } from '@/lib/utils'

interface OrderListProps {
  orders: (Order & {
    items: (OrderItem & {
      part: {
        name: string
        price: number
      }
    })[]
  })[]
}

export function OrderList({ orders }: OrderListProps) {
  return (
    <div className="space-y-8">
      {orders.map((order) => (
        <div key={order.id} className="border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Order #{order.id}</h2>
            <span className="text-gray-500">{formatDate(order.createdAt)}</span>
          </div>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.part.name} x {item.quantity}</span>
                <span>${(item.part.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}