'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/navigation'
import { useTranslations } from 'next-intl'
import { motion, useReducedMotion } from 'motion/react'
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
    window.addEventListener('resize', check)
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

interface Props {
  title: string
  subtitle?: string
  products: Product[]
  viewAllHref?: string
}

export function FeaturedCarousel({ title, subtitle, products, viewAllHref }: Props) {
  const reducedMotion = useReducedMotion()
  const isMobile = useIsMobile()
  const t = useTranslations('FeaturedCarousel')
  // No artificial loading delay — data is static and available immediately

  const perPage = isMobile ? 2 : 4
  const totalPages = Math.ceil(products.length / perPage)
  const { page, setPage } = usePagination(totalPages)

  if (products.length === 0) return null

  const visibleProducts = products.slice(page * perPage, page * perPage + perPage)

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

          {viewAllHref && (
            <Link href={viewAllHref} className="group relative shrink-0 ml-4">
              <span className="font-body text-[11px] tracking-widest uppercase text-on-surface">
                {t('viewAll')}
              </span>
              <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-on-surface scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-[280ms]" />
            </Link>
          )}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {visibleProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={reducedMotion ? false : { opacity: 0, y: 22 }}
              animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: idx * 0.08,
                ease: EASE,
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* Dot pagination */}
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
                  onClick={() => setPage(idx)}
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
