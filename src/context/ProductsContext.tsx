import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ProductsContext } from './products'
import type { Product } from '../data/products'
import { api } from '../api'

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    api
      .listProducts()
      .then((list) => {
        if (active) setProducts(list)
      })
      .catch(() => {
        if (active) setProducts([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const value = useMemo(() => ({ products, loading }), [products, loading])

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}
