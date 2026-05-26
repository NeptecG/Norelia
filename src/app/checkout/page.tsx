'use client'

import type React from 'react'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
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
            className="flex-shrink-0 font-body text-base text-on-surface/40 hover:text-on-surface transition-colors leading-none"
          >
            ×
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
  subtotal:     number
  shipping:     number
  total:        number
  orderNotes:   string
  onNotesChange: (val: string) => void
  onPlaceOrder: () => void
}

export function OrderSummary({
  subtotal,
  shipping,
  total,
  orderNotes,
  onNotesChange,
  onPlaceOrder,
}: OrderSummaryProps) {
  const progressPct  = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD
  const remaining    = (FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)

  return (
    // `dark` class forces dark-mode token values so text-on-surface (#f5f5f5) is readable
    // against the dark bg-surface-alt (#212121) in light mode — same pattern as nav/side-panel
    <aside className="dark lg:sticky lg:top-24 h-fit bg-surface-alt p-6 border border-border">
      <h2 className="font-display text-2xl text-on-surface tracking-widest mb-6">YOUR ORDER</h2>

      {/* Subtotal */}
      <div className="flex justify-between font-body text-sm text-on-surface mb-4">
        <span>Subtotal</span>
        <span>€{subtotal.toFixed(2)}</span>
      </div>

      {/* Free shipping progress */}
      <div className="mb-4">
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

      {/* Shipping line */}
      <div className="flex justify-between font-body text-sm text-on-surface mb-6 pb-6 border-b border-border">
        <span>Shipping</span>
        <span>{shipping === 0 ? 'Free' : '€4.99'}</span>
      </div>

      {/* Total */}
      <div className="flex justify-between font-display text-2xl text-on-surface mb-6">
        <span>TOTAL</span>
        <span>€{total.toFixed(2)}</span>
      </div>

      {/* Order notes / special instructions */}
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

      {/* Place Order */}
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

export default function CheckoutPage() {
  const { cartLines, removeFromCart, decrementCart, addToCart } = useCartStore()
  const { setShowCheckoutModal } = useUIStore()
  const reduced = useReducedMotion() ?? false

  const [orderNotes, setOrderNotes] = useState('')

  const lines   = cartLines()
  const isEmpty = lines.length === 0

  const subtotal = lines.reduce((sum, item) => {
    const unitPrice = item.salePrice != null ? item.salePrice : parsePriceNumber(item.price)
    return sum + unitPrice * item.qty
  }, 0)
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 4.99
  const total    = subtotal + shipping

  const variants = makeItemVariants(reduced)

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
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              orderNotes={orderNotes}
              onNotesChange={setOrderNotes}
              onPlaceOrder={() => setShowCheckoutModal(true)}
            />
          </div>
        )}
      </div>
    </main>
  )
}
