'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, ShoppingCart, BarChart, Car, List, Calendar, Settings, ChevronLeft, ChevronRight, Tag } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: BarChart },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/car-makers', label: 'Car Makers', icon: Car },
  { href: '/admin/model-lines', label: 'Model Lines', icon: List },
  { href: '/admin/years', label: 'Years', icon: Calendar },
  { href: '/admin/modifications', label: 'Modifications', icon: Settings },
]

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768)
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  return isMobile
}

export function AdminSidebar() {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true)
    }
  }, [isMobile])

  const toggleSidebar = () => {
    if (!isMobile) {
      setIsCollapsed(!isCollapsed)
    }
  }

  return (
    <aside className={cn(
      "flex flex-col bg-gray-900 text-white transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4">
        <h1 className={cn("text-xl font-bold", isCollapsed && "hidden")}>Admin Panel</h1>
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-white hover:bg-gray-800"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>
      <ScrollArea className="flex-grow">
        <nav className="px-2 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center p-2 rounded-lg transition-colors duration-150",
                    pathname === item.href ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800",
                    isCollapsed && "justify-center"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>
    </aside>
  )
}