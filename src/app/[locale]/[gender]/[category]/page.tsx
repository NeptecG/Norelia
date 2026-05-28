import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductGrid } from '@/components/products/product-grid'
import { byGender, CAT_SLUG_TO_FILTER, catLabelPlural } from '@/lib/utils'

const VALID_GENDERS = ['men', 'women']
const VALID_CATS    = Object.keys(CAT_SLUG_TO_FILTER)

interface Props { params: Promise<{ locale: string; gender: string; category: string }> }

export function generateStaticParams() {
  return ['el', 'en'].flatMap(locale =>
    VALID_GENDERS.flatMap(gender =>
      VALID_CATS.map(category => ({ locale, gender, category }))
    )
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { gender, category } = await params
  const filter = CAT_SLUG_TO_FILTER[category]
  if (!filter || !VALID_GENDERS.includes(gender)) return {}
  const genderLabel = gender === 'men' ? 'Men' : 'Women'
  return {
    title: `${catLabelPlural(filter)} · ${genderLabel}`,
    description: `Shop ${genderLabel.toLowerCase()}'s ${catLabelPlural(filter).toLowerCase()} from Norelia.`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { gender, category } = await params

  if (!VALID_GENDERS.includes(gender) || !VALID_CATS.includes(category)) notFound()

  const g = gender as 'men' | 'women'
  const filter = CAT_SLUG_TO_FILTER[category]
  if (!filter) notFound()

  const pool = byGender(g)
  let products = pool

  if (filter === 'NEWIN') {
    products = pool.filter(p => p.tag === 'NEW')
  } else if (filter === 'SALES') {
    products = pool.filter(p => p.salePrice != null)
  } else {
    products = pool.filter(p => p.cat === filter)
  }

  return (
    <main className="min-h-screen pt-20 bg-surface">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[60px] py-12">
        <ProductGrid
          products={products}
          title={catLabelPlural(filter).toUpperCase()}
          subtitle={gender === 'men' ? 'MEN' : 'WOMEN'}
          activeFilter={filter}
          filterBase={`/${gender}`}
          genderContext={g}
        />
      </div>
    </main>
  )
}
