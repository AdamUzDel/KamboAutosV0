// app/search/page.tsx
import { Suspense } from 'react'
import { SearchComponent } from '@/components/SearchComponent'
import { ProductCard } from '@/components/ProductCard'
import prisma from '@/lib/prisma'

async function SearchResults({ searchParams }: { searchParams: { [key: string]: string } }) {
  const { carMaker, modelLine, year, modification } = searchParams

  if (!carMaker || !modelLine || !year || !modification) {
    return <p>Please select all options to search for parts.</p>
  }

  const parts = await prisma.part.findMany({
    where: {
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
    },
    include: {
      category: true,
    }
  })

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Search Results</h2>
      {parts.length === 0 ? (
        <p>No parts found for the selected vehicle. Please try a different search.</p>
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
  return (
    <div className="container p-4 mx-auto">
      <SearchComponent />
      <div className="mt-8">
        <Suspense fallback={<div>Loading search results...</div>}>
          <SearchResults searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}