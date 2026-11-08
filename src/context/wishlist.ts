import { createContext } from 'react'

export type WishlistContextValue = {
  ids: string[]
  count: number
  isSaved: (id: string) => boolean
  toggle: (id: string) => void
  remove: (id: string) => void
}

export const WishlistContext = createContext<WishlistContextValue | null>(null)
