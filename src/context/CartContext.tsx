import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { CartContext } from './cart'
import type { CartItem, CartContextValue } from './cart'
import type { Product } from '../data/products'

const STORAGE_KEY = 'cart'

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const value = useMemo<CartContextValue>(() => {
    const keyOf = (id: string, size?: string) => `${id}__${size ?? ''}`

    return {
      items,
      count: items.reduce((sum, item) => sum + item.qty, 0),
      subtotal: items.reduce((sum, item) => sum + item.product.price * item.qty, 0),
      addItem: (product: Product, qty: number, size?: string) => {
        setItems((prev) => {
          const key = keyOf(product.id, size)
          const existing = prev.find((i) => keyOf(i.product.id, i.size) === key)
          if (existing) {
            return prev.map((i) =>
              keyOf(i.product.id, i.size) === key ? { ...i, qty: i.qty + qty } : i,
            )
          }
          return [...prev, { product, qty, size }]
        })
      },
      updateQty: (id: string, size: string | undefined, qty: number) => {
        setItems((prev) =>
          prev
            .map((i) =>
              keyOf(i.product.id, i.size) === keyOf(id, size) ? { ...i, qty: Math.max(0, qty) } : i,
            )
            .filter((i) => i.qty > 0),
        )
      },
      removeItem: (id: string, size: string | undefined) => {
        setItems((prev) => prev.filter((i) => keyOf(i.product.id, i.size) !== keyOf(id, size)))
      },
      clearCart: () => setItems([]),
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
