import { Link, useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getCategory, getProductsByCategory } from '../data/products'
import { ProductCard } from '../components/ProductCard'
import { PageTransition } from '../components/PageTransition'
import { useProducts } from '../context/useProducts'
import { useCategories } from '../context/useCategories'

export function Shop() {
  const { category } = useParams()
  const [params] = useSearchParams()
  const { products } = useProducts()
  const { categories } = useCategories()
  const query = (params.get('q') ?? '').trim()

  const active = category ? getCategory(category, categories) : undefined
  const base = category ? getProductsByCategory(category, products) : products
  const list = query
    ? base.filter((p) =>
        `${p.name} ${p.subcategory} ${p.category}`.toLowerCase().includes(query.toLowerCase()),
      )
    : base

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <nav
          aria-label="Breadcrumb"
          className="text-xs uppercase tracking-[0.3em] text-muted"
        >
          <Link to="/" className="transition-colors hover:text-gold-dark">
            Home
          </Link>{' '}
          / <span className={active ? '' : 'text-ink'}>Shop</span>
          {active ? ` / ${active.name}` : ''}
        </nav>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">
          {query ? `Search results for "${query}"` : active ? active.name : 'All Products'}
        </h1>
        {query ? (
          <p className="mt-2 text-muted">
            {list.length} product(s) found ·{' '}
            <Link to="/shop" className="text-gold-dark hover:text-gold">
              Clear search
            </Link>
          </p>
        ) : (
          active && <p className="mt-2 text-muted">{active.description}</p>
        )}

        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            to="/shop"
            aria-current={!category ? 'page' : undefined}
            className={`border px-4 py-2 text-xs uppercase tracking-[0.2em] transition-all ${
              !category
                ? 'border-gold bg-gold text-white shadow-sm'
                : 'border-sand bg-white hover:border-gold hover:text-gold-dark'
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop/${cat.id}`}
              aria-current={category === cat.id ? 'page' : undefined}
              className={`border px-4 py-2 text-xs uppercase tracking-[0.2em] transition-all ${
                category === cat.id
                  ? 'border-gold bg-gold text-white shadow-sm'
                  : 'border-sand bg-white hover:border-gold hover:text-gold-dark'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="mt-16 border border-dashed border-sand bg-white p-12 text-center">
            <p className="font-display text-xl">No products found</p>
            <p className="mt-2 text-sm text-muted">
              Try a different search or browse another category.
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-block bg-gold px-8 py-3 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-gold-dark"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <motion.div layout className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {list.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </motion.div>
        )}
      </div>
    </PageTransition>
  )
}
