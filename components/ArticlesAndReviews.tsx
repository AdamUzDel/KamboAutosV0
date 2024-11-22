// components/ArticlesAndReviews.tsx
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

const articles = [
  {
    id: 1,
    title: '10 Essential Car Maintenance Tips',
    excerpt: 'Keep your car running smoothly with these simple maintenance tips.',
    image: '/placeholder.svg',
    slug: '10-essential-car-maintenance-tips',
  },
  {
    id: 2,
    title: 'How to Choose the Right Brake Pads',
    excerpt: 'Learn what factors to consider when selecting brake pads for your vehicle.',
    image: '/placeholder.svg',
    slug: 'how-to-choose-right-brake-pads',
  },
  {
    id: 3,
    title: 'The Benefits of Regular Oil Changes',
    excerpt: 'Discover why regular oil changes are crucial for your engine&quot;s health.',
    image: '/placeholder.svg',
    slug: 'benefits-of-regular-oil-changes',
  },
]

export function ArticlesAndReviews() {
  return (
    <section className="my-12">
      <h2 className="text-2xl font-semibold mb-6">Articles and Reviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Card key={article.id}>
            <CardHeader>
              <Image
                src={article.image}
                alt={article.title}
                width={300}
                height={200}
                className="rounded-md mb-4"
              />
              <CardTitle>{article.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{article.excerpt}</p>
            </CardContent>
            <CardFooter>
              <Link href={`/article/${article.slug}`}>
                <Button variant="outline">Read More</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}