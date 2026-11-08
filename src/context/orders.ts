import { createContext } from 'react'
import type { ApiOrder, NewOrderInput } from '../api'

export type OrderItem = {
  name: string
  size?: string
  qty: number
  price: number
}

export type Order = ApiOrder

export type { NewOrderInput }

export type OrdersContextValue = {
  orders: Order[]
  loading: boolean
  refresh: () => Promise<void>
  placeOrder: (order: NewOrderInput) => Promise<Order>
}

export const OrdersContext = createContext<OrdersContextValue | null>(null)
