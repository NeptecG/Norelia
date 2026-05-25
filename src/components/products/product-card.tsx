'use client'
import type { Product } from '@/types'
interface Props { product: Product }
export function ProductCard({ product }: Props) {
  return <div className="border border-border aspect-[3/4] bg-surface-raised" aria-label={product.name} />
}
