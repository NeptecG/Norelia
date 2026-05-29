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
vi.mock('next/navigation', () => ({ notFound: vi.fn(() => { throw new Error('NOTFOUND') }) }))
vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }))
vi.mock('next-intl/server', () => ({
  getTranslations: async () => (key: string) => {
    const map: Record<string, string> = {
      men: 'MEN', women: 'WOMEN', styles: 'styles',
    }
    return map[key] ?? key
  },
}))
vi.mock('@/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/men',
  Link: ({ href, children, ...rest }: { href: string; children: React.ReactNode; [key: string]: unknown }) =>
    <a href={href} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>{children}</a>,
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

async function renderGenderPage(gender: string, filter?: string) {
  const GenderPage = (await import('./page')).default
  const jsx = await GenderPage({
    params: Promise.resolve({ locale: 'en', gender }),
    searchParams: Promise.resolve(filter ? { filter } : {}),
  })
  render(jsx)
}

describe('GenderPage', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('renders MEN heading for gender=men', async () => {
    await renderGenderPage('men')
    expect(screen.getByText('MEN')).toBeTruthy()
  })

  it('renders WOMEN heading for gender=women', async () => {
    await renderGenderPage('women')
    expect(screen.getByText('WOMEN')).toBeTruthy()
  })

  it('calls notFound() for an invalid gender', async () => {
    await expect(renderGenderPage('kids')).rejects.toThrow('NOTFOUND')
  })

  it('applies NEWIN filter — only NEW-tagged products shown', async () => {
    await renderGenderPage('men', 'NEWIN')
    // men pool: ALPHA TEE (NEW), BETA HOODIE (no tag) — only ALPHA TEE should appear
    expect(screen.getByText('ALPHA TEE')).toBeTruthy()
    expect(screen.queryByText('BETA HOODIE')).toBeNull()
  })

  it('applies SALES filter — only products with salePrice shown', async () => {
    // women pool: GAMMA TEE has salePrice
    await renderGenderPage('women', 'SALES')
    expect(screen.getByText('GAMMA TEE')).toBeTruthy()
  })

  it('applies category filter TSHIRTS — only TSHIRTS products shown', async () => {
    await renderGenderPage('men', 'TSHIRTS')
    expect(screen.getByText('ALPHA TEE')).toBeTruthy()
    expect(screen.queryByText('BETA HOODIE')).toBeNull()
  })
})
