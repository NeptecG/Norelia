import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, values?: Record<string, unknown>) => {
    const map: Record<string, string> = {
      title:                  'My Shopping Cart',
      cartEmpty:              'Your cart is empty.',
      continueShopping:       'Continue Shopping',
      colProduct:             'Product',
      colQuantity:            'Quantity',
      colRemove:              'Remove',
      colPrice:               'Price',
      colTotal:               'Total',
      decreaseQty:            'Decrease quantity',
      increaseQty:            'Increase quantity',
      removeFromCart:         'Remove {name} from cart',
      catSingularTSHIRTS:     'T-Shirt',
      catSingularHOODIES:     'Hoodie',
      catSingularZIPPERS:     'Zip Hoodie',
      catSingularTANKTOPS:    'Tank Top',
      catSingularNEWIN:       'New In',
      catSingularSALES:       'Sale',
      orderSummary:           'ORDER SUMMARY',
      subtotal:               'Subtotal',
      vat:                    'VAT (24%)',
      grandTotal:             'Grand Total',
      freeShipping:           'Free shipping included',
      addMoreForFreeShipping: 'Add €{amount} more for free shipping',
      shippingProgressLabel:  'Free shipping progress',
      couponCode:             'Coupon Code',
      removeCoupon:           'Remove coupon',
      removeCouponBtn:        'Remove',
      enterCode:              'Enter code',
      apply:                  'Apply',
      invalidCoupon:          'Invalid coupon code',
      specialInstructions:    'Special Instructions (optional)',
      notesPlaceholder:       'Gift wrap, delivery notes, etc.',
      placeOrderLabel:        'Place order',
      placeOrder:             'PLACE ORDER',
      proceedToCheckout:      'PROCEED TO CHECKOUT',
      proceedToCheckoutLabel: 'Proceed to checkout',
    }
    const template = map[key] ?? key
    if (!values) return template
    return Object.entries(values).reduce(
      (str, [k, v]) => str.replace(`{${k}}`, String(v)),
      template,
    )
  },
}))
const { pushMock } = vi.hoisted(() => ({ pushMock: vi.fn() }))
vi.mock('@/navigation', () => ({
  useRouter: () => ({ push: pushMock, back: vi.fn() }),
  usePathname: () => '/',
  Link: ({ href, children }: { href: string; children: React.ReactNode }) =>
    <a href={href}>{children}</a>,
}))
vi.mock('@/stores/cart-store', () => ({ useCartStore: vi.fn() }))
vi.mock('@/stores/ui-store',   () => ({ useUIStore: vi.fn() }))
vi.mock('next/image', () => ({
  default: ({ alt, src }: { alt: string; src: string }) =>
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} />,
}))
vi.mock('motion/react', () => ({
  motion: {
    li:  ({ children }: { children?: React.ReactNode }) => <li>{children}</li>,
    div: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    tr:  ({ children }: { children?: React.ReactNode }) => <tr>{children}</tr>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useReducedMotion: () => false,
}))

import { useCartStore } from '@/stores/cart-store'
import { useUIStore }   from '@/stores/ui-store'

// ---------------------------------------------------------------------------
// Mock helpers
// ---------------------------------------------------------------------------

const mockLine = {
  id: 1,
  name: 'ALPHA TEE',
  cat: 'TSHIRTS' as const,
  gender: 'men' as const,
  code: '100001',
  description: 'desc',
  price: '€45',
  tag: '' as const,
  img: '/a.jpg',
  qty: 2,
}

function makeCartMock(overrides: Partial<ReturnType<typeof useCartStore>> = {}) {
  return {
    cartItems: {},
    cartLines:      vi.fn(() => []),
    cartCount:      vi.fn(() => 0),
    addToCart:      vi.fn(),
    removeFromCart: vi.fn(),
    decrementCart:  vi.fn(),
    clearCart:      vi.fn(),
    ...overrides,
  }
}

function makeUIMock(overrides: Partial<ReturnType<typeof useUIStore>> = {}) {
  return {
    setShowCheckoutModal: vi.fn(),
    ...overrides,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(useCartStore).mockReturnValue(makeCartMock() as ReturnType<typeof useCartStore>)
  vi.mocked(useUIStore).mockReturnValue(makeUIMock() as ReturnType<typeof useUIStore>)
})

async function renderPage() {
  const CheckoutPage = (await import('./page')).default
  render(<CheckoutPage />)
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('CheckoutPage', () => {
  it('renders the cart title heading', async () => {
    await renderPage()
    expect(screen.getByRole('heading', { name: /my shopping cart/i })).toBeTruthy()
  })

  it('shows empty-cart message and Continue Shopping link when cart is empty', async () => {
    await renderPage()
    expect(screen.getByText(/your cart is empty/i)).toBeTruthy()
    const link = screen.getByRole('link', { name: /continue shopping/i })
    expect(link).toBeTruthy()
    expect((link as HTMLAnchorElement).href).toContain('/')
  })

  it('renders cart item name, category, and price when cart has items', async () => {
    vi.mocked(useCartStore).mockReturnValue(
      makeCartMock({ cartLines: vi.fn(() => [mockLine]) }) as ReturnType<typeof useCartStore>,
    )
    await renderPage()
    expect(screen.getByText('ALPHA TEE')).toBeTruthy()
    expect(screen.getByText('T-Shirt')).toBeTruthy()
    // price: no salePrice so shows item.price
    expect(screen.getByText('€45')).toBeTruthy()
  })

  it('shows free shipping progress bar when subtotal is below threshold', async () => {
    // qty 2 × €45 = €90 — ABOVE threshold. Use qty 1 → €45 < €60
    const lowItem = { ...mockLine, qty: 1 }
    vi.mocked(useCartStore).mockReturnValue(
      makeCartMock({ cartLines: vi.fn(() => [lowItem]) }) as ReturnType<typeof useCartStore>,
    )
    await renderPage()
    expect(screen.getByRole('progressbar')).toBeTruthy()
    expect(screen.getAllByText(/more for free shipping/i).length).toBeGreaterThan(0)
  })

  it('shows "Free shipping applied" when subtotal >= 60', async () => {
    // qty 2 × €45 = €90 >= €60
    vi.mocked(useCartStore).mockReturnValue(
      makeCartMock({ cartLines: vi.fn(() => [mockLine]) }) as ReturnType<typeof useCartStore>,
    )
    await renderPage()
    expect(screen.getAllByText(/free shipping included/i).length).toBeGreaterThan(0)
  })

  it('clicking "PROCEED TO CHECKOUT" navigates to the delivery step', async () => {
    pushMock.mockClear()
    vi.mocked(useCartStore).mockReturnValue(
      makeCartMock({ cartLines: vi.fn(() => [mockLine]) }) as ReturnType<typeof useCartStore>,
    )
    await renderPage()
    fireEvent.click(screen.getByRole('button', { name: /proceed to checkout/i }))
    expect(pushMock).toHaveBeenCalledWith('/checkout/shipping')
  })

  it('displays salePrice formatted to 2 decimal places when item has salePrice', async () => {
    const saleItem = { ...mockLine, salePrice: 29, qty: 1 }
    vi.mocked(useCartStore).mockReturnValue(
      makeCartMock({ cartLines: vi.fn(() => [saleItem]) }) as ReturnType<typeof useCartStore>,
    )
    await renderPage()
    // salePrice 29 → shown as €29.00 in red; original €45 shown with line-through
    expect(screen.getAllByText('€29.00').length).toBeGreaterThan(0)
    expect(screen.getByText('€45')).toBeTruthy()
  })

  it('clicking × remove button calls removeFromCart with correct id', async () => {
    const removeFromCart = vi.fn()
    vi.mocked(useCartStore).mockReturnValue(
      makeCartMock({
        cartLines: vi.fn(() => [mockLine]),
        removeFromCart,
      }) as ReturnType<typeof useCartStore>,
    )
    await renderPage()
    fireEvent.click(screen.getByRole('button', { name: /remove alpha tee from cart/i }))
    expect(removeFromCart).toHaveBeenCalledWith(1)
  })
})
