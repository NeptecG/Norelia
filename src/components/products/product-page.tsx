'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Link, useRouter } from '@/navigation'
import { useTranslations } from 'next-intl'
import { Heart, Truck, Shield, RotateCcw, Ruler, ChevronLeft } from 'lucide-react'
import { cn, FILTER_TO_SLUG, getStock } from '@/lib/utils'
import { useCatLabel, useColorLabel } from '@/hooks/use-i18n-labels'
import { SIZES } from '@/data/sizes'
import { GCOLORS } from '@/data/colors'
import { useCartStore } from '@/stores/cart-store'
import { useFavoritesStore } from '@/stores/favorites-store'
import { useUIStore } from '@/stores/ui-store'
import { PriceTag } from '@/components/products/price-tag'
import { SizeMiniGuide } from '@/components/modals/size-mini-guide'
import type { Product, GarmentColor } from '@/types'

interface Props {
  product:       Product
  initialColor?: string   // pre-select color from card swatch ?color= param
  from?:         string   // gender context for unisex breadcrumbs (?from=women|men)
}

export function ProductPage({ product, initialColor, from }: Props) {
  const router = useRouter()
  const t          = useTranslations('ProductPage')
  const catLabel   = useCatLabel()
  const colorLabel = useColorLabel()
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [activeImageSide, setActiveImageSide] = useState<'front' | 'back'>('front')
  const defaultColor = GCOLORS.find(c => c.name === initialColor) ?? GCOLORS[1]
  const [selectedColor, setSelectedColor] = useState<GarmentColor>(defaultColor)

  const { cartItems, addToCart } = useCartStore()
  const { favorites, toggleFavorite } = useFavoritesStore()
  const { showToast, addToRecent } = useUIStore()

  useEffect(() => {
    addToRecent(product)
    // Intentional: fire once on mount. `product` is a stable RSC prop; `addToRecent` is a stable Zustand action.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Cart tracks by product ID only — size-aware cart tracking arrives with Supabase.
  // Subtracting the total cart qty from the selected size's stock is conservative:
  // if you have 1 Medium in the cart and switch to Small, Small will also show 0.
  // This is the correct trade-off for v1 — prevents over-adding, never over-promises.
  const cartQty = cartItems[product.id] ?? 0
  const stock = selectedSize
    ? Math.max(0, getStock(product.id, selectedSize) - cartQty)
    : 0  // not rendered when no size is selected
  const isFav     = favorites.includes(product.id)
  const addingRef = useRef(false)  // prevents rapid double-click from firing twice

  // Breadcrumb helpers — for unisex products use the `from` param to show the
  // correct gender context (the page the user navigated from)
  const effectiveGender = product.gender === 'unisex'
    ? (from === 'women' ? 'women' : 'men')
    : product.gender
  const genderHref  = effectiveGender === 'women' ? '/women' : '/men'
  const catSlug     = FILTER_TO_SLUG[product.cat] ?? ''
  const catHref     = `${genderHref}/${catSlug}`

  // Plural cat labels for the breadcrumb (singular eyebrow uses the shared catLabel hook)
  const catPluralMap: Record<string, string> = {
    TSHIRTS:  t('catPluralTSHIRTS'),
    HOODIES:  t('catPluralHOODIES'),
    ZIPPERS:  t('catPluralZIPPERS'),
    TANKTOPS: t('catPluralTANKTOPS'),
    NEWIN:    t('catPluralNEWIN'),
    SALES:    t('catPluralSALES'),
  }

  // Active image: back view if available and selected, otherwise front
  const activeImg = activeImageSide === 'back' && product.imgBack ? product.imgBack : product.img

  function handleAddToCart() {
    if (!selectedSize || stock <= 0 || addingRef.current) return
    addingRef.current = true
    addToCart(product.id, qty)
    showToast(t('addedToCart', { name: product.name }), 'add', 'cart')
    // Release the gate after Zustand + React have flushed — prevents rapid double-click
    requestAnimationFrame(() => { addingRef.current = false })
  }

  function handleToggleFavorite() {
    toggleFavorite(product.id)
    showToast(
      isFav
        ? t('removedFromFavorites', { name: product.name })
        : t('addedToFavorites', { name: product.name }),
      isFav ? 'remove' : 'add',
      'fav',
    )
  }

  const addBtnDisabled = !selectedSize || stock <= 0
  const addBtnText =
    !selectedSize ? t('selectSize') :
    stock <= 0    ? t('soldOut')    :
                    t('addToCart')

  return (
    <section className="min-h-screen pt-20 bg-surface">
      {/* Back button — prominent on mobile, subtle on desktop */}
      <div className="mx-auto max-w-6xl px-4 md:px-8 pt-6 pb-0">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 py-3 pr-4 md:py-2 md:pr-3 font-body text-sm md:text-[10px] tracking-[0.15em] uppercase text-on-surface-muted hover:text-on-surface transition-colors"
        >
          <ChevronLeft size={18} strokeWidth={1.5} className="md:w-[15px] md:h-[15px]" />
          {t('back')}
        </button>
      </div>

      <div className="mx-auto max-w-6xl px-4 md:px-8 py-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">

        {/* ── Left: thumbnail strip + main image ── */}
        <div className="flex gap-3">

          {/* Thumbnail strip — vertical, left of main image */}
          <div className="flex flex-col gap-2 shrink-0">

            {/* Front thumbnail */}
            <button
              type="button"
              aria-label={t('viewFront')}
              onClick={() => setActiveImageSide('front')}
              className={cn(
                'relative w-[54px] aspect-[3/4] overflow-hidden border transition-colors',
                activeImageSide === 'front'
                  ? 'border-on-surface'
                  : 'border-border hover:border-on-surface/50',
              )}
            >
              <Image
                src={product.img}
                alt={`${product.name} front`}
                fill
                className="object-cover"
                sizes="54px"
              />
            </button>

            {/* Back thumbnail — placeholder until imgBack is set */}
            <button
              type="button"
              aria-label={t('viewBack')}
              onClick={() => setActiveImageSide('back')}
              className={cn(
                'relative w-[54px] aspect-[3/4] overflow-hidden border transition-colors bg-surface-raised flex items-end justify-center pb-1',
                activeImageSide === 'back'
                  ? 'border-on-surface'
                  : 'border-border hover:border-on-surface/50',
              )}
            >
              {product.imgBack ? (
                <Image
                  src={product.imgBack}
                  alt={`${product.name} back`}
                  fill
                  className="object-cover"
                  sizes="54px"
                />
              ) : (
                /* Placeholder label until back photo is uploaded */
                <span className="font-body text-[7px] tracking-[0.1em] uppercase text-on-surface-muted">
                  {t('backView')}
                </span>
              )}
            </button>
          </div>

          {/* Main image */}
          <div className="relative flex-1 aspect-[3/4] bg-surface-raised overflow-hidden rounded-sm">
            <Image
              src={activeImg}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
        </div>

        {/* ── Right: product info ── */}
        <div className="flex flex-col">

          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1 font-body text-[10px] tracking-[0.12em] uppercase text-on-surface-muted">
              <li><Link href="/">{t('breadcrumbHome')}</Link></li>
              <li aria-hidden="true"> / </li>
              <li>
                <Link href={genderHref}>
                  {effectiveGender === 'women' ? t('breadcrumbWomen') : t('breadcrumbMen')}
                </Link>
              </li>
              <li aria-hidden="true"> / </li>
              <li><Link href={catHref}>{catPluralMap[product.cat] ?? product.cat}</Link></li>
              <li aria-hidden="true"> / </li>
              <li aria-current="page" data-testid="breadcrumb-current">
                {product.name}
              </li>
            </ol>
          </nav>

          {/* Category eyebrow + Name + Product code */}
          <p className="font-body text-[9px] tracking-[0.22em] uppercase text-on-surface-muted mt-6">
            {catLabel(product.cat)}
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-on-surface leading-none mt-1">
            {product.name}
          </h1>
          <p className="font-body text-[10px] tracking-[0.15em] text-on-surface-muted mt-1.5">
            #{product.code}
          </p>

          {/* Price */}
          <div className="mt-3">
            <PriceTag price={product.price} salePrice={product.salePrice} size="lg" />
          </div>

          {/* Description */}
          <p className="font-body text-[13px] text-on-surface/70 leading-relaxed mt-4">
            {product.description}
          </p>

          {/* Color swatches */}
          <div className="mt-6">
            <p className="font-body text-[10px] tracking-[0.18em] uppercase text-on-surface mb-2">
              {t('colorLabel')}: <span className="normal-case tracking-normal font-normal text-on-surface-muted">{colorLabel(selectedColor.name)}</span>
            </p>
            <div className="flex gap-2">
              {GCOLORS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  aria-label={c.name}
                  aria-pressed={selectedColor.name === c.name}
                  onClick={() => setSelectedColor(c)}
                  /* dynamic swatch colour — cannot use a static Tailwind class */
                  style={{ '--swatch-color': c.hex } as React.CSSProperties}
                  className={cn(
                    'w-6 h-6 rounded-full transition-transform hover:scale-110 bg-[var(--swatch-color)]',
                    c.outline && 'border border-on-surface/20',
                    selectedColor.name === c.name && 'ring-2 ring-offset-2 ring-on-surface',
                  )}
                />
              ))}
            </div>
          </div>

          {/* Size picker */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-body text-[10px] tracking-[0.18em] uppercase text-on-surface">
                {t('sizeLabel')}: <span className="normal-case tracking-normal font-normal text-on-surface-muted">{selectedSize ?? ''}</span>
              </span>
              {/* Ruler icon replaces arrow per design feedback */}
              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                className="flex items-center gap-1.5 font-body text-[10px] tracking-[0.12em] uppercase text-on-surface-muted hover:text-on-surface transition-colors"
              >
                <Ruler size={11} />
                {t('sizeGuide')}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => {
                const sizeQty      = getStock(product.id, size)
                const sizeUnavail  = sizeQty === 0
                const sizeSelected = selectedSize === size
                return (
                  <button
                    key={size}
                    type="button"
                    aria-pressed={sizeSelected}
                    disabled={sizeUnavail}
                    onClick={() => { if (!sizeUnavail) setSelectedSize(size) }}
                    className={cn(
                      'w-12 h-10 font-body text-[11px] tracking-wide transition-colors',
                      sizeUnavail
                        ? 'border border-border text-on-surface/25 cursor-not-allowed line-through'
                        : sizeSelected
                          ? 'bg-on-surface text-surface'
                          : 'border border-border text-on-surface hover:border-on-surface/60',
                    )}
                  >
                    {size}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Qty stepper */}
          <div className="mt-5 flex items-center gap-4">
            <span className="font-body text-[10px] tracking-[0.18em] uppercase text-on-surface">
              {t('qtyLabel')}
            </span>
            <div className="flex items-center border border-border">
              <button
                type="button"
                aria-label={t('decreaseQty')}
                disabled={qty <= 1}
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center font-body text-on-surface disabled:opacity-30 hover:bg-surface-raised transition-colors"
              >
                −
              </button>
              <span className="w-9 text-center font-body text-[12px] text-on-surface select-none">
                {qty}
              </span>
              <button
                type="button"
                aria-label={t('increaseQty')}
                disabled={qty >= stock}
                onClick={() => setQty(q => Math.min(stock, q + 1))}
                className="w-9 h-9 flex items-center justify-center font-body text-on-surface disabled:opacity-30 hover:bg-surface-raised transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Stock indicator — hidden until a size is selected */}
          <div className="mt-3 font-body text-[11px] tracking-wide min-h-[1rem]">
            {selectedSize && (
              stock <= 0 ? (
                <span className="text-destructive">{t('soldOut')}</span>
              ) : stock <= 5 ? (
                <span className="text-destructive">{t('inStock', { n: stock })}</span>
              ) : (
                <span className="text-success">{t('inStockFull')}</span>
              )
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

          {/* Favorites — hover:bg-on-surface/5 (not surface-alt which is dark in light mode) */}
          <button
            type="button"
            aria-pressed={isFav}
            onClick={handleToggleFavorite}
            className="mt-3 flex items-center justify-center gap-2 w-full border border-border py-3 font-body text-[11px] tracking-[0.18em] uppercase text-on-surface hover:bg-on-surface/5 transition-colors"
          >
            <Heart
              size={14}
              className={cn(isFav ? 'fill-destructive stroke-destructive' : 'fill-none')}
            />
            {isFav ? t('removeFromFavorites') : t('addToFavorites')}
          </button>

          {/* Trust signals */}
          <div className="mt-6 pt-6 border-t border-border flex flex-wrap gap-4">
            <span className="flex items-center gap-1.5 font-body text-[9px] text-on-surface-muted uppercase tracking-wide">
              <Truck size={12} />
              {t('freeShippingBadge')}
            </span>
            <span className="flex items-center gap-1.5 font-body text-[9px] text-on-surface-muted uppercase tracking-wide">
              <Shield size={12} />
              {t('secureCheckout')}
            </span>
            <span className="flex items-center gap-1.5 font-body text-[9px] text-on-surface-muted uppercase tracking-wide">
              <RotateCcw size={12} />
              {t('returnsPolicy')}
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
