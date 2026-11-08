import { createContext } from 'react'

export type ToastVariant = 'cart' | 'info'

export type ToastItem = {
  id: number
  message: string
  variant: ToastVariant
}

export type ToastContextValue = {
  toasts: ToastItem[]
  notify: (message: string, variant?: ToastVariant) => void
  dismiss: (id: number) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
