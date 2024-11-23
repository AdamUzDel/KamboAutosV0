"use client"

import React, { useState, useEffect } from 'react'
import { ModelLine, Year, Modification, ProductFormData, AddProductFormProps } from '@/lib/types'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function AddProductForm({ carMakers, categories, onSubmit }: AddProductFormProps) {
  const [modelLines, setModelLines] = useState<ModelLine[]>([])
  const [years, setYears] = useState<Year[]>([])
  const [modifications, setModifications] = useState<Modification[]>([])

  const [selectedCarMaker, setSelectedCarMaker] = useState<string>('')
  const [selectedModelLine, setSelectedModelLine] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [selectedModification, setSelectedModification] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [price, setPrice] = useState<number>(0)
  const [stockQuantity, setStockQuantity] = useState<number>(0)
  const [image, setImage] = useState<string>('')

  useEffect(() => {
    if (selectedCarMaker) {
      fetch(`/api/model-lines/?carMakerId=${selectedCarMaker}`)
        .then((res) => res.json())
        .then((data: ModelLine[]) => setModelLines(data))
        .catch(() => setModelLines([]))
    } else {
      setModelLines([])
    }
  }, [selectedCarMaker])

  useEffect(() => {
    if (selectedModelLine) {
      fetch(`/api/years?modelLineId=${selectedModelLine}`)
        .then((res) => res.json())
        .then((data: Year[]) => setYears(data))
        .catch(() => setYears([]))
    } else {
      setYears([])
    }
  }, [selectedModelLine])

  useEffect(() => {
    if (selectedYear) {
      fetch(`/api/modifications?yearId=${selectedYear}`)
        .then((res) => res.json())
        .then((data: Modification[]) => setModifications(data))
        .catch(() => setModifications([]))
    } else {
      setModifications([])
    }
  }, [selectedYear])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const productData: ProductFormData = {
      name,
      description,
      price,
      stockQuantity,
      image,
      categoryId: selectedCategory,
      modificationId: selectedModification,
    }

    onSubmit(productData)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carMaker">Car Maker</Label>
              <Select value={selectedCarMaker} onValueChange={setSelectedCarMaker}>
                <SelectTrigger id="carMaker">
                  <SelectValue placeholder="Select a Car Maker" />
                </SelectTrigger>
                <SelectContent>
                  {carMakers.map((maker) => (
                    <SelectItem key={maker.id} value={maker.id}>
                      {maker.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="modelLine">Model Line</Label>
              <Select value={selectedModelLine} onValueChange={setSelectedModelLine} disabled={!modelLines.length}>
                <SelectTrigger id="modelLine">
                  <SelectValue placeholder="Select a Model Line" />
                </SelectTrigger>
                <SelectContent>
                  {modelLines.map((line) => (
                    <SelectItem key={line.id} value={line.id}>
                      {line.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear} disabled={!years.length}>
                <SelectTrigger id="year">
                  <SelectValue placeholder="Select a Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year.id} value={year.id}>
                      {year.year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="modification">Modification</Label>
              <Select value={selectedModification} onValueChange={setSelectedModification} disabled={!modifications.length}>
                <SelectTrigger id="modification">
                  <SelectValue placeholder="Select a Modification" />
                </SelectTrigger>
                <SelectContent>
                  {modifications.map((mod) => (
                    <SelectItem key={mod.id} value={mod.id}>
                      {mod.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
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
                onChange={(e) => setPrice(parseFloat(e.target.value))}
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
                onChange={(e) => setStockQuantity(parseInt(e.target.value))}
                required
                min="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input id="image" value={image} onChange={(e) => setImage(e.target.value)} />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" onClick={handleSubmit}>Add Product</Button>
      </CardFooter>
    </Card>
  )
}