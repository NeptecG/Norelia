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

// Detach a leading currency symbol (€) from the amount with a hair of space,
// so "€45" doesn't read as if the glyphs are touching. em-based so it scales
// with the price font size.
function withCurrencyGap(price: string) {
  const match = price.match(/^(\D+)(.*)$/)
  if (!match) return price
  return (
    <>
      {/* mr-[0.12em]: subtle gap after the currency symbol, scales with font size */}
      <span className="mr-[0.12em]">{match[1]}</span>
      {match[2]}
    </>
  )
}

export function PriceTag({ price, salePrice, size = 'md' }: Props) {
  const cls = sizeClass[size]

  if (!salePrice) {
    return (
      <p className={`font-body font-medium text-on-surface ${cls}`}>{withCurrencyGap(price)}</p>
    )
  }

  const pct = calcSalePercent(price, salePrice)

  return (
    <div className={`flex items-center gap-1.5 ${cls}`}>
      <span className="font-body line-through text-on-surface-muted">{withCurrencyGap(price)}</span>
      <span className="font-body font-bold text-destructive">
        {/* mr-[0.12em]: same subtle gap after the € on the sale price */}
        <span className="mr-[0.12em]">€</span>{salePrice}
      </span>
      {/* Fixed-height inline-flex: avoids leading-none glyph-shift; h-[1.5em] is
          relative to the badge's own font size so it scales with the parent size class */}
      <span className="inline-flex items-center rounded bg-destructive px-[5px] h-[1.5em] text-[0.72em] font-bold text-surface self-center lining-nums tabular-nums whitespace-nowrap">
        −{pct}%
      </span>
    </div>
  )
}
