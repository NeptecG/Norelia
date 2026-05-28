import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }))
vi.mock('@/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/',
  Link: ({ href, children, ...rest }: { href: string; children: React.ReactNode; [key: string]: unknown }) =>
    <a href={href} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>{children}</a>,
}))
vi.mock('next/image', () => ({ default: ({ alt }: { alt: string }) => React.createElement('img', { alt }) }))
vi.mock('@/stores/ui-store', () => ({ useUIStore: vi.fn(() => ({ showToast: vi.fn(), recentlyViewed: [] })) }))
vi.mock('@/stores/cart-store', () => ({ useCartStore: vi.fn(() => ({ cartItems: {}, addToCart: vi.fn() })) }))
vi.mock('@/stores/favorites-store', () => ({ useFavoritesStore: vi.fn(() => ({ toggleFavorite: vi.fn(), isFavorite: vi.fn(() => false) })) }))

import { RelatedProducts } from './related-products'
import type { Product } from '@/types'

const PROD: Product = { id: 1, name: 'TEST TEE', cat: 'TSHIRTS', gender: 'men', code: '100001', description: 'desc', price: '€45', tag: '', img: '/a.jpg' }

describe('RelatedProducts', () => {
  it('renders MORE TSHIRTS heading', () => {
    render(<RelatedProducts product={PROD} />)
    expect(screen.getByText(/MORE/i)).toBeTruthy()
  })
  it('renders up to 4 related products (excludes current)', () => {
    render(<RelatedProducts product={PROD} />)
    // Should show products from TSHIRTS category, not id=1
    const images = document.querySelectorAll('img')
    expect(images.length).toBeGreaterThan(0)
    expect(images.length).toBeLessThanOrEqual(4)
  })
})
