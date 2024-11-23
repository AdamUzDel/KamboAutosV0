import { SearchBar } from '@/components/SearchBar'
import { SearchComponent } from '@/components/SearchComponent'
import { FeaturedProducts } from '@/components/FeaturedProducts'
import { CarPartCategories } from '@/components/CarPartCategories'
import { Promotions } from '@/components/Promotions'
import { PopularCarMakers } from '@/components/PopularCarMakers'
import { ArticlesAndReviews } from '@/components/ArticlesAndReviews'
import { ClientTestimonials } from '@/components/ClientTestimonials'
import { Suspense } from 'react'
import { SearchParamsWrapper } from '@/components/SearchParamsWrapper'

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsWrapper>
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mt-10">Welcome to Kambo Autos</h1>
          <p className='text-center mt-4 mb-8'>Find the best auto parts for your vehicle</p>
          <div className="flex justify-center mb-8">
            <SearchBar />
          </div>
          <SearchComponent />
          <FeaturedProducts />
          <CarPartCategories />
          <Promotions />
          <PopularCarMakers />
          <ArticlesAndReviews />
          <ClientTestimonials />
        </div>
      </SearchParamsWrapper>
    </Suspense>
  )
}