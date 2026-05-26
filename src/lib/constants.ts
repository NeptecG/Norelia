export const BRAND = 'NORELIA.'

export const MARQUEE_TEXT = 'NORELIA. STUDIO ✦ PREMIUM STREETWEAR ✦ CUSTOM PRINTING ✦ SS 2026 ✦ DTG & EMBROIDERY ✦ FREE SHIPPING OVER €60 ✦'

export const MEN_NAV_CATS    = ['New In', 'T-Shirts', 'Hoodies', 'Zippers', 'Tank Tops', 'Sales'] as const
export const WOMEN_NAV_CATS  = ['New In', 'T-Shirts', 'Hoodies', 'Zippers', 'Sales'] as const

export const NAV_CAT_TO_SLUG: Record<string, string> = {
  'New In':    'newin',
  'T-Shirts':  'tshirts',
  'Hoodies':   'hoodies',
  'Zippers':   'zippers',
  'Tank Tops': 'tanktops',
  'Sales':     'sale',
}

export const STORAGE_TTL_MS         = 7 * 24 * 60 * 60 * 1000  // 7 days
export const TOAST_DURATION_MS      = 2500
export const RECENTLY_VIEWED_MAX    = 8
export const SCROLL_TOP_THRESHOLD   = 400
export const CART_COOLDOWN_MS       = 1000
export const FAV_COOLDOWN_MS        = 1000
export const FREE_SHIPPING_THRESHOLD = 60  // €60 free shipping
