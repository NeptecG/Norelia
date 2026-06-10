import type { MetadataRoute } from 'next'
import { PRODUCTS } from '@/data/products'
import { SITE_URL, MEN_NAV_CATS, WOMEN_NAV_CATS, NAV_CAT_TO_SLUG } from '@/lib/constants'

const BASE = SITE_URL
const now = () => new Date()

// Category landing pages, generated from the nav so the sitemap never drifts
// from the real routes (e.g. /men/newin, /women/sale).
const categoryRoutes: MetadataRoute.Sitemap = [
  ...MEN_NAV_CATS.map(c => `/men/${NAV_CAT_TO_SLUG[c]}`),
  ...WOMEN_NAV_CATS.map(c => `/women/${NAV_CAT_TO_SLUG[c]}`),
].map(path => ({ url: `${BASE}${path}`, lastModified: now(), changeFrequency: 'daily' as const, priority: 0.8 }))

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE,                  lastModified: now(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/men`,         lastModified: now(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/women`,       lastModified: now(), changeFrequency: 'daily',   priority: 0.9 },
    ...categoryRoutes,
    { url: `${BASE}/studio`,      lastModified: now(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/size-guide`,  lastModified: now(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/about`,       lastModified: now(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/our-studio`,  lastModified: now(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/shipping`,    lastModified: now(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/returns`,     lastModified: now(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/privacy`,     lastModified: now(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/terms`,       lastModified: now(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/company`,     lastModified: now(), changeFrequency: 'yearly',  priority: 0.3 },
    ...PRODUCTS.map(p => ({
      url: `${BASE}/product/${p.code}`,
      lastModified: now(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
}
