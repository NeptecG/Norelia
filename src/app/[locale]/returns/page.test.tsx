import { describe, it, expect, vi } from 'vitest'

const { redirectMock } = vi.hoisted(() => ({ redirectMock: vi.fn() }))
vi.mock('@/navigation', () => ({ redirect: redirectMock }))

import ReturnsPage from './page'

describe('ReturnsPage', () => {
  it('redirects to the combined /shipping page, preserving locale', async () => {
    redirectMock.mockClear()
    await ReturnsPage({ params: Promise.resolve({ locale: 'en' }) })
    expect(redirectMock).toHaveBeenCalledWith({ href: '/shipping', locale: 'en' })
  })
})
