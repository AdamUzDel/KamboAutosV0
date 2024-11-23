'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface Category {
  id: string
  name: string
}

interface Year {
  id: string
  year: number
}

interface ModelLine {
  id: string
  name: string
  carMakerId: string
  years: Year[]
}

interface CarMaker {
  id: string
  name: string
  logo: string | null
  modelLines: ModelLine[]
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  stockQuantity: number
  categoryId: string
  modelLineId: string
  modelLine?: {
    carMakerId: string
  }
}

interface ProductFormProps {
  product?: Product
  categories: Category[]
  modelLines: ModelLine[]
  carMakers: CarMaker[]
}

export function ProductForm({ product, categories, modelLines, carMakers }: ProductFormProps) {
  const [name, setName] = useState(product?.name || '')
  const [description, setDescription] = useState(product?.description || '')
  const [price, setPrice] = useState(product?.price?.toString() || '')
  const [stockQuantity, setStockQuantity] = useState(product?.stockQuantity?.toString() || '')
  const [categoryId, setCategoryId] = useState(product?.categoryId || '')
  const [carMakerId, setCarMakerId] = useState(product?.modelLine?.carMakerId || '')
  const [modelLineId, setModelLineId] = useState(product?.modelLineId || '')

  const [filteredModelLines, setFilteredModelLines] = useState<ModelLine[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (carMakerId) {
      setFilteredModelLines(modelLines.filter(ml => ml.carMakerId === carMakerId))
    } else {
      setFilteredModelLines([])
    }
  }, [carMakerId, modelLines])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const updatedFields: Partial<Record<keyof Product, string | number>> = {}

    formData.forEach((value, key) => {
      if (key in (product || {})) {
        const productKey = key as keyof Product
        const stringValue = value.toString()
        if (product && stringValue !== product[productKey]?.toString()) {
          updatedFields[productKey] = stringValue
        } else if (!product) {
          updatedFields[productKey] = stringValue
        }
      }
    })

    if (product && Object.keys(updatedFields).length === 0) {
      toast({
        title: 'No changes',
        description: 'No fields were changed.',
      })
      setIsSubmitting(false)
      return
    }

    try {
      const url = product ? `/api/products/${product.id}` : '/api/products'
      const method = product ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Product ${product ? 'updated' : 'created'} successfully`,
        })
        router.push('/admin/products')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || `Failed to ${product ? 'update' : 'create'} product`)
      }
    } catch (error) {
      console.error('Error in form submission:', error)
      toast({
        title: 'Error',
        description: `Failed to ${product ? 'update' : 'create'} product. ${error instanceof Error ? error.message : 'Please try again.'}`,
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{product ? 'Edit Product' : 'Add New Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carMaker">Car Maker</Label>
              <Select name="carMakerId" value={carMakerId} onValueChange={setCarMakerId}>
                <SelectTrigger id="carMaker">
                  <SelectValue placeholder="Select a Car Maker" />
                </SelectTrigger>
                <SelectContent>
                  {carMakers.map((maker) => (
                    <SelectItem key={maker.id} value={maker.id}>{maker.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="modelLine">Model Line</Label>
              <Select name="modelLineId" value={modelLineId} onValueChange={setModelLineId}>
                <SelectTrigger id="modelLine">
                  <SelectValue placeholder="Select a Model Line" />
                </SelectTrigger>
                <SelectContent>
                  {filteredModelLines.map((line) => (
                    <SelectItem key={line.id} value={line.id}>{line.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select name="categoryId" value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required={!product} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required={!product}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required={!product}
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stockQuantity">Stock Quantity</Label>
              <Input
                id="stockQuantity"
                name="stockQuantity"
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                required={!product}
                min="0"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" onClick={() => handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : (product ? 'Update' : 'Create')} Product
        </Button>
      </CardFooter>
    </Card>
  )
}