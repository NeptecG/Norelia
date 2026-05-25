import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CAT_SLUG_TO_FILTER, catLabelPlural } from '@/lib/utils'

const VALID_GENDERS = ['men', 'women']
const VALID_CATS    = Object.keys(CAT_SLUG_TO_FILTER)

interface Props { params: Promise<{ gender: string; category: string }> }

export function generateStaticParams() {
  return VALID_GENDERS.flatMap(gender =>
    VALID_CATS.map(category => ({ gender, category }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { gender, category } = await params
  const filter = CAT_SLUG_TO_FILTER[category]
  if (!filter) return {}
  return { title: `${catLabelPlural(filter)} — ${gender === 'men' ? 'Men' : 'Women'}` }
}

export default async function CategoryPage({ params }: Props) {
  const { gender, category } = await params
  if (!VALID_GENDERS.includes(gender) || !VALID_CATS.includes(category)) notFound()
  return (
    <main className="min-h-screen pt-20 px-8 bg-surface">
      <p className="font-display text-4xl capitalize text-on-surface">{gender} / {category} (shell)</p>
    </main>
  )
}
