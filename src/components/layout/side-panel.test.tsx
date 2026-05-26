import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

// Mock stores
vi.mock('@/stores/ui-store', () => ({ useUIStore: vi.fn() }))
vi.mock('@/stores/cart-store', () => ({ useCartStore: vi.fn() }))
vi.mock('@/stores/favorites-store', () => ({ useFavoritesStore: vi.fn() }))

// Mock data
vi.mock('@/data/products', () => ({ PRODUCTS: [] }))

// Mock motion
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, onClick, ...rest }: { children?: React.ReactNode; onClick?: () => void; [key: string]: unknown }) =>
      <div onClick={onClick} {...(rest as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useReducedMotion: () => false,
}))

// Mock next/image
vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ alt, ...rest }: { alt: string; [key: string]: unknown }) => <img alt={alt} {...(rest as React.ImgHTMLAttributes<HTMLImageElement>)} />,
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ href, children, onClick, ...rest }: { href: string; children: React.ReactNode; onClick?: () => void; [key: string]: unknown }) =>
    <a href={href} onClick={onClick} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>{children}</a>,
}))

// Mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush }) }))

import { useUIStore } from '@/stores/ui-store'
import { useCartStore } from '@/stores/cart-store'
import { useFavoritesStore } from '@/stores/favorites-store'
import { SidePanel } from './side-panel'

const DEFAULT_UI = {
  sidePanel: null as null | 'cart' | 'favorites',
  setSidePanel: vi.fn(),
  showToast: vi.fn(),
}
const DEFAULT_CART = {
  cartItems: {} as Record<number, number>,
  addToCart: vi.fn(),
  removeFromCart: vi.fn(),
  decrementCart: vi.fn(),
}
const DEFAULT_FAV = {
  favorites: [] as number[],
  toggleFavorite: vi.fn(),
}

beforeEach(() => {
  vi.mocked(useUIStore).mockReturnValue(DEFAULT_UI as ReturnType<typeof useUIStore>)
  vi.mocked(useCartStore).mockReturnValue(DEFAULT_CART as ReturnType<typeof useCartStore>)
  vi.mocked(useFavoritesStore).mockReturnValue(DEFAULT_FAV as ReturnType<typeof useFavoritesStore>)
  mockPush.mockClear()
})

describe('SidePanel', () => {
  it('renders nothing when sidePanel is null', () => {
    const { container } = render(<SidePanel />)
    expect(container.firstChild).toBeNull()
  })

  it('shows MY CART title when sidePanel is cart', () => {
    vi.mocked(useUIStore).mockReturnValue({
      ...DEFAULT_UI, sidePanel: 'cart',
    } as ReturnType<typeof useUIStore>)
    render(<SidePanel />)
    expect(screen.getByText('MY CART')).toBeTruthy()
  })

  it('shows FAVORITES title when sidePanel is favorites', () => {
    vi.mocked(useUIStore).mockReturnValue({
      ...DEFAULT_UI, sidePanel: 'favorites',
    } as ReturnType<typeof useUIStore>)
    render(<SidePanel />)
    expect(screen.getByText('FAVORITES')).toBeTruthy()
  })

  it('calls setSidePanel(null) when backdrop is clicked', () => {
    const setSidePanel = vi.fn()
    vi.mocked(useUIStore).mockReturnValue({
      ...DEFAULT_UI, sidePanel: 'cart', setSidePanel,
    } as ReturnType<typeof useUIStore>)
    render(<SidePanel />)
    // The backdrop is the first motion.div rendered (before the panel)
    const backdrop = document.querySelector('[aria-hidden="true"]')
    expect(backdrop).toBeTruthy()
    fireEvent.click(backdrop!)
    expect(setSidePanel).toHaveBeenCalledWith(null)
  })
})
