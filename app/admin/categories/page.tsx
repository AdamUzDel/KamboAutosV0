'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Pencil, Trash2, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Category } from '@/lib/types'
import { PhotoUpload } from '@/components/PhotoUpload'
import Image from 'next/image'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id'>>({ name: '', image: '' })
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated" || (session && session.user.role !== 'ADMIN')) {
      router.push('/login')
    } else {
      fetchCategories()
    }
  }, [status, session, router])

  useEffect(() => {
    if (editingCategory && nameInputRef.current) {
      nameInputRef.current.focus()
    }
  }, [editingCategory])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data: Category[] = await response.json()
        setCategories(data)
      } else {
        throw new Error('Failed to fetch categories')
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to fetch categories',
        variant: 'destructive',
      })
    }
  }

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      })
      if (response.ok) {
        toast({ title: 'Success', description: 'Category created successfully' })
        setNewCategory({ name: '', image: '' })
        fetchCategories()
      } else if (response.status === 401) {
        toast({ title: 'Error', description: 'Unauthorized access', variant: 'destructive' })
      } else {
        throw new Error('Failed to create category')
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to create category',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategory) return
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCategory),
      })
      if (response.ok) {
        toast({ title: 'Success', description: 'Category updated successfully' })
        setEditingCategory(null)
        fetchCategories()
      } else if (response.status === 401) {
        toast({ title: 'Error', description: 'Unauthorized access', variant: 'destructive' })
      } else {
        throw new Error('Failed to update category')
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update category',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      const response = await fetch('/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (response.ok) {
        toast({ title: 'Success', description: 'Category deleted successfully' })
        fetchCategories()
      } else if (response.status === 401) {
        toast({ title: 'Error', description: 'Unauthorized access', variant: 'destructive' })
      } else {
        throw new Error('Failed to delete category')
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete category',
        variant: 'destructive',
      })
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handlePhotoUploaded = (url: string) => {
    if (editingCategory) {
      setEditingCategory({ ...editingCategory, image: url })
    } else {
      setNewCategory({ ...newCategory, image: url })
    }
  }

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (status === "unauthenticated" || (session && session.user.role !== 'ADMIN')) {
    return null
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-5">Manage Categories</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingCategory ? 'Edit Category' : 'Create New Category'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory} className="space-y-4">
            <Input
              ref={nameInputRef}
              placeholder="Category Name"
              value={editingCategory ? editingCategory.name : newCategory.name}
              onChange={(e) => editingCategory 
                ? setEditingCategory({...editingCategory, name: e.target.value})
                : setNewCategory({...newCategory, name: e.target.value})
              }
              required
            />
            <PhotoUpload onPhotoUploaded={handlePhotoUploaded} />
            {(editingCategory?.image || newCategory.image) && (
              <div className="mt-4">
                <Image 
                  src={editingCategory?.image || newCategory.image || '/placeholder.svg'} 
                  alt="Category Image" 
                  width={100} 
                  height={100} 
                  className="rounded-md"
                />
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingCategory ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  editingCategory ? 'Update' : 'Create'
                )}
              </Button>
              {editingCategory && (
                <Button type="button" variant="outline" onClick={() => setEditingCategory(null)} className="w-full sm:w-auto">
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>
                  {category.image ? (
                    <Image 
                      src={category.image} 
                      alt={category.name} 
                      width={50} 
                      height={50} 
                      className="rounded-md"
                    />
                  ) : (
                    <span>No image</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" onClick={() => handleEdit(category)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" onClick={() => handleDeleteCategory(category.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}