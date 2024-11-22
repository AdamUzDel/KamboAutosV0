import { Suspense } from 'react'
import Link from 'next/link'
import { ProductTable } from '@/components/admin/ProductTable'
import { Button } from '@/components/ui/button'
import { Loader } from '@/components/ui/loader'
import { getProducts } from '@/lib/products'

export default async function AdminProducts() {
  const products = await getProducts()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/admin/products/add" passHref>
          <Button>Add New Product</Button>
        </Link>
      </div>
      <Suspense fallback={<Loader />}>
        <ProductTable products={products} />
      </Suspense>
    </div>
  )
}