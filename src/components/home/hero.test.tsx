import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { Hero } from './hero'

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}))

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

vi.mock('@/navigation', () => ({
  Link: ({
    href,
    children,
    ...rest
  }: {
    href: string
    children: React.ReactNode
    [key: string]: unknown
  }) => (
    <a href={href} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
      {children}
    </a>
  ),
}))

vi.mock('motion/react', () => ({
  motion: {
    div: ({
      children,
      ...rest
    }: {
      children: React.ReactNode
      [key: string]: unknown
    }) => <div {...(rest as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>,
    span: ({
      children,
      ...rest
    }: {
      children: React.ReactNode
      [key: string]: unknown
    }) => <span {...(rest as React.HTMLAttributes<HTMLSpanElement>)}>{children}</span>,
  },
  useReducedMotion: () => false,
}))

describe('Hero', () => {
  it('renders two links to /women and /men', () => {
    render(<Hero />)
    const womenLink = screen.getByRole('link', { name: 'womenAriaLabel' })
    const menLink = screen.getByRole('link', { name: 'menAriaLabel' })
    expect(womenLink).toHaveAttribute('href', '/women')
    expect(menLink).toHaveAttribute('href', '/men')
  })

  it('renders gender labels', () => {
    render(<Hero />)
    expect(screen.getByText('womenLabel')).toBeTruthy()
    expect(screen.getByText('menLabel')).toBeTruthy()
  })

  it('links have correct aria-labels', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: 'womenAriaLabel' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'menAriaLabel' })).toBeTruthy()
  })
})
