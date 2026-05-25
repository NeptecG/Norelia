'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'
import { ProductCard } from '@/components/products/product-card'
import type { Product } from '@/types'

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
  const [loading, setLoading] = useState(true)

  const perPage = isMobile ? 2 : 4
  const totalPages = Math.ceil(products.length / perPage)
  const { page, setPage } = usePagination(totalPages)

  // Skeleton loading state — show for 750ms on first mount
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 750)
    return () => clearTimeout(timer)
  }, [])

  if (products.length === 0) return null

  const visibleProducts = products.slice(page * perPage, page * perPage + perPage)
  const skeletonCount = isMobile ? 2 : 4

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
            <h2 className="font-display text-5xl text-on-surface leading-none">
              {title}
            </h2>
          </div>

          {viewAllHref && (
            <Link href={viewAllHref} className="group relative shrink-0 ml-4">
              <span className="font-body text-[11px] tracking-widest uppercase text-on-surface">
                View All →
              </span>
              {/* Animated underline — using transform/opacity per CLAUDE.md */}
              <motion.span
                className="absolute inset-x-0 bottom-0 h-px bg-on-surface origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: reducedMotion ? 0 : 1 }}
                transition={{ duration: 0.25, ease: [0.25, 0, 0, 1] }}
              />
            </Link>
          )}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {loading
            ? Array.from({ length: skeletonCount }).map((_, idx) => (
                <div
                  key={idx}
                  className="aspect-[3/4] bg-surface-raised animate-pulse"
                />
              ))
            : visibleProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={reducedMotion ? false : { opacity: 0, y: 22 }}
                  animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: idx * 0.08,
                    ease: [0.25, 0, 0, 1],
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
        </div>

        {/* Dot pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2.5 mt-7">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const isActive = idx === page
              return (
                <motion.button
                  key={idx}
                  type="button"
                  aria-label={`Go to page ${idx + 1}`}
                  onClick={() => setPage(idx)}
                  animate={isActive ? { scale: reducedMotion ? 1 : 1.2 } : { scale: 1 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    'rounded-full transition-colors',
                    isActive
                      ? 'w-2.5 h-2.5 bg-on-surface'
                      : 'w-2 h-2 bg-border-subtle',
                  )}
                />
              )
            })}
          </div>
        )}

      </div>
    </section>
  )
}
