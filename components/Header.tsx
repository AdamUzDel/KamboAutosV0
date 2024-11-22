// components/Header.tsx
'use client'

import Link from 'next/link'
import { ShoppingCart, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { Badge } from '@/components/ui/badge'
import { useSession, signOut } from 'next-auth/react'

export default function Header() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { cart } = useCart()

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Kambo Autos
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Link href="/" className="text-gray-600 hover:text-blue-600">
            Home
          </Link>
          <Link href="/search" className="text-gray-600 hover:text-blue-600">
            Search
          </Link>
          <Link href="/categories" className="text-gray-600 hover:text-blue-600">
            Categories
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/cart" className="relative">
            <ShoppingCart className="h-6 w-6 text-gray-600 hover:text-blue-600" />
            {cartItemsCount > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2">
                {cartItemsCount}
              </Badge>
            )}
          </Link>
          {session ? (
              <>
                <Link href="/profile">
                  <Button variant="outline" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                </Link>
                <Link href="/orders" className="text-gray-600 hover:text-gray-800">
                  Orders
                </Link>
                <Button variant="outline" size="sm" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          {/* <Link href="/account">
            <User className="h-6 w-6 text-gray-600 hover:text-blue-600" />
          </Link>
          <Button variant="outline" className="hidden md:inline-flex">
            Sign In
          </Button> */}
        </div>
        <Button
          variant="ghost"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          Menu
        </Button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white py-2">
          <Link href="/" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
            Home
          </Link>
          <Link href="/search" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
            Search
          </Link>
          <Link href="/categories" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
            Categories
          </Link>
          <Link href="/account" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
            Account
          </Link>
          <Button variant="outline" className="mx-4 mt-2">
            Sign In
          </Button>
        </div>
      )}
    </header>
  )
}