'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Part, Category, ModelLine, CarMaker } from '@prisma/client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

type ProductWithRelations = Part & {
  category: Category
  modelLine: ModelLine & {
    carMaker: CarMaker
  }
}

interface ProductTableProps {
  products: ProductWithRelations[]
}

export function ProductTable({ products: initialProducts }: ProductTableProps) {
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState('')
  const { toast } = useToast()

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          setProducts(products.filter(product => product.id !== id))
          toast({
            title: 'Product deleted',
            description: 'The product has been successfully deleted.',
          })
        } else {
          throw new Error('Failed to delete product')
        }
      } catch (error) {
        console.error('Error deleting product:', error)
        toast({
          title: 'Error',
          description: 'Failed to delete product. Please try again.',
          variant: 'destructive',
        })
      }
    }
  }

  return (
    <div>
      <Input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.category.name}</TableCell>
              <TableCell>{`${product.modelLine.carMaker.name} ${product.modelLine.name}`}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.stockQuantity}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Link href={`/admin/products/${product.id}/edit`} passHref>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}