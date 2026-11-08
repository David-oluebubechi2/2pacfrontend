import { useContext } from 'react'
import { WishlistContext } from './wishlist'
import type { WishlistContextValue } from './wishlist'

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
