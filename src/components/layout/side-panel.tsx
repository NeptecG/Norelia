'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { X, Trash2, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { parsePriceNumber, catLabel, getStock } from '@/lib/utils'
import { useUIStore } from '@/stores/ui-store'
import { useCartStore } from '@/stores/cart-store'
import { useFavoritesStore } from '@/stores/favorites-store'
import { PRODUCTS } from '@/data/products'
import type { CartItem, Product } from '@/types'

// ─── CartItemRow ──────────────────────────────────────────────────────────────

interface CartItemRowProps {
  item: CartItem
  isFav: boolean
  canAdd: boolean
  onFav: () => void
  onDecrement: () => void
  onAdd: () => void
  onRemove: () => void
  onNavigate: () => void
}

function CartItemRow({
  item,
  isFav,
  canAdd,
  onFav,
  onDecrement,
  onAdd,
  onRemove,
  onNavigate,
}: CartItemRowProps) {
  const unit = item.salePrice ?? parsePriceNumber(item.price)
  const total = (unit * item.qty).toFixed(2)

  return (
    <div className="py-3.5 border-b border-border">
      <div className="flex gap-3.5 items-start">
        {/* Thumbnail */}
        <Link href={`/product/${item.code}`} onClick={onNavigate} className="shrink-0">
          <div className="relative w-16 h-[85px] bg-surface overflow-hidden">
            <Image
              src={item.img}
              alt={item.name}
              fill
              className="object-cover hover:opacity-70 transition-opacity"
              sizes="64px"
            />
          </div>
        </Link>
        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-body text-[8px] tracking-[0.2em] uppercase text-on-surface-muted mb-1">
            {catLabel(item.cat)}
          </p>
          <Link
            href={`/product/${item.code}`}
            onClick={onNavigate}
            className="font-body text-[12px] font-bold tracking-wide uppercase text-on-surface hover:opacity-60 transition-opacity inline-block mb-1.5"
          >
            {item.name}
          </Link>
          {item.salePrice ? (
            <div className="flex gap-1.5 items-center mb-1">
              <span className="font-body text-[10px] text-on-surface-muted line-through">
                €{item.price.replace('€', '')}
              </span>
              <span className="font-body text-[12px] font-bold text-destructive">
                €{item.salePrice}
              </span>
            </div>
          ) : (
            <p className="font-body text-[12px] text-on-surface mb-1">
              €{item.price.replace('€', '')}
            </p>
          )}
          {item.qty > 1 && (
            <p className="font-body text-[11px] text-on-surface-muted">
              Total: <strong className="text-on-surface">€{total}</strong>
            </p>
          )}
        </div>
        {/* Controls */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          {/* Save for later (heart) */}
          <button
            onClick={onFav}
            aria-label={isFav ? 'Remove from saved' : 'Save for later'}
            className={cn(
              'transition-colors',
              isFav ? 'text-destructive' : 'text-on-surface-muted hover:text-destructive',
            )}
          >
            <Heart size={14} className={isFav ? 'fill-destructive' : ''} />
          </button>
          {/* Qty stepper */}
          <div className="flex items-center border border-border">
            <button
              onClick={onDecrement}
              disabled={item.qty <= 1}
              className="w-7 h-7 flex items-center justify-center text-on-surface disabled:text-on-surface-muted disabled:cursor-not-allowed font-body text-base hover:bg-surface-raised transition-colors"
            >
              −
            </button>
            <span className="w-6 text-center font-body text-[12px] font-bold text-on-surface">
              {item.qty}
            </span>
            <button
              onClick={onAdd}
              disabled={!canAdd}
              className="w-7 h-7 flex items-center justify-center text-on-surface disabled:text-on-surface-muted disabled:cursor-not-allowed font-body text-base hover:bg-surface-raised transition-colors"
            >
              +
            </button>
          </div>
          {/* Delete */}
          <button
            onClick={onRemove}
            aria-label="Remove item"
            className="text-on-surface-muted hover:text-destructive transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── FavItemRow ───────────────────────────────────────────────────────────────

interface FavItemRowProps {
  product: Product
  onRemove: () => void
  onNavigate: () => void
}

function FavItemRow({ product, onRemove, onNavigate }: FavItemRowProps) {
  return (
    <div className="py-3.5 border-b border-border">
      <div className="flex gap-3.5 items-start">
        <Link href={`/product/${product.code}`} onClick={onNavigate} className="shrink-0">
          <div className="relative w-16 h-[85px] bg-surface overflow-hidden">
            <Image
              src={product.img}
              alt={product.name}
              fill
              className="object-cover hover:opacity-70 transition-opacity"
              sizes="64px"
            />
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <p className="font-body text-[8px] tracking-[0.2em] uppercase text-on-surface-muted mb-1">
            {catLabel(product.cat)}
          </p>
          <Link
            href={`/product/${product.code}`}
            onClick={onNavigate}
            className="font-body text-[12px] font-bold tracking-wide uppercase text-on-surface hover:opacity-60 transition-opacity inline-block mb-1.5"
          >
            {product.name}
          </Link>
          {product.salePrice ? (
            <div className="flex gap-1.5 items-center">
              <span className="font-body text-[10px] text-on-surface-muted line-through">
                €{product.price.replace('€', '')}
              </span>
              <span className="font-body text-[12px] font-bold text-destructive">
                €{product.salePrice}
              </span>
            </div>
          ) : (
            <p className="font-body text-[12px] text-on-surface">
              €{product.price.replace('€', '')}
            </p>
          )}
        </div>
        <button
          onClick={onRemove}
          aria-label={`Remove ${product.name} from saved`}
          className="text-on-surface-muted hover:text-destructive transition-colors flex flex-col items-center gap-1 pt-1"
        >
          <Trash2 size={14} />
          <span className="font-body text-[7px] tracking-[0.1em] uppercase">Remove</span>
        </button>
      </div>
    </div>
  )
}

// ─── SidePanel ────────────────────────────────────────────────────────────────

export function SidePanel() {
  const { sidePanel, setSidePanel, showToast } = useUIStore()
  const { cartItems, addToCart, removeFromCart, decrementCart } = useCartStore()
  const { favorites, toggleFavorite } = useFavoritesStore()

  const router = useRouter()
  const shouldReduceMotion = useReducedMotion()

  const isCart = sidePanel === 'cart'

  const cartLines = useMemo(
    () =>
      Object.entries(cartItems)
        .map(([idStr, qty]) => {
          const product = PRODUCTS.find(p => p.id === Number(idStr))
          return product ? { ...product, qty } : null
        })
        .filter((x): x is CartItem => x !== null),
    [cartItems],
  )

  const favProducts = useMemo(
    () => PRODUCTS.filter(p => favorites.includes(p.id)),
    [favorites],
  )

  const total = useMemo(
    () =>
      cartLines.reduce((sum, item) => {
        const unit = item.salePrice ?? parsePriceNumber(item.price)
        return sum + unit * item.qty
      }, 0),
    [cartLines],
  )

  const handleClose = () => setSidePanel(null)

  const handleCheckout = () => {
    setSidePanel(null)
    router.push('/checkout')
  }

  const backdropVariants = shouldReduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }

  const panelVariants = shouldReduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } }

  return (
    <AnimatePresence>
      {sidePanel !== null && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            aria-hidden="true"
            initial={backdropVariants.initial}
            animate={backdropVariants.animate}
            exit={backdropVariants.exit}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/55 z-[999]"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={panelVariants.initial}
            animate={panelVariants.animate}
            exit={panelVariants.exit}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="dark bg-surface-alt fixed top-0 right-0 bottom-0 w-full max-w-[340px] z-[1000] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-6 border-b border-border">
              <span className="font-display text-[22px] tracking-[0.12em] text-on-surface">
                {isCart ? 'MY CART' : 'FAVORITES'}
              </span>
              <button
                onClick={handleClose}
                aria-label="Close panel"
                className="text-on-surface-muted hover:text-on-surface p-1 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Item list */}
            <div className="flex-1 overflow-y-auto px-5">
              {isCart ? (
                cartLines.length === 0 ? (
                  <p className="font-body text-sm text-on-surface-muted tracking-wide mt-4">
                    Your cart is empty.
                  </p>
                ) : (
                  cartLines.map(item => (
                    <CartItemRow
                      key={item.id}
                      item={item}
                      isFav={favorites.includes(item.id)}
                      canAdd={item.qty < getStock(item.id)}
                      onFav={() => {
                        toggleFavorite(item.id)
                        showToast(
                          favorites.includes(item.id)
                            ? `${item.name} removed from saved`
                            : `${item.name} saved`,
                          favorites.includes(item.id) ? 'remove' : 'add',
                        )
                      }}
                      onDecrement={() => decrementCart(item.id)}
                      onAdd={() => addToCart(item.id)}
                      onRemove={() => {
                        removeFromCart(item.id)
                        showToast(`${item.name} removed`, 'remove')
                      }}
                      onNavigate={handleClose}
                    />
                  ))
                )
              ) : favProducts.length === 0 ? (
                <p className="font-body text-sm text-on-surface-muted tracking-wide mt-4">
                  No saved items yet.
                </p>
              ) : (
                favProducts.map(product => (
                  <FavItemRow
                    key={product.id}
                    product={product}
                    onRemove={() => {
                      toggleFavorite(product.id)
                      showToast(`${product.name} removed from saved`, 'remove')
                    }}
                    onNavigate={handleClose}
                  />
                ))
              )}
            </div>

            {/* Footer (cart only, with items) */}
            {isCart && cartLines.length > 0 && (
              <div className="border-t border-border px-5 py-[18px] bg-surface-raised">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="font-body text-[11px] tracking-[0.18em] uppercase text-on-surface-muted">
                    Order Total
                  </span>
                  <span className="font-display text-2xl text-on-surface">
                    €{total.toFixed(2)}
                  </span>
                </div>
                <p className="font-body text-[10px] text-on-surface-muted tracking-wide mb-3.5">
                  {total >= 60
                    ? 'Free shipping on your order!'
                    : `Add €${(60 - total).toFixed(2)} more for free shipping`}
                </p>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-on-surface text-surface font-body text-[11px] font-bold tracking-[0.22em] uppercase py-3.5 hover:opacity-90 transition-opacity"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
