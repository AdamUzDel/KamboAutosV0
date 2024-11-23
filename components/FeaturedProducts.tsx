"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Part } from '@prisma/client';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface PartWithCategory extends Part {
  category: {
    name: string;
  };
}

export function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<PartWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        const response = await fetch('/api/featured-products');
        if (!response.ok) {
          throw new Error('Failed to fetch featured products');
        }
        const products = await response.json();
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setError('Error fetching featured products');
      } finally {
        setLoading(false);
      }
    }
    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return <p className="text-center py-8">Loading featured products...</p>;
  }

  if (error) {
    return <p className="text-center py-8 text-red-500">{error}</p>;
  }

  const displayedProducts = featuredProducts.slice(0, 6);
  const hasMoreProducts = featuredProducts.length > 6;

  return (
    <section className="my-8 px-4 md:px-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-semibold">Featured Products</h2>
        {hasMoreProducts && (
          <Link href="/products" passHref>
            <Button variant="outline" className="flex items-center text-sm md:text-base">
              More Products
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
      <div className="relative">
        <div className="flex overflow-x-auto pb-6 -mx-4 px-4 space-x-4 md:space-x-6 snap-x scrollbar-hide">
          {displayedProducts.map((product) => (
            <div key={product.id} className="flex-none w-64 md:w-72 snap-start">
              <Link href={`/products/${product.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-sm md:text-base truncate">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="relative w-full h-48 mb-4">
                      <Image
                        src={product.image || '/placeholder.svg'}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="rounded-md object-cover"
                        priority
                      />
                    </div>
                    <p className="text-lg md:text-xl font-bold">${product.price.toFixed(2)}</p>
                    <p className="text-xs md:text-sm text-gray-500">{product.category.name}</p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full text-sm md:text-base">Add to Cart</Button>
                  </CardFooter>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}