import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProductCard } from './product-card'
import type { Product } from '@/types'

// Mock next/image — omit non-DOM props (fill, priority) to avoid React warnings
vi.mock('next/image', () => ({
  default: ({ src, alt, className, sizes }: { src: string; alt: string; className?: string; sizes?: string; fill?: boolean; priority?: boolean }) =>
    React.createElement('img', { src, alt, className, sizes }),
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string
    children: React.ReactNode
    [key: string]: unknown
  }) => React.createElement('a', { href, ...rest }, children),
}))

// Mock Zustand stores (localStorage unavailable in jsdom)
vi.mock('@/stores/favorites-store', () => ({
  useFavoritesStore: () => ({
    favorites: [],
    toggleFavorite: vi.fn(),
    isFavorite: () => false,
  }),
}))

vi.mock('@/stores/cart-store', () => ({
  useCartStore: () => ({
    cartItems: {},
    addToCart: vi.fn(),
    cartCount: () => 0,
  }),
}))

vi.mock('@/stores/ui-store', () => ({
  useUIStore: () => ({
    showToast: vi.fn(),
    sidePanel: null,
  }),
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

describe('ProductCard', () => {
  it('renders the product name', () => {
    render(<ProductCard product={baseProduct} />)
    // Text is uppercased via CSS; DOM content retains the original casing
    expect(screen.getByText('Urban Drop Tee')).toBeInTheDocument()
  })

  it('renders NEW badge when tag === "NEW"', () => {
    render(<ProductCard product={{ ...baseProduct, tag: 'NEW' }} />)
    expect(screen.getByText('NEW')).toBeInTheDocument()
  })

  it('does NOT render NEW badge when tag === ""', () => {
    render(<ProductCard product={{ ...baseProduct, tag: '' }} />)
    expect(screen.queryByText('NEW')).not.toBeInTheDocument()
  })

  it('renders a link to /product/{id}', () => {
    render(<ProductCard product={baseProduct} />)
    const link = screen.getByRole('link', { name: baseProduct.name })
    expect(link).toHaveAttribute('href', '/product/1')
  })

  it('renders sale indicator when salePrice exists', () => {
    render(<ProductCard product={{ ...baseProduct, price: '€45', salePrice: 27 }} />)
    // Original price should be struck through
    const original = screen.getByText('€45')
    expect(original).toHaveClass('line-through')
    // Sale price shown
    expect(screen.getByText('€27')).toBeInTheDocument()
  })
})
