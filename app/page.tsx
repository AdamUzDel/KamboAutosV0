// app/page.tsx
import { SearchBar } from '@/components/SearchBar'
import { SearchComponent } from '@/components/SearchComponent'
import { FeaturedProducts } from '@/components/FeaturedProducts'
import { CarPartCategories } from '@/components/CarPartCategories'
import { Promotions } from '@/components/Promotions'
import { PopularCarMakers } from '@/components/PopularCarMakers'
import { ArticlesAndReviews } from '@/components/ArticlesAndReviews'
import { ClientTestimonials } from '@/components/ClientTestimonials'

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center my-8">Welcome to Kambo Autos</h1>
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
  )
}