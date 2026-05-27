import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import ReturnsPage from './page'

describe('ReturnsPage', () => {
  it('renders the RETURNS heading', async () => {
    render(await ReturnsPage())
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toBeTruthy()
    expect(h1.textContent).toMatch(/RETURNS/i)
    expect(h1.textContent).toMatch(/EXCHANGES/i)
  })

  it('renders Return Policy section', async () => {
    render(await ReturnsPage())
    expect(screen.getByText('Return Policy')).toBeTruthy()
  })

  it('renders Refunds & Exchanges section', async () => {
    render(await ReturnsPage())
    expect(screen.getByText('Refunds & Exchanges')).toBeTruthy()
  })
})
