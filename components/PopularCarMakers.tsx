// components/PopularCarMakers.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface CarMaker {
  id: number
  name: string
  logo: string
  modelLines?: string[]
}

/* const carMakers = [
  { id: 1, name: 'Toyota', logo: '/placeholder.svg', slug: 'toyota' },
  { id: 2, name: 'Honda', logo: '/placeholder.svg', slug: 'honda' },
  { id: 3, name: 'Ford', logo: '/placeholder.svg', slug: 'ford' },
  { id: 4, name: 'Chevrolet', logo: '/placeholder.svg', slug: 'chevrolet' },
  { id: 5, name: 'BMW', logo: '/placeholder.svg', slug: 'bmw' },
  { id: 6, name: 'Mercedes-Benz', logo: '/placeholder.svg', slug: 'mercedes-benz' },
] */

export function PopularCarMakers() {
  const [carMakers, setCarMakers] = useState<CarMaker[]>([])

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

  if (!carMakers) {
    return null
  }

  return (
    <section className="my-12">
      <h2 className="text-2xl font-semibold mb-6">Popular Car Makers</h2>
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
        {carMakers.map((maker) => (
            <Link
              key={maker.id}
              href={`/search?carMakerId=${maker.id}`}
              className="h-100 w-100 flex flex-col items-center  justify-items-stretch p-4"
            >
              <Image
                src={maker.logo || '/placeholder.svg'}
                alt={maker.name}
                width={100}
                height={100}
                className="mb-2 w-100 h-full p-4 border rounded-lg hover:shadow-md transition-shadow" />
                <span className="text-center font-medium">{maker.name}</span>
            </Link>
        ))}
      </div>
    </section>
  )
}