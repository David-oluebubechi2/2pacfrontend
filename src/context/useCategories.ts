import { useContext } from 'react'
import { CategoriesContext } from './categories'
import type { CategoriesContextValue } from './categories'

export function useCategories(): CategoriesContextValue {
  const ctx = useContext(CategoriesContext)
  if (!ctx) throw new Error('useCategories must be used within CategoriesProvider')
  return ctx
}
