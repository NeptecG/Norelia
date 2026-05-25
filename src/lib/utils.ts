import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { PRODUCTS } from '@/data/products'
import { STOCK, DEFAULT_STOCK } from '@/data/stock'
import { BP, FIT_SURCHARGE, EMBROIDERY_SURCHARGE } from '@/data/pricing'
import type { Product, Gender, GarmentType, SizeKey, FitType, PrintMethod } from '@/types'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function byGender(gender: Gender, pool: Product[] = PRODUCTS): Product[] {
  return pool.filter(p => p.gender === gender || p.gender === 'unisex')
}

export function getStock(id: number): number {
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

export function catLabel(cat: string): string {
  const map: Record<string, string> = {
    TSHIRTS:  'T-Shirt',
    HOODIES:  'Hoodie',
    ZIPPERS:  'Zip Hoodie',
    TANKTOPS: 'Tank Top',
    NEWIN:    'New In',
    SALES:    'Sale',
  }
  return map[cat] ?? cat
}

export function catLabelPlural(cat: string): string {
  const map: Record<string, string> = {
    TSHIRTS:  'T-Shirts',
    HOODIES:  'Hoodies',
    ZIPPERS:  'Zippers',
    TANKTOPS: 'Tank Tops',
    NEWIN:    'New In',
    SALES:    'Sale',
  }
  return map[cat] ?? cat
}
