import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import ShippingPage from './page'

describe('ShippingPage', () => {
  it('renders the SHIPPING heading', async () => {
    render(await ShippingPage())
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy()
    expect(screen.getByText('SHIPPING')).toBeTruthy()
  })

  it('renders Standard Delivery section', async () => {
    render(await ShippingPage())
    expect(screen.getByText('Standard Delivery')).toBeTruthy()
  })

  it('renders Express Delivery section', async () => {
    render(await ShippingPage())
    expect(screen.getByText('Express Delivery')).toBeTruthy()
  })
})
