import { ProductForm } from '@/components/admin/ProductForm'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Toaster } from "@/components/ui/toaster"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditProduct({ params }: PageProps) {
  // Await the params object before accessing id
  const { id } = await params

  console.log('Fetching product with ID:', id)

  try {
    const [product, categories, carMakers] = await Promise.all([
      prisma.part.findUnique({
        where: { id },
        include: {
          category: true,
          modelLine: {
            include: {
              carMaker: true,
              years: {
                include: {
                  modifications: true
                }
              },
            },
          },
          modifications: true,
        },
      }),
      prisma.category.findMany(),
      prisma.carMaker.findMany({
        include: {
          modelLines: {
            include: {
              years: {
                include: {
                  modifications: true
                }
              },
            },
          },
        },
      })
    ])

    if (!product) {
      console.log('Product not found')
      notFound()
    }

    console.log('Product fetched successfully:', product.id)

    return (
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Edit Product: {product.name}</h1>
        <ProductForm
          product={product}
          categories={categories}
          modelLines={carMakers.flatMap(cm => cm.modelLines)}
          carMakers={carMakers}
        />
        <Toaster />
      </div>
    )
  } catch (error) {
    console.error('Error fetching product data:', error)
    throw error // This will trigger the closest error boundary
  }
}