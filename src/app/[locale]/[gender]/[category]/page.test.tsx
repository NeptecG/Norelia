import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@/data/products', () => ({
  PRODUCTS: [
    { id: 1, name: 'ALPHA TEE', cat: 'TSHIRTS', gender: 'men', code: '100001', description: 'desc', price: '€45', tag: 'NEW', img: '/a.jpg' },
    { id: 2, name: 'BETA HOODIE', cat: 'HOODIES', gender: 'men', code: '100002', description: 'desc', price: '€89', tag: '', img: '/b.jpg' },
    { id: 3, name: 'GAMMA TEE', cat: 'TSHIRTS', gender: 'women', code: '200001', description: 'desc', price: '€45', salePrice: 30, tag: '', img: '/c.jpg' },
  ],
}))
vi.mock('next/navigation', () => ({ notFound: vi.fn(() => { throw new Error('NOTFOUND') }), useRouter: () => ({ push: vi.fn() }), usePathname: () => '/men' }))
vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}))
vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => React.createElement('img', { alt }),
}))
vi.mock('@/stores/cart-store', () => ({
  useCartStore: vi.fn(() => ({ cartItems: {}, addToCart: vi.fn() })),
}))
vi.mock('@/stores/favorites-store', () => ({
  useFavoritesStore: vi.fn(() => ({ favorites: [], toggleFavorite: vi.fn(), isFavorite: vi.fn(() => false) })),
}))
vi.mock('@/stores/ui-store', () => ({
  useUIStore: vi.fn(() => ({ showToast: vi.fn(), toggleSidePanel: vi.fn() })),
}))

async function renderCategoryPage(gender: string, category: string) {
  const CategoryPage = (await import('./page')).default
  const jsx = await CategoryPage({
    params: Promise.resolve({ locale: 'en', gender, category }),
  })
  render(jsx)
}

describe('CategoryPage', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('renders correct title for men/tshirts', async () => {
    await renderCategoryPage('men', 'tshirts')
    expect(screen.getByRole('heading', { name: 'T-SHIRTS' })).toBeTruthy()
  })

  it('renders correct title for women/hoodies', async () => {
    await renderCategoryPage('women', 'hoodies')
    expect(screen.getByRole('heading', { name: 'HOODIES' })).toBeTruthy()
  })

  it('calls notFound() for invalid gender', async () => {
    await expect(renderCategoryPage('kids', 'tshirts')).rejects.toThrow('NOTFOUND')
  })

  it('calls notFound() for invalid category', async () => {
    await expect(renderCategoryPage('men', 'hats')).rejects.toThrow('NOTFOUND')
  })

  it('filters products correctly — only TSHIRTS when category=tshirts for men', async () => {
    await renderCategoryPage('men', 'tshirts')
    expect(screen.getByText('ALPHA TEE')).toBeTruthy()
    expect(screen.queryByText('BETA HOODIE')).toBeNull()
  })

  it('renders NEW IN heading for newin route', async () => {
    await renderCategoryPage('men', 'newin')
    expect(screen.getByRole('heading', { name: 'NEW IN' })).toBeTruthy()
  })

  it('shows only NEW-tagged products for newin route', async () => {
    await renderCategoryPage('men', 'newin')
    // ALPHA TEE has tag:'NEW'; BETA HOODIE has tag:''
    expect(screen.getByText('ALPHA TEE')).toBeTruthy()
    expect(screen.queryByText('BETA HOODIE')).toBeNull()
  })

  it('renders SALE heading for sale route', async () => {
    await renderCategoryPage('women', 'sale')
    expect(screen.getByRole('heading', { name: 'SALE' })).toBeTruthy()
  })

  it('shows only products with salePrice for sale route', async () => {
    await renderCategoryPage('women', 'sale')
    // GAMMA TEE has salePrice:30; others do not
    expect(screen.getByText('GAMMA TEE')).toBeTruthy()
  })
})
