'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X, Mic } from 'lucide-react'
import { useRouter } from 'next/navigation'

const searchExamples = [
  'Oil filter',
  'Subaru oil filter',
  'Brake pads',
  'Toyota Camry alternator',
  'Honda Civic spark plugs'
]

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setPlaceholderIndex((prevIndex) => (prevIndex + 1) % searchExamples.length)
        setIsTransitioning(false)
      }, 500)
    }, 3000)

    return () => clearInterval(intervalId)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  const clearInput = () => {
    setQuery('')
    inputRef.current?.focus()
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto mb-8">
      <div className="relative bg-white rounded-full border-2 border-gray-300 flex items-center overflow-hidden">
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-6 pr-32 py-6 text-lg border-0 focus:ring-0 rounded-full bg-transparent"
        />
        <div 
          className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 transition-all duration-500 ease-in-out overflow-hidden h-7"
          style={{ opacity: query ? 0 : 1 }}
        >
          <div 
            className={`transition-transform duration-500 ease-in-out ${isTransitioning ? '-translate-y-full' : 'translate-y-0'}`}
          >
            {searchExamples[placeholderIndex]}
          </div>
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && (
            <Button 
              type="button" 
              variant="ghost" 
              onClick={clearInput}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="h-5 w-5 text-gray-500" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
          <Button 
            type="button"
            variant="ghost"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <Mic className="h-5 w-5 text-gray-500" />
            <span className="sr-only">Voice search</span>
          </Button>
          <Button 
            type="submit" 
            size="icon"
            className="ml-1 p-3 rounded-full bg-[#1a4789] hover:bg-[#1a4789]/90 transition-colors duration-200"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-500 text-center">
        Try searching for specific parts or by car make and model
      </p>
    </form>
  )
}