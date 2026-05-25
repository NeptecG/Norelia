'use client'
import type { Product } from '@/types'
interface Props { title: string; subtitle?: string; products: Product[] }
export function FeaturedCarousel({ title }: Props) {
  return (
    <section className="py-16 border-t border-border-subtle">
      <div className="max-w-[1440px] mx-auto px-16">
        <p className="font-display text-4xl text-on-surface">{title}</p>
      </div>
    </section>
  )
}
