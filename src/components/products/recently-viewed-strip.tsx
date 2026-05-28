'use client'
import { Link } from '@/navigation'
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
        {/* scroll-snap horizontal strip; children snap to start on swipe */}
        <div
          className={cn(
            'flex gap-4 overflow-x-auto pb-4 scrollbar-hide',
            '[scroll-snap-type:x_mandatory]',
            '[&>*]:[scroll-snap-align:start]',
          )}
        >
          {recentlyViewed.slice(0, 8).map(product => (
            <Link
              key={product.id}
              href={`/product/${product.code}`}
              /* fixed card width keeps all thumbnails uniform inside the scroll strip */
              className="shrink-0 w-[160px] md:w-[200px] group"
            >
              <div className="relative aspect-[3/4] bg-surface-raised overflow-hidden mb-2">
                <Image
                  src={product.img}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:opacity-80 transition-opacity"
                  sizes="(min-width: 768px) 200px, 160px"
                />
              </div>
              {/* sub-caption micro-typography: intentionally smaller than any scale step */}
              <p className="font-body text-[10px] tracking-[0.12em] uppercase text-on-surface truncate">
                {product.name}
              </p>
              <p className="font-body text-[11px] text-on-surface-muted">
                {product.salePrice != null ? `€${product.salePrice}` : product.price}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
