'use client'

import { useSearchParams } from 'next/navigation'
import React from 'react'

interface SearchParamsWrapperProps {
  children: React.ReactNode
}

export function SearchParamsWrapper({ children }: SearchParamsWrapperProps) {
  const searchParams = useSearchParams()
  
  return (
    <SearchParamsContext.Provider value={searchParams}>
      {children}
    </SearchParamsContext.Provider>
  )
}

export const SearchParamsContext = React.createContext<URLSearchParams | null>(null)

export function useSearchParamsContext() {
  const context = React.useContext(SearchParamsContext)
  if (context === null) {
    throw new Error('useSearchParamsContext must be used within a SearchParamsWrapper')
  }
  return context
}