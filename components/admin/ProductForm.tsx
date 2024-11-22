'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'

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
  //yearId: string
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
  //const [yearId, setYearId] = useState(product?.yearId || '')

  const [filteredModelLines, setFilteredModelLines] = useState<ModelLine[]>([])
  //const [filteredYears, setFilteredYears] = useState<Year[]>([])
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

  /* useEffect(() => {
    if (modelLineId) {
      const selectedModelLine = modelLines.find(ml => ml.id === modelLineId)
      setFilteredYears(selectedModelLine?.years || [])
    } else {
      setFilteredYears([])
    }
  }, [modelLineId, modelLines]) */

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block mb-1">Name</label>
        <Input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required={!product} />
      </div>
      <div>
        <label htmlFor="description" className="block mb-1">Description</label>
        <Textarea id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} required={!product} />
      </div>
      <div>
        <label htmlFor="price" className="block mb-1">Price</label>
        <Input type="number" id="price" name="price" value={price} onChange={(e) => setPrice(e.target.value)} required={!product} min="0" step="0.01" />
      </div>
      <div>
        <label htmlFor="stockQuantity" className="block mb-1">Stock Quantity</label>
        <Input type="number" id="stockQuantity" name="stockQuantity" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} required={!product} min="0" />
      </div>
      <div>
        <label className="block mb-1">Category</label>
        <Select name="categoryId" value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block mb-1">Car Maker</label>
        <Select name="carMakerId" value={carMakerId} onValueChange={setCarMakerId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a car maker" />
          </SelectTrigger>
          <SelectContent>
            {carMakers.map((carMaker) => (
              <SelectItem key={carMaker.id} value={carMaker.id}>{carMaker.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block mb-1">Model Line</label>
        <Select name="modelLineId" value={modelLineId} onValueChange={setModelLineId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a model line" />
          </SelectTrigger>
          <SelectContent>
            {filteredModelLines.map((modelLine) => (
              <SelectItem key={modelLine.id} value={modelLine.id}>{modelLine.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* <div>
        <label className="block mb-1">Year</label>
        <Select name="yearId" value={yearId} onValueChange={setYearId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a year" />
          </SelectTrigger>
          <SelectContent>
            {filteredYears.map((year) => (
              <SelectItem key={year.id} value={year.id}>{year.year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : (product ? 'Update' : 'Create')} Product
      </Button>
    </form>
  )
}

// previously working code
/* // components/admin/ProductForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'

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

interface ProductFormProps {
  product?: any
  categories: Category[]
  modelLines: ModelLine[]
  carMakers: CarMaker[]
}

export function ProductForm({ product, categories, modelLines, carMakers }: ProductFormProps) {
  const [name, setName] = useState(product?.name || '')
  const [description, setDescription] = useState(product?.description || '')
  const [price, setPrice] = useState(product?.price || '')
  const [stockQuantity, setStockQuantity] = useState(product?.stockQuantity || '')
  const [categoryId, setCategoryId] = useState(product?.categoryId || '')
  const [carMakerId, setCarMakerId] = useState(product?.modelLine?.carMakerId || '')
  const [modelLineId, setModelLineId] = useState(product?.modelLineId || '')
  const [yearId, setYearId] = useState(product?.yearId || '')

  const [filteredModelLines, setFilteredModelLines] = useState<ModelLine[]>([])
  const [filteredYears, setFilteredYears] = useState<Year[]>([])

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (carMakerId) {
      setFilteredModelLines(modelLines.filter(ml => ml.carMakerId === carMakerId))
    } else {
      setFilteredModelLines([])
    }
  }, [carMakerId, modelLines])

  useEffect(() => {
    if (modelLineId) {
      const selectedModelLine = modelLines.find(ml => ml.id === modelLineId)
      setFilteredYears(selectedModelLine?.years || [])
    } else {
      setFilteredYears([])
    }
  }, [modelLineId, modelLines])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = product ? `/api/products/${product.id}` : '/api/products'
      const method = product ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          price: parseFloat(price),
          stockQuantity: parseInt(stockQuantity),
          categoryId,
          modelLineId,
          yearId,
        }),
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
      toast({
        title: 'Error',
        description: `Failed to ${product ? 'update' : 'create'} product. ${error instanceof Error ? error.message : 'Please try again.'}`,
        variant: 'destructive',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block mb-1">Name</label>
        <Input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="description" className="block mb-1">Description</label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="price" className="block mb-1">Price</label>
        <Input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" step="0.01" />
      </div>
      <div>
        <label htmlFor="stockQuantity" className="block mb-1">Stock Quantity</label>
        <Input type="number" id="stockQuantity" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} required min="0" />
      </div>
      <div>
        <label className="block mb-1">Category</label>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block mb-1">Car Maker</label>
        <Select value={carMakerId} onValueChange={setCarMakerId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a car maker" />
          </SelectTrigger>
          <SelectContent>
            {carMakers.map((carMaker) => (
              <SelectItem key={carMaker.id} value={carMaker.id}>{carMaker.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block mb-1">Model Line</label>
        <Select value={modelLineId} onValueChange={setModelLineId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a model line" />
          </SelectTrigger>
          <SelectContent>
            {filteredModelLines.map((modelLine) => (
              <SelectItem key={modelLine.id} value={modelLine.id}>{modelLine.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block mb-1">Year</label>
        <Select value={yearId} onValueChange={setYearId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a year" />
          </SelectTrigger>
          <SelectContent>
            {filteredYears.map((year) => (
              <SelectItem key={year.id} value={year.id}>{year.year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">{product ? 'Update' : 'Create'} Product</Button>
    </form>
  )
} */