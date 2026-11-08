import { Fragment, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { useOrders } from '../context/useOrders'
import { formatPrice } from '../data/products'
import { api } from '../api'
import { formatOrderDate } from '../utils/order'
import { PageTransition } from '../components/PageTransition'

const ORDER_STEPS = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered']

function OrderTracker({ status }: { status: string }) {
  const current = Math.max(0, ORDER_STEPS.indexOf(status))

  return (
    <div className="mt-5">
      <div className="flex items-center">
        {ORDER_STEPS.map((step, i) => (
          <Fragment key={step}>
            <div
              className={`h-4 w-4 shrink-0 rounded-full border-2 ${
                i <= current ? 'border-gold bg-gold' : 'border-sand bg-white'
              }`}
            />
            {i < ORDER_STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 ${i < current ? 'bg-gold' : 'bg-sand'}`} />
            )}
          </Fragment>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.15em]">
        {ORDER_STEPS.map((step, i) => (
          <span key={step} className={i <= current ? 'text-gold-dark' : 'text-muted'}>
            {step}
          </span>
        ))}
      </div>
    </div>
  )
}

export function Account() {
  const { user, logout } = useAuth()
  const { orders, loading } = useOrders()
  const navigate = useNavigate()
  const [paying, setPaying] = useState<string | null>(null)
  const [payError, setPayError] = useState('')

  if (!user) return null

  const myOrders = orders.filter((o) => o.email === user.email)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handlePay = async (orderNumber: string) => {
    setPayError('')
    setPaying(orderNumber)
    try {
      const payment = await api.initializePayment(
        orderNumber,
        `${window.location.origin}/payment/callback`,
      )
      window.location.assign(payment.authorizationUrl)
    } catch (err) {
      setPayError(err instanceof Error ? err.message : 'Could not start payment.')
      setPaying(null)
    }
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">My Account</p>
            <h1 className="mt-1 font-display text-3xl">{user.name}</h1>
            <p className="mt-1 text-sm text-muted">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="border border-ink px-6 py-2.5 text-xs uppercase tracking-[0.2em] transition-colors hover:border-gold hover:bg-gold hover:text-white"
          >
            Log Out
          </button>
        </div>

        <section className="mt-12">
          <h2 className="font-display text-2xl">Order History</h2>
          {payError && (
            <p
              role="alert"
              className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {payError}
            </p>
          )}
          {loading ? (
            <div className="mt-6 border border-sand bg-white p-10 text-center text-muted">
              Loading your orders…
            </div>
          ) : myOrders.length === 0 ? (
            <div className="mt-6 border border-dashed border-sand bg-white p-10 text-center">
              <p className="text-muted">You haven’t placed any orders yet.</p>
              <Link
                to="/shop"
                className="mt-6 inline-block bg-gold px-8 py-3 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-gold-dark"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {myOrders.map((order) => (
                <div
                  key={order.number}
                  className="border border-sand bg-white p-6 transition-shadow hover:shadow-soft"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-lg">{order.number}</p>
                      <p className="mt-1 text-xs text-muted">
                        {formatOrderDate(order.createdAt)}
                      </p>
                    </div>
                    <span className="bg-gold-soft px-3 py-1 text-xs uppercase tracking-[0.2em] text-gold-dark">
                      {order.status}
                    </span>
                    <span
                      className={`px-3 py-1 text-xs uppercase tracking-[0.2em] ${
                        order.paymentStatus === 'paid'
                          ? 'bg-gold-soft text-gold-dark'
                          : 'bg-ink text-cream'
                      }`}
                    >
                      {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                    </span>
                  </div>
                  <div className="mt-4 space-y-1 border-t border-sand pt-4 text-sm">
                    {order.items.map((item, i) => (
                      <p key={i} className="text-muted">
                        {item.name}
                        {item.size ? ` (${item.size})` : ''} × {item.qty} —{' '}
                        {formatPrice(item.price * item.qty)}
                      </p>
                    ))}
                  </div>
                  <OrderTracker status={order.status} />
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-sand pt-4 text-sm">
                    <span className="text-muted">
                      Delivering to: {order.city}, {order.state} · Paid via {order.paymentMethod}
                    </span>
                    <div className="flex items-center gap-4">
                      {order.paymentStatus !== 'paid' &&
                        order.paymentMethod === 'Card Payment' && (
                          <button
                            type="button"
                            disabled={paying === order.number}
                            onClick={() => handlePay(order.number)}
                            className="bg-gold px-5 py-2 text-xs uppercase tracking-[0.2em] text-white transition-colors hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {paying === order.number ? 'Starting…' : 'Pay Now'}
                          </button>
                        )}
                      <span className="font-semibold text-gold-dark">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </PageTransition>
  )
}
