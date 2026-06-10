export const BRAND = 'NORELIA.'
export const CONTACT_EMAIL = 'hello@norelia.com'

export const MARQUEE_TEXT = 'NORELIA. STUDIO / PREMIUM STREETWEAR / CUSTOM PRINTING / SS 2026 / DTG & EMBROIDERY / FREE SHIPPING OVER €60 /'

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
export const RECENTLY_VIEWED_MAX    = 6
export const SCROLL_TOP_THRESHOLD   = 400
export const CART_COOLDOWN_MS       = 1000
export const FAV_COOLDOWN_MS        = 1000
export const LOW_STOCK_THRESHOLD     = 5   // show "x left" urgency cue at or below this remaining stock
export const FREE_SHIPPING_THRESHOLD = 60  // €60 free shipping
export const HOME_DELIVERY_COST       = 3   // € flat courier fee (waived over the free-shipping threshold)
export const ESTIMATED_DELIVERY_DAYS  = 3   // working-day estimate shown on the delivery step
export const COD_FEE                  = 3.5 // € cash-on-delivery surcharge (home delivery only)
