// components/FeaturedProducts.tsx
"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Part } from '@prisma/client';
import Link from 'next/link';

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
    return <p>Loading featured products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }


  return (
    <section className="my-12">
      <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredProducts.map((product) => (
        <Link key={product.id} href={`/products/${product.id}`} passHref>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Image
                  src={product.image || '/placeholder.svg'}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="rounded-md"
                  priority
                />
                <p className="mt-2 text-xl font-bold">${product.price.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{product.category.name}</p>
              </CardContent>
              <CardFooter>
                <Button className="block">Add to Cart</Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}