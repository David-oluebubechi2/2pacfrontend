import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ProductCard } from '../components/ProductCard'
import { PageTransition } from '../components/PageTransition'
import { useProducts } from '../context/useProducts'
import { useCategories } from '../context/useCategories'

export function Home() {
  const { products } = useProducts()
  const { categories } = useCategories()
  const featured = products.filter((p) => p.featured && p.available)

  return (
    <PageTransition>
      <section className="relative overflow-hidden bg-ink text-cream">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(124,77,171,0.28),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 md:grid-cols-2 md:py-28">
          <div className="flex flex-col items-start gap-6">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xs uppercase tracking-[0.4em] text-gold"
            >
              Style. Quality. Confidence.
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl leading-tight sm:text-5xl md:text-6xl"
            >
              Dress sharp with <span className="text-gold">2Pack Classic Boutique</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-xl text-cream/70"
            >
              Bags, shoes, suits, shirts, trousers and more — everything you need for a complete
              wardrobe, all in one place.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-4 flex gap-4"
            >
              <Link
                to="/shop"
                className="bg-gold px-8 py-3 text-sm uppercase tracking-[0.2em] text-white shadow-[0_18px_40px_-20px_rgba(124,77,171,0.9)] transition-colors hover:bg-gold-dark"
              >
                Shop Now
              </Link>
              <Link
                to="/shop/suits"
                className="border border-cream/30 px-8 py-3 text-sm uppercase tracking-[0.2em] transition-colors hover:border-gold hover:text-gold"
              >
                Suits & Blazers
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex flex-col items-center justify-center gap-8"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(124,77,171,0.22),transparent_65%)]" />
            <div className="pointer-events-none absolute h-64 w-64 rounded-full border border-cream/10 sm:h-80 sm:w-80" />
            <motion.img
              src="/2pack-logo.png"
              alt="2Pack Classic Boutique Logo"
              width={840}
              height={644}
              className="relative max-h-[480px] w-auto max-w-full object-contain drop-shadow-[0_0_40px_rgba(124,77,171,0.35)]"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <p className="relative text-[10px] uppercase tracking-[0.45em] text-gold">
              2Pack Classic Boutique
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl sm:text-3xl">Shop by Category</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
            >
              <Link
                to={`/shop/${cat.id}`}
                className="group flex h-full flex-col border border-sand bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:shadow-soft"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg transition-colors group-hover:text-gold-dark">
                    {cat.name}
                  </h3>
                  <span className="text-gold opacity-0 transition-opacity group-hover:opacity-100">
                    →
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted">{cat.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl sm:text-3xl">Featured Pieces</h2>
          <Link to="/shop" className="text-sm uppercase tracking-[0.2em] text-gold-dark hover:text-gold">
            View all →
          </Link>
        </div>
        {featured.length === 0 ? (
          <div className="mt-8 border border-dashed border-sand bg-white p-12 text-center text-muted">
            Featured pieces are being curated. Check the full shop in the meantime.
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </section>
    </PageTransition>
  )
}
