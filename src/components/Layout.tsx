import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/useCart'
import { useAuth } from '../context/useAuth'
import { useWishlist } from '../context/useWishlist'
import { useCategories } from '../context/useCategories'
import { Toaster } from './Toaster'

const year = new Date().getFullYear()

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const { count } = useCart()
  const { user, logout } = useAuth()
  const { count: savedCount } = useWishlist()
  const { categories } = useCategories()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [query, setQuery] = useState('')

  const closeMenu = () => setMenuOpen(false)

  const handleLogout = () => {
    logout()
    closeMenu()
    setAccountOpen(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    setMenuOpen(false)
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop')
  }

  const searchForm = (
    <form onSubmit={handleSearch} className="relative w-full">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products, brands and categories"
        aria-label="Search products"
        className="w-full border border-sand bg-white py-2.5 pr-24 pl-4 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-gold"
      />
      <button
        type="submit"
        className="absolute top-0 right-0 h-full bg-gold px-5 text-xs font-medium uppercase tracking-[0.15em] text-white transition-colors hover:bg-gold-dark"
      >
        Search
      </button>
    </form>
  )

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-cream"
      >
        Skip to content
      </a>
      <Toaster />
      <header className="sticky top-0 z-40 border-b border-sand bg-cream/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
          <Link
            to="/"
            className="shrink-0 font-display text-xl tracking-[0.25em] text-ink transition-opacity hover:opacity-80"
          >
            2PACK <span className="text-gold">CLASSIC</span>
          </Link>

          <nav className="hidden shrink-0 items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm uppercase tracking-[0.2em] transition-colors ${
                    isActive ? 'text-gold-dark' : 'text-ink hover:text-gold-dark'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden flex-1 justify-center md:flex">{searchForm}</div>

          <div className="ml-auto flex items-center gap-4 md:ml-0">
            {user ? (
              <div className="relative hidden md:block">
                <button
                  type="button"
                  onClick={() => setAccountOpen((v) => !v)}
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                  className="flex items-center gap-1 text-sm uppercase tracking-widest transition-colors hover:text-gold-dark"
                >
                  Hi, {user.name.split(' ')[0]}
                  <span
                    className={`text-[10px] transition-transform ${accountOpen ? 'rotate-180' : ''}`}
                  >
                    ▾
                  </span>
                </button>
                <AnimatePresence>
                  {accountOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setAccountOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 z-20 mt-3 w-56 border border-sand bg-white shadow-xl"
                      >
                        <div className="border-b border-sand px-4 py-3">
                          <p className="truncate text-sm font-semibold">{user.name}</p>
                          <p className="truncate text-xs text-muted">{user.email}</p>
                        </div>
                        <Link
                          to="/account"
                          onClick={() => setAccountOpen(false)}
                          className="block px-4 py-3 text-sm text-muted hover:bg-cream hover:text-gold-dark"
                        >
                          My Account
                        </Link>
                        <Link
                          to="/account"
                          onClick={() => setAccountOpen(false)}
                          className="block px-4 py-3 text-sm text-muted hover:bg-cream hover:text-gold-dark"
                        >
                          My Orders
                        </Link>
                        <Link
                          to="/saved"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center justify-between px-4 py-3 text-sm text-muted hover:bg-cream hover:text-gold-dark"
                        >
                          Saved Items
                          {savedCount > 0 && (
                            <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-white">
                              {savedCount}
                            </span>
                          )}
                        </Link>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="block w-full border-t border-sand px-4 py-3 text-left text-sm text-muted hover:bg-cream hover:text-gold-dark"
                        >
                          Log Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden items-center gap-4 md:flex">
                <Link
                  to="/login"
                  className="text-sm uppercase tracking-widest transition-colors hover:text-gold-dark"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="border border-ink px-4 py-1.5 text-sm uppercase tracking-widest transition-colors hover:border-gold hover:bg-gold hover:text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <Link
              to="/saved"
              className="relative hidden text-sm uppercase tracking-widest transition-colors hover:text-gold-dark md:inline"
            >
              Saved
              {savedCount > 0 && (
                <span className="absolute -top-2 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-white">
                  {savedCount}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative text-sm uppercase tracking-widest transition-colors hover:text-gold-dark"
            >
              Cart
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-white"
                >
                  {count}
                </motion.span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="text-sm uppercase tracking-widest transition-colors hover:text-gold-dark lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>

        <div className="border-t border-sand px-4 py-3 sm:px-6 md:hidden">{searchForm}</div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-sand lg:hidden"
            >
              <div className="flex flex-col gap-4 px-4 py-4">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={closeMenu}
                    className="text-sm uppercase tracking-[0.2em]"
                  >
                    {link.label}
                  </NavLink>
                ))}
                <div className="border-t border-sand pt-4">
                  {user ? (
                    <>
                      <Link
                        to="/account"
                        onClick={closeMenu}
                        className="block py-1 text-sm text-muted hover:text-gold-dark"
                      >
                        My Account
                      </Link>
                      <Link
                        to="/account"
                        onClick={closeMenu}
                        className="block py-1 text-sm text-muted hover:text-gold-dark"
                      >
                        My Orders
                      </Link>
                      <Link
                        to="/saved"
                        onClick={closeMenu}
                        className="block py-1 text-sm text-muted hover:text-gold-dark"
                      >
                        Saved Items ({savedCount})
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="py-1 text-sm text-muted hover:text-gold-dark"
                      >
                        Log Out
                      </button>
                    </>
                  ) : (
                    <div className="flex gap-4">
                      <Link
                        to="/login"
                        onClick={closeMenu}
                        className="py-1 text-sm text-muted hover:text-gold-dark"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        onClick={closeMenu}
                        className="py-1 text-sm text-muted hover:text-gold-dark"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
                <div className="border-t border-sand pt-4">
                  <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted">Categories</p>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/shop/${cat.id}`}
                      onClick={closeMenu}
                      className="block py-1 text-sm text-muted hover:text-gold-dark"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="border-t border-sand bg-ink text-cream">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div>
            <p className="font-display text-lg tracking-[0.25em]">
              2PACK <span className="text-gold">CLASSIC</span>
            </p>
            <p className="mt-3 text-sm text-cream/70">
              Quality fashion for men and women — bags, shoes, suits, shirts and more.
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold">Shop</p>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1">
              {categories.slice(0, 8).map((cat) => (
                <Link
                  key={cat.id}
                  to={`/shop/${cat.id}`}
                  className="text-sm text-cream/70 transition-colors hover:text-gold"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold">Contact</p>
            <p className="mt-3 flex items-start gap-2 text-sm text-cream/70">
              <svg
                viewBox="0 0 24 24"
                className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
              </svg>
              <span>Phone: +234 703 7354 455, +234 703 1665 330</span>
            </p>
            <p className="mt-1 flex items-start gap-2 text-sm text-cream/70">
              <svg
                viewBox="0 0 24 24"
                className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
              <span>WhatsApp: +234 703 7354 455, +234 703 1665 330</span>
            </p>
          </div>
        </div>
        <div className="border-t border-cream/10 py-4 text-center text-xs text-cream/50">
          © {year} 2Pack Classic Boutique. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
