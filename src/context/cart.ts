import { createContext } from 'react'
import type { Product } from '../data/products'

export type CartItem = {
  product: Product
  qty: number
  size?: string
}

export type CartContextValue = {
  items: CartItem[]
  count: number
  subtotal: number
  addItem: (product: Product, qty: number, size?: string) => void
  updateQty: (id: string, size: string | undefined, qty: number) => void
  removeItem: (id: string, size: string | undefined) => void
  clearCart: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)
