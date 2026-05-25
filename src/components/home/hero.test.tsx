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

vi.mock('next/link', () => ({
  default: ({
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
    const womenLink = screen.getByRole('link', { name: /Shop Women/i })
    const menLink = screen.getByRole('link', { name: /Shop Men/i })
    expect(womenLink).toHaveAttribute('href', '/women')
    expect(menLink).toHaveAttribute('href', '/men')
  })

  it('renders "WOMEN" and "MEN" labels', () => {
    render(<Hero />)
    expect(screen.getByText('WOMEN')).toBeTruthy()
    expect(screen.getByText('MEN')).toBeTruthy()
  })

  it('links have correct aria-labels', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: 'Shop WOMEN' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Shop MEN' })).toBeTruthy()
  })
})
