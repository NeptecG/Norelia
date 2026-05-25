import { describe, it, expect } from 'vitest'
import { cn, byGender, getStock, getPrice, parsePriceNumber, calcSalePercent } from './utils'
import type { Product } from '@/types'

const makeProduct = (overrides: Partial<Product>): Product => ({
  id: 1, name: '', cat: 'TSHIRTS', gender: 'men', code: '', description: '', price: '€40', tag: '', img: '',
  ...overrides,
})

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })
  it('deduplicates tailwind classes — last wins', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })
  it('handles falsy values', () => {
    expect(cn('foo', false && 'bar', undefined, 'baz')).toBe('foo baz')
  })
})

describe('byGender', () => {
  it('returns only men products for men', () => {
    const pool = [makeProduct({ gender: 'men' }), makeProduct({ id: 2, gender: 'women' })]
    expect(byGender('men', pool)).toHaveLength(1)
    expect(byGender('men', pool)[0].id).toBe(1)
  })
  it('includes unisex in both men and women', () => {
    const pool = [makeProduct({ gender: 'unisex' })]
    expect(byGender('men', pool)).toHaveLength(1)
    expect(byGender('women', pool)).toHaveLength(1)
  })
  it('excludes the other gender', () => {
    const pool = [makeProduct({ gender: 'women' })]
    expect(byGender('men', pool)).toHaveLength(0)
  })
})

describe('getStock', () => {
  it('returns specific low-stock count for product id 25', () => {
    expect(getStock(25)).toBe(2)
  })
  it('returns DEFAULT_STOCK (25) for unknown product', () => {
    expect(getStock(9999)).toBe(25)
  })
  it('returns specific count for product id 9 (3 left)', () => {
    expect(getStock(9)).toBe(3)
  })
})

describe('getPrice', () => {
  it('returns base price for normal fit DTG t-shirt M', () => {
    expect(getPrice('tshirt', 'M', 'normal', 'dtg')).toBeCloseTo(24.99)
  })
  it('adds €4 for oversized fit', () => {
    expect(getPrice('tshirt', 'M', 'oversized', 'dtg')).toBeCloseTo(28.99)
  })
  it('adds €7 for embroidery', () => {
    expect(getPrice('tshirt', 'M', 'normal', 'embroidery')).toBeCloseTo(31.99)
  })
  it('adds both surcharges', () => {
    expect(getPrice('tshirt', 'M', 'oversized', 'embroidery')).toBeCloseTo(35.99)
  })
  it('uses hoodie base price', () => {
    expect(getPrice('hoodie', 'S', 'normal', 'dtg')).toBeCloseTo(42.99)
  })
})

describe('parsePriceNumber', () => {
  it('strips € prefix and returns float', () => {
    expect(parsePriceNumber('€45')).toBe(45)
    expect(parsePriceNumber('€110')).toBe(110)
    expect(parsePriceNumber('€24.99')).toBeCloseTo(24.99)
  })
})

describe('calcSalePercent', () => {
  it('calculates 25% off correctly', () => {
    expect(calcSalePercent('€100', 75)).toBe(25)
  })
  it('rounds to nearest integer', () => {
    expect(calcSalePercent('€37', 27)).toBe(27)  // 1 - 27/37 = 27.02%
  })
})
