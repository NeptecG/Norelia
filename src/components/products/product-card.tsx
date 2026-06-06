'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { Link, useRouter, usePathname } from '@/navigation'
import { useTranslations } from 'next-intl'
import { motion, useReducedMotion } from 'motion/react'
import { cn, getStock } from '@/lib/utils'
import { useCatLabel } from '@/hooks/use-i18n-labels'
import { useFavoritesStore } from '@/stores/favorites-store'
import { useCartStore } from '@/stores/cart-store'
import { useUIStore } from '@/stores/ui-store'
import { PriceTag } from '@/components/products/price-tag'
import { GCOLORS } from '@/data/colors'
import { SIZES } from '@/data/sizes'
import type { Product } from '@/types'

interface Props {
  product: Product
  priority?: boolean
}

const COOLDOWN_MS = 1000

export function ProductCard({ product, priority = false }: Props) {
  const reducedMotion  = useReducedMotion()
  const router         = useRouter()
  const pathname       = usePathname()
  const t              = useTranslations('ProductCard')
  const catLabel       = useCatLabel()
  const [hovering, setHovering]           = useState(false)
  const [sizePickerOpen, setSizePickerOpen] = useState(false)

  // For unisex products, pass the browsing-gender context so the product page
  // can show the correct breadcrumb (e.g. Women > Hoodies instead of Men > Hoodies)
  const genderCtx = product.gender === 'unisex' && pathname.startsWith('/women')
    ? 'women'
    : null

  const productHref = `/product/${product.code}${genderCtx ? `?from=${genderCtx}` : ''}`

  const { toggleFavorite, isFavorite } = useFavoritesStore()
  const { cartItems, addToCart } = useCartStore()
  const { showToast } = useUIStore()

  const lastToggleRef = useRef<Record<number, number>>({})

  const favorited  = isFavorite(product.id)
  const outOfStock = getStock(product.id) === 0

  function handleFavorite(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const now = Date.now()
    const last = lastToggleRef.current[product.id] ?? 0
    if (now - last < COOLDOWN_MS) return
    lastToggleRef.current[product.id] = now
    toggleFavorite(product.id)
    showToast(favorited ? t('removedFromFavorites') : t('addedToFavorites'), favorited ? 'remove' : 'add', 'fav')
  }

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (outOfStock) return
    setSizePickerOpen(true)
  }

  function handlePickSize(size: string) {
    const sizeStock = getStock(product.id, size)
    const cartQty   = cartItems[product.id] ?? 0
    if (cartQty >= sizeStock) {
      showToast(t('noMoreStock', { size, name: product.name }), 'remove', 'cart')
      setSizePickerOpen(false)
      return
    }
    addToCart(product.id, 1)
    showToast(t('sizeAdded', { name: product.name, size }), 'add', 'cart')
    setSizePickerOpen(false)
  }

  // Motion variants — disabled when user prefers reduced motion
  const imageScaleVariants = {
    rest:  { scale: 1 },
    hover: { scale: reducedMotion ? 1 : 1.05 },
  }

  const underlineVariants = {
    rest:  { scaleX: 0 },
    hover: { scaleX: reducedMotion ? 0 : 1 },
  }

  const quickAddVariants = {
    rest:  { y: reducedMotion ? 0 : '100%', opacity: reducedMotion ? 1 : 0 },
    hover: { y: 0, opacity: 1 },
  }

  const heartVariants = {
    rest:  { scale: 1 },
    hover: { scale: reducedMotion ? 1 : 1.15 },
  }

  return (
    <motion.div
      className="group relative flex flex-col border border-on-surface/70 hover:border-on-surface transition-colors"
      initial="rest"
      animate={hovering || sizePickerOpen ? 'hover' : 'rest'}
      onHoverStart={() => setHovering(true)}
      onHoverEnd={() => { setHovering(false); setSizePickerOpen(false) }}
    >
      {/* ── Image area ─────────────────────────────────────────────────────────── */}
      <div className="relative aspect-[3/4] overflow-hidden bg-surface-alt">

        {/* Product image */}
        <motion.div
          className="absolute inset-0"
          variants={imageScaleVariants}
          transition={{ duration: 0.35, ease: [0.25, 0, 0, 1] }}
        >
          <Image
            src={product.img}
            alt={product.name}
            fill
            priority={priority}
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </motion.div>

        {/* Primary link overlay — z-[1] so interactive elements at z-[2] stay clickable */}
        <Link
          href={productHref}
          aria-label={product.name}
          className="absolute inset-0 z-[1]"
          tabIndex={0}
        />

        {/* NEW badge — pointer-events-none so the link overlay remains active beneath it */}
        {product.tag === 'NEW' && (
          <span className="absolute left-2 top-2 z-[2] pointer-events-none bg-on-surface px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-widest text-surface">
            {t('new')}
          </span>
        )}

        {/* Heart / Favorite button — z-[2] so it sits above the link overlay */}
        <motion.button
          type="button"
          aria-label={favorited ? t('removeFromFavorites') : t('addToFavorites')}
          onClick={handleFavorite}
          variants={heartVariants}
          transition={{ duration: 0.15 }}
          className="absolute right-1.5 top-1.5 z-[2] flex items-center justify-center min-w-[36px] min-h-[36px]"
        >
          <Heart
            size={16}
            className={cn(
              favorited ? 'fill-destructive stroke-destructive' : 'fill-none stroke-on-surface-muted',
            )}
          />
        </motion.button>

        {/* Quick Add / Size picker — z-[2] above link overlay */}
        <motion.div
          variants={quickAddVariants}
          transition={{ duration: 0.25, ease: [0.25, 0, 0, 1] }}
          className="absolute inset-x-0 bottom-0 z-[2]"
        >
          {sizePickerOpen ? (
            <div className="bg-on-surface py-2 px-2">
              <div className="flex flex-wrap gap-1 justify-center">
                {SIZES.map((size) => {
                  const sizeQty = getStock(product.id, size)
                  const soldOut = sizeQty === 0 || (cartItems[product.id] ?? 0) >= sizeQty
                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={soldOut}
                      onClick={(e) => { e.stopPropagation(); if (!soldOut) handlePickSize(size) }}
                      className={cn(
                        'px-2 py-1 font-body text-[0.6rem] tracking-widest uppercase border transition-colors',
                        soldOut
                          ? 'text-surface/25 border-surface/10 cursor-not-allowed line-through'
                          : 'text-surface border-surface/30 hover:bg-surface/20',
                      )}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={outOfStock}
              className={cn(
                'w-full bg-on-surface py-3 text-xs font-semibold uppercase tracking-widest text-surface transition-opacity',
                outOfStock && 'cursor-not-allowed opacity-50',
              )}
            >
              {outOfStock ? t('outOfStock') : t('quickAdd')}
            </button>
          )}
        </motion.div>

        {/* Bottom underline accent */}
        <motion.div
          variants={underlineVariants}
          transition={{ duration: 0.3, ease: [0.25, 0, 0, 1] }}
          style={{ originX: 0 }}
          className="absolute bottom-0 inset-x-0 h-0.5 bg-on-surface z-[2] pointer-events-none"
        />
      </div>

      {/* ── Info area ──────────────────────────────────────────────────────────── */}
      {/*
        Plain div with onClick — no Link wrapper here.
        This avoids nested interactive elements (button inside a) while still
        making the text area clickable. Interactive children (swatches) stop
        propagation so they don't also navigate.
      */}
      <div
        role="presentation"
        onClick={() => router.push(productHref)}
        className="bg-surface pl-5 pr-4 pt-4 pb-5 space-y-[5px] cursor-pointer"
      >
        <p className="font-body text-[11px] uppercase tracking-[0.12em] text-on-surface-muted">
          {catLabel(product.cat)}
        </p>
        <p className="font-body text-[13px] font-semibold uppercase tracking-[0.06em] text-on-surface">
          {product.name}
        </p>

        {/* Color swatches — 0.6 opacity at rest (visible on mobile), full on hover */}
        <motion.div
          variants={{
            rest:  { opacity: 0.6 },
            hover: { opacity: 1 },
          }}
          transition={{ duration: 0.2 }}
          className="flex gap-1.5"
        >
          {GCOLORS.map((c) => (
            <button
              key={c.name}
              type="button"
              aria-label={c.name}
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/product/${product.code}?color=${encodeURIComponent(c.name)}${genderCtx ? `&from=${genderCtx}` : ''}`)
              }}
              style={{ '--swatch-color': c.hex } as React.CSSProperties}
              className={cn(
                'block h-3 w-3 rounded-full border border-border-subtle bg-[var(--swatch-color)] cursor-pointer',
                c.outline && 'ring-1 ring-border ring-offset-1',
              )}
            />
          ))}
        </motion.div>

        <PriceTag price={product.price} salePrice={product.salePrice} />
      </div>
    </motion.div>
  )
}
