interface Props { price: string; salePrice?: number }
export function PriceTag({ price }: Props) {
  return <p className="font-body text-sm font-medium text-on-surface">{price}</p>
}
