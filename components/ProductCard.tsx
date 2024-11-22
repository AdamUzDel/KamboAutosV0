// components/ProductCard.tsx
"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Part } from '@prisma/client'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'
import toast, { Toast } from 'react-hot-toast'
import { AddToCartButton } from './AddToCartButton'

interface ProductCardProps {
  product: Part & {
    category: {
      name: string
    }
  }
}

export function ProductCard({ product }: ProductCardProps) {
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

  const handleBuyNow = () => {
    handleAddToCart()
    router.push('/cart')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Image
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          width={300}
          height={200}
          className="rounded-md"
        />
        <p className="mt-2 text-xl font-bold">${product.price.toFixed(2)}</p>
        <p className="text-sm text-gray-500">{product.category.name}</p>
        <p className="mt-2">{product.description}</p>
      </CardContent>
      <CardFooter className="flex flex-col">
        <Link href={`/products/${product.id}`} className="w-full mb-2">
          <Button className="w-full" variant="outline">View Details</Button>
        </Link>
        <div className="flex space-x-2 justify-between w-full">
          <AddToCartButton product={product} />
          <Button className="w-full" onClick={handleBuyNow} variant="secondary">Buy Now</Button>
        </div>
      </CardFooter>
    </Card>
  )
}

/* // components/ProductCard.tsx
'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  price: number
  image: string
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const router = useRouter()

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    })
    toast.success(
      (t) => (
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

  const handleBuyNow = () => {
    handleAddToCart()
    router.push('/cart')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={200}
          className="rounded-md mb-4"
        />
        <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={`/product/${product.id}`}>
          <Button variant="outline">View Details</Button>
        </Link>
        <div className="space-x-2">
          <Button onClick={handleAddToCart}>Add to Cart</Button>
          <Button onClick={handleBuyNow} variant="secondary">Buy Now</Button>
        </div>
      </CardFooter>
    </Card>
  )
} */