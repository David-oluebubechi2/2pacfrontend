import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { CategoriesContext } from './categories'
import { defaultCategories } from '../data/products'
import type { Category } from '../data/products'
import { api } from '../api'

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    api
      .listCategories()
      .then((list) => {
        if (active) setCategories(list)
      })
      .catch(() => {
        if (active) setCategories(defaultCategories)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const value = useMemo(() => ({ categories, loading }), [categories, loading])

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>
}
