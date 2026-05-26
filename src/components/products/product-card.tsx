'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { cn, catLabel, getStock } from '@/lib/utils'
import { useFavoritesStore } from '@/stores/favorites-store'
import { useCartStore } from '@/stores/cart-store'
import { useUIStore } from '@/stores/ui-store'
import { PriceTag } from '@/components/products/price-tag'
import type { Product } from '@/types'

interface Props {
  product: Product
  priority?: boolean
}

const SWATCHES = [
  { name: 'White',    hex: '#FFFFFF', outline: true },
  { name: 'Black',    hex: '#1e1e1e' },
  { name: 'Grey',     hex: '#919191' },
  { name: 'Bordeaux', hex: '#6b1b2c' },
]

const COOLDOWN_MS = 1000

export function ProductCard({ product, priority = false }: Props) {
  const reducedMotion = useReducedMotion()
  const [hovering, setHovering] = useState(false)

  const { toggleFavorite, isFavorite } = useFavoritesStore()
  const { addToCart } = useCartStore()
  const { showToast } = useUIStore()

  const lastToggleRef = useRef<Record<number, number>>({})

  const favorited = isFavorite(product.id)
  const outOfStock = getStock(product.id) === 0

  function handleFavorite(e: React.MouseEvent) {
    e.preventDefault()
    const now = Date.now()
    const last = lastToggleRef.current[product.id] ?? 0
    if (now - last < COOLDOWN_MS) return
    lastToggleRef.current[product.id] = now
    toggleFavorite(product.id)
  }

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault()
    if (outOfStock) return
    addToCart(product.id, 1)
    showToast('Added to cart', 'add')
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
    // border border-on-surface/20: visible black box outline; darkens on hover
    <motion.div
      className="group relative flex flex-col border border-on-surface/20 hover:border-on-surface/50 transition-colors"
      initial="rest"
      animate={hovering ? 'hover' : 'rest'}
      onHoverStart={() => setHovering(true)}
      onHoverEnd={() => setHovering(false)}
    >
      <Link href={`/product/${product.code}`} aria-label={product.name} className="flex flex-col">
        {/* Image container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-surface-alt">
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

          {/* NEW badge */}
          {product.tag === 'NEW' && (
            <span className="absolute left-2 top-2 z-10 bg-on-surface px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-widest text-surface">
              NEW
            </span>
          )}

          {/* Heart / Favorite button */}
          <motion.button
            type="button"
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            onClick={handleFavorite}
            variants={heartVariants}
            transition={{ duration: 0.15 }}
            className="absolute right-2 top-2 z-10 p-1"
          >
            <Heart
              size={16}
              className={cn(
                favorited ? 'fill-destructive stroke-destructive' : 'fill-none stroke-on-surface-muted',
              )}
            />
          </motion.button>

          {/* Quick Add overlay */}
          <motion.div
            variants={quickAddVariants}
            transition={{ duration: 0.25, ease: [0.25, 0, 0, 1] }}
            className="absolute inset-x-0 bottom-0 z-10"
          >
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={outOfStock}
              className={cn(
                'w-full bg-on-surface py-3 text-xs font-semibold uppercase tracking-widest text-surface transition-opacity',
                outOfStock && 'cursor-not-allowed opacity-50',
              )}
            >
              {outOfStock ? 'OUT OF STOCK' : 'QUICK ADD'}
            </button>
          </motion.div>

          {/* Bottom underline accent */}
          <motion.div
            variants={underlineVariants}
            transition={{ duration: 0.3, ease: [0.25, 0, 0, 1] }}
            style={{ originX: 0 }}
            className="absolute bottom-0 inset-x-0 h-0.5 bg-on-surface"
          />
        </div>

        {/* Color swatches */}
        <motion.div
          variants={{
            rest:  { opacity: 0 },
            hover: { opacity: reducedMotion ? 0 : 1 },
          }}
          transition={{ duration: 0.2 }}
          className="mt-2 flex gap-1.5 px-0.5"
          aria-hidden="true"
        >
          {SWATCHES.map((s) => (
            <span
              key={s.name}
              style={{ '--swatch-color': s.hex } as React.CSSProperties}
              className={cn(
                'block h-3 w-3 rounded-full border border-border-subtle bg-[var(--swatch-color)]',
                s.outline && 'ring-1 ring-border ring-offset-1',
              )}
            />
          ))}
        </motion.div>

        {/* Info */}
        <div className="mt-2 space-y-0.5 px-0.5">
          <p className="font-body text-xs uppercase tracking-wider text-on-surface-muted">
            {catLabel(product.cat)}
          </p>
          <p className="font-body text-sm font-semibold uppercase tracking-wide text-on-surface">
            {product.name}
          </p>
          <PriceTag price={product.price} salePrice={product.salePrice} />
        </div>
      </Link>
    </motion.div>
  )
}
