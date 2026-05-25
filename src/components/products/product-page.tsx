'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Truck, Shield, RotateCcw } from 'lucide-react'
import { cn, catLabel, catLabelPlural, getStock } from '@/lib/utils'
import { NAV_CAT_TO_SLUG } from '@/lib/constants'
import { SIZES } from '@/data/sizes'
import { useCartStore } from '@/stores/cart-store'
import { useFavoritesStore } from '@/stores/favorites-store'
import { useUIStore } from '@/stores/ui-store'
import { PriceTag } from '@/components/products/price-tag'
import { SizeMiniGuide } from '@/components/modals/size-mini-guide'
import type { Product } from '@/types'

interface Props {
  product: Product
}

export function ProductPage({ product }: Props) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)

  const { cartItems, addToCart } = useCartStore()
  const { favorites, toggleFavorite } = useFavoritesStore()
  const { toggleSidePanel, showToast, addToRecent } = useUIStore()

  useEffect(() => {
    addToRecent(product)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stock = getStock(product.id) - (cartItems[product.id] ?? 0)
  const isFav = favorites.includes(product.id)

  // Breadcrumb helpers
  const genderHref = product.gender === 'women' ? '/women' : '/men'
  const genderLabel = product.gender === 'women' ? 'Women' : 'Men'
  const catKey = catLabelPlural(product.cat) // e.g. "T-Shirts"
  const catSlug = NAV_CAT_TO_SLUG[catKey] ?? ''
  const catHref = `${genderHref}/${catSlug}`

  function handleAddToCart() {
    if (!selectedSize || stock <= 0) return
    addToCart(product.id, qty)
    showToast(`${product.name} added to cart`, 'add')
    toggleSidePanel('cart')
  }

  const addBtnDisabled = !selectedSize || stock <= 0
  const addBtnText =
    !selectedSize ? 'SELECT A SIZE' :
    stock <= 0    ? 'OUT OF STOCK'  :
                    'ADD TO CART'

  return (
    <section className="min-h-screen pt-20 bg-surface">
      <div className="mx-auto max-w-6xl px-4 md:px-8 py-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">

        {/* Image */}
        <div className="relative aspect-[3/4] bg-surface-raised overflow-hidden rounded-sm">
          <Image
            src={product.img}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col">

          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1 font-body text-[10px] tracking-[0.12em] uppercase text-on-surface-muted">
              <li><Link href="/">Home</Link></li>
              <li aria-hidden="true"> / </li>
              <li><Link href={genderHref}>{genderLabel}</Link></li>
              <li aria-hidden="true"> / </li>
              <li><Link href={catHref}>{catLabelPlural(product.cat)}</Link></li>
              <li aria-hidden="true"> / </li>
              {/* Zero-width space appended so getByText(name) targets only the <h1> */}
              <li aria-current="page" aria-label={product.name}>
                {product.name}{'​'}
              </li>
            </ol>
          </nav>

          {/* Category + Name */}
          <p className="font-body text-[9px] tracking-[0.22em] uppercase text-on-surface-muted mt-6">
            {catLabel(product.cat)}
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-on-surface leading-none mt-1">
            {product.name}
          </h1>

          {/* Price */}
          <div className="mt-3">
            <PriceTag price={product.price} salePrice={product.salePrice} size="lg" />
          </div>

          {/* Description */}
          <p className="font-body text-[13px] text-on-surface/70 leading-relaxed mt-4">
            {product.description}
          </p>

          {/* Size picker */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-body text-[10px] tracking-[0.18em] uppercase text-on-surface">
                SIZE
              </span>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                className="font-body text-[10px] tracking-[0.12em] uppercase text-on-surface-muted hover:text-on-surface transition-colors"
              >
                Size Guide →
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  aria-pressed={selectedSize === size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    'w-12 h-10 font-body text-[11px] tracking-wide transition-colors',
                    selectedSize === size
                      ? 'bg-on-surface text-surface'
                      : 'border border-border text-on-surface hover:border-on-surface/60',
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Qty stepper */}
          <div className="mt-5 flex items-center gap-4">
            <span className="font-body text-[10px] tracking-[0.18em] uppercase text-on-surface">
              QTY
            </span>
            <div className="flex items-center border border-border">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={qty <= 1}
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center font-body text-on-surface disabled:opacity-30 hover:bg-surface-alt transition-colors"
              >
                −
              </button>
              <span className="w-9 text-center font-body text-[12px] text-on-surface select-none">
                {qty}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                disabled={qty >= stock}
                onClick={() => setQty(q => Math.min(stock, q + 1))}
                className="w-9 h-9 flex items-center justify-center font-body text-on-surface disabled:opacity-30 hover:bg-surface-alt transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Stock indicator */}
          <div className="mt-3 font-body text-[11px] tracking-wide">
            {stock <= 0 ? (
              <span className="text-destructive">Out of Stock</span>
            ) : stock <= 5 ? (
              <span className="text-destructive">Only {stock} left in stock</span>
            ) : (
              <span className="text-success">In Stock</span>
            )}
          </div>

          {/* Add to Cart */}
          <button
            type="button"
            disabled={addBtnDisabled}
            onClick={handleAddToCart}
            className={cn(
              'mt-5 w-full bg-on-surface text-surface font-body text-[11px] tracking-[0.22em] uppercase py-4 transition-opacity',
              addBtnDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-90',
            )}
          >
            {addBtnText}
          </button>

          {/* Favorites */}
          <button
            type="button"
            aria-pressed={isFav}
            onClick={() => toggleFavorite(product.id)}
            className="mt-3 flex items-center justify-center gap-2 w-full border border-border py-3 font-body text-[11px] tracking-[0.18em] uppercase text-on-surface hover:bg-surface-alt transition-colors"
          >
            <Heart
              size={14}
              className={cn(isFav ? 'fill-on-surface' : 'fill-none')}
            />
            {isFav ? 'SAVED TO FAVORITES' : 'ADD TO FAVORITES'}
          </button>

          {/* Trust signals */}
          <div className="mt-6 pt-6 border-t border-border flex flex-wrap gap-4">
            <span className="flex items-center gap-1.5 font-body text-[9px] text-on-surface-muted uppercase tracking-wide">
              <Truck size={12} />
              Free shipping €60+
            </span>
            <span className="flex items-center gap-1.5 font-body text-[9px] text-on-surface-muted uppercase tracking-wide">
              <Shield size={12} />
              Secure checkout
            </span>
            <span className="flex items-center gap-1.5 font-body text-[9px] text-on-surface-muted uppercase tracking-wide">
              <RotateCcw size={12} />
              30-day returns
            </span>
          </div>
        </div>
      </div>

      <SizeMiniGuide
        product={product}
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />
    </section>
  )
}
