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
import { CarMaker } from '@/lib/types'

export default function CarMakersPage() {
  const [carMakers, setCarMakers] = useState<CarMaker[]>([])
  const [newCarMaker, setNewCarMaker] = useState<Omit<CarMaker, 'id'>>({ name: '', logo: '' })
  const [editingCarMaker, setEditingCarMaker] = useState<CarMaker | null>(null)
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
      fetchCarMakers()
    }
  }, [status, session, router])

  useEffect(() => {
    if (editingCarMaker && nameInputRef.current) {
      nameInputRef.current.focus()
    }
  }, [editingCarMaker])

  const fetchCarMakers = async () => {
    try {
      const response = await fetch('/api/car-makers')
      if (response.ok) {
        const data: CarMaker[] = await response.json()
        setCarMakers(data)
      } else {
        throw new Error('Failed to fetch car makers')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch car makers',
        variant: 'destructive',
      })
    }
  }

  const handleCreateCarMaker = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/car-makers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCarMaker),
      })
      if (response.ok) {
        toast({ title: 'Success', description: 'Car maker created successfully' })
        setNewCarMaker({ name: '', logo: '' })
        fetchCarMakers()
      } else if (response.status === 401) {
        toast({ title: 'Error', description: 'Unauthorized access', variant: 'destructive' })
      } else {
        throw new Error('Failed to create car maker')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create car maker',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateCarMaker = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCarMaker) return
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/car-makers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCarMaker),
      })
      if (response.ok) {
        toast({ title: 'Success', description: 'Car maker updated successfully' })
        setEditingCarMaker(null)
        fetchCarMakers()
      } else if (response.status === 401) {
        toast({ title: 'Error', description: 'Unauthorized access', variant: 'destructive' })
      } else {
        throw new Error('Failed to update car maker')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update car maker',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCarMaker = async (id: string) => {
    if (!confirm('Are you sure you want to delete this car maker?')) return

    try {
      const response = await fetch('/api/car-makers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (response.ok) {
        toast({ title: 'Success', description: 'Car maker deleted successfully' })
        fetchCarMakers()
      } else if (response.status === 401) {
        toast({ title: 'Error', description: 'Unauthorized access', variant: 'destructive' })
      } else {
        throw new Error('Failed to delete car maker')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete car maker',
        variant: 'destructive',
      })
    }
  }

  const handleEdit = (carMaker: CarMaker) => {
    setEditingCarMaker(carMaker)
    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (status === "unauthenticated" || (session && session.user.role !== 'ADMIN')) {
    return null
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-5">Manage Car Makers</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingCarMaker ? 'Edit Car Maker' : 'Create New Car Maker'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={editingCarMaker ? handleUpdateCarMaker : handleCreateCarMaker} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                ref={nameInputRef}
                placeholder="Car Maker Name"
                value={editingCarMaker ? editingCarMaker.name : newCarMaker.name}
                onChange={(e) => editingCarMaker 
                  ? setEditingCarMaker({...editingCarMaker, name: e.target.value})
                  : setNewCarMaker({...newCarMaker, name: e.target.value})
                }
                required
              />
              <Input
                placeholder="Logo URL"
                value={editingCarMaker ? editingCarMaker.logo || '' : newCarMaker.logo || ''}
                onChange={(e) => editingCarMaker
                  ? setEditingCarMaker({...editingCarMaker, logo: e.target.value})
                  : setNewCarMaker({...newCarMaker, logo: e.target.value})
                }
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingCarMaker ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  editingCarMaker ? 'Update' : 'Create'
                )}
              </Button>
              {editingCarMaker && (
                <Button type="button" variant="outline" onClick={() => setEditingCarMaker(null)} className="w-full sm:w-auto">
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
              <TableHead>Logo</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {carMakers.map((carMaker) => (
              <TableRow key={carMaker.id}>
                <TableCell className="font-medium">{carMaker.name}</TableCell>
                <TableCell>{carMaker.logo ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" onClick={() => handleEdit(carMaker)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" onClick={() => handleDeleteCarMaker(carMaker.id)}>
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