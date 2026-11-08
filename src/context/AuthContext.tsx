import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from './auth'
import type { SessionUser } from './auth'
import { api, getToken, setToken } from '../api'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const restore = async () => {
      if (!getToken()) {
        if (active) setLoading(false)
        return
      }
      try {
        const u = await api.me()
        if (active) setUser(u)
      } catch {
        setToken(null)
      } finally {
        if (active) setLoading(false)
      }
    }
    void restore()
    return () => {
      active = false
    }
  }, [])

  const signup = async (name: string, email: string, password: string) => {
    try {
      const res = await api.signup(name, email, password)
      if (!res.ok || !res.token || !res.user) {
        return { ok: false, error: res.error ?? 'Signup failed.' }
      }
      setToken(res.token)
      setUser(res.user)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : 'Signup failed.' }
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const res = await api.login(email, password)
      if (!res.ok || !res.token || !res.user) {
        return { ok: false, error: res.error ?? 'Login failed.' }
      }
      setToken(res.token)
      setUser(res.user)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : 'Login failed.' }
    }
  }

  const logout = async () => {
    try {
      await api.logout()
    } catch {
      // ignore network errors on logout
    }
    setToken(null)
    setUser(null)
  }

  const requestReset = async (email: string) => {
    try {
      const res = await api.requestReset(email)
      if (!res.ok) return { ok: false, error: res.error ?? 'Could not start the reset.' }
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : 'Could not start the reset.' }
    }
  }

  const resetPassword = async (email: string, code: string, password: string) => {
    try {
      const res = await api.resetPassword(email, code, password)
      if (!res.ok) return { ok: false, error: res.error ?? 'Reset failed.' }
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : 'Reset failed.' }
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, signup, login, logout, requestReset, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  )
}
