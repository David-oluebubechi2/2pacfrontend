import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatPrice, getProduct, getProductsByCategory } from '../data/products'
import { resolveImageUrl } from '../api'
import { ProductImage } from '../components/ProductImage'
import { ProductCard } from '../components/ProductCard'
import { PageTransition } from '../components/PageTransition'
import { useCart } from '../context/useCart'
import { useAuth } from '../context/useAuth'
import { useToast } from '../context/useToast'
import { useWishlist } from '../context/useWishlist'
import { useProducts } from '../context/useProducts'

export function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { user } = useAuth()
  const { notify } = useToast()
  const { isSaved, toggle } = useWishlist()
  const { products, loading } = useProducts()
  const product = id ? getProduct(id, products) : undefined

  const [size, setSize] = useState<string | undefined>(product?.sizes?.[0])
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [imgIndex, setImgIndex] = useState(0)

  useEffect(() => {
    setImgIndex(0)
  }, [id])

  if (loading) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-6xl px-4 py-24 text-center text-sm text-muted">
          Loading product…
        </div>
      </PageTransition>
    )
  }

  if (!product) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-6xl px-4 py-24 text-center">
          <h1 className="font-display text-3xl">Product not found</h1>
          <Link to="/shop" className="mt-4 inline-block text-gold-dark uppercase tracking-widest text-sm">
            Back to shop
          </Link>
        </div>
      </PageTransition>
    )
  }

  const related = getProductsByCategory(product.category, products)
    .filter((p) => p.id !== product.id)
    .concat(products.filter((p) => p.category !== product.category && p.featured))
    .slice(0, 4)

  const gallery = product.images?.length > 0 ? product.images : [product.image]
  const mainImage = resolveImageUrl(gallery[Math.min(imgIndex, gallery.length - 1)])

  const handleAdd = () => {
    if (!product.available) {
      notify(`${product.name} is currently out of stock`)
      return
    }
    addItem(product, qty, size)
    setAdded(true)
    notify(`${product.name} added to your cart`, 'cart')
    setTimeout(() => setAdded(false), 2000)
  }

  const handleSave = () => {
    if (!user) {
      navigate('/login', { state: { from: `/product/${product.id}` } })
      return
    }
    const saved = isSaved(product.id)
    toggle(product.id)
    notify(saved ? `${product.name} removed from saved items` : `${product.name} saved for later`)
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.3em] text-muted">
          <Link to="/shop" className="transition-colors hover:text-gold-dark">
            Shop
          </Link>{' '}
          /{' '}
          <Link
            to={`/shop/${product.category}`}
            className="transition-colors hover:text-gold-dark"
          >
            {product.subcategory}
          </Link>{' '}
          / <span className="text-ink">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="aspect-[4/5] overflow-hidden border border-sand bg-white"
            >
              <ProductImage src={mainImage} alt={product.name} className="h-full w-full" />
            </motion.div>
            {gallery.length > 1 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {gallery.map((url, i) => (
                  <button
                    key={`${product.id}-img-${i}`}
                    type="button"
                    onClick={() => setImgIndex(i)}
                    className={`h-16 w-14 overflow-hidden border transition-colors ${
                      i === imgIndex ? 'border-gold' : 'border-sand hover:border-gold/50'
                    }`}
                  >
                    <ProductImage src={resolveImageUrl(url)} alt="" className="h-full w-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">{product.subcategory}</p>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl">{product.name}</h1>
            <p className="mt-4 font-display text-2xl text-gold-dark">{formatPrice(product.price)}</p>
            {product.available ? (
              <p className="mt-3 inline-flex items-center gap-2 bg-gold-soft px-3 py-1 text-xs uppercase tracking-[0.2em] text-gold-dark">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                In Stock
              </p>
            ) : (
              <p className="mt-3 inline-block bg-ink px-3 py-1 text-xs uppercase tracking-[0.2em] text-cream">
                Out of Stock
              </p>
            )}
            {product.description && (
              <p className="mt-5 text-sm leading-relaxed text-muted">{product.description}</p>
            )}

            {product.sizes && (
              <div className="mt-8">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Size</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`min-w-12 border px-4 py-2 text-sm transition-colors ${
                        size === s
                          ? 'border-gold bg-gold text-white'
                          : 'border-sand bg-white hover:border-gold'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">Quantity</p>
              <div className="mt-3 inline-flex items-center border border-sand bg-white">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  aria-label="Decrease quantity"
                  className="px-4 py-2 text-lg transition-colors hover:text-gold-dark disabled:cursor-not-allowed disabled:opacity-30"
                >
                  −
                </button>
                <span className="w-12 text-center tabular-nums">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="px-4 py-2 text-lg transition-colors hover:text-gold-dark"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={handleAdd}
                disabled={!product.available}
                className="bg-ink px-10 py-3 text-sm uppercase tracking-[0.2em] text-cream transition-colors hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-40"
              >
                {!product.available ? 'Out of Stock' : added ? 'Added ✓' : 'Add to Cart'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!product.available) return
                   handleAdd()
                   navigate('/cart')
                }}
                disabled={!product.available}
                className="border border-ink px-10 py-3 text-sm uppercase tracking-[0.2em] transition-colors hover:border-gold hover:text-gold-dark disabled:cursor-not-allowed disabled:opacity-40"
              >
                Buy Now
              </button>
              <button
                type="button"
                onClick={handleSave}
                aria-pressed={isSaved(product.id)}
                className="flex items-center gap-2 border border-sand bg-white px-6 py-3 text-sm uppercase tracking-[0.2em] transition-colors hover:border-gold hover:text-gold-dark"
              >
                {isSaved(product.id) ? '♥ Saved' : '♡ Save'}
              </button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl">You may also like</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </PageTransition>
  )
}
