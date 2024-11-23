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
import { Year, ModelLine, CarMaker } from '@/lib/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function YearsPage() {
  const [years, setYears] = useState<Year[]>([])
  const [carMakers, setCarMakers] = useState<CarMaker[]>([])
  const [modelLines, setModelLines] = useState<ModelLine[]>([])
  const [newYear, setNewYear] = useState<Omit<Year, 'id'>>({ year: 0, modelLineId: '' })
  const [editingYear, setEditingYear] = useState<Year | null>(null)
  const [selectedCarMaker, setSelectedCarMaker] = useState<string>('')
  const [selectedModelLine, setSelectedModelLine] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)
  const yearInputRef = useRef<HTMLInputElement>(null)
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
      setYears([])
    }
  }, [selectedCarMaker])

  useEffect(() => {
    if (selectedModelLine) {
      fetchYears(selectedModelLine)
    } else {
      setYears([])
    }
  }, [selectedModelLine])

  useEffect(() => {
    if (editingYear && yearInputRef.current) {
      yearInputRef.current.focus()
    }
  }, [editingYear])

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

  const handleCreateYear = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/years', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newYear, modelLineId: selectedModelLine }),
      })
      if (response.ok) {
        toast({ title: 'Success', description: 'Year created successfully' })
        setNewYear({ year: 0, modelLineId: selectedModelLine })
        fetchYears(selectedModelLine)
      } else if (response.status === 401) {
        toast({ title: 'Error', description: 'Unauthorized access', variant: 'destructive' })
      } else {
        throw new Error('Failed to create year')
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to create year',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateYear = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingYear) return
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/years', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingYear),
      })
      if (response.ok) {
        toast({ title: 'Success', description: 'Year updated successfully' })
        setEditingYear(null)
        fetchYears(selectedModelLine)
      } else if (response.status === 401) {
        toast({ title: 'Error', description: 'Unauthorized access', variant: 'destructive' })
      } else {
        throw new Error('Failed to update year')
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update year',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteYear = async (id: string) => {
    if (!confirm('Are you sure you want to delete this year?')) return

    try {
      const response = await fetch('/api/years', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (response.ok) {
        toast({ title: 'Success', description: 'Year deleted successfully' })
        fetchYears(selectedModelLine)
      } else if (response.status === 401) {
        toast({ title: 'Error', description: 'Unauthorized access', variant: 'destructive' })
      } else {
        throw new Error('Failed to delete year')
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete year',
        variant: 'destructive',
      })
    }
  }

  const handleEdit = (year: Year) => {
    setEditingYear(year)
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
      <h1 className="text-2xl font-bold mb-5">Manage Years</h1>
      
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
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingYear ? 'Edit Year' : 'Create New Year'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={editingYear ? handleUpdateYear : handleCreateYear} className="space-y-4">
            <Input
              ref={yearInputRef}
              type="number"
              placeholder="Year"
              value={editingYear ? editingYear.year : newYear.year}
              onChange={(e) => editingYear 
                ? setEditingYear({...editingYear, year: parseInt(e.target.value)})
                : setNewYear({...newYear, year: parseInt(e.target.value)})
              }
              required
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting || !selectedModelLine}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingYear ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  editingYear ? 'Update' : 'Create'
                )}
              </Button>
              {editingYear && (
                <Button type="button" variant="outline" onClick={() => setEditingYear(null)} className="w-full sm:w-auto">
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
              <TableHead>Year</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {years.map((year) => (
              <TableRow key={year.id}>
                <TableCell className="font-medium">{year.year}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" onClick={() => handleEdit(year)}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" onClick={() => handleDeleteYear(year.id)}>
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