import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next/navigation', () => ({
  useRouter:   () => ({ back: vi.fn(), push: vi.fn() }),
  usePathname: () => '/',
}))

import ShippingPage from './page'

describe('ShippingPage', () => {
  it('renders the SHIPPING heading', async () => {
    render(await ShippingPage())
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy()
    expect(screen.getByText('SHIPPING')).toBeTruthy()
  })

  it('renders Standard Shipping section', async () => {
    render(await ShippingPage())
    expect(screen.getByText('Standard Shipping')).toBeTruthy()
  })

  it('renders Express Shipping section', async () => {
    render(await ShippingPage())
    expect(screen.getByText('Express Shipping')).toBeTruthy()
  })
})
