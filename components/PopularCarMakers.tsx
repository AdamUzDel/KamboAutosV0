'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface CarMaker {
  id: number
  name: string
  logo: string
  modelLines?: string[]
}

export function PopularCarMakers() {
  const [carMakers, setCarMakers] = useState<CarMaker[]>([])
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    async function fetchCarMakers() {
      try {
        const response = await fetch('/api/car-makers')
        const makers = await response.json()
        setCarMakers(makers)
      } catch (error) {
        console.error("Failed to fetch car makers", error)
      }
    }
    fetchCarMakers()
  }, [])

  if (!carMakers.length) {
    return null
  }

  const visibleMakers = showAll ? carMakers : carMakers.slice(0, 18)

  return (
    <section className="my-12 px-4 md:px-0">
      <h2 className="text-2xl font-semibold mb-6">Popular Car Makers</h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
        {visibleMakers.map((maker) => (
          <Link
            key={maker.id}
            href={`/search?carMakerId=${maker.id}`}
            className="flex flex-col items-center justify-center p-2 md:p-4 border rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="relative w-16 h-16 md:w-20 md:h-20 mb-2">
              <Image
                src={maker.logo || '/placeholder.svg'}
                alt={maker.name}
                fill
                sizes="(max-width: 768px) 33vw, 16vw"
                className="object-contain p-2"
              />
            </div>
            <span className="text-center text-sm md:text-base font-medium">{maker.name}</span>
          </Link>
        ))}
      </div>
      {carMakers.length > 18 && (
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center"
          >
            {showAll ? (
              <>
                Show Less <ChevronUp className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Show More <ChevronDown className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </section>
  )
}