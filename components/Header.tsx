'use client'

import Link from 'next/link'
import { ShoppingCart, User, Menu, X, ChevronDown, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import { Badge } from '@/components/ui/badge'
import { useSession, signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
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
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  if (!mounted) {
    return null
  }

  return (
    <header className="bg-background shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          Kambo Autos
        </Link>
        <nav className="hidden md:flex space-x-4 items-center">
          <Link href="/" className="text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/search" className="text-foreground hover:text-primary transition-colors">
            Search
          </Link>
          <Link href="/categories" className="text-foreground hover:text-primary transition-colors">
            Categories
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/cart" className="relative">
            <ShoppingCart className="h-6 w-6 text-foreground hover:text-primary transition-colors" />
            {cartItemsCount > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2">
                {cartItemsCount}
              </Badge>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-foreground hover:text-primary transition-colors"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
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
        className={`fixed top-0 right-0 h-full w-64 bg-background shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
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
            <Link href="/" className="block text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/search" className="block text-foreground hover:text-primary transition-colors">
              Search
            </Link>
            <Link href="/categories" className="block text-foreground hover:text-primary transition-colors">
              Categories
            </Link>
            {session ? (
              <>
                <Link href="/profile" className="block text-foreground hover:text-primary transition-colors">
                  Profile
                </Link>
                <Link href="/orders" className="block text-foreground hover:text-primary transition-colors">
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
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </Button>
          </nav>
        </div>
      </div>
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 z-40"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </header>
  )
}