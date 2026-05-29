import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('next-intl/server', () => ({
  getTranslations: async () => (key: string, values?: Record<string, unknown>) => {
    if (!values) return key
    return Object.entries(values).reduce(
      (str, [k, v]) => str.replace(`{${k}}`, String(v)),
      key,
    )
  },
  getMessages: async () => ({}),
  getLocale: async () => 'en',
}))
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    // SizeTable column headers need uppercase values; all other keys fall back to the key name
    const map: Record<string, string> = {
      size: 'SIZE', intl: 'INTL', eu: 'EU', uk: 'UK',
      chest: 'CHEST', waist: 'WAIST', hip: 'HIP',
      length: 'LENGTH', sleeve: 'SLEEVE',
    }
    return map[key] ?? key
  },
}))
vi.mock('@/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/',
  Link: ({ href, children, ...rest }: { href: string; children: React.ReactNode; [key: string]: unknown }) =>
    <a href={href} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>{children}</a>,
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
  it('renders the heading key', async () => {
    await renderPage()
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy()
    expect(screen.getByText('heading')).toBeTruthy()
  })

  it('renders MEN tab as active by default (uses menTitle key uppercased)', async () => {
    await renderPage()
    // mock returns 'menTitle', .toUpperCase() gives 'MENTITLE'
    const menLink = screen.getAllByText('MENTITLE').find(
      (el) => el.closest('a')?.getAttribute('aria-current') === 'page',
    )
    expect(menLink).toBeTruthy()
  })

  it('renders T-SHIRTS garment tab as active by default (uses tshirtsTab key)', async () => {
    await renderPage()
    const tshirtsLink = screen.getAllByText('tshirtsTab').find(
      (el) => el.closest('a')?.getAttribute('aria-current') === 'page',
    )
    expect(tshirtsLink).toBeTruthy()
  })

  it('renders the table with correct chest measurement for men/tshirt', async () => {
    await renderPage({ gender: 'men', garment: 'tshirt' })
    expect(screen.getByText('96–100')).toBeTruthy()
  })

  it('renders WOMEN tab as active when gender=women (uses womenTitle key uppercased)', async () => {
    await renderPage({ gender: 'women' })
    const womenLink = screen.getAllByText('WOMENTITLE').find(
      (el) => el.closest('a')?.getAttribute('aria-current') === 'page',
    )
    expect(womenLink).toBeTruthy()
  })

  it('renders hip column when gender=women', async () => {
    await renderPage({ gender: 'women', garment: 'tshirt' })
    expect(screen.getByText('HIP')).toBeTruthy()
  })
})
