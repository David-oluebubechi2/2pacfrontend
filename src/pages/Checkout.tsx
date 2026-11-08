import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatPrice } from '../data/products'
import { allStates, getZoneByState, paymentMethods } from '../data/delivery'
import { api } from '../api'
import { PageTransition } from '../components/PageTransition'
import { useCart } from '../context/useCart'
import { useAuth } from '../context/useAuth'
import { useOrders } from '../context/useOrders'

type FormState = {
  name: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  notes: string
}

const initialForm: FormState = {
  name: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  state: '',
  notes: '',
}

export function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const { placeOrder } = useOrders()
  const navigate = useNavigate()

  const [form, setForm] = useState<FormState>(() =>
    user ? { ...initialForm, name: user.name, email: user.email } : initialForm,
  )
  const [methodId, setMethodId] = useState(paymentMethods[0].id)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [placedTotal, setPlacedTotal] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const zone = form.state ? getZoneByState(form.state) : undefined
  const method = paymentMethods.find((m) => m.id === methodId)!
  const total = subtotal + (zone?.fee ?? 0)

  const setField = (field: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const created = await placeOrder({
        items: items.map((i) => ({
          name: i.product.name,
          size: i.size,
          qty: i.qty,
          price: i.product.price,
        })),
        subtotal,
        deliveryFee: zone?.fee ?? 0,
        total,
        paymentMethod: method.name,
        recipientName: form.name,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        notes: form.notes,
      })
      if (method.id === 'card') {
        const payment = await api.initializePayment(
          created.number,
          `${window.location.origin}/payment/callback`,
        )
        clearCart()
        window.location.assign(payment.authorizationUrl)
        return
      }

      setPlacedTotal(total)
      setOrderNumber(created.number)
      clearCart()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not place your order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (orderNumber) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold text-3xl text-white shadow-lift"
          >
            ✓
          </motion.div>
          <h1 className="mt-8 font-display text-3xl">Order Placed!</h1>
          <p className="mt-3 text-muted">
            Your order number is <span className="font-semibold text-ink">{orderNumber}</span>
          </p>
          <p className="mt-4 text-sm text-muted">
            {method.id === 'transfer' && (
              <>
                Please transfer {formatPrice(placedTotal)} to our bank account. Our account details
                have been sent to your email/WhatsApp. Contact us to confirm your payment.
              </>
            )}
            {method.id === 'card' && (
              <>
                A secure payment link for {formatPrice(placedTotal)} will be sent to you shortly.
                Your order ships once payment is confirmed.
              </>
            )}
          </p>
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="mt-10 bg-gold px-8 py-3 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-gold-dark"
          >
            Continue Shopping
          </button>
          <Link
            to="/account"
            className="mt-4 inline-block text-sm uppercase tracking-[0.2em] text-gold-dark transition-colors hover:text-gold"
          >
            View My Orders →
          </Link>
        </div>
      </PageTransition>
    )
  }

  if (items.length === 0) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-6xl px-4 py-24 text-center">
          <h1 className="font-display text-3xl">Your cart is empty</h1>
          <Link
            to="/shop"
            className="mt-6 inline-block bg-gold px-8 py-3 text-sm uppercase tracking-[0.2em] text-white hover:bg-gold-dark"
          >
            Go to Shop
          </Link>
        </div>
      </PageTransition>
    )
  }

  const inputClass =
    'w-full border border-sand bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-gold'
  const labelClass = 'text-xs uppercase tracking-[0.2em] text-muted'

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-3xl sm:text-4xl">Checkout</h1>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-10 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            <section>
              <h2 className="font-display text-xl">1. Contact & Delivery Details</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    required
                    className={`${inputClass} mt-2`}
                    value={form.name}
                    onChange={(e) => setField('name', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    required
                    type="tel"
                    className={`${inputClass} mt-2`}
                    value={form.phone}
                    onChange={(e) => setField('phone', e.target.value)}
                    placeholder="08012345678"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass} htmlFor="email">Email</label>
                  <input
                    id="email"
                    required
                    type="email"
                    readOnly={!!user}
                    className={`${inputClass} mt-2 ${user ? 'bg-sand/50 text-muted' : ''}`}
                    value={form.email}
                    onChange={(e) => setField('email', e.target.value)}
                    placeholder="you@example.com"
                  />
                  {user && (
                    <p className="mt-1 text-xs text-muted">Locked to your account email</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass} htmlFor="address">Delivery Address</label>
                  <input
                    id="address"
                    required
                    className={`${inputClass} mt-2`}
                    value={form.address}
                    onChange={(e) => setField('address', e.target.value)}
                    placeholder="Street, area, landmark"
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="city">City / Town</label>
                  <input
                    id="city"
                    required
                    className={`${inputClass} mt-2`}
                    value={form.city}
                    onChange={(e) => setField('city', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="state">State</label>
                  <select
                    id="state"
                    required
                    className={`${inputClass} mt-2`}
                    value={form.state}
                    onChange={(e) => setField('state', e.target.value)}
                  >
                    <option value="" disabled>
                      Select your state
                    </option>
                    {allStates.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass} htmlFor="notes">Order Notes (optional)</label>
                  <textarea
                    id="notes"
                    rows={3}
                    className={`${inputClass} mt-2`}
                    value={form.notes}
                    onChange={(e) => setField('notes', e.target.value)}
                    placeholder="Any special instructions for delivery"
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl">2. Payment Method</h2>
              <div className="mt-4 grid gap-3">
                {paymentMethods.map((m) => (
                  <label
                    key={m.id}
                    className={`flex cursor-pointer items-start gap-4 border p-4 transition-colors ${
                      methodId === m.id
                        ? 'border-gold bg-gold-soft/50'
                        : 'border-sand bg-white hover:border-gold/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      className="mt-1 h-4 w-4 accent-gold"
                      checked={methodId === m.id}
                      onChange={() => setMethodId(m.id)}
                    />
                    <span>
                      <span className="block font-semibold">{m.name}</span>
                      <span className="mt-1 block text-sm text-muted">{m.description}</span>
                    </span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          <div className="h-fit border border-sand bg-white p-6 shadow-soft lg:sticky lg:top-24">
            <h2 className="font-display text-xl">Order Summary</h2>
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.size ?? ''}`}
                  className="flex justify-between gap-3 text-sm"
                >
                  <span className="text-muted">
                    {item.product.name}
                    {item.size ? ` (${item.size})` : ''} × {item.qty}
                  </span>
                  <span>{formatPrice(item.product.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 border-t border-sand pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">
                  Delivery{zone ? ` (${zone.name})` : ''}
                </span>
                <span>{zone ? formatPrice(zone.fee) : 'Select your state'}</span>
              </div>
            </div>
            <div className="mt-4 flex justify-between border-t border-sand pt-4 font-semibold">
              <span>Total</span>
              <span className="text-gold-dark">{formatPrice(total)}</span>
            </div>
            {error && (
              <p
                role="alert"
                className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={!zone || submitting}
              className="mt-6 w-full bg-gold px-6 py-3 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting
                ? method.id === 'card'
                  ? 'Redirecting to payment…'
                  : 'Placing order…'
                : `Place Order — ${formatPrice(total)}`}
            </button>
            <p className="mt-3 text-center text-xs text-muted">
              Paying via: {method.name}
            </p>
          </div>
        </form>
      </div>
    </PageTransition>
  )
}
