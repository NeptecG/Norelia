'use client'

import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { motion } from 'motion/react'
import { useRouter } from '@/navigation'
import { useCartStore } from '@/stores/cart-store'
import { useCheckoutStore } from '@/stores/checkout-store'
import type { PaymentMethod } from '@/stores/checkout-store'
import { useUIStore } from '@/stores/ui-store'
import { getCartSubtotal } from '@/lib/utils'
import { FREE_SHIPPING_THRESHOLD, HOME_DELIVERY_COST, COD_FEE } from '@/lib/constants'
import { useMounted } from '@/hooks/use-mounted'
import { useEstimatedDeliveryDate } from '@/hooks/use-estimated-delivery'
import { useSectionMotion } from '@/components/checkout/checkout-motion'
import { StepIndicator } from '@/components/checkout/step-indicator'
import { OptionCard } from '@/components/checkout/option-card'
import { CheckoutSummary } from '@/components/checkout/checkout-summary'
import { CheckoutEmpty } from '@/components/checkout/checkout-empty'
import { PaymentMark } from '@/components/checkout/payment-marks'
import { BackLink } from '@/components/checkout/back-link'

interface PaymentFields {
  paymentMethod: PaymentMethod
}

interface MethodDef {
  id:    PaymentMethod
  title: string
  desc:  string
  price?: ReactNode
}

export default function CheckoutPaymentPage() {
  const t        = useTranslations('CheckoutPayment')
  const router   = useRouter()
  const mounted  = useMounted()
  const sectionMotion = useSectionMotion()
  const deliveryDate  = useEstimatedDeliveryDate()
  const { cartLines } = useCartStore()
  const { gift, setGift, deliveryMethod, shippingCost: storedShipping, setPaymentMethod } = useCheckoutStore()
  const { setShowCheckoutModal } = useUIStore()

  const { register, handleSubmit, control } = useForm<PaymentFields>({
    defaultValues: { paymentMethod: 'card' },
  })
  const selected = useWatch({ control, name: 'paymentMethod' }) ?? 'card'

  const lines        = cartLines()
  const isEmpty      = lines.length === 0
  const productValue = getCartSubtotal(lines)

  // Carry shipping from the delivery step. A null shippingCost means the shopper
  // never completed delivery (skipped ahead / hard refresh that cleared session).
  const needsShipping  = !isEmpty && storedShipping === null
  const isHome         = deliveryMethod === 'home'
  const shippingCost   = storedShipping ?? (productValue >= FREE_SHIPPING_THRESHOLD ? 0 : HOME_DELIVERY_COST)
  const shippingWaived = isHome && shippingCost === 0
  const codFee         = selected === 'cod' ? COD_FEE : 0
  const total          = productValue + shippingCost + codFee

  // Send a shopper who skipped the delivery step back to complete it.
  useEffect(() => {
    if (mounted && needsShipping) router.replace('/checkout/shipping')
  }, [mounted, needsShipping, router])

  // Cash on delivery is offered for courier (home) delivery only.
  const methods: MethodDef[] = [
    { id: 'card',      title: t('cardTitle'),      desc: t('cardDesc') },
    { id: 'iris',      title: t('irisTitle'),      desc: t('irisDesc') },
    { id: 'applepay',  title: t('applePayTitle'),  desc: t('applePayDesc') },
    { id: 'googlepay', title: t('googlePayTitle'), desc: t('googlePayDesc') },
    { id: 'klarna',    title: t('klarnaTitle'),    desc: t('klarnaDesc') },
    ...(isHome ? [{
      id: 'cod' as const, title: t('codTitle'), desc: t('codDesc'),
      price: <span className="text-on-surface">+€{COD_FEE.toFixed(2)}</span>,
    }] : []),
  ]

  // Real charging is not wired yet — the CTA records the choice and shows the notice.
  const onValid = (data: PaymentFields) => {
    setPaymentMethod(data.paymentMethod)
    setShowCheckoutModal(true)
  }

  // Render nothing until mounted (persisted, client-only stores) to avoid a
  // hydration mismatch; and hold render while redirecting a skip-ahead shopper.
  if (!mounted || needsShipping) return <main className="min-h-screen pt-20 bg-surface" />

  if (isEmpty) {
    return (
      <main className="min-h-screen pt-20 bg-surface">
        <div className="max-w-[1440px] mx-auto px-4 md:px-[60px] py-12">
          <h1 className="font-display text-5xl md:text-6xl text-on-surface leading-none mb-10">{t('heading')}</h1>
          <CheckoutEmpty message={t('emptyText')} ctaLabel={t('emptyCta')} ctaHref="/" />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-20 bg-surface">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[60px] py-12">

        <BackLink href="/checkout/shipping" label={t('back')} />

        <StepIndicator current={2} />

        <form onSubmit={handleSubmit(onValid)} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">

            {/* ── Left: payment methods ── */}
            <motion.div {...sectionMotion(0)}>
              <h1 className="font-display text-4xl md:text-5xl text-on-surface leading-none mb-8">{t('heading')}</h1>

              <p className="font-body text-[11px] tracking-[0.2em] uppercase text-on-surface-muted mb-4">{t('paymentMethod')}</p>
              <div className="space-y-3" role="radiogroup" aria-label={t('paymentMethod')}>
                {methods.map(m => (
                  <OptionCard
                    key={m.id}
                    value={m.id}
                    selected={selected === m.id}
                    register={register('paymentMethod')}
                    title={m.title}
                    desc={m.desc}
                    icon={<PaymentMark method={m.id} />}
                    price={m.price}
                  />
                ))}
              </div>

              <p className="flex items-center gap-2 mt-6 font-body text-[12px] tracking-[0.04em] text-on-surface-muted">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
                {t('secure')}
              </p>
            </motion.div>

            {/* ── Right: order summary ── */}
            <motion.div {...sectionMotion(0.1)}>
              <CheckoutSummary
                items={lines}
                productValue={productValue}
                shippingCost={shippingCost}
                shippingWaived={shippingWaived}
                extraFee={selected === 'cod' ? { label: t('rowCod'), amount: COD_FEE } : undefined}
                total={total}
                deliveryDate={deliveryDate}
                gift={gift}
                onToggleGift={() => setGift(!gift)}
                ctaLabel={t('pay')}
                ctaAriaLabel={t('payLabel')}
              />
            </motion.div>
          </div>
        </form>
      </div>
    </main>
  )
}
