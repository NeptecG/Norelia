import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductGrid } from '@/components/products/product-grid'
import { byGender, CAT_SLUG_TO_FILTER } from '@/lib/utils'

interface Props {
  params:       Promise<{ locale: string; gender: string }>
  searchParams: Promise<{ filter?: string }>
}

const VALID_GENDERS = ['men', 'women']
const VALID_CAT_FILTERS = new Set(Object.values(CAT_SLUG_TO_FILTER))

export function generateStaticParams() {
  return [
    { locale: 'el', gender: 'men' },
    { locale: 'el', gender: 'women' },
    { locale: 'en', gender: 'men' },
    { locale: 'en', gender: 'women' },
  ]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { gender } = await params
  if (!VALID_GENDERS.includes(gender)) return {}
  const label = gender === 'men' ? 'Men' : 'Women'
  return {
    title: label,
    description: `Shop the full ${label.toLowerCase()} collection: T-Shirts, Hoodies, Zippers and more.`,
  }
}

export default async function GenderPage({ params, searchParams }: Props) {
  const { gender } = await params
  const { filter: rawFilter } = await searchParams

  if (!VALID_GENDERS.includes(gender)) notFound()

  const g = gender as 'men' | 'women'
  const pool = byGender(g)

  let activeFilter: string | undefined
  let products = pool

  if (rawFilter) {
    if (rawFilter === 'NEWIN') {
      activeFilter = 'NEWIN'
      products = pool.filter(p => p.tag === 'NEW')
    } else if (rawFilter === 'SALES') {
      activeFilter = 'SALES'
      products = pool.filter(p => p.salePrice != null)
    } else if (VALID_CAT_FILTERS.has(rawFilter)) {
      activeFilter = rawFilter
      products = pool.filter(p => p.cat === rawFilter)
    }
    // invalid filter → full pool, no active tab
  }

  return (
    <main className="min-h-screen pt-20 bg-surface">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[60px] py-12">
        <ProductGrid
          products={products}
          title={gender === 'men' ? 'MEN' : 'WOMEN'}
          subtitle={`${products.length} styles`}
          activeFilter={activeFilter}
          filterBase={`/${gender}`}
          genderContext={g}
        />
      </div>
    </main>
  )
}
