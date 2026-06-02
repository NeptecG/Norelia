'use client'

import { useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations, useLocale } from 'next-intl'
import { motion, useReducedMotion } from 'motion/react'
import { Link, useRouter } from '@/navigation'
import { useCartStore } from '@/stores/cart-store'
import { useCheckoutStore } from '@/stores/checkout-store'
import { cn, parsePriceNumber } from '@/lib/utils'
import { FREE_SHIPPING_THRESHOLD, HOME_DELIVERY_COST, ESTIMATED_DELIVERY_DAYS } from '@/lib/constants'
import { StepIndicator } from '@/components/checkout/step-indicator'
import { OptionCard } from '@/components/checkout/option-card'
import { CheckoutSummary } from '@/components/checkout/checkout-summary'

const EASE: [number, number, number, number] = [0.25, 0, 0, 1]

const INPUT_CLS = 'w-full px-3 py-2.5 font-body text-sm bg-surface border border-border text-on-surface placeholder:text-on-surface/30 focus:outline-none focus:border-on-surface transition-colors'
const LABEL_CLS = 'block font-body text-[9px] tracking-[0.2em] uppercase text-on-surface-muted mb-1.5'
const ERR_CLS   = 'font-body text-[11px] text-destructive mt-1'

// Reveal box that attaches under the selected option card
const REVEAL_CLS = 'border border-on-surface border-t-0 -mt-px px-5 md:px-6 pt-4 pb-5'

// Delivery-method icons — module-level JSX (not nested components)
const ICON_TRUCK = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 6h11v9H3z" /><path d="M14 9h4l3 3v3h-7z" /><circle cx="7" cy="18" r="1.6" /><circle cx="17.5" cy="18" r="1.6" />
  </svg>
)
const ICON_PIN = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10z" /><circle cx="12" cy="11" r="2" />
  </svg>
)
const ICON_STORE = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 9h16v11H4z" /><path d="M3 9l1.5-4h15L21 9" /><path d="M9 20v-5h6v5" />
  </svg>
)

function Req() {
  return <span className="text-destructive" aria-hidden="true"> *</span>
}

interface ShippingFields {
  deliveryMethod: 'home' | 'pickup' | 'store'
  receiptType:    'receipt' | 'invoice'
  name:    string
  street:  string
  city:    string
  postal:  string
  phone:   string
  notes?:  string
  companyName: string
  vatNumber:   string
  taxOffice:   string
}

