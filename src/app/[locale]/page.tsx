import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Hero } from '@/components/home/hero'
import { Marquee } from '@/components/home/marquee'
import { FeaturedCarousel } from '@/components/home/featured-carousel'
import { PRODUCTS } from '@/data/products'
import { SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  // absolute = no "%s | NORELIA." template suffix, so the tab reads just "NORELIA."
  title: { absolute: 'NORELIA.' },
  description: 'Minimal premium streetwear. New collections, trending styles, and exclusive drops.',
  openGraph: {
    title: 'NORELIA.',
    description: 'Minimal premium streetwear. New collections, trending styles, and exclusive drops.',
    url: SITE_URL,
    type: 'website',
  },
}

export default async function HomePage() {
  const t = await getTranslations('Home')

  const newProducts      = PRODUCTS.filter((p) => p.tag === 'NEW')
  const trendingProducts = PRODUCTS.slice(0, 8)
  const saleProducts     = PRODUCTS.filter((p) => p.salePrice !== undefined)

  return (
    <main>
      <Hero />
      <Marquee dark={true} />

      <FeaturedCarousel
        title={t('newInTitle')}
        subtitle={t('newInSubtitle')}
        products={newProducts}
        viewAllLinks={[
          { label: t('shopMen'),   href: '/men/newin' },
          { label: t('shopWomen'), href: '/women/newin' },
        ]}
      />
      <FeaturedCarousel
        title={t('trendingTitle')}
        subtitle={t('trendingSubtitle')}
        products={trendingProducts}
        viewAllLinks={[
          { label: t('shopMen'),   href: '/men' },
          { label: t('shopWomen'), href: '/women' },
        ]}
      />
      <FeaturedCarousel
        title={t('onSaleTitle')}
        subtitle={t('onSaleSubtitle')}
        products={saleProducts}
        viewAllLinks={[
          { label: t('shopMen'),   href: '/men/sale' },
          { label: t('shopWomen'), href: '/women/sale' },
        ]}
      />
    </main>
  )
}
