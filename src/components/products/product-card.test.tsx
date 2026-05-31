import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProductCard } from './product-card'
import type { Product } from '@/types'
import { useFavoritesStore } from '@/stores/favorites-store'
import { useCartStore } from '@/stores/cart-store'
import { useUIStore } from '@/stores/ui-store'

// Mock next/image — omit non-DOM props (fill, priority) to avoid React warnings
vi.mock('next/image', () => ({
  default: ({ src, alt, className, sizes }: { src: string; alt: string; className?: string; sizes?: string; fill?: boolean; priority?: boolean }) =>
    React.createElement('img', { src, alt, className, sizes }),
}))

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

// Mock @/navigation (useRouter used for color swatch routing, usePathname for gender context)
vi.mock('@/navigation', () => ({
  useRouter:   () => ({ push: vi.fn() }),
  usePathname: () => '/',
  Link: ({
    href,
    children,
    ...rest
  }: {
    href: string
    children: React.ReactNode
    [key: string]: unknown
  }) => React.createElement('a', { href, ...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>) }, children),
}))

// Mock Zustand stores (localStorage unavailable in jsdom)
vi.mock('@/stores/favorites-store', () => ({
  useFavoritesStore: vi.fn(() => ({
    favorites: [],
    toggleFavorite: vi.fn(),
    isFavorite: () => false,
  })),
}))

vi.mock('@/stores/cart-store', () => ({
  useCartStore: vi.fn(() => ({
    cartItems: {},
    addToCart: vi.fn(),
    cartCount: () => 0,
  })),
}))

vi.mock('@/stores/ui-store', () => ({
  useUIStore: vi.fn(() => ({
    showToast: vi.fn(),
    sidePanel: null,
    setSidePanel: vi.fn(),
    toggleSidePanel: vi.fn(),
  })),
}))

const baseProduct: Product = {
  id: 1,
  name: 'Urban Drop Tee',
  cat: 'TSHIRTS',
  gender: 'unisex',
  code: 'TS-001',
  description: 'A classic tee',
  price: '€45',
  tag: '',
  img: '/images/products/ts-001.jpg',
}

const mockProduct = baseProduct

describe('ProductCard', () => {
  it('renders the product name', () => {
    render(<ProductCard product={baseProduct} />)
    // Text is uppercased via CSS; DOM content retains the original casing
    expect(screen.getByText('Urban Drop Tee')).toBeInTheDocument()
  })

  it('renders NEW badge when tag === "NEW"', () => {
    render(<ProductCard product={{ ...baseProduct, tag: 'NEW' }} />)
    expect(screen.getByText('new')).toBeInTheDocument()
  })

  it('does NOT render NEW badge when tag === ""', () => {
    render(<ProductCard product={{ ...baseProduct, tag: '' }} />)
    expect(screen.queryByText('new')).not.toBeInTheDocument()
  })

  it('renders a link to /product/{code}', () => {
    render(<ProductCard product={baseProduct} />)
    const link = screen.getByRole('link', { name: baseProduct.name })
    expect(link).toHaveAttribute('href', '/product/TS-001')
  })

  it('renders sale indicator when salePrice exists', () => {
    render(<ProductCard product={{ ...baseProduct, price: '€45', salePrice: 27 }} />)
    // Currency symbol renders in its own span, so price text is split across
    // nodes — match the innermost element whose combined textContent is the price.
    const byPrice = (text: string) =>
      screen.getByText((_, el) =>
        el?.textContent === text && Array.from(el?.children ?? []).every(c => c.textContent !== text),
      )
    // Original price should be struck through
    expect(byPrice('€45')).toHaveClass('line-through')
    // Sale price shown
    expect(byPrice('€27')).toBeInTheDocument()
  })

  it('calls toggleFavorite when heart button is clicked', () => {
    const toggleFavorite = vi.fn()
    vi.mocked(useFavoritesStore).mockReturnValue({ favorites: [], toggleFavorite, isFavorite: () => false })
    render(<ProductCard product={mockProduct} />)
    const heartBtn = screen.getByLabelText(/addToFavorites/i)
    fireEvent.click(heartBtn)
    expect(toggleFavorite).toHaveBeenCalledWith(mockProduct.id)
  })

  it('shows size picker when Quick Add is clicked, then calls addToCart on size selection', () => {
    const addToCart = vi.fn()
    const showToast = vi.fn()
    vi.mocked(useCartStore).mockReturnValue({ cartItems: {}, addToCart, cartCount: () => 0 })
    vi.mocked(useUIStore).mockReturnValue({ showToast, sidePanel: null, setSidePanel: vi.fn(), toggleSidePanel: vi.fn() })
    render(<ProductCard product={mockProduct} />)
    // Step 1: click QUICK ADD → size picker appears
    fireEvent.click(screen.getByText(/quickAdd/i))
    // Step 2: pick a size → addToCart and showToast fired
    fireEvent.click(screen.getByText('M'))
    expect(addToCart).toHaveBeenCalledWith(mockProduct.id, 1)
    expect(showToast).toHaveBeenCalled()
  })
})
