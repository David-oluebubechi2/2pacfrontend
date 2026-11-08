import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { OrdersContext } from './orders'
import type { Order, NewOrderInput } from './orders'
import { useAuth } from './useAuth'
import { api } from '../api'

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!user) {
      setOrders([])
      return
    }
    setLoading(true)
    try {
      const list = await api.listOrders()
      setOrders(list)
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const value = useMemo(
    () => ({
      orders,
      loading,
      refresh,
      placeOrder: async (order: NewOrderInput) => {
        const created = await api.createOrder(order)
        setOrders((prev) => [created, ...prev])
        return created
      },
    }),
    [orders, loading, refresh],
  )

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}
