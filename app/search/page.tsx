import { Suspense } from 'react'
import { SearchBar } from '@/components/SearchBar'
import { SearchComponent } from '@/components/SearchComponent'
import { ProductCard } from '@/components/ProductCard'
import prisma from '@/lib/prisma'

async function SearchResults({ searchParams }: { searchParams: { [key: string]: string } }) {
  const { q, carMaker, modelLine, year, modification, category } = searchParams

  if (!q && !category && (!carMaker || !modelLine || !year || !modification)) {
    return <p>Please enter a search query, select a category, or specify car details to search for parts.</p>
  }

  const parts = await prisma.part.findMany({
    where: {
      AND: [
        q ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ]
        } : {},
        category ? { category: { name: category } } : {},
        carMaker && modelLine && year && modification ? {
          modifications: {
            some: {
              id: modification,
              year: {
                id: year,
                modelLine: {
                  id: modelLine,
                  carMaker: {
                    id: carMaker
                  }
                }
              }
            }
          }
        } : {}
      ]
    },
    include: {
      category: true,
    }
  })

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
      {parts.length === 0 ? (
        <p>No parts found for the given search criteria. Please try a different search.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {parts.map((part) => (
            <ProductCard key={part.id} product={part} />
          ))}
        </div>
      )}
    </div>
  )
}

export default async function SearchPage(props: { searchParams: Promise<{ [key: string]: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || '';
  const category = searchParams.category || '';

  return (
    <div className="container p-4 mx-auto">
      <SearchBar initialQuery={query} />
      {query && (
        <h1 className="text-3xl font-bold mb-6 text-center">
          Select a car for your "{query}" search
        </h1>
      )}
      {category && (
        <h1 className="text-3xl font-bold mb-6 text-center">
          Select a car for {category} parts
        </h1>
      )}
      <SearchComponent initialCategory={category} />
      <div className="mt-8">
        <Suspense fallback={<div>Loading search results...</div>}>
          <SearchResults searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}