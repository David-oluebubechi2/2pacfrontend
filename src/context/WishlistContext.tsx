import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { WishlistContext } from './wishlist'
import { useAuth } from './useAuth'
import { api } from '../api'

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [ids, setIds] = useState<string[]>([])

  useEffect(() => {
    let active = true
    const load = async () => {
      if (!user) {
        if (active) setIds([])
        return
      }
      try {
        const list = await api.getWishlist()
        if (active) setIds(list)
      } catch {
        if (active) setIds([])
      }
    }
    void load()
    return () => {
      active = false
    }
  }, [user])

  const value = useMemo(() => {
    const persist = (next: string[]) => {
      setIds(next)
      if (user) api.setWishlist(next).catch(() => {})
    }

    return {
      ids,
      count: ids.length,
      isSaved: (id: string) => ids.includes(id),
      toggle: (id: string) => {
        if (!user) return
        persist(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id])
      },
      remove: (id: string) => {
        if (!user) return
        persist(ids.filter((x) => x !== id))
      },
    }
  }, [ids, user])

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
