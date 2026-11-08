import { useContext } from 'react'
import { ProductsContext } from './products'
import type { ProductsContextValue } from './products'

export function useProducts(): ProductsContextValue {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider')
  return ctx
}
