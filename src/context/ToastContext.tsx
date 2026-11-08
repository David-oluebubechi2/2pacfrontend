import { useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ToastContext } from './toast'
import type { ToastItem, ToastVariant } from './toast'

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(1)

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id))

  const value = useMemo(
    () => ({
      toasts,
      dismiss,
      notify: (message: string, variant: ToastVariant = 'info') => {
        const id = nextId.current++
        setToasts((prev) => [...prev, { id, message, variant }])
        setTimeout(() => dismiss(id), 4000)
      },
    }),
    [toasts],
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}
