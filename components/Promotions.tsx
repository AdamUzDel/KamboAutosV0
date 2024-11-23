import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const promotions = [
  {
    id: 1,
    title: 'Summer Sale',
    description: 'Get up to 30% off on all brake parts',
    code: 'SUMMER30',
  },
  {
    id: 2,
    title: 'New Customer Discount',
    description: '15% off your first order',
    code: 'NEWCUSTOMER15',
  },
  {
    id: 3,
    title: 'Free Shipping',
    description: 'On orders over $100',
    code: 'FREESHIP100',
  },
]

export function Promotions() {
  return (
    <section className="my-12 bg-secondary py-8 px-4 rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Current Promotions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {promotions.map((promo) => (
          <Card key={promo.id}>
            <CardHeader>
              <CardTitle className="text-primary">{promo.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{promo.description}</p>
              <p className="font-semibold mb-4">Use code: {promo.code}</p>
              <Button className="w-full">
                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}