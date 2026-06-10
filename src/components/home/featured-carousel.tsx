'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/navigation'
import { useTranslations } from 'next-intl'
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'motion/react'
import { cn } from '@/lib/utils'
import { ProductCard } from '@/components/products/product-card'
import type { Product } from '@/types'

const EASE: [number, number, number, number] = [0.25, 0, 0, 1]

// Module-level hook — not defined inside FeaturedCarousel
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

// Pagination hook — encapsulates page state, resets when `total` shrinks
function usePagination(total: number) {
  const [page, setPage] = useState(0)
  // Clamp page to valid range without calling setState during render
  const safePage = total > 0 ? Math.min(page, total - 1) : 0
  return { page: safePage, setPage }
}

interface ViewAllLink {
  label: string
  href: string
}

interface Props {
  title: string
  subtitle?: string
  products: Product[]
  viewAllHref?: string
  /** When provided, renders multiple links instead of the single viewAllHref link */
  viewAllLinks?: ViewAllLink[]
}

export function FeaturedCarousel({ title, subtitle, products, viewAllHref, viewAllLinks }: Props) {
  const reducedMotion = useReducedMotion()
  const isMobile = useIsMobile()
  const t = useTranslations('FeaturedCarousel')
  // No artificial loading delay — data is static and available immediately

  const perPage = isMobile ? 2 : 4
  const totalPages = Math.ceil(products.length / perPage)
  const { page, setPage } = usePagination(totalPages)
  // Direction the page is moving (1 = forward, -1 = back) so the slide animation
  // enters/exits from the correct side.
  const [direction, setDirection] = useState(0)

  if (products.length === 0) return null

  const visibleProducts = products.slice(page * perPage, page * perPage + perPage)

  // Clamped page navigation shared by arrows, dots and swipe.
  const goTo = (next: number) => {
    const clamped = Math.max(0, Math.min(totalPages - 1, next))
    if (clamped === page) return
    setDirection(clamped > page ? 1 : -1)
    setPage(clamped)
  }

  // Mobile: a horizontal flick past a small distance / velocity flips the page.
  const handleDragEnd = (_e: unknown, info: PanInfo) => {
    if (info.offset.x < -50 || info.velocity.x < -500) goTo(page + 1)
    else if (info.offset.x > 50 || info.velocity.x > 500) goTo(page - 1)
  }

  // Directional slide + fade. Falls back to a plain fade under reduced-motion.
  const pageVariants = {
    enter:  (dir: number) => (reducedMotion ? { opacity: 0 } : { opacity: 0, x: dir > 0 ? 48 : -48 }),
    center: { opacity: 1, x: 0 },
    exit:   (dir: number) => (reducedMotion ? { opacity: 0 } : { opacity: 0, x: dir > 0 ? -48 : 48 }),
  }

  return (
    <section className="border-t border-border-subtle py-16 md:py-[60px]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[60px]">

        {/* Header row */}
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            {subtitle && (
              <p className="font-body text-[11px] tracking-widest uppercase text-on-surface-muted mb-1">
                {subtitle}
              </p>
            )}
            {/* title nudged -3px (-ml-[3px]) to sit a touch further left, per design */}
            <h2 className="font-display text-5xl text-on-surface leading-none -ml-[3px]">
              {title}
            </h2>
          </div>

          {viewAllLinks && viewAllLinks.length > 0 ? (
            <div className="flex items-center gap-4 shrink-0 ml-4">
              {viewAllLinks.map(link => (
                <Link key={link.href} href={link.href} className="group relative">
                  <span className="font-body text-[11px] tracking-widest uppercase text-on-surface">
                    {link.label}
                  </span>
                  <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-on-surface scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-[280ms]" />
                </Link>
              ))}
            </div>
          ) : viewAllHref ? (
            <Link href={viewAllHref} className="group relative shrink-0 ml-4">
              <span className="font-body text-[11px] tracking-widest uppercase text-on-surface">
                {t('viewAll')}
              </span>
              <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-on-surface scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-[280ms]" />
            </Link>
          ) : null}
        </div>

        {/* Product grid — one page at a time. On mobile the grid is draggable, so
            a finger-flick swaps pages; on desktop the arrows below do the same.
            overflow-hidden clips the off-screen slide so neighbouring pages never
            peek past the section edge. */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={page}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.32, ease: EASE }}
              drag={isMobile && totalPages > 1 ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={handleDragEnd}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 touch-pan-y"
            >
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Page indicator — tappable dots. On mobile, a finger-swipe changes page
            (the slide animation follows the swipe direction); desktop clicks a dot. */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-7">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const isActive = idx === page
              return (
                // p-2 gives a 24px hit area around each 8–10px dot (meets 44px recommended via adjacent dots)
                <button
                  key={idx}
                  type="button"
                  aria-label={t('goToPage', { n: idx + 1 })}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={() => goTo(idx)}
                  className="p-2"
                >
                  <motion.span
                    animate={isActive ? { scale: reducedMotion ? 1 : 1.25 } : { scale: 1 }}
                    transition={{ duration: 0.15 }}
                    className={cn(
                      'block rounded-full transition-colors',
                      isActive ? 'w-2.5 h-2.5 bg-on-surface' : 'w-2 h-2 bg-border-subtle',
                    )}
                  />
                </button>
              )
            })}
          </div>
        )}

      </div>
    </section>
  )
}
