'use client'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/ui-store'

export function RecentlyViewedStrip() {
  const { recentlyViewed } = useUIStore()
  if (recentlyViewed.length === 0) return null

  return (
    <section className="py-12 border-t border-border-subtle">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[60px]">
        <h2 className="font-display text-3xl text-on-surface leading-none mb-6">
          RECENTLY VIEWED
        </h2>
        {/* Horizontal scroll container with scroll-snap */}
        <div
          className={cn(
            'flex gap-4 overflow-x-auto pb-4',
            '[scroll-snap-type:x_mandatory]',
            '[&>*]:[scroll-snap-align:start]',
            'scrollbar-hide',
          )}
        >
          {recentlyViewed.slice(0, 8).map(product => (
            <Link
              key={product.id}
              href={`/product/${product.code}`}
              className="shrink-0 w-[160px] md:w-[200px] group"
            >
              <div className="relative aspect-[3/4] bg-surface-raised overflow-hidden mb-2">
                <Image
                  src={product.img}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:opacity-80 transition-opacity"
                  sizes="200px"
                />
              </div>
              <p className="font-body text-[10px] tracking-[0.12em] uppercase text-on-surface truncate">
                {product.name}
              </p>
              <p className="font-body text-[11px] text-on-surface-muted">
                {product.salePrice ? `€${product.salePrice}` : product.price}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
