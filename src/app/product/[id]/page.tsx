import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PRODUCTS } from '@/data/products'
import { BRAND } from '@/lib/constants'
import { ProductPage } from '@/components/products/product-page'
import { RelatedProducts } from '@/components/products/related-products'
import { RecentlyViewedStrip } from '@/components/products/recently-viewed-strip'

interface Props {
  params:       Promise<{ id: string }>
  searchParams: Promise<{ color?: string }>
}

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

export default async function ProductDetailPage({ params, searchParams }: Props) {
  const { id }    = await params
  const { color } = await searchParams
  const product   = PRODUCTS.find(p => p.code === id)
  if (!product) notFound()
  return (
    <>
      <ProductPage product={product} initialColor={color} />
      <RelatedProducts product={product} />
      <RecentlyViewedStrip />
    </>
  )
}
