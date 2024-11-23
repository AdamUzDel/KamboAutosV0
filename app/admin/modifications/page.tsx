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
import { Modification, Year, ModelLine, CarMaker } from '@/lib/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ModificationsPage() {
  const [modifications, setModifications] = useState<Modification[]>([])
  const [carMakers, setCarMakers] = useState<CarMaker[]>([])
  const [modelLines, setModelLines] = useState<ModelLine[]>([])
  const [years, setYears] = useState<Year[]>([])
  const [newModification, setNewModification] = useState<Omit<Modification, 'id'>>({ name: '', yearId: '' })
  const [editingModification, setEditingModification] = useState<Modification | null>(null)
  const [selectedCarMaker, setSelectedCarMaker] = useState<string>('')
  const [selectedModelLine, setSelectedModelLine] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<string>('')
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
      setSelectedModelLine('')
      setSelectedYear('')
      setYears([])
      setModifications([])
    }
  }, [selectedCarMaker])

  useEffect(() => {
    if (selectedModelLine) {
      fetchYears(selectedModelLine)
      setSelectedYear('')
      setModifications([])
    }
  }, [selectedModelLine])

  useEffect(() => {
    if (selectedYear) {
      fetchModifications(selectedYear)
    } else {
      setModifications([])
    }
  }, [selectedYear])

  useEffect(() => {
    if (editingModification && nameInputRef.current) {
      nameInputRef.current.focus()
    }
  }, [editingModification])

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

  const fetchYears = async (modelLineId: string) => {
    try {
      const response = await fetch(`/api/years?modelLineId=${modelLineId}`)
      if (response.ok) {
        const data: Year[] = await response.json()
        setYears(data)
      } else {
        throw new Error('Failed to fetch years')
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to fetch years',
        variant: 'destructive',
      })
    }
  }

  const fetchModifications = async (yearId: string) => {
    try {
      const response = await fetch(`/api/modifications?yearId=${yearId}`)
      if (response.ok) {
        const data: Modification[] = await response.json()
        setModifications(data)
      } else {
        throw new Error('Failed to fetch modifications')
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to fetch modifications',
        variant: 'destructive',
      })
    }
  }

  const handleCreateModification = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/modifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newModification, yearId: selectedYear }),
      })
      if (response.ok) {
        toast({ title: 'Success', description: 'Modification created successfully' })
        setNewModification({ name: '', yearId: selectedYear })
        fetchModifications(selectedYear)
      } else if (response.status === 401) {
        toast({ title: 'Error', description: 'Unauthorized access', variant: 'destructive' })
      } else {
        throw new Error('Failed to create modification')
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to create modification',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateModification = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingModification) return
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/modifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingModification),
      })
      if (response.ok) {
        toast({ title: 'Success', description: 'Modification updated successfully' })
        setEditingModification(null)
        fetchModifications(selectedYear)
      } else if (response.status === 401) {
        toast({ title: 'Error', description: 'Unauthorized access', variant: 'destructive' })
      } else {
        throw new Error('Failed to update modification')
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update modification',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteModification = async (id: string) => {
    if (!confirm('Are you sure you want to delete this modification?')) return

    try {
      const response = await fetch('/api/modifications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (response.ok) {
        toast({ title: 'Success', description: 'Modification deleted successfully' })
        fetchModifications(selectedYear)
      } else if (response.status === 401) {
        toast({ title: 'Error', description: 'Unauthorized access', variant: 'destructive' })
      } else {
        throw new Error('Failed to delete modification')
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete modification',
        variant: 'destructive',
      })
    }
  }

  const handleEdit = (modification: Modification) => {
    setEditingModification(modification)
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
      <h1 className="text-2xl font-bold mb-5">Manage Modifications</h1>
      
      <div className="mb-4 space-y-4">
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

        <Select value={selectedModelLine} onValueChange={setSelectedModelLine} disabled={!selectedCarMaker}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Model Line" />
          </SelectTrigger>
          <SelectContent>
            {modelLines.map((modelLine) => (
              <SelectItem key={modelLine.id} value={modelLine.id}>{modelLine.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedYear} onValueChange={setSelectedYear} disabled={!selectedModelLine}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year.id} value={year.id}>{year.year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingModification ? 'Edit Modification' : 'Create New Modification'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={editingModification ? handleUpdateModification : handleCreateModification} className="space-y-4">
            <Input
              ref={nameInputRef}
              placeholder="Modification Name"
              value={editingModification ? editingModification.name : newModification.name}
              onChange={(e) => editingModification 
                ? setEditingModification({...editingModification, name: e.target.value})
                : setNewModification({...newModification, name: e.target.value})
              }
              required
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting || !selectedYear}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingModification ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  editingModification ? 'Update' : 'Create'
                )}
              </Button>
              {editingModification && (
                <Button type="button" variant="outline" onClick={() => setEditingModification(null)} className="w-full sm:w-auto">
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
            {modifications.map((modification) => (
              <TableRow key={modification.id}>
                <TableCell className="font-medium">{modification.name}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" onClick={() => handleEdit(modification)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" onClick={() => handleDeleteModification(modification.id)}>
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