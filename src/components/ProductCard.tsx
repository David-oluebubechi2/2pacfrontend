import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Product } from '../data/products'
import { formatPrice } from '../data/products'
import { productCover } from '../api'
import { ProductImage } from './ProductImage'
import { useCart } from '../context/useCart'
import { useAuth } from '../context/useAuth'
import { useToast } from '../context/useToast'
import { useWishlist } from '../context/useWishlist'

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { user } = useAuth()
  const { notify } = useToast()
  const { isSaved, toggle } = useWishlist()

  const saved = isSaved(product.id)

  const requireLogin = () =>
    navigate('/login', { state: { from: `/product/${product.id}` } })

  const handleAdd = () => {
    if (!product.available) return
    addItem(product, 1, product.sizes?.[0])
    notify(`${product.name} added to your cart`, 'cart')
  }

  const handleSave = () => {
    if (!user) {
      requireLogin()
      return
    }
    toggle(product.id)
    notify(saved ? `${product.name} removed from saved items` : `${product.name} saved for later`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.4), ease: 'easeOut' }}
      className="group flex flex-col border border-sand bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-soft"
    >
      <div className="relative">
        <Link to={`/product/${product.id}`} className="block overflow-hidden bg-sand">
          <div className="aspect-[4/5] overflow-hidden">
            <ProductImage
              src={productCover(product)}
              alt={product.name}
              className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${
                product.available ? '' : 'opacity-60 grayscale'
              }`}
            />
          </div>
        </Link>
        {!product.available && (
          <span className="absolute top-3 left-3 bg-ink px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-cream">
            Out of Stock
          </span>
        )}
        <button
          type="button"
          onClick={handleSave}
          aria-label={saved ? 'Remove from saved items' : 'Save item'}
          aria-pressed={saved}
          className={`absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border text-lg shadow-sm backdrop-blur transition-all hover:scale-105 ${
            saved
              ? 'border-gold bg-white text-gold'
              : 'border-transparent bg-white/85 text-muted hover:text-gold'
          }`}
        >
          {saved ? '♥' : '♡'}
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4 text-left">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted">{product.subcategory}</p>
        <Link to={`/product/${product.id}`} className="mt-1">
          <h3 className="font-display text-lg leading-snug transition-colors hover:text-gold-dark">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 text-sm font-semibold text-gold-dark">{formatPrice(product.price)}</p>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!product.available}
          className="mt-4 w-full bg-ink px-4 py-2.5 text-xs uppercase tracking-[0.2em] text-cream transition-colors hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          {product.available ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </motion.div>
  )
}
