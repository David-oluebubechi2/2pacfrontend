import { createContext } from 'react'
import type { Product } from '../data/products'

export type ProductsContextValue = {
  products: Product[]
  loading: boolean
}

export const ProductsContext = createContext<ProductsContextValue | null>(null)
