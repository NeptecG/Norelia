import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { FeaturedCarousel } from './featured-carousel'
import type { Product } from '@/types'

vi.mock('@/components/products/product-card', () => ({
  ProductCard: ({ product }: { product: { name: string } }) => (
    <div data-testid="product-card">{product.name}</div>
  ),
}))

vi.mock('motion/react', () => ({
  motion: {
    div: ({
      children,
      ...rest
    }: {
      children: React.ReactNode
      [key: string]: unknown
    }) => <div {...(rest as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>,
    button: ({
      children,
      onClick,
      ...rest
    }: {
      children: React.ReactNode
      onClick?: () => void
      [key: string]: unknown
    }) => (
      <button onClick={onClick} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
        {children}
      </button>
    ),
    span: ({
      children,
      ...rest
    }: {
      children: React.ReactNode
      [key: string]: unknown
    }) => <span {...(rest as React.HTMLAttributes<HTMLSpanElement>)}>{children}</span>,
  },
  useReducedMotion: () => false,
}))

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string
    children: React.ReactNode
    [key: string]: unknown
  }) => (
    <a href={href} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
      {children}
    </a>
  ),
}))

function makeProduct(id: number, name: string): Product {
  return {
    id,
    name,
    cat: 'TSHIRTS',
    gender: 'unisex',
    code: `TS-00${id}`,
    description: 'A product',
    price: '€45',
    tag: '',
    img: `/images/products/ts-00${id}.jpg`,
  }
}

const FOUR_PRODUCTS = [
  makeProduct(1, 'Product One'),
  makeProduct(2, 'Product Two'),
  makeProduct(3, 'Product Three'),
  makeProduct(4, 'Product Four'),
]

const FIVE_PRODUCTS = [...FOUR_PRODUCTS, makeProduct(5, 'Product Five')]

beforeEach(() => {
  vi.useFakeTimers()
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1280 })
})
afterEach(() => {
  vi.useRealTimers()
  vi.clearAllMocks()
})

describe('FeaturedCarousel', () => {
  it('returns null when products is empty', () => {
    const { container } = render(
      <FeaturedCarousel title="New In Collection" products={[]} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders the title', () => {
    render(<FeaturedCarousel title="New In Collection" products={FOUR_PRODUCTS} />)
    expect(screen.getByText('New In Collection')).toBeTruthy()
  })

  it('renders product cards for provided products after skeleton', () => {
    render(<FeaturedCarousel title="New In Collection" products={FOUR_PRODUCTS} />)
    // Advance past 750ms skeleton
    act(() => vi.advanceTimersByTime(1000))
    const cards = screen.getAllByTestId('product-card')
    expect(cards).toHaveLength(4)
  })

  it('renders View All link when viewAllHref is provided', () => {
    render(
      <FeaturedCarousel
        title="New In"
        products={FOUR_PRODUCTS}
        viewAllHref="/shop"
      />,
    )
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/shop')
  })

  it('does NOT render View All link when viewAllHref is absent', () => {
    render(<FeaturedCarousel title="New In" products={FOUR_PRODUCTS} />)
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('shows dot pagination when there are more than 4 products', () => {
    render(<FeaturedCarousel title="New In" products={FIVE_PRODUCTS} />)
    act(() => vi.advanceTimersByTime(1000))
    const dots = screen.getAllByRole('button')
    // 2 pages → 2 dot buttons
    expect(dots.length).toBeGreaterThanOrEqual(2)
  })

  it('does NOT show dot pagination when there are 4 or fewer products', () => {
    render(<FeaturedCarousel title="New In" products={FOUR_PRODUCTS} />)
    act(() => vi.advanceTimersByTime(1000))
    expect(screen.queryByRole('button')).toBeNull()
  })
})
