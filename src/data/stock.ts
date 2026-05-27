import type { StockMap } from '@/types'

// Flat totals — used as fallback when no per-size data exists
export const STOCK: StockMap = {
  25: 2,
  1: 8,  6: 5,  9: 3,  14: 7, 17: 9,
  21: 6, 22: 4, 26: 10, 28: 3,
}

export const DEFAULT_STOCK = 25

// Per-size stock for limited products — sums match STOCK totals above
export const STOCK_BY_SIZE: Record<number, Record<string, number>> = {
  25: { S: 1,  M: 1,  L: 0, XL: 0, '2XL': 0, '3XL': 0 },
  1:  { S: 3,  M: 2,  L: 2, XL: 1, '2XL': 0, '3XL': 0 },
  6:  { S: 2,  M: 2,  L: 1, XL: 0, '2XL': 0, '3XL': 0 },
  9:  { S: 0,  M: 1,  L: 2, XL: 0, '2XL': 0, '3XL': 0 },
  14: { S: 3,  M: 2,  L: 2, XL: 0, '2XL': 0, '3XL': 0 },
  17: { S: 4,  M: 3,  L: 2, XL: 0, '2XL': 0, '3XL': 0 },
  21: { S: 1,  M: 2,  L: 2, XL: 1, '2XL': 0, '3XL': 0 },
  22: { S: 0,  M: 2,  L: 2, XL: 0, '2XL': 0, '3XL': 0 },
  26: { S: 3,  M: 4,  L: 2, XL: 1, '2XL': 0, '3XL': 0 },
  28: { S: 1,  M: 1,  L: 1, XL: 0, '2XL': 0, '3XL': 0 },
}
