// The page is RSC so we call it as an async function
// Mock the child components so we're only testing HomePage's own logic

import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock next-intl/server — return English display strings so title assertions pass
vi.mock('next-intl/server', () => ({
  getTranslations: async () => (key: string) => {
    const map: Record<string, string> = {
      newInTitle:       'NEW IN COLLECTION',
      newInSubtitle:    'JUST ARRIVED',
      trendingTitle:    'TRENDING',
      trendingSubtitle: 'THIS SEASON',
      onSaleTitle:      'ON SALE',
      onSaleSubtitle:   'LIMITED TIME OFFERS',
    }
    return map[key] ?? key
  },
}))

// Mock child components
vi.mock('@/components/home/hero', () => ({
  Hero: () => <div data-testid="hero" />,
}))
vi.mock('@/components/home/marquee', () => ({
  Marquee: ({ dark }: { dark?: boolean }) => <div data-testid="marquee" data-dark={String(dark)} />,
}))
vi.mock('@/components/home/featured-carousel', () => ({
  FeaturedCarousel: ({ title, subtitle, products, viewAllHref }: {
    title: string
    subtitle?: string
    products: unknown[]
    viewAllHref?: string
  }) => (
    <div data-testid="featured-carousel" data-title={title} data-subtitle={subtitle} data-count={products.length} data-href={viewAllHref} />
  ),
}))

describe('HomePage', () => {
  it('renders Hero', async () => {
    const Page = (await import('./page')).default
    render(await Page())
    expect(screen.getByTestId('hero')).toBeTruthy()
  })

  it('renders dark Marquee', async () => {
    const Page = (await import('./page')).default
    render(await Page())
    expect(screen.getByTestId('marquee').dataset.dark).toBe('true')
  })

  it('renders NEW IN COLLECTION carousel with only NEW-tagged products', async () => {
    const Page = (await import('./page')).default
    render(await Page())
    const carousels = screen.getAllByTestId('featured-carousel')
    const newIn = carousels.find(c => c.dataset.title === 'NEW IN COLLECTION')
    expect(newIn).toBeTruthy()
    expect(Number(newIn!.dataset.count)).toBeGreaterThan(0)
    expect(newIn!.dataset.href).toBe('/men?filter=NEWIN')
  })

  it('renders TRENDING carousel with 8 products', async () => {
    const Page = (await import('./page')).default
    render(await Page())
    const carousels = screen.getAllByTestId('featured-carousel')
    const trending = carousels.find(c => c.dataset.title === 'TRENDING')
    expect(trending).toBeTruthy()
    expect(Number(trending!.dataset.count)).toBe(8)
  })

  it('renders ON SALE carousel with only products that have salePrice', async () => {
    const Page = (await import('./page')).default
    render(await Page())
    const carousels = screen.getAllByTestId('featured-carousel')
    const onSale = carousels.find(c => c.dataset.title === 'ON SALE')
    expect(onSale).toBeTruthy()
    expect(Number(onSale!.dataset.count)).toBeGreaterThan(0)
    expect(onSale!.dataset.href).toBe('/men?filter=SALES')
  })
})
