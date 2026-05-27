import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('next/navigation', () => ({
  useRouter:   () => ({ back: vi.fn(), push: vi.fn() }),
  usePathname: () => '/',
}))

vi.mock('@/data/sizes', () => ({
  SIZE_DATA: {
    tshirt: {
      men: [
        { size: 'M', intl: 'M', eu: '48–50', uk: '38–40', chest: '96–100', waist: '84–88', length: '72', sleeve: '23' },
      ],
      women: [
        { size: 'S', intl: 'S', eu: '36–38', uk: '8–10', chest: '84–88', waist: '68–72', hip: '92–96', length: '60', sleeve: '20' },
      ],
    },
    hoodie: {
      men: [
        { size: 'M', intl: 'M', eu: '48–50', uk: '38–40', chest: '104–108', waist: '92–96', length: '70', sleeve: '64' },
      ],
      women: [
        { size: 'S', intl: 'S', eu: '36–38', uk: '8–10', chest: '92–96', waist: '76–80', hip: '100–104', length: '62', sleeve: '58' },
      ],
    },
    zipper: {
      men: [
        { size: 'M', intl: 'M', eu: '48–50', uk: '38–40', chest: '104–108', waist: '92–96', length: '70', sleeve: '64' },
      ],
      women: [
        { size: 'S', intl: 'S', eu: '36–38', uk: '8–10', chest: '92–96', waist: '76–80', hip: '100–104', length: '62', sleeve: '58' },
      ],
    },
  },
  SIZES: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
  SIZE_CHART_IMG: '/size-chart.jpg',
}))

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
    'aria-current': ariaCurrent,
  }: {
    href: string
    children: React.ReactNode
    className?: string
    'aria-current'?: React.AriaAttributes['aria-current']
  }) => (
    <a href={href} className={className} aria-current={ariaCurrent}>
      {children}
    </a>
  ),
}))

// Lightweight SVG figure mocks
vi.mock('@/components/size-guide/male-figure', () => ({
  MaleFigure: () => <svg data-testid="male-figure" />,
}))
vi.mock('@/components/size-guide/female-figure', () => ({
  FemaleFigure: () => <svg data-testid="female-figure" />,
}))

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function renderPage(searchParams: Record<string, string> = {}) {
  const Page = (await import('./page')).default
  render(await Page({ searchParams: Promise.resolve(searchParams) }))
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('SizeGuidePage', () => {
  it('renders SIZE GUIDE heading', async () => {
    await renderPage()
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy()
    expect(screen.getByText('SIZE GUIDE')).toBeTruthy()
  })

  it('renders MEN tab as active by default', async () => {
    await renderPage()
    const menLink = screen.getAllByText('MEN').find(
      (el) => el.closest('a')?.getAttribute('aria-current') === 'page',
    )
    expect(menLink).toBeTruthy()
  })

  it('renders T-SHIRTS garment tab as active by default', async () => {
    await renderPage()
    const tshirtsLink = screen.getAllByText('T-SHIRTS').find(
      (el) => el.closest('a')?.getAttribute('aria-current') === 'page',
    )
    expect(tshirtsLink).toBeTruthy()
  })

  it('renders the table with correct chest measurement for men/tshirt', async () => {
    await renderPage({ gender: 'men', garment: 'tshirt' })
    expect(screen.getByText('96–100')).toBeTruthy()
  })

  it('renders WOMEN tab as active when gender=women', async () => {
    await renderPage({ gender: 'women' })
    const womenLink = screen.getAllByText('WOMEN').find(
      (el) => el.closest('a')?.getAttribute('aria-current') === 'page',
    )
    expect(womenLink).toBeTruthy()
  })

  it('renders hip column when gender=women', async () => {
    await renderPage({ gender: 'women', garment: 'tshirt' })
    expect(screen.getByText('HIP')).toBeTruthy()
  })
})
