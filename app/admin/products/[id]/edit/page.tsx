'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ProductForm } from '@/components/admin/ProductForm'
import { Product, Category, CarMaker, ProductFormData } from '@/lib/types'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

export default function EditProduct() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [carMakers, setCarMakers] = useState<CarMaker[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoriesRes, carMakersRes] = await Promise.all([
          fetch(`/api/products/${id}`),
          fetch('/api/categories'),
          fetch('/api/car-makers')
        ])

        if (!productRes.ok || !categoriesRes.ok || !carMakersRes.ok) {
          throw new Error('Failed to fetch data')
        }

        const [productData, categoriesData, carMakersData] = await Promise.all([
          productRes.json(),
          categoriesRes.json(),
          carMakersRes.json()
        ])

        setProduct(productData)
        setCategories(categoriesData)
        setCarMakers(carMakersData)
      } catch (err) {
        setError('Error loading data. Please try again later.')
        console.error('Error fetching data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleSubmit = async (productData: ProductFormData) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        throw new Error('Failed to update product')
      }

      toast({
        title: "Success",
        description: "Product updated successfully",
      })
      router.push('/admin/products')
    } catch (error) {
      console.error('Error updating product:', error)
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) return <div className="text-center py-8">Loading...</div>
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>
  if (!product) return <div className="text-center py-8">Product not found</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Product: {product.name}</h1>
      <ProductForm
        product={product}
        categories={categories}
        carMakers={carMakers}
        onSubmit={handleSubmit}
      />
      <Toaster />
    </div>
  )
}