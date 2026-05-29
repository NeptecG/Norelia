import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SizeTable } from './size-table'
import type { SizeRow } from '@/types'

// Mock next-intl — return English column header strings so assertions pass
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      size: 'SIZE', intl: 'INTL', eu: 'EU', uk: 'UK',
      chest: 'CHEST', waist: 'WAIST', hip: 'HIP',
      length: 'LENGTH', sleeve: 'SLEEVE',
    }
    return map[key] ?? key
  },
}))

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const MEN_ROWS: SizeRow[] = [
  { size: 'S', intl: 'S', eu: '44–46', uk: '34–36', chest: '88–92',  waist: '76–80',  length: '70', sleeve: '22' },
  { size: 'M', intl: 'M', eu: '48–50', uk: '38–40', chest: '96–100', waist: '84–88',  length: '72', sleeve: '23' },
]

const WOMEN_ROWS: SizeRow[] = [
  { size: 'S', intl: 'S', eu: '36–38', uk: '8–10', chest: '84–88', waist: '68–72', hip: '92–96', length: '60', sleeve: '20' },
]

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('SizeTable', () => {
  it('renders a table element', () => {
    render(<SizeTable rows={MEN_ROWS} gender="men" />)
    expect(document.querySelector('table')).toBeTruthy()
  })

  it('shows all column headers in full mode (SIZE, INTL, EU, UK, CHEST, WAIST, LENGTH, SLEEVE)', () => {
    render(<SizeTable rows={MEN_ROWS} gender="men" />)
    expect(screen.getByText('SIZE')).toBeTruthy()
    expect(screen.getByText('INTL')).toBeTruthy()
    expect(screen.getByText('EU')).toBeTruthy()
    expect(screen.getByText('UK')).toBeTruthy()
    expect(screen.getByText('CHEST')).toBeTruthy()
    expect(screen.getByText('WAIST')).toBeTruthy()
    expect(screen.getByText('LENGTH')).toBeTruthy()
    expect(screen.getByText('SLEEVE')).toBeTruthy()
  })

  it('renders the correct number of data rows', () => {
    render(<SizeTable rows={MEN_ROWS} gender="men" />)
    const rows = document.querySelectorAll('tbody tr')
    expect(rows.length).toBe(MEN_ROWS.length)
  })

  it('shows HIP column header when women rows have hip data', () => {
    render(<SizeTable rows={WOMEN_ROWS} gender="women" />)
    expect(screen.getByText('HIP')).toBeTruthy()
  })

  it('does NOT show HIP column when rows have no hip data', () => {
    render(<SizeTable rows={MEN_ROWS} gender="men" />)
    expect(screen.queryByText('HIP')).toBeNull()
  })

  it('in mini mode: omits INTL, EU, UK columns', () => {
    render(<SizeTable rows={MEN_ROWS} gender="men" mini />)
    expect(screen.queryByText('INTL')).toBeNull()
    expect(screen.queryByText('EU')).toBeNull()
    expect(screen.queryByText('UK')).toBeNull()
    // Core columns still present
    expect(screen.getByText('SIZE')).toBeTruthy()
    expect(screen.getByText('CHEST')).toBeTruthy()
    expect(screen.getByText('WAIST')).toBeTruthy()
    expect(screen.getByText('LENGTH')).toBeTruthy()
    expect(screen.getByText('SLEEVE')).toBeTruthy()
  })
})
