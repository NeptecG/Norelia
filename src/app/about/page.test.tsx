import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import AboutPage from './page'

describe('AboutPage', () => {
  it('renders the WHO WE ARE heading', async () => {
    render(await AboutPage())
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy()
    expect(screen.getByText('WHO WE ARE')).toBeTruthy()
  })

  it('renders two content sections', async () => {
    render(await AboutPage())
    expect(screen.getByText('The Brand')).toBeTruthy()
    expect(screen.getByText('Our Process')).toBeTruthy()
  })

  it('renders map iframe', async () => {
    render(await AboutPage())
    expect(document.querySelector('iframe')).toBeTruthy()
  })
})
