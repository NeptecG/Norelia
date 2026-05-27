import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ProductCard } from '@/components/products/product-card'
import type { Product } from '@/types'

interface Props {
  products: Product[]
  title?: string
  subtitle?: string
  activeFilter?: string
  showFilters?: boolean
  filterBase?: string
  genderContext?: 'men' | 'women'
}

interface FilterTab {
  key: string
  label: string
}

const ALL_TABS: FilterTab[] = [
  { key: 'ALL',      label: 'ALL' },
  { key: 'TSHIRTS',  label: 'T-SHIRTS' },
  { key: 'HOODIES',  label: 'HOODIES' },
  { key: 'ZIPPERS',  label: 'ZIPPERS' },
  { key: 'TANKTOPS', label: 'TANK TOPS' },
  { key: 'NEWIN',    label: 'NEW IN' },
  { key: 'SALES',    label: 'SALES' },
]

function getEmptyHeading(activeFilter?: string): string {
  if (activeFilter === 'NEWIN' || activeFilter === 'SALES') return 'NONE FOUND'
  return 'COMING SOON'
}

export function ProductGrid({
  products,
  title = 'Ready to Wear',
  subtitle = 'Collection',
  activeFilter,
  showFilters = true,
  filterBase = '',
  genderContext,
}: Props) {
  const tabs = genderContext === 'women'
    ? ALL_TABS.filter(t => t.key !== 'TANKTOPS')
    : ALL_TABS

  return (
    <section aria-label={title} className="w-full">
      {/* Section header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-body text-xs uppercase tracking-widest text-on-surface-muted">
            {subtitle}
          </p>
          <h2 className="font-display text-5xl uppercase leading-none text-on-surface">
            {title}
          </h2>
        </div>

        {/* Filter tab strip */}
        {showFilters && (
          <nav
            aria-label="Product filter"
            className="no-scrollbar flex gap-1 overflow-x-auto sm:justify-end"
          >
            {tabs.map(tab => {
              const isActive = tab.key === 'ALL' ? !activeFilter : activeFilter === tab.key
              // ALL clears the filter (base URL); others append ?filter=KEY
              const href = tab.key === 'ALL' ? filterBase || '.' : `${filterBase}?filter=${tab.key}`
              return (
                <Link
                  key={tab.key}
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'shrink-0 px-3 py-1.5 font-body text-[0.65rem] font-semibold uppercase tracking-widest transition-colors',
                    isActive
                      ? 'bg-on-surface text-surface'
                      : 'bg-surface text-on-surface hover:bg-surface-raised',
                  )}
                >
                  {tab.label}
                </Link>
              )
            })}
          </nav>
        )}
      </div>

      {/* Product grid or empty state */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-px lg:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < 4}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="font-display text-6xl uppercase text-on-surface-muted">
            {getEmptyHeading(activeFilter)}
          </p>
          <p className="mt-3 font-body text-sm text-on-surface-muted">
            Check back soon for new arrivals.
          </p>
        </div>
      )}
    </section>
  )
}
