import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageTransition } from '../components/PageTransition'
import { useOrders } from '../context/useOrders'
import { api } from '../api'

type Status = 'loading' | 'success' | 'failed'

export function PaymentCallback() {
  const [params] = useSearchParams()
  const reference = params.get('reference') || params.get('trxref') || ''
  const { refresh } = useOrders()
  const [status, setStatus] = useState<Status>(() =>
    reference ? 'loading' : 'failed',
  )
  const [message, setMessage] = useState(() =>
    reference ? '' : 'No payment reference was provided.',
  )
  const [orderNumber, setOrderNumber] = useState('')
  const started = useRef(false)

  useEffect(() => {
    if (started.current || !reference) return
    started.current = true

    api
      .verifyPayment(reference)
      .then(async (result) => {
        setOrderNumber(result.orderNumber)
        await refresh()
        if (result.ok) {
          setStatus('success')
        } else {
          setStatus('failed')
          setMessage('Your payment was not completed. You can try again from your account.')
        }
      })
      .catch((err) => {
        setStatus('failed')
        setMessage(err instanceof Error ? err.message : 'We could not verify your payment.')
      })
  }, [reference, refresh])

  return (
    <PageTransition>
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        {status === 'loading' && (
          <>
            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-sand border-t-gold" />
            <h1 className="mt-8 font-display text-3xl">Verifying payment…</h1>
            <p className="mt-3 text-muted">Please wait while we confirm your transaction.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold text-3xl text-white shadow-lift"
            >
              ✓
            </motion.div>
            <h1 className="mt-8 font-display text-3xl">Payment Successful</h1>
            <p className="mt-3 text-muted">
              Thank you! Your payment has been received
              {orderNumber ? (
                <>
                  {' '}
                  for order <span className="font-semibold text-ink">{orderNumber}</span>
                </>
              ) : null}
              .
            </p>
            <p className="mt-2 text-sm text-muted">
              We've emailed you a confirmation and will notify you once your order ships.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                to="/account"
                className="bg-gold px-8 py-3 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-gold-dark"
              >
                View My Orders
              </Link>
              <Link
                to="/shop"
                className="border border-ink px-8 py-3 text-sm uppercase tracking-[0.2em] transition-colors hover:border-gold hover:bg-gold hover:text-white"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-red-300 bg-red-50 text-3xl text-red-600">
              !
            </div>
            <h1 className="mt-8 font-display text-3xl">Payment Not Completed</h1>
            <p className="mt-3 text-muted">{message}</p>
            <p className="mt-2 text-sm text-muted">
              If you were charged, contact us on WhatsApp (+234 703 7354 455) with your order
              number and we'll resolve it right away.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                to="/account"
                className="bg-gold px-8 py-3 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-gold-dark"
              >
                Try Again From My Orders
              </Link>
              <Link
                to="/shop"
                className="border border-ink px-8 py-3 text-sm uppercase tracking-[0.2em] transition-colors hover:border-gold hover:bg-gold hover:text-white"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </PageTransition>
  )
}
