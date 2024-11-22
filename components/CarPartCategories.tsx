// components/CarPartCategories.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

const categories = [
  { id: 1, name: 'Filters', image: '/categories/filters.svg', slug: 'engine-parts' },
  { id: 2, name: 'Brake System', image: '/categories/brakes.svg', slug: 'brake-system' },
  { id: 3, name: 'Steering', image: '/categories/steering.svg', slug: 'suspension-steering' },
  { id: 4, name: 'Service Parts', image: '/categories/service-parts.svg', slug: 'electrical-lighting' },
  { id: 5, name: 'Body & Exterior', image: '/categories/body.svg', slug: 'body-exterior' },
  { id: 6, name: 'Interior', image: '/categories/interior.svg', slug: 'interior' },
]

export function CarPartCategories() {
  return (
    <section className="my-12">
      <h2 className="text-2xl font-semibold mb-6">Car Part Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src={category.image}
                alt={category.name}
                width={300}
                height={200}
                className="rounded-md mb-4"
                priority
              />
              <Link href={`/category/${category.slug}`}>
                <Button variant="outline" className="w-full">
                  Browse {category.name}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}