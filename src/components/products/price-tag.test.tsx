import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PriceTag } from './price-tag'

describe('PriceTag', () => {
  it('renders regular price when no salePrice', () => {
    render(<PriceTag price="€45" />)
    expect(screen.getByText('€45')).toBeInTheDocument()
  })

  it('renders sale price with strikethrough and badge when salePrice given', () => {
    render(<PriceTag price="€45" salePrice={27} />)
    const original = screen.getByText('€45')
    expect(original).toBeInTheDocument()
    expect(original).toHaveClass('line-through')
    expect(screen.getByText('€27')).toBeInTheDocument()
    expect(screen.getByText(/[−-]\d+%/)).toBeInTheDocument()
  })

  it('calculates discount percentage correctly', () => {
    // €89 → salePrice 50 → (1 - 50/89) * 100 = 43.8... → rounds to 44
    render(<PriceTag price="€89" salePrice={50} />)
    expect(screen.getByText('−44%')).toBeInTheDocument()
  })

  it('applies sm size class', () => {
    const { container } = render(<PriceTag price="€45" size="sm" />)
    expect(container.firstChild).toHaveClass('text-xs')
  })

  it('applies md size class (default)', () => {
    const { container } = render(<PriceTag price="€45" />)
    expect(container.firstChild).toHaveClass('text-sm')
  })

  it('applies lg size class', () => {
    const { container } = render(<PriceTag price="€45" size="lg" />)
    expect(container.firstChild).toHaveClass('text-lg')
  })
})
