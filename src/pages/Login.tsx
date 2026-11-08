import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { PageTransition } from '../components/PageTransition'
import { PasswordInput } from '../components/PasswordInput'

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const result = await login(email, password)
    if (!result.ok) {
      setError(result.error ?? 'Login failed.')
      return
    }
    navigate(from, { replace: true })
  }

  const inputClass =
    'w-full border border-sand bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-gold'
  const labelClass = 'text-xs uppercase tracking-[0.2em] text-muted'

  return (
    <PageTransition>
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <p className="text-center text-[10px] uppercase tracking-[0.4em] text-gold">
          2Pack Classic Boutique
        </p>
        <h1 className="mt-3 text-center font-display text-3xl">Welcome Back</h1>
        <p className="mt-2 text-center text-sm text-muted">
          Log in to complete your order and track deliveries.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 border border-sand bg-white p-6 shadow-soft sm:p-8"
        >
          {error && (
            <p
              role="alert"
              className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}
          <div>
            <label className={labelClass} htmlFor="email">Email</label>
            <input
              id="email"
              required
              type="email"
              autoComplete="email"
              className={`${inputClass} mt-2`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <label className={labelClass} htmlFor="password">Password</label>
              <Link
                to="/forgot-password"
                className="text-xs uppercase tracking-[0.15em] text-gold-dark transition-colors hover:text-gold"
              >
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              required
              autoComplete="current-password"
              className={`${inputClass} mt-2`}
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="mt-8 w-full bg-gold px-6 py-3 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-gold-dark"
          >
            Log In
          </button>
          <p className="mt-6 text-center text-sm text-muted">
            New to 2Pack Classic?{' '}
            <Link
              to="/signup"
              state={location.state}
              className="font-semibold text-gold-dark hover:text-gold"
            >
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </PageTransition>
  )
}
