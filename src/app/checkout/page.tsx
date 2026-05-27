'use client'

import type React from 'react'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { useCartStore } from '@/stores/cart-store'
import { useUIStore } from '@/stores/ui-store'
import { parsePriceNumber, catLabel, getStock } from '@/lib/utils'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants'
import type { CartItem } from '@/types'

const EASE: [number, number, number, number] = [0.25, 0, 0, 1]

// ---------------------------------------------------------------------------
// CartTableRow — one <tr> per cart item, matches NOIR column layout
// ---------------------------------------------------------------------------

interface CartTableRowProps {
  item:        CartItem
  reduced:     boolean
  stock:       number
  onDecrement: (id: number) => void
  onIncrement: (id: number) => void
  onRemove:    (id: number) => void
}

export function CartTableRow({ item, reduced, stock, onDecrement, onIncrement, onRemove }: CartTableRowProps) {
  const unitPrice = item.salePrice != null ? item.salePrice : parsePriceNumber(item.price)
  const lineTotal = (unitPrice * item.qty).toFixed(2)

  return (
    <motion.tr
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15, ease: EASE } }}
      transition={{ duration: 0.25, ease: EASE }}
      className="border-b border-border"
    >
      {/* ── Product ── */}
      <td className="py-5 pr-6 align-middle">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0 w-[72px] h-[90px] bg-surface-alt overflow-hidden">
            <Image src={item.img} alt={item.name} fill sizes="72px" className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="font-body text-[9px] tracking-[0.18em] uppercase text-on-surface/50 mb-1">
              {catLabel(item.cat)}
            </p>
            <p className="font-display text-xl text-on-surface leading-tight">
              {item.name}
            </p>
            <p className="font-body text-[10px] text-on-surface/40 mt-0.5">
              #{item.code}
            </p>
          </div>
        </div>
      </td>

      {/* ── Quantity ── */}
      <td className="py-5 px-4 align-middle text-center">
        <div className="flex items-center border border-border w-fit mx-auto">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={item.qty <= 1}
            onClick={() => onDecrement(item.id)}
            className="w-8 h-8 flex items-center justify-center font-body text-sm text-on-surface hover:bg-surface-raised transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            −
          </button>
          <span className="w-8 h-8 flex items-center justify-center font-body text-sm text-on-surface border-x border-border select-none">
            {item.qty}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            disabled={item.qty >= stock}
            onClick={() => onIncrement(item.id)}
            className="w-8 h-8 flex items-center justify-center font-body text-sm text-on-surface hover:bg-surface-raised transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
      </td>

      {/* ── Remove ── */}
      <td className="py-5 px-4 align-middle text-center">
        <button
          type="button"
          aria-label={`Remove ${item.name} from cart`}
          onClick={() => onRemove(item.id)}
          className="text-on-surface/40 hover:text-destructive transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </td>

      {/* ── Price ── */}
      <td className="py-5 px-4 align-middle text-right">
        {item.salePrice != null ? (
          <div className="flex flex-col items-end gap-0.5">
            <span className="font-body text-xs line-through text-on-surface/40">{item.price}</span>
            <span className="font-body text-sm font-bold text-destructive">€{item.salePrice.toFixed(2)}</span>
          </div>
        ) : (
          <span className="font-body text-sm text-on-surface">{item.price}</span>
        )}
      </td>

      {/* ── Total ── */}
      <td className="py-5 pl-4 align-middle text-right">
        <span className="font-body text-sm font-semibold text-on-surface">€{lineTotal}</span>
      </td>
    </motion.tr>
  )
}

// ---------------------------------------------------------------------------
// BelowTableTotals — right-aligned subtotals below the cart table (NOIR pattern)
// ---------------------------------------------------------------------------

interface BelowTableTotalsProps {
  exVat:         number
  vatAmt:        number
  grandTotal:    number   // items total, VAT incl.
  afterDiscount: number   // for free-shipping threshold check
}

