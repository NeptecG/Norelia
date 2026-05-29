import { getTranslations } from 'next-intl/server'
import { PRODUCTS } from '@/data/products'
import { ProductCard } from '@/components/products/product-card'
import type { Product } from '@/types'

export async function RelatedProducts({ product }: { product: Product }) {
  const related = PRODUCTS.filter(p => p.cat === product.cat && p.id !== product.id).slice(0, 4)
  if (related.length === 0) return null

  const t = await getTranslations('RelatedProducts')

  const catLabelMap: Record<string, string> = {
    TSHIRTS:  t('catTSHIRTS'),
    HOODIES:  t('catHOODIES'),
    ZIPPERS:  t('catZIPPERS'),
    TANKTOPS: t('catTANKTOPS'),
    NEWIN:    t('catNEWIN'),
    SALES:    t('catSALES'),
  }
  const catLabel = catLabelMap[product.cat] ?? product.cat

  return (
    <section className="py-16 border-t border-border-subtle">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[60px]">
        <h2 className="font-display text-5xl text-on-surface leading-none mb-8 md:mb-10">
          {t('morePrefix')} {catLabel}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {related.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  )
}