export default function CheckoutShippingPage() {
  const t       = useTranslations('CheckoutShipping')
  const locale  = useLocale()
  const reduced = useReducedMotion() ?? false
  const router  = useRouter()
  const { cartLines } = useCartStore()
  const { gift, setGift, setDelivery } = useCheckoutStore()

  // Locale-aware validation. Address fields required only for home delivery;
  // invoice fields only when an invoice is requested.
  const schema = useMemo(() => z.object({
    deliveryMethod: z.enum(['home', 'pickup', 'store']),
    receiptType:    z.enum(['receipt', 'invoice']),
    name:    z.string(),
    street:  z.string(),
    city:    z.string(),
    postal:  z.string(),
    phone:   z.string(),
    notes:   z.string().max(500).optional(),
    companyName: z.string(),
    vatNumber:   z.string(),
    taxOffice:   z.string(),
  }).superRefine((val, ctx) => {
    if (val.deliveryMethod === 'home') {
      if (val.name.trim().length < 2)   ctx.addIssue({ code: 'custom', path: ['name'],   message: t('nameRequired') })
      if (val.street.trim().length < 3) ctx.addIssue({ code: 'custom', path: ['street'], message: t('streetRequired') })
      if (val.city.trim().length < 2)   ctx.addIssue({ code: 'custom', path: ['city'],   message: t('cityRequired') })
      if (!/^\d{5}$/.test(val.postal.trim())) ctx.addIssue({ code: 'custom', path: ['postal'], message: t('postalInvalid') })
      if (val.phone.replace(/[\s+]/g, '').replace(/^30/, '').length < 10) ctx.addIssue({ code: 'custom', path: ['phone'], message: t('phoneInvalid') })
    }
    if (val.receiptType === 'invoice') {
      if (val.companyName.trim().length < 2) ctx.addIssue({ code: 'custom', path: ['companyName'], message: t('companyRequired') })
      if (!/^\d{9}$/.test(val.vatNumber.trim())) ctx.addIssue({ code: 'custom', path: ['vatNumber'], message: t('vatInvalid') })
      if (val.taxOffice.trim().length < 2) ctx.addIssue({ code: 'custom', path: ['taxOffice'], message: t('taxOfficeRequired') })
    }
  }), [t])

  const { register, handleSubmit, control, formState: { errors } } = useForm<ShippingFields>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: {
      deliveryMethod: 'home', receiptType: 'receipt',
      name: '', street: '', city: '', postal: '', phone: '', notes: '',
      companyName: '', vatNumber: '', taxOffice: '',
    },
  })

  const deliveryMethod = useWatch({ control, name: 'deliveryMethod' })
  const receiptType    = useWatch({ control, name: 'receiptType' })
  const isHome    = deliveryMethod === 'home'
  const isStore   = deliveryMethod === 'store'
  const isInvoice = receiptType === 'invoice'

  const phoneReg  = register('phone')
  const postalReg = register('postal')
  const vatReg    = register('vatNumber')

  const lines        = cartLines()
  const isEmpty      = lines.length === 0
  const productValue = lines.reduce((s, i) => s + (i.salePrice != null ? i.salePrice : parsePriceNumber(i.price)) * i.qty, 0)
  const freeQualified  = productValue >= FREE_SHIPPING_THRESHOLD
  const shippingCost   = isHome ? (freeQualified ? 0 : HOME_DELIVERY_COST) : 0
  const shippingWaived = isHome && freeQualified
  const total          = productValue + shippingCost

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

  const sectionMotion = (delay: number) =>
    reduced ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay, ease: EASE } }

  const onValid = (data: ShippingFields) => {
    setDelivery(data.deliveryMethod, shippingCost)
    router.push('/checkout/payment')
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
          href="/checkout"
          className="inline-flex items-center gap-2 font-body text-[10px] tracking-[0.15em] uppercase text-on-surface-muted hover:text-on-surface transition-colors mb-8"
        >
          <span aria-hidden="true">←</span>
          {t('back')}
        </Link>

        <StepIndicator current={1} />

        <form onSubmit={handleSubmit(onValid)} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">

            {/* ── Left: delivery + receipt ── */}
            <div>
              <h1 className="font-display text-4xl md:text-5xl text-on-surface leading-none mb-8">{t('heading')}</h1>

              {/* Delivery method */}
              <motion.section {...sectionMotion(0)} aria-label={t('deliveryMethod')} className="mb-12">
                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-on-surface-muted mb-4">{t('deliveryMethod')}</p>

                <div className="space-y-3">
                  {/* Home delivery + revealed address form */}
                  <div>
                    <OptionCard
                      value="home"
                      selected={isHome}
                      register={register('deliveryMethod')}
                      title={t('methodHomeTitle')}
                      desc={t('methodHomeDesc')}
                      icon={ICON_TRUCK}
                      price={shippingWaived
                        ? (
                          <span className="flex items-baseline gap-2">
                            <span className="line-through text-on-surface/35 text-xs">€{HOME_DELIVERY_COST.toFixed(2)}</span>
                            <span className="text-success">{t('free')}</span>
                          </span>
                        )
                        : `€${HOME_DELIVERY_COST.toFixed(2)}`}
                    />
                    {isHome && (
                      <div className={REVEAL_CLS}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="sm:col-span-2">
                            <label htmlFor="ship-name" className={LABEL_CLS}>{t('addressName')}<Req /></label>
                            <input id="ship-name" {...register('name')} className={INPUT_CLS} placeholder={t('addressNamePlaceholder')} autoComplete="name" />
                            {errors.name && <p className={ERR_CLS}>{errors.name.message}</p>}
                          </div>
                          <div className="sm:col-span-2">
                            <label htmlFor="ship-street" className={LABEL_CLS}>{t('addressStreet')}<Req /></label>
                            <input id="ship-street" {...register('street')} className={INPUT_CLS} placeholder={t('addressStreetPlaceholder')} autoComplete="street-address" />
                            {errors.street && <p className={ERR_CLS}>{errors.street.message}</p>}
                          </div>
                          <div>
                            <label htmlFor="ship-city" className={LABEL_CLS}>{t('addressCity')}<Req /></label>
                            <input id="ship-city" {...register('city')} className={INPUT_CLS} placeholder={t('addressCityPlaceholder')} autoComplete="address-level2" />
                            {errors.city && <p className={ERR_CLS}>{errors.city.message}</p>}
                          </div>
                          <div>
                            <label htmlFor="ship-postal" className={LABEL_CLS}>{t('addressPostal')}<Req /></label>
                            <input
                              id="ship-postal"
                              inputMode="numeric"
                              maxLength={5}
                              {...postalReg}
                              onChange={e => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 5); postalReg.onChange(e) }}
                              className={INPUT_CLS}
                              placeholder={t('addressPostalPlaceholder')}
                              autoComplete="postal-code"
                            />
                            {errors.postal && <p className={ERR_CLS}>{errors.postal.message}</p>}
                          </div>
                          <div className="sm:col-span-2">
                            <label htmlFor="ship-phone" className={LABEL_CLS}>{t('addressPhone')}<Req /></label>
                            <input
                              id="ship-phone"
                              inputMode="tel"
                              maxLength={16}
                              {...phoneReg}
                              onChange={e => { e.target.value = e.target.value.replace(/[^\d+\s]/g, '').slice(0, 16); phoneReg.onChange(e) }}
                              className={INPUT_CLS}
                              placeholder={t('addressPhonePlaceholder')}
                              autoComplete="tel"
                            />
                            {errors.phone && <p className={ERR_CLS}>{errors.phone.message}</p>}
                          </div>
                          <div className="sm:col-span-2">
                            <label htmlFor="ship-notes" className={LABEL_CLS}>{t('addressNotes')}</label>
                            <textarea id="ship-notes" {...register('notes')} rows={2} className={cn(INPUT_CLS, 'resize-none')} placeholder={t('addressNotesPlaceholder')} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pickup point / locker */}
                  <OptionCard
                    value="pickup"
                    selected={deliveryMethod === 'pickup'}
                    register={register('deliveryMethod')}
                    title={t('methodPickupTitle')}
                    desc={t('methodPickupDesc')}
                    icon={ICON_PIN}
                    price={<span className="text-success">{t('free')}</span>}
                  />

                  {/* Store pickup */}
                  <OptionCard
                    value="store"
                    selected={isStore}
                    register={register('deliveryMethod')}
                    title={t('methodStoreTitle')}
                    desc={t('methodStoreDesc')}
                    icon={ICON_STORE}
                    price={<span className="text-success">{t('free')}</span>}
                  />
                </div>
              </motion.section>

              {/* Receipt / invoice */}
              <motion.section {...sectionMotion(0.08)} aria-label={t('receiptHeading')}>
                <h2 className="font-display text-2xl text-on-surface leading-none mb-4">{t('receiptHeading')}</h2>
                <div className="space-y-3">
                  <OptionCard value="receipt" selected={!isInvoice} register={register('receiptType')} title={t('receiptOption')} />
                  <div>
                    <OptionCard value="invoice" selected={isInvoice} register={register('receiptType')} title={t('invoiceOption')} />
                    {isInvoice && (
                      <div className={REVEAL_CLS}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="sm:col-span-2">
                            <label htmlFor="inv-company" className={LABEL_CLS}>{t('invoiceCompany')}<Req /></label>
                            <input id="inv-company" {...register('companyName')} className={INPUT_CLS} placeholder={t('invoiceCompanyPlaceholder')} autoComplete="organization" />
                            {errors.companyName && <p className={ERR_CLS}>{errors.companyName.message}</p>}
                          </div>
                          <div>
                            <label htmlFor="inv-vat" className={LABEL_CLS}>{t('invoiceVat')}<Req /></label>
                            <input
                              id="inv-vat"
                              inputMode="numeric"
                              maxLength={9}
                              {...vatReg}
                              onChange={e => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 9); vatReg.onChange(e) }}
                              className={INPUT_CLS}
                              placeholder={t('invoiceVatPlaceholder')}
                            />
                            {errors.vatNumber && <p className={ERR_CLS}>{errors.vatNumber.message}</p>}
                          </div>
                          <div>
                            <label htmlFor="inv-tax" className={LABEL_CLS}>{t('invoiceTaxOffice')}<Req /></label>
                            <input id="inv-tax" {...register('taxOffice')} className={INPUT_CLS} placeholder={t('invoiceTaxOfficePlaceholder')} />
                            {errors.taxOffice && <p className={ERR_CLS}>{errors.taxOffice.message}</p>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.section>
            </div>

            {/* ── Right: order summary ── */}
            <motion.div {...sectionMotion(0.12)}>
              <CheckoutSummary
                items={lines}
                productValue={productValue}
                shippingCost={shippingCost}
                shippingWaived={shippingWaived}
                total={total}
                deliveryDate={deliveryDate}
                gift={gift}
                onToggleGift={() => setGift(!gift)}
                ctaLabel={t('toPayment')}
                ctaAriaLabel={t('toPaymentLabel')}
                backHref="/checkout"
                backLabel={t('backToCart')}
              />
            </motion.div>
          </div>
        </form>
      </div>
    </main>
  )
}
