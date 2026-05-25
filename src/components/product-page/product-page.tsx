'use client'
import type { Product } from '@/types'
interface Props { product: Product }
export function ProductPageClient({ product }: Props) {
  return (
    <div className="max-w-[1440px] mx-auto px-8 py-12 bg-surface">
      <p className="font-display text-4xl text-on-surface">{product.name}</p>
    </div>
  )
}
