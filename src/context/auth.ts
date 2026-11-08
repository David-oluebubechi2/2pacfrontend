import { createContext } from 'react'
import type { ApiUser } from '../api'

export type SessionUser = ApiUser

export type AuthResult = {
  ok: boolean
  error?: string
}

export type AuthContextValue = {
  user: SessionUser | null
  loading: boolean
  signup: (name: string, email: string, password: string) => Promise<AuthResult>
  login: (email: string, password: string) => Promise<AuthResult>
  logout: () => Promise<void>
  requestReset: (email: string) => Promise<AuthResult>
  resetPassword: (email: string, code: string, password: string) => Promise<AuthResult>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
