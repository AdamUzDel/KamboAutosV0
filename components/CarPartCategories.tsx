import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

const categories = [
  { id: 1, name: 'Filters', image: '/categories/filters.svg', slug: 'engine-parts' },
  { id: 2, name: 'Brake System', image: '/categories/brakes.svg', slug: 'brake-system' },
  { id: 3, name: 'Steering', image: '/categories/steering.svg', slug: 'suspension-steering' },
  { id: 4, name: 'Service Parts', image: '/categories/service-parts.svg', slug: 'electrical-lighting' },
  { id: 5, name: 'Body & Exterior', image: '/categories/body.svg', slug: 'body-exterior' },
  { id: 6, name: 'Interior', image: '/categories/interior.svg', slug: 'interior' },
]

export function CarPartCategories() {
  const displayedCategories = categories.slice(0, 5)
  const hasMoreCategories = categories.length > 5

  return (
    <section className="my-8 px-4 md:px-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-semibold">Shop by Category</h2>
        {hasMoreCategories && (
          <Link href="/categories" passHref>
            <Button variant="outline" className="flex items-center text-sm md:text-base">
              More Categories
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
      <div className="relative">
        <div className="flex overflow-x-auto pb-6 -mx-4 px-4 space-x-4 md:space-x-6 snap-x scrollbar-hide">
          {displayedCategories.map((category) => (
            <div key={category.id} className="flex-none w-64 md:w-72 snap-start">
              <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="text-sm md:text-base truncate">{category.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="relative w-full h-40 mb-4">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="rounded-md object-contain"
                      priority
                    />
                  </div>
                  <Link href={`/category/${category.slug}`} className="w-full">
                    <Button variant="outline" className="w-full text-sm md:text-base">
                      Browse {category.name}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}