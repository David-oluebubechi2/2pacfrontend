export type ApiUser = {
  id: string
  name: string
  email: string
  role: 'admin' | 'customer'
}

export type ApiCategory = {
  id: string
  name: string
  description: string
}

export type ApiProduct = {
  id: string
  name: string
  category: string
  subcategory: string
  price: number
  image: string
  images: string[]
  sizes: string[]
  featured: boolean
  available: boolean
  description: string
}

export type AuthResponse = {
  ok: boolean
  error?: string
  token?: string
  user?: ApiUser
}

export type ApiOrderItem = {
  name: string
  size?: string
  qty: number
  price: number
}

export type ApiOrder = {
  number: string
  email: string
  items: ApiOrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  paymentMethod: string
  paymentStatus: string
  recipientName: string
  phone: string
  address: string
  city: string
  state: string
  notes: string
  status: string
  createdAt: string
}

export type NewOrderInput = Omit<
  ApiOrder,
  'number' | 'email' | 'status' | 'paymentStatus' | 'createdAt'
>

export type PaymentInit = {
  authorizationUrl: string
  accessCode: string
  reference: string
}

export type PaymentVerify = {
  ok: boolean
  paymentStatus: string
  orderNumber: string
}

const TOKEN_KEY = 'pc_token'

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

// Same-origin '/api' works behind a reverse proxy (nginx/vercel rewrite).
// For a separate API host, set VITE_API_URL (e.g. "https://api.example.com").
const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')

export function resolveImageUrl(src: string): string {
  if (src.startsWith('/uploads')) return `${API_BASE.replace(/\/api$/, '')}${src}`
  return src
}

export function productCover(product: Pick<ApiProduct, 'image' | 'images'>): string {
  return resolveImageUrl(product.images?.[0] || product.image)
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const message =
      data && typeof data.message === 'string' ? data.message : 'Something went wrong.'
    throw new Error(message)
  }
  return data as T
}

export const api = {
  signup: (name: string, email: string, password: string) =>
    request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () => request<{ ok: boolean }>('/auth/logout', { method: 'POST' }),

  me: () => request<ApiUser>('/auth/me'),

  requestReset: (email: string) =>
    request<AuthResponse>('/auth/request-reset', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (email: string, code: string, password: string) =>
    request<AuthResponse>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, code, password }),
    }),

  listProducts: () => request<ApiProduct[]>('/products'),

  listCategories: () => request<ApiCategory[]>('/categories'),

  listOrders: () => request<ApiOrder[]>('/orders'),

  createOrder: (order: NewOrderInput) =>
    request<ApiOrder>('/orders', { method: 'POST', body: JSON.stringify(order) }),

  initializePayment: (orderNumber: string, callbackUrl: string) =>
    request<PaymentInit>('/payments/initialize', {
      method: 'POST',
      body: JSON.stringify({ orderNumber, callbackUrl }),
    }),

  verifyPayment: (reference: string) =>
    request<PaymentVerify>(`/payments/verify/${encodeURIComponent(reference)}`),

  getWishlist: () => request<string[]>('/wishlist'),

  setWishlist: (productIds: string[]) =>
    request<string[]>('/wishlist', { method: 'PUT', body: JSON.stringify({ productIds }) }),
}
