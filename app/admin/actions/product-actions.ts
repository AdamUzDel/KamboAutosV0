'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'

type ActionResponse = {
  message: { type: 'success' | 'error'; text: string };
  errors?: Record<string, string | null>;
}

export async function createProduct(formData: FormData): Promise<ActionResponse> {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const stockQuantity = parseInt(formData.get('stockQuantity') as string)
  const categoryId = formData.get('categoryId') as string
  const modelLineId = formData.get('modelLineId') as string
  const yearId = formData.get('yearId') as string

  if (!name || !description || isNaN(price) || isNaN(stockQuantity) || !categoryId || !modelLineId || !yearId) {
    return { 
      message: { type: 'error', text: 'Please fill all required fields correctly.' },
      errors: {
        name: !name ? 'Name is required' : null,
        description: !description ? 'Description is required' : null,
        price: isNaN(price) ? 'Price must be a valid number' : null,
        stockQuantity: isNaN(stockQuantity) ? 'Stock quantity must be a valid number' : null,
        categoryId: !categoryId ? 'Category is required' : null,
        modelLineId: !modelLineId ? 'Model line is required' : null,
        yearId: !yearId ? 'Year is required' : null,
      }
    }
  }

  try {
    await prisma.part.create({
      data: {
        name,
        description,
        price,
        stockQuantity,
        category: { connect: { id: categoryId } },
        modelLine: { connect: { id: modelLineId } },
        //year: { connect: { id: yearId } },
      },
    })

    revalidatePath('/admin/products')
    return { message: { type: 'success', text: 'Product created successfully.' } }
  } catch (error) {
    console.error('Error creating product:', error)
    return { message: { type: 'error', text: 'Failed to create product. Please try again.' } }
  }
}

export async function updateProduct(formData: FormData): Promise<ActionResponse> {
    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const stockQuantity = parseInt(formData.get('stockQuantity') as string)
    const categoryId = formData.get('categoryId') as string
    const modelLineId = formData.get('modelLineId') as string
    const yearId = formData.get('yearId') as string
  
    if (!id || !name || !description || isNaN(price) || isNaN(stockQuantity) || !categoryId || !modelLineId || !yearId) {
      return { 
        message: { type: 'error', text: 'Please fill all required fields correctly.' },
        errors: {
          name: !name ? 'Name is required' : null,
          description: !description ? 'Description is required' : null,
          price: isNaN(price) ? 'Price must be a valid number' : null,
          stockQuantity: isNaN(stockQuantity) ? 'Stock quantity must be a valid number' : null,
          categoryId: !categoryId ? 'Category is required' : null,
          modelLineId: !modelLineId ? 'Model line is required' : null,
          yearId: !yearId ? 'Year is required' : null,
        }
      }
    }
  
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          price,
          stockQuantity,
          categoryId,
          modelLineId,
          yearId,
        }),
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error response from API:', errorData)
        throw new Error(errorData.message || 'Failed to update product')
      }
  
      const updatedProduct = await response.json()
      console.log('Updated product:', updatedProduct)
  
      revalidatePath('/admin/products')
      return { message: { type: 'success', text: 'Product updated successfully.' } }
    } catch (error) {
      console.error('Error updating product:', error)
      return { 
        message: { 
          type: 'error', 
          text: error instanceof Error ? error.message : 'Failed to update product. Please try again.' 
        } 
      }
    }
  }