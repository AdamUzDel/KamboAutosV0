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
import { ModelLine, CarMaker } from '@/lib/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ModelLinesPage() {
  const [modelLines, setModelLines] = useState<ModelLine[]>([])
  const [carMakers, setCarMakers] = useState<CarMaker[]>([])
  const [newModelLine, setNewModelLine] = useState<Omit<ModelLine, 'id'>>({ name: '', carMakerId: '' })
  const [editingModelLine, setEditingModelLine] = useState<ModelLine | null>(null)
  const [selectedCarMaker, setSelectedCarMaker] = useState<string>('')
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
    if (selectedCarMaker) {
      fetchModelLines(selectedCarMaker)
    }
  }, [selectedCarMaker])

  useEffect(() => {
    if (editingModelLine && nameInputRef.current) {
      nameInputRef.current.focus()
    }
  }, [editingModelLine])

  const fetchCarMakers = async () => {
    try {
      const response = await fetch('/api/car-makers')
      if (response.ok) {
        const data: CarMaker[] = await response.json()
        setCarMakers(data)
      } else {
        throw new Error('Failed to fetch car makers')
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to fetch car makers',
        variant: 'destructive',
      })
    }
  }

  const fetchModelLines = async (carMakerId: string) => {
    try {
      const response = await fetch(`/api/model-lines?carMakerId=${carMakerId}`)
      if (response.ok) {
        const data: ModelLine[] = await response.json()
        setModelLines(data)
      } else {
        throw new Error('Failed to fetch model lines')
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to fetch model lines',
        variant: 'destructive',
      })
    }
  }

  const handleCreateModelLine = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/model-lines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newModelLine),
      })
      if (response.ok) {
        toast({ title: 'Success', description: 'Model line created successfully' })
        setNewModelLine({ name: '', carMakerId: selectedCarMaker })
        fetchModelLines(selectedCarMaker)
      } else if (response.status === 401) {
        toast({ title: 'Error', description: 'Unauthorized access', variant: 'destructive' })
      } else {
        throw new Error('Failed to create model line')
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to create model line',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateModelLine = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingModelLine) return
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/model-lines', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingModelLine),
      })
      if (response.ok) {
        toast({ title: 'Success', description: 'Model line updated successfully' })
        setEditingModelLine(null)
        fetchModelLines(selectedCarMaker)
      } else if (response.status === 401) {
        toast({ title: 'Error', description: 'Unauthorized access', variant: 'destructive' })
      } else {
        throw new Error('Failed to update model line')
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update model line',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteModelLine = async (id: string) => {
    if (!confirm('Are you sure you want to delete this model line?')) return

    try {
      const response = await fetch('/api/model-lines', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (response.ok) {
        toast({ title: 'Success', description: 'Model line deleted successfully' })
        fetchModelLines(selectedCarMaker)
      } else if (response.status === 401) {
        toast({ title: 'Error', description: 'Unauthorized access', variant: 'destructive' })
      } else {
        throw new Error('Failed to delete model line')
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete model line',
        variant: 'destructive',
      })
    }
  }

  const handleEdit = (modelLine: ModelLine) => {
    setEditingModelLine(modelLine)
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
      <h1 className="text-2xl font-bold mb-5">Manage Model Lines</h1>
      
      <div className="mb-4">
        <Select value={selectedCarMaker} onValueChange={setSelectedCarMaker}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Car Maker" />
          </SelectTrigger>
          <SelectContent>
            {carMakers.map((carMaker) => (
              <SelectItem key={carMaker.id} value={carMaker.id}>{carMaker.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingModelLine ? 'Edit Model Line' : 'Create New Model Line'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={editingModelLine ? handleUpdateModelLine : handleCreateModelLine} className="space-y-4">
            <Input
              ref={nameInputRef}
              placeholder="Model Line Name"
              value={editingModelLine ? editingModelLine.name : newModelLine.name}
              onChange={(e) => editingModelLine 
                ? setEditingModelLine({...editingModelLine, name: e.target.value})
                : setNewModelLine({...newModelLine, name: e.target.value, carMakerId: selectedCarMaker})
              }
              required
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting || !selectedCarMaker}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingModelLine ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  editingModelLine ? 'Update' : 'Create'
                )}
              </Button>
              {editingModelLine && (
                <Button type="button" variant="outline" onClick={() => setEditingModelLine(null)} className="w-full sm:w-auto">
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
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modelLines.map((modelLine) => (
              <TableRow key={modelLine.id}>
                <TableCell className="font-medium">{modelLine.name}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" onClick={() => handleEdit(modelLine)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" onClick={() => handleDeleteModelLine(modelLine.id)}>
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