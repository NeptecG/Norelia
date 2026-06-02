'use client'

import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslations, useLocale } from 'next-intl'
import { motion, useReducedMotion } from 'motion/react'
import { Link } from '@/navigation'
import { useCartStore } from '@/stores/cart-store'
import { useCheckoutStore } from '@/stores/checkout-store'
import type { PaymentMethod } from '@/stores/checkout-store'
import { useUIStore } from '@/stores/ui-store'
import { parsePriceNumber } from '@/lib/utils'
import { FREE_SHIPPING_THRESHOLD, HOME_DELIVERY_COST, ESTIMATED_DELIVERY_DAYS, COD_FEE } from '@/lib/constants'
import { StepIndicator } from '@/components/checkout/step-indicator'
import { OptionCard } from '@/components/checkout/option-card'
import { CheckoutSummary } from '@/components/checkout/checkout-summary'
import { PaymentMark } from '@/components/checkout/payment-marks'

const EASE: [number, number, number, number] = [0.25, 0, 0, 1]

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
  const t       = useTranslations('CheckoutPayment')
  const locale  = useLocale()
  const reduced = useReducedMotion() ?? false
  const { cartLines } = useCartStore()
  const { gift, setGift, deliveryMethod, shippingCost: storedShipping, setPaymentMethod } = useCheckoutStore()
  const { setShowCheckoutModal } = useUIStore()

  const { register, handleSubmit, control } = useForm<PaymentFields>({
    defaultValues: { paymentMethod: 'card' },
  })
  const selected = useWatch({ control, name: 'paymentMethod' }) ?? 'card'

  const lines        = cartLines()
  const isEmpty      = lines.length === 0
  const productValue = lines.reduce((s, i) => s + (i.salePrice != null ? i.salePrice : parsePriceNumber(i.price)) * i.qty, 0)

  // Carry shipping from the delivery step; fall back to home pricing on refresh.
  const isHome         = deliveryMethod === 'home'
  const shippingCost   = storedShipping ?? (productValue >= FREE_SHIPPING_THRESHOLD ? 0 : HOME_DELIVERY_COST)
  const shippingWaived = isHome && shippingCost === 0
  const codFee         = selected === 'cod' ? COD_FEE : 0
  const total          = productValue + shippingCost + codFee

  const deliveryDate = useMemo(() => {
    const d = new Date()
    let added = 0
    while (added < ESTIMATED_DELIVERY_DAYS) {
      d.setDate(d.getDate() + 1)
      const day = d.getDay()
      if (day !== 0 && day !== 6) added++
    }
    return new Intl.DateTimeFormat(locale, { weekday: 'short', day: '2-digit', month: 'short' }).format(d)
  }, [locale])

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

  const sectionMotion = (delay: number) =>
    reduced ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay, ease: EASE } }

  // Real charging is not wired yet — the CTA records the choice and shows the notice.
  const onValid = (data: PaymentFields) => {
    setPaymentMethod(data.paymentMethod)
    setShowCheckoutModal(true)
  }

  if (isEmpty) {
    return (
      <main className="min-h-screen pt-20 bg-surface">
        <div className="max-w-[1440px] mx-auto px-4 md:px-[60px] py-12">
          <h1 className="font-display text-5xl md:text-6xl text-on-surface leading-none mb-10">{t('heading')}</h1>
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <p className="font-body text-base text-on-surface/60 tracking-wide">{t('emptyText')}</p>
            <Link
              href="/"
              className="font-body text-xs tracking-[0.2em] uppercase border border-border px-8 py-3 text-on-surface hover:bg-surface-raised transition-colors"
            >
              {t('emptyCta')}
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-20 bg-surface">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[60px] py-12">

        <Link
          href="/checkout/shipping"
          className="inline-flex items-center gap-2 font-body text-[10px] tracking-[0.15em] uppercase text-on-surface-muted hover:text-on-surface transition-colors mb-8"
        >
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
          {t('back')}
        </Link>

        <StepIndicator current={2} />

        <form onSubmit={handleSubmit(onValid)} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">

            {/* ── Left: payment methods ── */}
            <motion.div {...sectionMotion(0)}>
              <h1 className="font-display text-4xl md:text-5xl text-on-surface leading-none mb-8">{t('heading')}</h1>

              <p className="font-body text-[10px] tracking-[0.2em] uppercase text-on-surface-muted mb-4">{t('paymentMethod')}</p>
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

              <p className="flex items-center gap-2 mt-6 font-body text-[11px] tracking-[0.04em] text-on-surface-muted">
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
