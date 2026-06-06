import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/navigation'
import { Hero } from '@/components/home/hero'
import { Marquee } from '@/components/home/marquee'
import { FeaturedCarousel } from '@/components/home/featured-carousel'
import { PRODUCTS } from '@/data/products'

export const metadata: Metadata = {
  title: 'NORELIA. Premium Streetwear',
  description: 'Minimal premium streetwear. New collections, trending styles, and exclusive drops.',
  openGraph: {
    title: 'NORELIA. Premium Streetwear',
    description: 'Minimal premium streetwear. New collections, trending styles, and exclusive drops.',
    url: 'https://norelia.com',
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

      {/* ── Editorial band ── */}
      <section className="dark bg-surface-alt border-t border-border-subtle">
        <div className="max-w-[1440px] mx-auto px-4 md:px-[60px] py-20 md:py-[88px] grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
          <div>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-on-surface/40 mb-4">
              {t('editorialEyebrow')}
            </p>
            <h2 className="font-display text-[64px] md:text-[80px] leading-[0.92] tracking-[0.04em] text-on-surface whitespace-pre-line">
              {t('editorialHeading')}
            </h2>
          </div>
          <div>
            <p className="font-body text-[15px] text-on-surface-muted leading-[1.85] tracking-[0.02em] mb-8">
              {t('editorialBody')}
            </p>
            <Link
              href="/about"
              className="group relative inline-block font-body text-[10px] tracking-[0.24em] uppercase text-on-surface"
            >
              {t('editorialCta')}
              <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-on-surface scale-x-100 group-hover:opacity-60 transition-opacity duration-[280ms]" />
            </Link>
          </div>
        </div>
      </section>

      <FeaturedCarousel
        title={t('newInTitle')}
        subtitle={t('newInSubtitle')}
        products={newProducts}
        viewAllLinks={[
          { label: t('shopMen'),   href: '/men/new-in' },
          { label: t('shopWomen'), href: '/women/new-in' },
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
          { label: t('shopMen'),   href: '/men/sales' },
          { label: t('shopWomen'), href: '/women/sales' },
        ]}
      />
    </main>
  )
}
