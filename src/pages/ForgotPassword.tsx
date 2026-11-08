import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { PageTransition } from '../components/PageTransition'
import { PasswordInput } from '../components/PasswordInput'

type Step = 'email' | 'reset' | 'done'

export function ForgotPassword() {
  const { requestReset, resetPassword } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  const inputClass =
    'w-full border border-sand bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-gold'
  const labelClass = 'text-xs uppercase tracking-[0.2em] text-muted'

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await requestReset(email)
    if (!result.ok) {
      setError(result.error ?? 'Could not start the reset.')
      return
    }
    setError('')
    setStep('reset')
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    const result = await resetPassword(email, code, password)
    if (!result.ok) {
      setError(result.error ?? 'Reset failed.')
      return
    }
    setError('')
    setStep('done')
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <p className="text-center text-[10px] uppercase tracking-[0.4em] text-gold">
          2Pack Classic Boutique
        </p>
        <h1 className="mt-3 text-center font-display text-3xl">Reset Password</h1>

        {step === 'email' && (
          <>
            <p className="mt-2 text-center text-sm text-muted">
              Enter the email on your account and we'll send you a reset code.
            </p>
            <form
              onSubmit={handleRequest}
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
              <button
                type="submit"
                className="mt-8 w-full bg-gold px-6 py-3 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-gold-dark"
              >
                Send Reset Code
              </button>
              <p className="mt-6 text-center text-sm text-muted">
                Remembered it?{' '}
                <Link to="/login" className="font-semibold text-gold-dark hover:text-gold">
                  Log in
                </Link>
              </p>
            </form>
          </>
        )}

        {step === 'reset' && (
          <>
            <p className="mt-2 text-center text-sm text-muted">
              We sent a 6-digit code to <span className="font-semibold text-ink">{email}</span>. It
              expires in 15 minutes.
            </p>
            <form
              onSubmit={handleReset}
              className="mt-8 border border-sand bg-white p-6 shadow-soft sm:p-8"
            >
              {error && (
                <p
                  role="alert"
                  className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </p>
              )}
              <label className={labelClass} htmlFor="code">Reset Code</label>
              <input
                id="code"
                required
                inputMode="numeric"
                className={`${inputClass} mt-2`}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
              />
              <div className="mt-4">
                <label className={labelClass} htmlFor="password">New Password</label>
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
                <label className={labelClass} htmlFor="confirm">Confirm New Password</label>
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
                Reset Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep('email')
                  setError('')
                }}
                className="mt-4 w-full text-center text-sm text-muted hover:text-gold-dark"
              >
                Use a different email
              </button>
            </form>
          </>
        )}

        {step === 'done' && (
          <div className="mt-10 border border-sand bg-white p-8 text-center shadow-soft">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold text-2xl text-white shadow-lift">
              ✓
            </div>
            <p className="mt-6 font-display text-xl">Password updated</p>
            <p className="mt-2 text-sm text-muted">
              Your password has been reset. You can now log in with your new password.
            </p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="mt-8 bg-gold px-8 py-3 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-gold-dark"
            >
              Log In
            </button>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
