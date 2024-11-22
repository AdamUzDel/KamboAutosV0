'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/CartContext'
import { Part } from '@prisma/client'
import { useRouter } from 'next/navigation'
import toast, { Toast } from 'react-hot-toast'

interface AddToCartButtonProps {
  product: Part
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const router = useRouter()

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image ? product.image : "/placeholder.svg",
    })
    toast.success(
      (t: Toast) => (
        <div>
          <p>{product.name} added to cart</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast.dismiss(t.id)
              router.push('/cart')
            }}
          >
            View Cart
          </Button>
        </div>
      ),
      { duration: 3000 }
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        className="w-16 p-2 border rounded"
      />
      <Button onClick={handleAddToCart}>Add to Cart</Button>
    </div>
  )
}