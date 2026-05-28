import { createNavigation } from 'next-intl/navigation'

const routing = {
  locales: ['el', 'en'] as const,
  defaultLocale: 'el' as const,
  localePrefix: 'as-needed' as const,
}

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
