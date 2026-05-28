import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { IntlWrapper } from '@/test-utils/intl-wrapper'
import { NewsletterBar } from './newsletter-bar'

describe('NewsletterBar', () => {
  it('renders email input', () => {
    render(<IntlWrapper><NewsletterBar /></IntlWrapper>)
    expect(screen.getByPlaceholderText(/email/i)).toBeTruthy()
  })
  it('shows thank-you message on valid submit', async () => {
    render(<IntlWrapper><NewsletterBar /></IntlWrapper>)
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /subscribe/i }))
    expect(await screen.findByText(/you're in/i)).toBeTruthy()
  })
})
