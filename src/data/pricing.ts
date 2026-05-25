import type { BasePrices } from '@/types'

export const BP: BasePrices = {
  tshirt: { S: 22.99, M: 24.99, L: 24.99, XL: 26.99, '2XL': 28.99, '3XL': 30.99 },
  hoodie: { S: 42.99, M: 44.99, L: 44.99, XL: 46.99, '2XL': 49.99, '3XL': 52.99 },
  zipper: { S: 49.99, M: 52.99, L: 52.99, XL: 55.99, '2XL': 59.99, '3XL': 63.99 },
}

export const FIT_SURCHARGE            = 4   // +€4 oversized
export const EMBROIDERY_SURCHARGE     = 7   // +€7 embroidery
export const FREE_SHIPPING_THRESHOLD  = 60
export const VAT_RATE                 = 0.24
