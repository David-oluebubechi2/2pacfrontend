import { createContext } from 'react'
import type { Category } from '../data/products'

export type CategoriesContextValue = {
  categories: Category[]
  loading: boolean
}

export const CategoriesContext = createContext<CategoriesContextValue | null>(null)
