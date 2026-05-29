import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = { heading: 'RECENTLY VIEWED' }
    return map[key] ?? key
  },
}))
vi.mock('@/stores/ui-store', () => ({ useUIStore: vi.fn() }))
vi.mock('@/navigation', () => ({ Link: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a> }))
vi.mock('next/image', () => ({ default: ({ alt }: { alt: string }) => React.createElement('img', { alt }) }))

import { useUIStore } from '@/stores/ui-store'
import { RecentlyViewedStrip } from './recently-viewed-strip'
import type { Product } from '@/types'

const MOCK_PRODUCT: Product = { id: 5, name: 'SEEN BEFORE', cat: 'HOODIES', gender: 'men', code: '200001', description: 'desc', price: '€89', tag: '', img: '/b.jpg' }

describe('RecentlyViewedStrip', () => {
  it('renders nothing when recentlyViewed is empty', () => {
    vi.mocked(useUIStore).mockReturnValue({ recentlyViewed: [] } as ReturnType<typeof useUIStore>)
    const { container } = render(<RecentlyViewedStrip />)
    expect(container.firstChild).toBeNull()
  })
  it('renders RECENTLY VIEWED heading when there are items', () => {
    vi.mocked(useUIStore).mockReturnValue({ recentlyViewed: [MOCK_PRODUCT] } as ReturnType<typeof useUIStore>)
    render(<RecentlyViewedStrip />)
    expect(screen.getByText('RECENTLY VIEWED')).toBeTruthy()
  })
  it('renders a link for each recently viewed product', () => {
    vi.mocked(useUIStore).mockReturnValue({ recentlyViewed: [MOCK_PRODUCT] } as ReturnType<typeof useUIStore>)
    render(<RecentlyViewedStrip />)
    expect(document.querySelector(`a[href="/product/${MOCK_PRODUCT.code}"]`)).toBeTruthy()
  })
})
