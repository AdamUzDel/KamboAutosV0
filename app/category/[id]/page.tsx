'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
}

interface Category {
  id: string
  name: string
}

export default function CategoryPage() {
  const { id } = useParams()
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        const [categoryResponse, productsResponse] = await Promise.all([
          fetch(`/api/categories/${id}`),
          fetch(`/api/products?categoryId=${id}`)
        ])

        if (!categoryResponse.ok || !productsResponse.ok) {
          throw new Error('Failed to fetch data')
        }

        const [categoryData, productsData] = await Promise.all([
          categoryResponse.json(),
          productsResponse.json()
        ])

        setCategory(categoryData)
        setProducts(productsData)
      } catch (err) {
        setError('Error loading category and products. Please try again later.')
        console.error('Error fetching data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategoryAndProducts()
  }, [id])

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (error || !category) {
    return <div className="text-center py-8 text-red-500">{error || 'Category not found'}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{category.name}</h1>
      {products.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="text-lg truncate">{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="relative w-full h-48 mb-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="rounded-md object-contain"
                  />
                </div>
                <p className="text-lg font-semibold mb-2">${product.price.toFixed(2)}</p>
                <Link href={`/products/${product.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}