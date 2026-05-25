import { PRODUCTS } from '@/data/products'
import { ProductCard } from '@/components/products/product-card'
import { catLabelPlural } from '@/lib/utils'
import type { Product } from '@/types'

export function RelatedProducts({ product }: { product: Product }) {
  const related = PRODUCTS.filter(p => p.cat === product.cat && p.id !== product.id).slice(0, 4)
  if (related.length === 0) return null

  return (
    <section className="py-16 border-t border-border-subtle">
      <div className="max-w-[1440px] mx-auto px-4 md:px-[60px]">
        <h2 className="font-display text-5xl text-on-surface leading-none mb-8 md:mb-10">
          MORE {catLabelPlural(product.cat).toUpperCase()}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {related.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  )
}
