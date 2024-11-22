// app/product/[id]/page.tsx
'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StarIcon } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useState, useEffect, use } from 'react';

interface ProductDetails {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  features?: string[];
  specifications?: string[];
  reviews: Array<{
    id: number;
    user: string;
    rating: number;
    comment: string;
  }>;
}

export default function ProductPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  //const router = useRouter();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart()


  useEffect(() => {
      const fetchProductDetails = async () => {
        if (!params.id) return; // Don't fetch if ID is not available
        try {
          const response = await fetch(`/api/products/${params.id}`);
          if (!response.ok) {
            throw new Error('Product not found');
          }
          const data = await response.json();
          setProduct(data);
        } catch (error) {
          // Type assertion to treat error as an instance of Error
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError('An unknown error occurred');
          }
        } finally {
          setLoading(false);
        }
      };
  
      fetchProductDetails();
    }, [params.id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!product) {
    return <div>Can&apos;t find product with ID: {params.id}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{product.name}</CardTitle>
          <CardDescription>Product ID: {product.id}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Image
              src={product.image}
              alt={product.name}
              width={500}
              height={500}
              className="rounded-lg"
            />
          </div>
          <div>
            <p className="text-3xl font-bold mb-4">${product.price.toFixed(2)}</p>
            <p className="mb-4">{product.description}</p>
            <Button size="lg" onClick={() => addToCart({...product, quantity: 1})}>Add to Cart</Button>
          </div>
        </CardContent>
        <CardFooter>
          <Tabs defaultValue="features" className="w-full">
            <TabsList>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="features">
              {product.features && product.features.length > 0 ? (
                <ul className="list-disc pl-5">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              ) : (
                <p>No features available.</p>
              )}
            </TabsContent>
            <TabsContent value="specifications">
              {product.specifications && product.specifications.length > 0 ? (
                <ul className="list-disc pl-5">
                  {product.specifications.map((spec, index) => (
                    <li key={index}>{spec}</li>
                  ))}
                </ul>
              ) : (
                <p>No specifications available.</p>
              )}
            </TabsContent>
            <TabsContent value="reviews">
              {product.reviews.map((review) => (
                <div key={review.id} className="mb-4 p-4 border rounded">
                  <div className="flex items-center mb-2">
                    <span className="font-bold mr-2">{review.user}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-5 w-5 ${
                            i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p>{review.comment}</p>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardFooter>
      </Card>
    </div>
  )
}