'use client'

import type React from 'react'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'motion/react'
import { useCartStore } from '@/stores/cart-store'
import { useUIStore } from '@/stores/ui-store'
import { parsePriceNumber, catLabel, getStock } from '@/lib/utils'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants'
import type { CartItem } from '@/types'

// ---------------------------------------------------------------------------
// Motion helpers
// ---------------------------------------------------------------------------

const EASE: [number, number, number, number] = [0.25, 0, 0, 1]

function makeItemVariants(reduced: boolean): Variants {
  if (reduced) {
    return {
      hidden:  { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.2, ease: EASE } },
      exit:    { opacity: 0, transition: { duration: 0.15, ease: EASE } },
    }
  }
  return {
    hidden:  { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: EASE } },
    exit:    { opacity: 0, x: 20,  transition: { duration: 0.2,  ease: EASE } },
  }
}

// ---------------------------------------------------------------------------
// CartItemRow — module level (never inside another component)
// ---------------------------------------------------------------------------

interface CartItemRowProps {
  item:        CartItem
  variants:    Variants
  stock:       number          // available stock for this product
  onDecrement: (id: number) => void
  onIncrement: (id: number) => void
  onRemove:    (id: number) => void
}

export function CartItemRow({ item, variants, stock, onDecrement, onIncrement, onRemove }: CartItemRowProps) {
  const displayPrice =
    item.salePrice != null
      ? `€${item.salePrice.toFixed(2)}`
      : item.price

  return (
    <motion.li
      layout
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex gap-4 py-5 border-b border-border last:border-b-0"
    >
      {/* Thumbnail */}
      {/* h-[106px]: portrait-ratio thumbnail at 80px width */}
      <div className="relative flex-shrink-0 w-20 h-[106px] bg-surface-alt overflow-hidden">
        <Image
          src={item.img}
          alt={item.name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-display text-2xl text-on-surface leading-tight truncate">
              {item.name}
            </p>
            <p className="font-body text-xs text-on-surface/50 mt-0.5 uppercase tracking-widest">
              {catLabel(item.cat)}
            </p>
          </div>
          {/* Remove button */}
          <button
            type="button"
            aria-label={`Remove ${item.name} from cart`}
            onClick={() => onRemove(item.id)}
            className="flex-shrink-0 text-on-surface/40 hover:text-destructive transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Price row — shows sale price prominently */}
        <div className="mt-1">
          {item.salePrice != null ? (
            <div className="flex items-center gap-1.5">
              <span className="font-body text-sm font-bold text-destructive">
                €{item.salePrice.toFixed(2)}
              </span>
              <span className="font-body text-xs text-on-surface/40 line-through">
                {item.price}
              </span>
            </div>
          ) : (
            <p className="font-body text-sm text-on-surface">{displayPrice}</p>
          )}
        </div>

        {/* Qty stepper */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-0 border border-border">
            {/* disabled when qty is 1 — prevents going to 0 */}
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={item.qty <= 1}
              onClick={() => onDecrement(item.id)}
              className="w-8 h-8 flex items-center justify-center font-body text-sm text-on-surface hover:bg-surface-raised transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              −
            </button>
            <span className="w-8 h-8 flex items-center justify-center font-body text-sm text-on-surface border-x border-border">
              {item.qty}
            </span>
            {/* disabled when qty reaches stock limit */}
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
          {/* Line total when qty > 1 */}
          {item.qty > 1 && (
            <p className="font-body text-xs text-on-surface/50">
              {item.qty} × {displayPrice}
            </p>
          )}
        </div>
      </div>
    </motion.li>
  )
}

// ---------------------------------------------------------------------------
// OrderSummary — module level
// ---------------------------------------------------------------------------

interface OrderSummaryProps {
  // Pricing — all computed in CheckoutPage
  exVat:          number   // items price excl. VAT (after coupon)
  vatAmt:         number   // VAT component (24%, extracted from prices)
  afterDiscount:  number   // items total VAT-incl after coupon (for free-shipping check)
  discountAmt:    number
  discountRate:   number
  appliedCoupon:  string | null
  shipping:       number
  grandTotal:     number
  // Coupon field
  couponInput:    string
  couponError:    string
  onCouponChange: (val: string) => void
  onCouponApply:  () => void
  onCouponRemove: () => void
  // Notes + submit
  orderNotes:     string
  onNotesChange:  (val: string) => void
  onPlaceOrder:   () => void
}

export function OrderSummary({
  exVat,
  vatAmt,
  afterDiscount,
  discountAmt,
  discountRate,
  appliedCoupon,
  shipping,
  grandTotal,
  couponInput,
  couponError,
  orderNotes,
  onCouponChange,
  onCouponApply,
  onCouponRemove,
  onNotesChange,
  onPlaceOrder,
}: OrderSummaryProps) {
  // Free-shipping progress is based on items total after coupon (VAT incl.)
  const progressPct  = Math.min((afterDiscount / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const freeShipping = afterDiscount >= FREE_SHIPPING_THRESHOLD
  const remaining    = (FREE_SHIPPING_THRESHOLD - afterDiscount).toFixed(2)

  return (
    // `dark` class forces dark-mode token values so text-on-surface (#f5f5f5) is readable
    // against the dark bg-surface-alt (#212121) in light mode — same pattern as nav/side-panel
    <aside className="dark lg:sticky lg:top-24 h-fit bg-surface-alt p-6 border border-border">
      <h2 className="font-display text-2xl text-on-surface tracking-widest mb-6">YOUR ORDER</h2>

      {/* ── Subtotal excl. VAT ── */}
      <div className="flex justify-between font-body text-sm text-on-surface mb-2.5">
        <span className="text-on-surface/70">Subtotal excl. VAT</span>
        <span>€{exVat.toFixed(2)}</span>
      </div>

      {/* ── VAT (24%) ── */}
      <div className="flex justify-between font-body text-sm text-on-surface mb-4 pb-4 border-b border-border">
        <span className="text-on-surface/70">VAT (24%)</span>
        <span>€{vatAmt.toFixed(2)}</span>
      </div>

      {/* ── Free shipping progress ── */}
      <div className="mb-3">
        {freeShipping ? (
          <p className="font-body text-xs text-success tracking-wide">
            Free shipping applied ✓
          </p>
        ) : (
          <>
            <p className="font-body text-xs text-on-surface/60 mb-2">
              €{remaining} away from free shipping
            </p>
            {/* CSS custom property drives dynamic width — avoids inline style={} */}
            <div
              className="h-1 w-full bg-border overflow-hidden"
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

      {/* ── Shipping line ── */}
      <div className="flex justify-between font-body text-sm text-on-surface mb-5 pb-5 border-b border-border">
        <span className="text-on-surface/70">Shipping</span>
        <span>{shipping === 0 ? 'Free' : '€4.99'}</span>
      </div>

      {/* ── Grand Total ── */}
      <div className="flex justify-between font-display text-2xl text-on-surface mb-5 pb-5 border-b border-border">
        <span>GRAND TOTAL</span>
        <span>€{grandTotal.toFixed(2)}</span>
      </div>

      {/* ── Coupon code — sits below grand total (NOIR pattern) ── */}
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
              className="px-4 bg-on-surface text-surface font-body text-[10px] tracking-[0.18em] uppercase transition-opacity hover:opacity-80 border border-on-surface whitespace-nowrap"
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

      {/* ── Order notes / special instructions ── */}
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

  // All prices are VAT-inclusive (Greek standard VAT 24%).
  // afterDiscount = items total (VAT incl.) after coupon is applied.
  // exVat  = afterDiscount / 1.24   — the net price excl. VAT
  // vatAmt = afterDiscount − exVat  — the VAT component (0.24/1.24 of total)
  const discountRate    = appliedCoupon ? (VALID_COUPONS[appliedCoupon] ?? 0) : 0
  const discountAmt     = rawSubtotal * discountRate
  const afterDiscount   = rawSubtotal - discountAmt
  const exVat           = afterDiscount / 1.24
  const vatAmt          = afterDiscount - exVat
  const shipping        = afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : 4.99
  const grandTotal      = afterDiscount + shipping

  const variants = makeItemVariants(reduced)

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
          /* ---- Empty state ---- */
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
          /* ---- Cart with items ---- */
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
            {/* sidebar fixed at 360px */}

            {/* Items column */}
            <section aria-label="Cart items">
              <AnimatePresence mode="popLayout">
                <ul className="divide-y divide-border" role="list">
                  {lines.map(item => (
                    <CartItemRow
                      key={item.id}
                      item={item}
                      variants={variants}
                      stock={getStock(item.id)}
                      onDecrement={decrementCart}
                      onIncrement={id => addToCart(id, 1)}
                      onRemove={removeFromCart}
                    />
                  ))}
                </ul>
              </AnimatePresence>
            </section>

            {/* Summary column */}
            <OrderSummary
              exVat={exVat}
              vatAmt={vatAmt}
              afterDiscount={afterDiscount}
              discountAmt={discountAmt}
              discountRate={discountRate}
              appliedCoupon={appliedCoupon}
              shipping={shipping}
              grandTotal={grandTotal}
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
        )}
      </div>
    </main>
  )
}
