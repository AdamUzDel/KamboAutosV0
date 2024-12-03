'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { PhotoUpload } from '@/components/PhotoUpload'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { CarMaker, ModelLine, Year, Modification, Category, Product, ProductFormData } from '@/lib/types'

interface ProductFormProps {
  product?: Product
  categories: Category[]
  carMakers: CarMaker[]
  onSubmit: (productData: ProductFormData) => void
}

export function ProductForm({ product, categories, carMakers, onSubmit }: ProductFormProps) {
  const [name, setName] = useState(product?.name || '')
  const [description, setDescription] = useState(product?.description || '')
  const [price, setPrice] = useState(product?.price?.toString() || '')
  const [stockQuantity, setStockQuantity] = useState(product?.stockQuantity?.toString() || '')
  const [categoryId, setCategoryId] = useState(product?.categoryId || '')
  const [carMakerId, setCarMakerId] = useState(product?.modelLine?.carMakerId || '')
  const [modelLineId, setModelLineId] = useState(product?.modelLineId || '')
  const [image, setImage] = useState<string>(product?.image || '')
  const [yearId, setYearId] = useState('')
  const [modificationId, setModificationId] = useState('')

  //const [filteredModelLines, setFilteredModelLines] = useState<ModelLine[]>([])
  const [years, setYears] = useState<Year[]>([])
  const [modifications, setModifications] = useState<Modification[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [modelLines, setModelLines] = useState<ModelLine[]>([])

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (carMakerId) {
      const selectedCarMaker = carMakers.find(cm => cm.id === carMakerId)
      setModelLines(selectedCarMaker?.modelLines || [])
    } else {
      setModelLines([])
    }
  }, [carMakerId, carMakers])

  useEffect(() => {
    if (modelLineId) {
      fetch(`/api/years?modelLineId=${modelLineId}`)
        .then((res) => res.json())
        .then((data: Year[]) => setYears(data))
        .catch(() => setYears([]))
    } else {
      setYears([])
    }
  }, [modelLineId])

  useEffect(() => {
    if (yearId) {
      fetch(`/api/modifications?yearId=${yearId}`)
        .then((res) => res.json())
        .then((data: Modification[]) => setModifications(data))
        .catch(() => setModifications([]))
    } else {
      setModifications([])
    }
  }, [yearId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const selectedCategory = categories.find(cat => cat.id === categoryId)
    const selectedModelLine = modelLines.find(ml => ml.id === modelLineId)
    const selectedCarMaker = carMakers.find(cm => cm.id === carMakerId)
    const selectedYear = years.find(y => y.id === yearId)
    const selectedModification = modifications.find(mod => mod.id === modificationId)

    const productData: ProductFormData = {
      name,
      description,
      price: parseFloat(price),
      stockQuantity: parseInt(stockQuantity),
      image,
      categoryName: selectedCategory?.name || '',
      modificationName: selectedModification?.name || '',
      year: selectedYear?.year || 0,
      modelLineName: selectedModelLine?.name || '',
      carMakerName: selectedCarMaker?.name || '',
    }

    try {
      await onSubmit(productData)
      toast({
        title: 'Success',
        description: `Product ${product ? 'updated' : 'created'} successfully`,
      })
      router.push('/admin/products')
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

  const handlePhotoUploaded = (url: string) => {
    setImage(url)
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
              <Select value={carMakerId} onValueChange={setCarMakerId}>
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
              <Select value={modelLineId} onValueChange={setModelLineId}>
                <SelectTrigger id="modelLine">
                  <SelectValue placeholder="Select a Model Line" />
                </SelectTrigger>
                <SelectContent>
                  {modelLines.map((line) => (
                    <SelectItem key={line.id} value={line.id}>{line.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Select value={yearId} onValueChange={setYearId}>
                <SelectTrigger id="year">
                  <SelectValue placeholder="Select a Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year.id} value={year.id}>{year.year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="modification">Modification</Label>
              <Select value={modificationId} onValueChange={setModificationId}>
                <SelectTrigger id="modification">
                  <SelectValue placeholder="Select a Modification" />
                </SelectTrigger>
                <SelectContent>
                  {modifications.map((mod) => (
                    <SelectItem key={mod.id} value={mod.id}>{mod.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
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
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stockQuantity">Stock Quantity</Label>
              <Input
                id="stockQuantity"
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                required
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Product Image</Label>
            <PhotoUpload onPhotoUploaded={handlePhotoUploaded} />
            {image && (
              <div className="mt-2">
                <Image 
                  src={image} 
                  alt="Product Image" 
                  width={100} 
                  height={100} 
                  className="rounded-md"
                />
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              product ? 'Update Product' : 'Create Product'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}