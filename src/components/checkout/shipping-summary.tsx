'use client'

import Image from 'next/image'
import { Link } from '@/navigation'
import { useTranslations } from 'next-intl'
import { parsePriceNumber } from '@/lib/utils'
import { HOME_DELIVERY_COST } from '@/lib/constants'
import type { CartItem } from '@/types'

interface ShippingSummaryProps {
  items:          CartItem[]
  productValue:   number
  shippingCost:   number
  shippingWaived: boolean   // home delivery selected but over the free threshold
  total:          number
  deliveryDate:   string
  gift:           boolean
  onToggleGift:   () => void
}

// Dark, sticky order summary — mirrors the cart page's OrderSummary aside so the
// two checkout steps feel like one continuous surface.
export function ShippingSummary({
  items, productValue, shippingCost, shippingWaived,
  total, deliveryDate, gift, onToggleGift,
}: ShippingSummaryProps) {
  const t = useTranslations('CheckoutShipping')
  const itemCount = items.reduce((sum, i) => sum + i.qty, 0)

  return (
    <aside className="dark lg:sticky lg:top-24 h-fit bg-surface-alt border border-border">

      {/* ── Heading + estimated delivery ── */}
      <div className="px-6 pt-6 pb-5 border-b border-border">
        <h2 className="font-display text-2xl text-on-surface tracking-wide leading-none mb-2">
          {t('summaryTitle')}
        </h2>
        <p className="font-body text-[11px] tracking-[0.04em] text-on-surface/55">
          {t('estDelivery', { date: deliveryDate })}
        </p>
      </div>

      {/* ── Mini item list ── */}
      <ul className="px-6 py-5 border-b border-border space-y-4">
        {items.map(item => {
          const unit = item.salePrice != null ? item.salePrice : parsePriceNumber(item.price)
          return (
            <li key={item.id} className="flex items-center gap-3">
              <div className="relative shrink-0 w-11 h-14 bg-on-surface/[0.06] overflow-hidden">
                <Image src={item.img} alt={item.name} fill sizes="44px" className="object-cover" />
                <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 flex items-center justify-center bg-on-surface text-surface font-body text-[9px] font-bold rounded-full">
                  {item.qty}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm text-on-surface leading-tight truncate">{item.name}</p>
                <p className="font-body text-[10px] text-on-surface/40 mt-0.5">#{item.code}</p>
              </div>
              <span className="font-body text-xs text-on-surface shrink-0">€{(unit * item.qty).toFixed(2)}</span>
            </li>
          )
        })}
      </ul>

      <div className="px-6 py-5">

        {/* ── Gift toggle ── */}
        <button
          type="button"
          onClick={onToggleGift}
          aria-pressed={gift}
          className="flex items-center gap-3 w-full mb-5 pb-5 border-b border-border text-left group"
        >
          <span
            className={`shrink-0 size-4 border flex items-center justify-center transition-colors ${
              gift ? 'bg-on-surface border-on-surface' : 'border-on-surface/40 group-hover:border-on-surface/70'
            }`}
          >
            {gift && (
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2.5 6.5L5 9l4.5-5.5" stroke="var(--color-surface)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <span className="font-body text-xs tracking-[0.04em] text-on-surface/80">{t('gift')}</span>
        </button>

        {/* ── Rows ── */}
        <div className="flex justify-between font-body text-sm mb-2.5">
          <span className="text-on-surface/60">
            {t('rowProducts')}
            <span className="text-on-surface/35"> · {t('itemsCount', { count: itemCount })}</span>
          </span>
          <span className="text-on-surface">€{productValue.toFixed(2)}</span>
        </div>

        <div className="flex justify-between font-body text-sm mb-5 pb-5 border-b border-border">
          <span className="text-on-surface/60">{t('rowShipping')}</span>
          {shippingCost === 0 ? (
            <span className="flex items-baseline gap-2">
              {shippingWaived && (
                <span className="font-body text-xs line-through text-on-surface/35">€{HOME_DELIVERY_COST.toFixed(2)}</span>
              )}
              <span className="text-success">{t('free')}</span>
            </span>
          ) : (
            <span className="text-on-surface">€{shippingCost.toFixed(2)}</span>
          )}
        </div>

        {/* ── Total ── */}
        <div className="flex justify-between items-baseline mb-1.5">
          <span className="font-body text-[11px] font-bold uppercase tracking-[0.12em] text-on-surface">
            {t('rowTotal')}
          </span>
          <span className="font-display text-3xl text-on-surface">€{total.toFixed(2)}</span>
        </div>
        <p className="font-body text-[10px] tracking-[0.04em] text-on-surface/40 mb-6">{t('vatIncluded')}</p>

        {/* ── Continue to payment (submits the delivery form) ── */}
        <button
          type="submit"
          aria-label={t('toPaymentLabel')}
          className="group w-full flex items-center justify-center gap-2 bg-on-surface text-surface font-body text-xs tracking-[0.2em] uppercase py-4 hover:opacity-80 transition-opacity"
        >
          {t('toPayment')}
          <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </button>

        {/* ── Back to cart ── */}
        <Link
          href="/checkout"
          className="block text-center mt-4 font-body text-[11px] tracking-[0.04em] text-on-surface/55 hover:text-on-surface transition-colors underline underline-offset-4 decoration-on-surface/25"
        >
          {t('backToCart')}
        </Link>
      </div>
    </aside>
  )
}
