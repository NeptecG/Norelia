import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import ReturnsPage from './page'

describe('ReturnsPage', () => {
  it('renders the RETURNS heading', async () => {
    render(await ReturnsPage())
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy()
    expect(screen.getByText('RETURNS')).toBeTruthy()
  })

  it('renders Our Policy section', async () => {
    render(await ReturnsPage())
    expect(screen.getByText('Our Policy')).toBeTruthy()
  })

  it('renders Refunds section', async () => {
    render(await ReturnsPage())
    expect(screen.getByText('Refunds')).toBeTruthy()
  })
})
