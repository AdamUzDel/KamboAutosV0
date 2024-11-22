// components/checkout/OrderSummary.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/components/ui/use-toast'

interface OrderSummaryProps {
  items: Array<{ id: string; name: string; price: number; quantity: number }>
  onPrev: () => void
}

export function OrderSummary({ items, onPrev }: OrderSummaryProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const { clearCart } = useCart()
  const { toast } = useToast()

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handlePlaceOrder = async () => {
    setIsProcessing(true)
    try {
      // Here you would typically send the order to your backend
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulating API call
      clearCart()
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase.",
      })
      router.push('/thank-you')
    } catch (error) {
      console.error('Error placing order:', error)
      toast({
        title: "Error",
        description: "There was a problem placing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Order Summary</h2>
      {items.map((item) => (
        <div key={item.id} className="flex justify-between">
          <span>{item.name} x {item.quantity}</span>
          <span>${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}
      <div className="border-t pt-4">
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>
          Back to Payment
        </Button>
        <Button onClick={handlePlaceOrder} disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Place Order'}
        </Button>
      </div>
    </div>
  )
}