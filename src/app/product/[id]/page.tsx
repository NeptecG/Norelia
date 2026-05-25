import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PRODUCTS } from '@/data/products'
import { BRAND } from '@/lib/constants'

interface Props { params: Promise<{ id: string }> }

export function generateStaticParams() {
  return PRODUCTS.map(p => ({ id: p.code }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = PRODUCTS.find(p => p.code === id)
  if (!product) return {}
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | ${BRAND}`,
      images: [{ url: product.img, width: 400, height: 533 }],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const product = PRODUCTS.find(p => p.code === id)
  if (!product) notFound()
  return (
    <main className="min-h-screen pt-20 px-8 bg-surface">
      <p className="font-display text-4xl text-on-surface">{product.name} (shell)</p>
    </main>
  )
}