function BelowTableTotals({ exVat, vatAmt, grandTotal, afterDiscount }: BelowTableTotalsProps) {
  const freeShipping = afterDiscount >= FREE_SHIPPING_THRESHOLD
  const remaining    = (FREE_SHIPPING_THRESHOLD - afterDiscount).toFixed(2)

  return (
    <div className="mt-8 border-t border-border pt-6 flex justify-end">
      <div className="w-full max-w-xs space-y-2">
        {/* Subtotal w/o VAT */}
        <div className="flex justify-between gap-8">
          <span className="font-body text-sm text-on-surface/60">Subtotal w/o VAT:</span>
          <span className="font-body text-sm text-on-surface">€{exVat.toFixed(2)}</span>
        </div>
        {/* VAT */}
        <div className="flex justify-between gap-8 pb-4 border-b border-border">
          <span className="font-body text-sm text-on-surface/60">VAT (24%):</span>
          <span className="font-body text-sm text-on-surface">€{vatAmt.toFixed(2)}</span>
        </div>
        {/* Grand Total */}
        <div className="flex justify-between gap-8 items-baseline pt-1">
          <span className="font-body text-[11px] font-bold uppercase tracking-[0.12em] text-on-surface">
            Grand Total (with VAT):
          </span>
          <span className="font-display text-3xl text-on-surface">€{grandTotal.toFixed(2)}</span>
        </div>
        {/* Free shipping note */}
        <p className="font-body text-[10px] text-on-surface/50 text-right">
          {freeShipping
            ? '✓ Free shipping included'
            : `Add €${remaining} more for free shipping`}
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// OrderSummary — right panel (dark box, kept per user request)
// ---------------------------------------------------------------------------

interface OrderSummaryProps {
  exVat:          number
  vatAmt:         number
  grandTotal:     number
  afterDiscount:  number
  discountAmt:    number
  discountRate:   number
  appliedCoupon:  string | null
  couponInput:    string
  couponError:    string
  orderNotes:     string
  onCouponChange: (val: string) => void
  onCouponApply:  () => void
  onCouponRemove: () => void
  onNotesChange:  (val: string) => void
  onPlaceOrder:   () => void
}

export function OrderSummary({
  exVat, vatAmt, grandTotal, afterDiscount,
  discountAmt, discountRate, appliedCoupon,
  couponInput, couponError, orderNotes,
  onCouponChange, onCouponApply, onCouponRemove,
  onNotesChange, onPlaceOrder,
}: OrderSummaryProps) {
  const freeShipping = afterDiscount >= FREE_SHIPPING_THRESHOLD
  const remaining    = (FREE_SHIPPING_THRESHOLD - afterDiscount).toFixed(2)
  const progressPct  = Math.min((afterDiscount / FREE_SHIPPING_THRESHOLD) * 100, 100)

  return (
    // `dark` forces dark-mode tokens so text-on-surface is readable on bg-surface-alt
    <aside className="dark lg:sticky lg:top-24 h-fit bg-surface-alt border border-border">

      {/* ── Heading ── */}
      <div className="px-6 pt-6 pb-5 border-b border-border">
        <h2 className="font-display text-2xl text-on-surface tracking-widest">ORDER SUMMARY</h2>
      </div>

      <div className="px-6 py-5">
        {/* ── Subtotal (excl. VAT) ── */}
        <div className="flex justify-between font-body text-sm mb-2.5">
          <span className="text-on-surface/60">Subtotal</span>
          <span className="text-on-surface">€{exVat.toFixed(2)}</span>
        </div>

        {/* ── VAT (24%) ── */}
        <div className="flex justify-between font-body text-sm mb-5 pb-5 border-b border-border">
          <span className="text-on-surface/60">VAT (24%)</span>
          <span className="text-on-surface">€{vatAmt.toFixed(2)}</span>
        </div>

        {/* ── Grand Total ── */}
        <div className="flex justify-between items-baseline mb-4">
          <span className="font-body text-[11px] font-bold uppercase tracking-[0.12em] text-on-surface">
            Grand Total
          </span>
          <span className="font-display text-3xl text-on-surface">€{grandTotal.toFixed(2)}</span>
        </div>

        {/* ── Shipping note ── */}
        <div className="mb-5 pb-5 border-b border-border">
          {freeShipping ? (
            <p className="font-body text-xs text-success tracking-wide">✓ Free shipping included</p>
          ) : (
            <>
              <p className="font-body text-xs text-on-surface/50 mb-2">
                Add €{remaining} more for free shipping
              </p>
              {/* CSS custom property drives dynamic width — avoids inline style={} */}
              <div
                className="h-px w-full bg-border overflow-hidden"
                role="progressbar"
                aria-valuenow={Math.round(progressPct)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Free shipping progress"
              >
                <div
                  className="h-full bg-on-surface transition-all duration-500 [width:var(--progress-w)]"
                  style={{ '--progress-w': `${progressPct}%` } as React.CSSProperties}
                />
              </div>
            </>
          )}
        </div>

        {/* ── Coupon code ── */}
        <div className="mb-5">
          <p className="font-body text-[9px] tracking-[0.2em] uppercase text-on-surface-muted mb-2">
            Coupon Code
          </p>
          {appliedCoupon ? (
            <div className="flex items-center justify-between bg-success/10 border border-success/30 px-3 py-2">
              <p className="font-body text-xs text-success tracking-wide">
                {appliedCoupon} · {Math.round(discountRate * 100)}% off ✓
                {discountAmt > 0 && (
                  <span className="ml-1 text-on-surface/40 font-normal normal-case">
                    (saved €{discountAmt.toFixed(2)})
                  </span>
                )}
              </p>
              <button
                type="button"
                aria-label="Remove coupon"
                onClick={onCouponRemove}
                className="font-body text-[10px] text-on-surface/40 hover:text-on-surface transition-colors ml-3 uppercase tracking-widest shrink-0"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex">
              <input
                id="coupon-code"
                type="text"
                value={couponInput}
                onChange={e => onCouponChange(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && onCouponApply()}
                placeholder="Enter code"
                className="flex-1 min-w-0 px-3 py-2.5 bg-on-surface/10 border border-border border-r-0 text-on-surface font-body text-[11px] uppercase tracking-widest placeholder:text-on-surface/30 placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:border-on-surface/50"
              />
              <button
                type="button"
                onClick={onCouponApply}
                className="px-4 bg-on-surface text-surface font-body text-[10px] tracking-[0.18em] uppercase transition-opacity hover:opacity-80 whitespace-nowrap"
              >
                Apply
              </button>
            </div>
          )}
          {couponError && (
            <p className="font-body text-[10px] text-destructive mt-1.5 tracking-wide">
              {couponError}
            </p>
          )}
        </div>

        {/* ── Special instructions ── */}
        <div className="mb-6">
          <label
            htmlFor="order-notes"
            className="block font-body text-[9px] tracking-[0.2em] uppercase text-on-surface-muted mb-2"
          >
            Special Instructions (optional)
          </label>
          <textarea
            id="order-notes"
            value={orderNotes}
            onChange={e => onNotesChange(e.target.value)}
            rows={3}
            placeholder="Gift wrap, delivery notes, etc."
            className="w-full px-3 py-2 bg-on-surface/10 border border-border text-on-surface font-body text-[11px] placeholder:text-on-surface/30 focus:outline-none focus:border-on-surface/50 resize-none"
          />
        </div>

        {/* ── Place Order ── */}
        <button
          type="button"
          aria-label="Place order"
          onClick={onPlaceOrder}
          className="w-full bg-on-surface text-surface font-body text-xs tracking-[0.2em] uppercase py-4 hover:opacity-80 transition-opacity"
        >
          PLACE ORDER
        </button>
      </div>
    </aside>
  )
}

// ---------------------------------------------------------------------------
// CheckoutPage — default export (page.tsx convention)
// ---------------------------------------------------------------------------

// Demo coupons — in production these would be server-validated
const VALID_COUPONS: Record<string, number> = {
  NORELIA10: 0.10,
  NORELIA20: 0.20,
}

export default function CheckoutPage() {
  const { cartLines, removeFromCart, decrementCart, addToCart } = useCartStore()
  const { setShowCheckoutModal } = useUIStore()
  const reduced = useReducedMotion() ?? false

  const [orderNotes,    setOrderNotes]    = useState('')
  const [couponInput,   setCouponInput]   = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [couponError,   setCouponError]   = useState('')

  const lines   = cartLines()
  const isEmpty = lines.length === 0

  const rawSubtotal = lines.reduce((sum, item) => {
    const unitPrice = item.salePrice != null ? item.salePrice : parsePriceNumber(item.price)
    return sum + unitPrice * item.qty
  }, 0)

  // All prices are VAT-inclusive (Greek standard 24%).
  // afterDiscount = items total (VAT incl.) after any coupon.
  // exVat  = afterDiscount / 1.24
  // vatAmt = afterDiscount − exVat
  // grandTotal = items total only (excl. shipping) — shipping shown as a separate note
  const discountRate  = appliedCoupon ? (VALID_COUPONS[appliedCoupon] ?? 0) : 0
  const discountAmt   = rawSubtotal * discountRate
  const afterDiscount = rawSubtotal - discountAmt
  const exVat         = afterDiscount / 1.24
  const vatAmt        = afterDiscount - exVat
  const grandTotal    = afterDiscount   // items only, excl. shipping (NOIR pattern)

  function handleCouponApply() {
    const code = couponInput.trim().toUpperCase()
    if (VALID_COUPONS[code]) {
      setAppliedCoupon(code)
      setCouponError('')
      setCouponInput('')
    } else {
      setCouponError('Invalid coupon code')
      setAppliedCoupon(null)
    }
  }

  function handleCouponRemove() {
    setAppliedCoupon(null)
    setCouponError('')
    setCouponInput('')
  }

  return (
    <main className="min-h-screen pt-20 bg-surface">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[60px] py-12">

        {/* Page heading */}
        <h1 className="font-display text-6xl text-on-surface leading-none mb-10">YOUR CART</h1>

        {isEmpty ? (
          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <p className="font-body text-base text-on-surface/60 tracking-wide">
              Your cart is empty.
            </p>
            <Link
              href="/"
              className="font-body text-xs tracking-[0.2em] uppercase border border-border px-8 py-3 text-on-surface hover:bg-surface-raised transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          /* ── Cart layout ── */
          <>
          {/* ← Continue Shopping — only shown when cart has items (NOIR pattern) */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-body text-[10px] tracking-[0.15em] uppercase text-on-surface/50 hover:text-on-surface transition-colors mb-8"
          >
            <span aria-hidden="true">←</span>
            Continue Shopping
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">

            {/* Items column */}
            <section aria-label="Cart items">

              {/* Scrollable table — min-w prevents crushing on narrow screens */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px]">
                  <thead>
                    <tr className="border-b border-border">
                      {(['Product', 'Quantity', 'Remove', 'Price', 'Total'] as const).map((col, i) => (
                        <th
                          key={col}
                          scope="col"
                          className={[
                            'pb-3 font-body text-[9px] tracking-[0.18em] uppercase text-on-surface/50',
                            i === 0 ? 'text-left pr-6'  : '',
                            i === 1 ? 'text-center px-4' : '',
                            i === 2 ? 'text-center px-4' : '',
                            i === 3 ? 'text-right px-4'  : '',
                            i === 4 ? 'text-right pl-4'  : '',
                          ].join(' ')}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence mode="popLayout">
                      {lines.map(item => (
                        <CartTableRow
                          key={item.id}
                          item={item}
                          reduced={reduced}
                          stock={getStock(item.id)}
                          onDecrement={decrementCart}
                          onIncrement={id => addToCart(id, 1)}
                          onRemove={removeFromCart}
                        />
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Below-table subtotals (NOIR pattern) */}
              <BelowTableTotals
                exVat={exVat}
                vatAmt={vatAmt}
                grandTotal={grandTotal}
                afterDiscount={afterDiscount}
              />
            </section>

            {/* Order summary column */}
            <OrderSummary
              exVat={exVat}
              vatAmt={vatAmt}
              grandTotal={grandTotal}
              afterDiscount={afterDiscount}
              discountAmt={discountAmt}
              discountRate={discountRate}
              appliedCoupon={appliedCoupon}
              couponInput={couponInput}
              couponError={couponError}
              orderNotes={orderNotes}
              onCouponChange={setCouponInput}
              onCouponApply={handleCouponApply}
              onCouponRemove={handleCouponRemove}
              onNotesChange={setOrderNotes}
              onPlaceOrder={() => setShowCheckoutModal(true)}
            />
          </div>
          </>
        )}
      </div>
    </main>
  )
}
