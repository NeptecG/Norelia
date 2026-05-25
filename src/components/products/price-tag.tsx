import { calcSalePercent } from '@/lib/utils'

interface Props {
  price: string
  salePrice?: number
  size?: 'sm' | 'md' | 'lg'
}

const sizeClass: Record<NonNullable<Props['size']>, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-lg',
}

export function PriceTag({ price, salePrice, size = 'md' }: Props) {
  const cls = sizeClass[size]

  if (!salePrice) {
    return (
      <p className={`font-body font-medium text-on-surface ${cls}`}>{price}</p>
    )
  }

  const pct = calcSalePercent(price, salePrice)

  return (
    <div className={`flex items-center gap-1.5 ${cls}`}>
      <span className="font-body line-through text-on-surface-muted">{price}</span>
      <span className="font-body font-bold text-destructive">€{salePrice}</span>
      <span className="rounded bg-destructive px-1 py-0.5 text-[0.65em] font-semibold text-white leading-none">
        -{pct}%
      </span>
    </div>
  )
}
