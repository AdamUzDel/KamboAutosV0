// components/ClientTestimonials.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Star } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'John Doe',
    rating: 5,
    comment: 'Great selection of parts and excellent customer service!',
  },
  {
    id: 2,
    name: 'Jane Smith',
    rating: 4,
    comment: 'Fast shipping and competitive prices. Will shop here again.',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    rating: 5,
    comment: 'Found exactly what I needed for my vintage car. Highly recommended!',
  },
]

export function ClientTestimonials() {
  return (
    <section className="my-12 bg-gray-50 py-8 px-4 rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">What Our Clients Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{testimonial.name}</span>
                <span className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">&ldquo;{testimonial.comment}&rdquo;</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}