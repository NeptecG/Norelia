import type { Metadata } from 'next'
import { Hero } from '@/components/home/hero'
import { Marquee } from '@/components/home/marquee'
import { FeaturedCarousel } from '@/components/home/featured-carousel'
import { PRODUCTS } from '@/data/products'

export const metadata: Metadata = {
  title: 'NORELIA. — Premium Streetwear',
  description: 'Minimal premium streetwear. New collections, trending styles, and exclusive drops.',
}

export default function HomePage() {
  const newProducts = PRODUCTS.filter((p) => p.tag === 'NEW')
  const trendingProducts = PRODUCTS.slice(0, 8)
  const saleProducts = PRODUCTS.filter((p) => p.salePrice !== undefined)

  return (
    <main>
      <Hero />
      <Marquee dark={true} />
      <FeaturedCarousel
        title="NEW IN COLLECTION"
        subtitle="JUST ARRIVED"
        products={newProducts}
        viewAllHref="/men?filter=NEWIN"
      />
      <FeaturedCarousel
        title="TRENDING"
        subtitle="THIS SEASON"
        products={trendingProducts}
        viewAllHref="/men"
      />
      <FeaturedCarousel
        title="ON SALE"
        subtitle="LIMITED TIME OFFERS"
        products={saleProducts}
        viewAllHref="/men?filter=SALES"
      />
    </main>
  )
}
