import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@/stores/ui-store', () => ({ useUIStore: vi.fn() }))
vi.mock('@/stores/cart-store', () => ({ useCartStore: vi.fn() }))
vi.mock('@/stores/favorites-store', () => ({ useFavoritesStore: vi.fn() }))
vi.mock('@/data/products', () => ({ PRODUCTS: [] }))
vi.mock('next/link', () => ({
  default: ({ href, children, onClick, ...rest }: { href: string; children: React.ReactNode; onClick?: () => void; [key: string]: unknown }) =>
    <a href={href} onClick={onClick} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>{children}</a>,
}))
vi.mock('next/image', () => ({
  default: ({ alt, ...rest }: { alt: string; [key: string]: unknown }) =>
    <img alt={alt} {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)} />,
}))
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn() }),
}))

import { useUIStore } from '@/stores/ui-store'
import { useCartStore } from '@/stores/cart-store'
import { useFavoritesStore } from '@/stores/favorites-store'
import { Nav } from './nav'

const DEFAULT_STORES = () => {
  vi.mocked(useUIStore).mockReturnValue({
    toggleSidePanel: vi.fn(),
    setShowSignIn: vi.fn(),
  } as ReturnType<typeof useUIStore>)
  vi.mocked(useCartStore).mockReturnValue({
    cartItems: {},
    cartCount: () => 0,
  } as ReturnType<typeof useCartStore>)
  vi.mocked(useFavoritesStore).mockReturnValue({
    favorites: [],
  } as ReturnType<typeof useFavoritesStore>)
}

beforeEach(DEFAULT_STORES)

describe('Nav', () => {
  it('renders the brand name NORELIA.', () => {
    render(<Nav />)
    expect(screen.getAllByText('NORELIA.').length).toBeGreaterThan(0)
  })

  it('renders a link to home (/)', () => {
    render(<Nav />)
    const homeLinks = document.querySelectorAll('a[href="/"]')
    expect(homeLinks.length).toBeGreaterThan(0)
  })

  it('renders a link to /men', () => {
    render(<Nav />)
    const menLinks = document.querySelectorAll('a[href="/men"]')
    expect(menLinks.length).toBeGreaterThan(0)
  })

  it('renders a link to /women', () => {
    render(<Nav />)
    const womenLinks = document.querySelectorAll('a[href="/women"]')
    expect(womenLinks.length).toBeGreaterThan(0)
  })

  it('renders favorites and cart buttons', () => {
    render(<Nav />)
    expect(screen.getByLabelText(/saved items/i)).toBeTruthy()
    expect(screen.getByLabelText(/cart/i)).toBeTruthy()
  })
})
