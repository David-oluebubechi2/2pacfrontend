import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { PageTransition } from '../components/PageTransition'
import { PasswordInput } from '../components/PasswordInput'

export function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setError('')
    const result = await signup(name, email, password)
    if (!result.ok) {
      setError(result.error ?? 'Signup failed.')
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
        <h1 className="mt-3 text-center font-display text-3xl">Create Account</h1>
        <p className="mt-2 text-center text-sm text-muted">
          Sign up to shop faster, track orders and save your details.
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
            <label className={labelClass} htmlFor="name">Full Name</label>
            <input
              id="name"
              required
              autoComplete="name"
              className={`${inputClass} mt-2`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div className="mt-4">
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
            <label className={labelClass} htmlFor="password">Password</label>
            <PasswordInput
              id="password"
              required
              autoComplete="new-password"
              className={`${inputClass} mt-2`}
              value={password}
              onChange={setPassword}
              placeholder="At least 6 characters"
            />
          </div>
          <div className="mt-4">
            <label className={labelClass} htmlFor="confirm">Confirm Password</label>
            <PasswordInput
              id="confirm"
              required
              autoComplete="new-password"
              className={`${inputClass} mt-2`}
              value={confirm}
              onChange={setConfirm}
              placeholder="Repeat password"
            />
          </div>
          <button
            type="submit"
            className="mt-8 w-full bg-gold px-6 py-3 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-gold-dark"
          >
            Sign Up
          </button>
          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{' '}
            <Link
              to="/login"
              state={location.state}
              className="font-semibold text-gold-dark hover:text-gold"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </PageTransition>
  )
}
