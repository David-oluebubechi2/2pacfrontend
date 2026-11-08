import { Link } from 'react-router-dom'
import { getProduct } from '../data/products'
import { useWishlist } from '../context/useWishlist'
import { useProducts } from '../context/useProducts'
import { ProductCard } from '../components/ProductCard'
import { PageTransition } from '../components/PageTransition'

export function Saved() {
  const { ids, count } = useWishlist()
  const { products } = useProducts()
  const items = ids.map((id) => getProduct(id, products)).filter((p) => p !== undefined)

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">My Account</p>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl">Saved Items</h1>
        <p className="mt-2 text-sm text-muted">{count} item(s) saved for later</p>

        {items.length === 0 ? (
          <div className="mt-10 border border-dashed border-sand bg-white p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-soft text-2xl text-gold-dark">
              ♡
            </div>
            <p className="mt-5 text-muted">You haven’t saved any items yet.</p>
            <Link
              to="/shop"
              className="mt-6 inline-block bg-gold px-8 py-3 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-gold-dark"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {items.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  )
}
