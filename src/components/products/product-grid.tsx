import type { Product } from '@/types'
interface Props {
  products: Product[]
  filter: string
  genderFilter?: string
  onFilterChange?: (f: string) => void
}
export function ProductGrid({ products }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-0">
      {products.map(p => (
        <div key={p.id} className="border border-border aspect-[3/4] bg-surface-raised" />
      ))}
    </div>
  )
}
