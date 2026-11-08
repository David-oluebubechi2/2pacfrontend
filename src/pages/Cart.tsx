import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { formatPrice } from '../data/products'
import { productCover } from '../api'
import { ProductImage } from '../components/ProductImage'
import { PageTransition } from '../components/PageTransition'
import { useCart } from '../context/useCart'

export function Cart() {
  const { items, subtotal, updateQty, removeItem } = useCart()

  if (items.length === 0) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-6xl px-4 py-24 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-soft text-2xl text-gold-dark">
            🛍
          </div>
          <h1 className="mt-6 font-display text-3xl">Your cart is empty</h1>
          <p className="mt-3 text-muted">Find something you like in our shop.</p>
          <Link
            to="/shop"
            className="mt-8 inline-block bg-gold px-8 py-3 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-gold-dark"
          >
            Continue Shopping
          </Link>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-3xl sm:text-4xl">Your Cart</h1>

        <div className="mt-8 grid gap-10 lg:grid-cols-3 lg:items-start">
          <div className="lg:col-span-2">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={`${item.product.id}-${item.size ?? ''}`}
                  layout
                  exit={{ opacity: 0, x: -24 }}
                  className="flex gap-4 border-b border-sand py-6 transition-colors hover:bg-white/50"
                >
                  <Link
                    to={`/product/${item.product.id}`}
                    className="h-28 w-24 shrink-0 overflow-hidden border border-sand bg-white"
                  >
                    <ProductImage
                      src={productCover(item.product)}
                      alt={item.product.name}
                      className="h-full w-full"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex justify-between gap-4">
                      <div className="min-w-0">
                        <Link
                          to={`/product/${item.product.id}`}
                          className="font-display text-lg transition-colors hover:text-gold-dark"
                        >
                          {item.product.name}
                        </Link>
                        <p className="mt-1 text-sm text-muted">
                          {item.product.subcategory}
                          {item.size ? ` · Size ${item.size}` : ''}
                        </p>
                      </div>
                      <p className="font-semibold text-gold-dark">
                        {formatPrice(item.product.price * item.qty)}
                      </p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="inline-flex items-center border border-sand bg-white">
                        <button
                          type="button"
                          onClick={() => updateQty(item.product.id, item.size, item.qty - 1)}
                          aria-label="Decrease quantity"
                          className="px-3 py-1 transition-colors hover:text-gold-dark"
                        >
                          −
                        </button>
                        <span className="w-10 text-center text-sm tabular-nums">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.product.id, item.size, item.qty + 1)}
                          aria-label="Increase quantity"
                          className="px-3 py-1 transition-colors hover:text-gold-dark"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id, item.size)}
                        className="text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="h-fit border border-sand bg-white p-6 shadow-soft lg:sticky lg:top-24">
            <h2 className="font-display text-xl">Order Summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Delivery fee</span>
                <span className="text-xs">Calculated at checkout</span>
              </div>
            </div>
            <div className="mt-4 flex justify-between border-t border-sand pt-4 font-semibold">
              <span>Total</span>
              <span className="text-gold-dark">{formatPrice(subtotal)}</span>
            </div>
            <Link
              to="/checkout"
              className="mt-6 block bg-gold px-6 py-3 text-center text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-gold-dark"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/shop"
              className="mt-4 block text-center text-sm text-muted transition-colors hover:text-gold-dark"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
