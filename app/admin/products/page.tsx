import { Suspense } from 'react'
import Link from 'next/link'
import { ProductTable } from '@/components/admin/ProductTable'
import { Button } from '@/components/ui/button'
import { Loader } from '@/components/ui/loader'
import { getProducts } from '@/lib/products'
import { Plus } from 'lucide-react'

export default async function AdminProducts() {
  const products = await getProducts()

  return (
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Products</h1>
        <Link href="/admin/products/add" passHref>
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add New Product
          </Button>
        </Link>
      </div>
      <div className="bg-background rounded-lg shadow-md overflow-hidden">
        <Suspense fallback={<Loader className="m-4" />}>
          <ProductTable products={products} />
        </Suspense>
      </div>
    </div>
  )
}