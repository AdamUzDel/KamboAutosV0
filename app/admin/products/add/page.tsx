"use client"

import React, { useEffect, useState } from 'react';
import AddProductForm from '@/components/admin/AddProductForm';
import { CarMaker, Category, ProductFormData } from '@/lib/types';
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

const AddProduct: React.FC = () => {
  const [carMakers, setCarMakers] = useState<CarMaker[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast()

  useEffect(() => {
    // Fetch car makers and categories concurrently
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [carMakersRes, categoriesRes] = await Promise.all([
          fetch('/api/car-makers'),
          fetch('/api/categories'),
        ]);

        if (!carMakersRes.ok || !categoriesRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [carMakersData, categoriesData] = await Promise.all([
          carMakersRes.json(),
          categoriesRes.json(),
        ]);

        setCarMakers(carMakersData);
        setCategories(categoriesData);
      } catch (error) {
        setError('Error fetching data. Please try again.');
        console.log(error instanceof Error ? error.message : error)
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFormSubmit = async (productData: ProductFormData) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Error from API:', error);
        throw new Error('Failed to create product');
      }

      //const newProduct = await response.json();
      alert('Product created successfully!');
      toast({
        title: "Success",
        description: "Product created successfully!",
        variant: "default",
      })
    } catch (err) {
      alert('Error creating product. Please try again.');
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      })
      console.error(err);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <AddProductForm
        carMakers={carMakers}
        categories={categories}
        onSubmit={handleFormSubmit}
      />
      <Toaster />
    </div>
  );
};

export default AddProduct;