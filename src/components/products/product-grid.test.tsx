import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProductGrid } from './product-grid'
import type { Product } from '@/types'

// Mock next-intl — return English display strings so label assertions pass
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      filterAll:      'ALL',
      filterTShirts:  'T-SHIRTS',
      filterHoodies:  'HOODIES',
      filterZippers:  'ZIPPERS',
      filterTankTops: 'TANK TOPS',
      filterNewIn:    'NEW IN',
      filterSales:    'SALES',
      nonFound:       'NONE FOUND',
      comingSoon:     'COMING SOON',
      checkBackSoon:  'Check back soon for new arrivals.',
    }
    return map[key] ?? key
  },
}))

// Mock ProductCard — keeps tests independent of ProductCard internals
vi.mock('@/components/products/product-card', () => ({
  ProductCard: ({ product }: { product: { name: string } }) => (
    <div data-testid="product-card">{product.name}</div>
  ),
}))

// Mock @/navigation — render Link as plain <a> so href assertions work in jsdom
vi.mock('@/navigation', () => ({
  Link: ({
    href,
    children,
    className,
    'aria-current': ariaCurrent,
  }: {
    href: string
    children: React.ReactNode
    className?: string
    'aria-current'?: React.AriaAttributes['aria-current']
  }) => (
    <a href={href} className={className} aria-current={ariaCurrent}>
      {children}
    </a>
  ),
}))

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeProduct(overrides: Partial<Product> & { id: number; name: string }): Product {
  return {
    cat: 'TSHIRTS',
    gender: 'unisex',
    code: `TS-${overrides.id.toString().padStart(3, '0')}`,
    description: 'A test product',
    price: '€45',
    tag: '',
    img: '/images/test.jpg',
    ...overrides,
  }
}

const PRODUCTS: Product[] = [
  makeProduct({ id: 1, name: 'Alpha Tee' }),
  makeProduct({ id: 2, name: 'Beta Hoodie', cat: 'HOODIES' }),
  makeProduct({ id: 3, name: 'Gamma Zipper', cat: 'ZIPPERS' }),
]

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ProductGrid', () => {
  it('renders a ProductCard for each product', () => {
    render(<ProductGrid products={PRODUCTS} />)
    const cards = screen.getAllByTestId('product-card')
    expect(cards).toHaveLength(PRODUCTS.length)
    expect(screen.getByText('Alpha Tee')).toBeInTheDocument()
    expect(screen.getByText('Beta Hoodie')).toBeInTheDocument()
    expect(screen.getByText('Gamma Zipper')).toBeInTheDocument()
  })

  it('shows empty state heading when products array is empty', () => {
    render(<ProductGrid products={[]} />)
    expect(screen.queryAllByTestId('product-card')).toHaveLength(0)
    expect(screen.getByText('COMING SOON')).toBeInTheDocument()
  })

  it('shows "NONE FOUND" empty state for NEWIN filter with no products', () => {
    render(<ProductGrid products={[]} activeFilter="NEWIN" />)
    expect(screen.getByText('NONE FOUND')).toBeInTheDocument()
  })

  it('shows "NONE FOUND" empty state for SALES filter with no products', () => {
    render(<ProductGrid products={[]} activeFilter="SALES" />)
    expect(screen.getByText('NONE FOUND')).toBeInTheDocument()
  })

  it('renders filter tabs when showFilters is true (default)', () => {
    render(<ProductGrid products={PRODUCTS} />)
    expect(screen.getByText('T-SHIRTS')).toBeInTheDocument()
    expect(screen.getByText('HOODIES')).toBeInTheDocument()
    expect(screen.getByText('ZIPPERS')).toBeInTheDocument()
    expect(screen.getByText('TANK TOPS')).toBeInTheDocument()
    expect(screen.getByText('NEW IN')).toBeInTheDocument()
    expect(screen.getByText('SALES')).toBeInTheDocument()
  })

  it('does NOT render filter tabs when showFilters is false', () => {
    render(<ProductGrid products={PRODUCTS} showFilters={false} />)
    expect(screen.queryByText('T-SHIRTS')).not.toBeInTheDocument()
    expect(screen.queryByText('HOODIES')).not.toBeInTheDocument()
  })

  it('active filter tab has aria-current="page"', () => {
    render(<ProductGrid products={PRODUCTS} activeFilter="TSHIRTS" />)
    const activeLink = screen.getByText('T-SHIRTS').closest('a')
    expect(activeLink).toHaveAttribute('aria-current', 'page')
  })

  it('active filter tab has inverted styling class (bg-on-surface)', () => {
    render(<ProductGrid products={PRODUCTS} activeFilter="HOODIES" />)
    const activeLink = screen.getByText('HOODIES').closest('a')
    expect(activeLink?.className).toContain('bg-on-surface')
    expect(activeLink?.className).toContain('text-surface')
  })

  it('inactive tabs do not have bg-on-surface class', () => {
    render(<ProductGrid products={PRODUCTS} activeFilter="TSHIRTS" />)
    const inactiveLink = screen.getByText('HOODIES').closest('a')
    expect(inactiveLink?.className).not.toContain('bg-on-surface')
  })

  it('omits TANK TOPS tab when genderContext is "women"', () => {
    render(<ProductGrid products={PRODUCTS} genderContext="women" />)
    expect(screen.queryByText('TANK TOPS')).not.toBeInTheDocument()
    expect(screen.getByText('T-SHIRTS')).toBeInTheDocument()
  })

  it('shows TANK TOPS tab when genderContext is "men"', () => {
    render(<ProductGrid products={PRODUCTS} genderContext="men" />)
    expect(screen.getByText('TANK TOPS')).toBeInTheDocument()
  })

  it('renders custom title and subtitle', () => {
    render(<ProductGrid products={PRODUCTS} title="New Drops" subtitle="Season" />)
    expect(screen.getByText('New Drops')).toBeInTheDocument()
    expect(screen.getByText('Season')).toBeInTheDocument()
  })

  it('filter tab links use ?filter= query param by default', () => {
    render(<ProductGrid products={PRODUCTS} />)
    const tshirtsLink = screen.getByText('T-SHIRTS').closest('a')
    expect(tshirtsLink).toHaveAttribute('href', '?filter=TSHIRTS')
  })

  it('filter tab links use filterBase prefix when provided', () => {
    render(<ProductGrid products={PRODUCTS} filterBase="/men" />)
    const hoodiesLink = screen.getByText('HOODIES').closest('a')
    expect(hoodiesLink).toHaveAttribute('href', '/men?filter=HOODIES')
  })
})
