import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }))
vi.mock('@/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => '/',
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}))
vi.mock('@/stores/ui-store', () => ({ useUIStore: vi.fn() }))
vi.mock('@/stores/cart-store', () => ({ useCartStore: vi.fn() }))
vi.mock('@/stores/favorites-store', () => ({ useFavoritesStore: vi.fn() }))
// eslint-disable-next-line @next/next/no-img-element
vi.mock('next/image', () => ({ default: ({ alt }: { alt: string }) => <img alt={alt} /> }))
vi.mock('@/components/products/price-tag', () => ({ PriceTag: ({ price }: { price: string }) => <span>{price}</span> }))
vi.mock('@/components/modals/size-mini-guide', () => ({ SizeMiniGuide: () => null }))
vi.mock('@/lib/utils', async () => {
  const actual = await vi.importActual<typeof import('@/lib/utils')>('@/lib/utils')
  return { ...actual, getStock: () => 10 }
})

import { useUIStore } from '@/stores/ui-store'
import { useCartStore } from '@/stores/cart-store'
import { useFavoritesStore } from '@/stores/favorites-store'
import { ProductPage } from './product-page'
import type { Product } from '@/types'

const PROD: Product = { id: 1, name: 'TEST TEE', cat: 'TSHIRTS', gender: 'men', code: '100001', description: 'A test tee.', price: '€45', tag: 'NEW', img: '/test.jpg' }

beforeEach(() => {
  vi.mocked(useUIStore).mockReturnValue({ toggleSidePanel: vi.fn(), showToast: vi.fn(), addToRecent: vi.fn() } as ReturnType<typeof useUIStore>)
  vi.mocked(useCartStore).mockReturnValue({ cartItems: {}, addToCart: vi.fn() } as ReturnType<typeof useCartStore>)
  vi.mocked(useFavoritesStore).mockReturnValue({ favorites: [], toggleFavorite: vi.fn() } as ReturnType<typeof useFavoritesStore>)
})

describe('ProductPage', () => {
  it('renders product name', () => {
    render(<ProductPage product={PROD} />)
    expect(screen.getByRole('heading', { name: 'TEST TEE' })).toBeTruthy()
  })
  it('renders size buttons S through 3XL', () => {
    render(<ProductPage product={PROD} />)
    for (const size of ['S', 'M', 'L', 'XL', '2XL', '3XL']) {
      expect(screen.getByRole('button', { name: new RegExp(`^${size}$`) })).toBeTruthy()
    }
  })
  it('Add to Cart is disabled before size selected', () => {
    render(<ProductPage product={PROD} />)
    const btn = screen.getByRole('button', { name: /selectSize/i })
    expect(btn).toHaveAttribute('disabled')
  })
  it('Add to Cart enabled after selecting a size', () => {
    render(<ProductPage product={PROD} />)
    fireEvent.click(screen.getByRole('button', { name: /^M$/ }))
    expect(screen.getByRole('button', { name: /addToCart/i })).not.toHaveAttribute('disabled')
  })
  it('calls addToRecent with the product on mount', () => {
    const addToRecent = vi.fn()
    vi.mocked(useUIStore).mockReturnValueOnce({
      toggleSidePanel: vi.fn(),
      showToast: vi.fn(),
      addToRecent,
    } as ReturnType<typeof useUIStore>)
    render(<ProductPage product={PROD} />)
    expect(addToRecent).toHaveBeenCalledWith(PROD)
  })
})
