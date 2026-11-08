import { useContext } from 'react'
import { OrdersContext } from './orders'
import type { OrdersContextValue } from './orders'

export function useOrders(): OrdersContextValue {
  const ctx = useContext(OrdersContext)
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider')
  return ctx
}
