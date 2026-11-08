import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '../context/useToast'

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="pointer-events-none fixed top-20 right-4 z-50 flex w-full max-w-sm flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto border border-sand bg-white p-4 shadow-lg"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm">
                {toast.variant === 'cart' ? '🛒 ' : ''}
                {toast.message}
              </p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="text-xs text-muted hover:text-ink"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
            {toast.variant === 'cart' && (
              <div className="mt-3 flex gap-2">
                <Link
                  to="/cart"
                  onClick={() => dismiss(toast.id)}
                  className="flex-1 border border-ink px-4 py-2 text-center text-xs uppercase tracking-[0.15em] hover:border-gold hover:text-gold-dark"
                >
                  View Cart
                </Link>
                <Link
                  to="/checkout"
                  onClick={() => dismiss(toast.id)}
                  className="flex-1 bg-gold px-4 py-2 text-center text-xs uppercase tracking-[0.15em] text-white hover:bg-gold-dark"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
