'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, User, Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect, useRef } from 'react'
import { useCart } from '@/contexts/CartContext'
import { Badge } from '@/components/ui/badge'
import { useSession, signOut } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { cart } = useCart()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          <Image src={"/logo_black.png"} alt="kambo autos logo" width={100} height={100} />
        </Link>
        <nav className="hidden md:flex space-x-4 items-center">
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
          <div className="hidden md:block">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link href="/profile" className="w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/orders" className="w-full">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <button onClick={() => signOut()} className="w-full text-left">Sign Out</button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4"
            onClick={() => setIsMenuOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
          <nav className="mt-8 space-y-4">
            <Link href="/" className="block text-gray-600 hover:text-blue-600">
              Home
            </Link>
            <Link href="/search" className="block text-gray-600 hover:text-blue-600">
              Search
            </Link>
            <Link href="/categories" className="block text-gray-600 hover:text-blue-600">
              Categories
            </Link>
            {session ? (
              <>
                <Link href="/profile" className="block text-gray-600 hover:text-blue-600">
                  Profile
                </Link>
                <Link href="/orders" className="block text-gray-600 hover:text-blue-600">
                  Orders
                </Link>
                <Button variant="outline" className="w-full mt-4" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="outline" className="w-full mt-4">
                  Sign In
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </header>
  )
}