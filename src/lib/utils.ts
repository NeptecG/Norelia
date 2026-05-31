import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { PRODUCTS } from '@/data/products'
import { STOCK, STOCK_BY_SIZE, DEFAULT_STOCK } from '@/data/stock'
import { BP, FIT_SURCHARGE, EMBROIDERY_SURCHARGE } from '@/data/pricing'
import type { Product, Gender, GarmentType, SizeKey, FitType, PrintMethod } from '@/types'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function byGender(gender: Gender, pool: Product[] = PRODUCTS): Product[] {
  return pool.filter(p => p.gender === gender || p.gender === 'unisex')
}

export function getStock(id: number, size?: string): number {
  const bySize = STOCK_BY_SIZE[id]
  if (bySize) {
    if (size !== undefined) return bySize[size] ?? 0
    // No size given: sum all size quantities (total remaining stock)
    return Object.values(bySize).reduce((sum, n) => sum + n, 0)
  }
  return STOCK[id] ?? DEFAULT_STOCK
}

export function getPrice(
  garment: GarmentType,
  size: SizeKey,
  fit: FitType,
  printMethod: PrintMethod,
): number {
  const base      = BP[garment][size] ?? 0
  const fitExtra  = fit === 'oversized' ? FIT_SURCHARGE : 0
  const pmExtra   = printMethod === 'embroidery' ? EMBROIDERY_SURCHARGE : 0
  return base + fitExtra + pmExtra
}

/**
 * Removes Greek tonos (acute accent) from a string while preserving the
 * dialytika (ϊ, ϋ). Use this ONLY when an accented Greek value must be rendered
 * through CSS `text-transform: uppercase`: uppercasing a tonos produces a
 * broken-looking artifact (e.g. Μαύρο becomes ΜΑΎΡΟ). The source string stays
 * accented for normal-case displays; strip only at the uppercase render site.
 */
export function stripGreekTonos(input: string): string {
  // NFD decomposes precomposed accents into base char + combining mark, so we
  // can drop the varia/tonos/perispomeni marks but keep dialytika (U+0308).
  return input
    .normalize('NFD')
    .replace(/[̀́͂]/g, '')
    .normalize('NFC')
}

export function parsePriceNumber(price: string): number {
  return parseFloat(price.replace('€', ''))
}

export function calcSalePercent(price: string, salePrice: number): number {
  const orig = parsePriceNumber(price)
  return Math.round((1 - salePrice / orig) * 100)
}

export const CAT_SLUG_TO_FILTER: Record<string, string> = {
  tshirts:  'TSHIRTS',
  hoodies:  'HOODIES',
  zippers:  'ZIPPERS',
  tanktops: 'TANKTOPS',
  newin:    'NEWIN',
  sale:     'SALES',
}

export const FILTER_TO_SLUG: Record<string, string> = {
  TSHIRTS:  'tshirts',
  HOODIES:  'hoodies',
  ZIPPERS:  'zippers',
  TANKTOPS: 'tanktops',
  NEWIN:    'newin',
  SALES:    'sale',
}

