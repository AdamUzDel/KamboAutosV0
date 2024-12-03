'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, ChevronDown, ChevronUp } from 'lucide-react'

interface Category {
  id: string
  name: string
  image: string
  slug: string
}

export function CarPartCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }
        const data = await response.json()
        setCategories(data)
      } catch (err) {
        setError('Error loading categories. Please try again later.')
        console.error('Error fetching categories:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const displayedCategories = showAll ? categories : categories.slice(0, 10)
  const hasMoreCategories = categories.length > 10

  if (isLoading) {
    return <div className="text-center py-8">Loading categories...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>
  }

  return (
    <section className="my-8 px-4 md:px-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-semibold">Shop by Category</h2>
        <Link href="/categories" passHref>
          <Button variant="outline" className="flex items-center text-sm md:text-base">
            All Categories
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {displayedCategories.map((category) => (
          <Link 
            href={`/search?category=${encodeURIComponent(category.name)}`} 
            key={category.id}
            className="block"
          >
            <Card className="h-full hover:shadow-lg transition-shadow duration-200 overflow-hidden">
              <div className="relative w-full px-4 pt-[100%]">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                  className="object-cover"
                  priority
                />
              </div>
              <CardHeader className="p-2">
                <CardTitle className="text-sm text-center truncate">{category.name}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
      {hasMoreCategories && (
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="flex items-center mx-auto"
          >
            {showAll ? (
              <>
                Show Less <ChevronUp className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Show More <ChevronDown className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </section>
  )
}