# Norelia — Design Spec
**Date:** 2026-05-25  
**Stack:** Next.js App Router · TypeScript strict · Tailwind CSS · shadcn/ui · motion · Zustand · react-hook-form + zod

---

## 1. Project Overview

**Norelia** is a minimalist premium streetwear e-commerce brand — a clean, properly-architected rebuild inspired by NOIR, ported from a single 3,900-line inline-styled React/Vite SPA into a production-grade Next.js App Router project.

Same product categories as NOIR: T-Shirts, Hoodies, Zip Hoodies, Tank Tops.  
Same features as NOIR: Garment Designer, cart, favorites, size guide, checkout, static info pages.  
Data: static (hardcoded TypeScript constants) for now — no backend.

---

## 2. Route Structure

```
src/app/
├── layout.tsx                     # Root layout: Nav, SidePanel, Toast, GDPRBanner, NewsletterBar, Footer
├── page.tsx                       # / — Landing: Hero, Marquee, FeaturedCarousels
├── studio/page.tsx                # /studio — GarmentDesigner
├── product/[id]/page.tsx          # /product/:code — Product detail
├── size-guide/page.tsx            # /size-guide — Full size chart
├── checkout/page.tsx              # /checkout — Cart review + VAT + coupon
├── about/page.tsx
├── shipping/page.tsx
├── returns/page.tsx
├── our-studio/page.tsx            # Location map + hours
└── [gender]/
    ├── page.tsx                   # /men | /women — Gender landing (stacked carousels)
    └── [category]/page.tsx        # /men/tshirts etc. — Filtered product grid
```

Category slugs: `tshirts`, `hoodies`, `zippers`, `tanktops`, `newin`, `sale`  
URL routing replaces NOIR's client-side `useState`-based router entirely.

---

## 3. Data Layer

All data lives in `src/data/` as typed TypeScript constants — zero API calls.

```
src/
├── types/index.ts         # Product, CartItem, GarmentColor, SizeRow, StockMap interfaces
├── data/
│   ├── products.ts        # Product[] — 25 products (T-Shirts, Hoodies, Zippers, Tank Tops)
│   ├── stock.ts           # Record<number, number> — low-stock overrides (default: 25)
│   ├── colors.ts          # GarmentColor[] — White, Black, Grey, Bordeaux swatches
│   ├── sizes.ts           # SIZE_DATA — measurements by garment type + gender
│   ├── pricing.ts         # BP — base prices per garment type and size (EUR)
│   └── paths.ts           # PATHS — SVG silhouette path data (tshirt, hoodie, zipper front/back)
└── lib/
    ├── utils.ts           # cn(), byGender(), getPrice(), getStock()
    └── constants.ts       # BRAND, SIZES array, marquee text, font tokens
```

**Product shape** (from NOIR, typed):
```ts
interface Product {
  id: number
  name: string
  cat: 'TSHIRTS' | 'HOODIES' | 'ZIPPERS' | 'TANKTOPS'
  gender: 'men' | 'women' | 'unisex'
  code: string
  description: string
  price: string        // "€45"
  salePrice?: number   // 27 (plain number, no € prefix)
  tag: 'NEW' | ''
  img: string
}
```

---

## 4. State Management (Zustand)

Three stores in `src/stores/`:

**`cart-store.ts`**
- `cartItems: Record<number, number>` — product id → quantity
- `addToCart(id, qty)` / `removeFromCart(id)` / `decrementCart(id)` / `clearCart()`
- Persisted to localStorage with 7-day TTL — keys use `norelia_` prefix: `norelia_cart`, `norelia_favorites`, `norelia_recent`, `norelia_gdpr_consent`

**`favorites-store.ts`**
- `favorites: number[]` — array of favorited product ids
- `toggleFavorite(id)` — add if not present, remove if present
- Persisted to localStorage with 7-day TTL

**`ui-store.ts`**
- `sidePanel: 'cart' | 'favorites' | null`
- `toast: { msg: string; visible: boolean; type: 'add' | 'remove' }`
- `showSignIn: boolean`
- `showCheckoutModal: boolean`
- `recentlyViewed: Product[]` — persisted to localStorage, max 8 items
- `showToast(msg, type)` — auto-hides after 2.5s

Cooldown refs (prevent double-fire within 1s) live in the component layer, not the store.

---

## 5. Component Map

All components in `src/components/`. Client components marked with `"use client"` only at the interaction leaf — never higher than necessary.

### Layout / Global
| Component | Type | Notes |
|-----------|------|-------|
| `Nav` | client | Sticky nav: Men/Women dropdowns, search bar, favorites/cart icons + badges, Sign In button |
| `SiteFooter` | server | Four columns: brand, info links, contact, payment icons |
| `NewsletterBar` | client | Email subscribe strip above footer |
| `SidePanel` | client | Slides in from right for cart or favorites; backdrop closes it |
| `Toast` | client | Fixed bottom-center, auto-hides, green/red accent border |
| `GDPRBanner` | client | Fixed bottom bar, persists consent to localStorage |
| `SignInModal` | client | Sign In / Create Account tabs (UI only — no auth yet) |
| `CheckoutComingSoonModal` | client | Shown when "Checkout →" is clicked |

### Home Page
| Component | Type | Notes |
|-----------|------|-------|
| `Hero` | client | Split Men/Women halves, hover scale + reveal label animation |
| `Marquee` | server | CSS `ticker` keyframe, dark variant |
| `FeaturedCarousel` | client | 4-per-page with dot pagination — used for New In, Trending, Sales |

### Products
| Component | Type | Notes |
|-----------|------|-------|
| `ProductGrid` | server | Category filter tabs, auto-fill grid, empty state |
| `ProductCard` | client | 3/4 aspect ratio, hover scale, NEW badge, favorite heart |
| `PriceTag` | server | Regular price or sale (strikethrough + red + % badge) |
| `RelatedProducts` | server | 4-card grid, same category |
| `RecentlyViewedStrip` | client | Horizontal scroll strip, max 8 items |

### Product Page
| Component | Type | Notes |
|-----------|------|-------|
| `ProductPage` | client | Gallery (thumbnails + main), breadcrumbs, color picker, size picker, qty stepper, stock indicator, Add to Cart, Add to Favorites, trust signals, shipping info |
| `SizeMiniGuide` | client | Modal popup with `SizeTable` |

### Size Guide
| Component | Type | Notes |
|-----------|------|-------|
| `SizeGuidePage` | server | Garment tabs, silhouette image, Women/Men tables, How to Measure tips |
| `SizeTable` | server | Reusable — full or mini variant |
| `MaleFigure` / `FemaleFigure` | server | SVG body diagrams with measurement callout lines |

### Studio
| Component | Type | Notes |
|-----------|------|-------|
| `GarmentDesigner` | client | Full canvas designer: SVG silhouettes, drag/resize/rotate, front/back, lock position, color picker, size/fit/print controls, 3-step order flow (design → form → success), EmailJS send, PNG download |

### Checkout
| Component | Type | Notes |
|-----------|------|-------|
| `CheckoutPage` | client | Product table, qty steppers, VAT breakdown (24%), coupon input, order summary sidebar |

### Info Pages (server, minimal state)
`AboutPage`, `ShippingPage`, `ReturnsPage`, `OurStudioPage` — dark hero band, content, map iframe

---

## 6. Design System

**Palette — light site with dark nav/footer, both modes must work:**
```css
/* Light mode (default) */
--color-surface:        #ffffff   /* page/content background */
--color-surface-alt:    #212121   /* nav, footer — always dark */
--color-surface-raised: #f5f5f5   /* card / section backgrounds */
--color-on-surface:     #212121
--color-on-surface-muted: #888888
--color-accent:         #212121   /* primary CTA */
--color-destructive:    #e11d48   /* sale, remove, errors */
--color-success:        #22c55e   /* in stock, added */
--color-border:         #212121   /* product card borders */
--color-border-subtle:  #e0e0e0   /* dividers */

/* Dark mode overrides (class="dark") */
--color-surface:        #111111
--color-surface-raised: #1a1a1a
--color-on-surface:     #f5f5f5
--color-on-surface-muted: rgba(255,255,255,0.55)
--color-border:         rgba(255,255,255,0.15)
--color-border-subtle:  rgba(255,255,255,0.08)
```

**Typography (3 typefaces max):**
- `--font-display`: Bebas Neue — headings, brand, prices
- `--font-body`: DM Sans — all body, labels, buttons
- `--font-mono`: (not used in initial scaffold, reserved)

**Motion:**
- All animations via `motion` (`transform` + `opacity` only — no layout properties)
- `useReducedMotion` check wraps every motion variant
- Page-load stagger on hero and product grids is the primary animation moment

**Spacing:** 4px base grid, Tailwind scale only — no arbitrary values without a comment.

---

## 7. Key Improvements Over NOIR

| NOIR | Norelia |
|------|---------|
| Single 3,900-line JSX file | ~30 focused component files |
| 100% inline `style={{}}` | Tailwind + CSS variables |
| `useState`-based routing | Next.js App Router (URL-first) |
| All state in `AppContent` + prop drilling | Zustand stores |
| No TypeScript | TypeScript strict, zero `any` |
| React/Vite SPA | Next.js RSC, SSR-ready |
| Google Fonts in `useEffect` | `next/font/google` |
| Manual `window.scrollTo` everywhere | Next.js `<Link>` + scroll restoration |
| EmailJS CDN script injection | `@emailjs/browser` npm package |
| No form validation | `react-hook-form` + `zod` on order form |
| No dark mode | Dark-first, class-strategy dark mode |
| No accessibility | Radix primitives for modals, focus management |

---

## 8. Full Improvement List (Beyond the Stack Upgrade)

Every feature from NOIR is kept and improved across three dimensions: code quality, UI, and UX.

### Animations & Motion
- All transitions via `motion` — never inline CSS `transition:` strings
- Hero: animated text/label reveals with spring physics on hover (replaces CSS opacity)
- Product grid: staggered card entrance animation on page load (cards reveal top-to-bottom in sequence)
- Cart / favorites panel: spring-based slide-in (replaces `position:fixed` with no entrance)
- Toast: animated slide-up entrance + fade-out exit
- GDPR banner: animated slide-up from bottom
- Nav dropdowns: animated `AnimatePresence` mount/unmount
- All motion variants wrapped in `useReducedMotion` check — zero exceptions

### Responsive / Mobile-First
- NOIR has zero mobile support — Norelia is fully responsive from 375px up
- Responsive product grid: 1 col (mobile) → 2 col (tablet) → 4 col (desktop)
- Mobile nav: hamburger menu with animated drawer, full-screen overlay
- Carousels: touch/swipe support via CSS `scroll-snap` + overflow-x
- Hero: stacked single-column on mobile instead of split halves
- Side panel: full-width on mobile
- Product page: stacked single-column on mobile
- Checkout: stacked layout on mobile (summary moves below table)

### Image Optimization
- All `<img>` tags replaced with `next/image`
- Proper `sizes` attribute per breakpoint for every image
- `placeholder="blur"` with generated blur data URLs
- Product images: fixed 3/4 aspect ratio with `object-cover`
- Hero images: `fill` layout with `priority` flag (above fold)

### SEO & Metadata
- `generateMetadata` on every page — title, description, canonical
- Product pages: OG image, product structured data
- `generateStaticParams` for `/product/[id]` and `[gender]/[category]` routes — static generation at build
- `sitemap.ts` and `robots.ts` in app root

### Product Card Improvements
- Color swatch row appears on hover (4 dots for available colors)
- "Quick Add" button overlay slides up on hover — adds to cart without navigating
- Skeleton card component for Suspense fallback while images load

### Forms
- GarmentDesigner order form: `react-hook-form` + `zod` schema (replaces 5x `useState` fields)
- Newsletter form: `react-hook-form` + `zod` — proper email validation with error states
- Checkout coupon field: `zod` validation
- All inputs: visible focus states via Radix primitives or Tailwind `focus-visible`

### Accessibility
- All modals (SignIn, SizeMiniGuide, CheckoutComingSoon): Radix `Dialog` — proper focus trap, Escape key, aria roles
- Side panel: Radix `Sheet` — focus management, keyboard close
- Product color swatches: `aria-label` with color name, `aria-pressed` for selected state
- Size buttons: `aria-pressed` state
- Nav dropdowns: proper `aria-expanded`, keyboard navigation
- Cart stepper buttons: `aria-label="Increase quantity"` etc.

### UX Details
- Scroll-to-top button (appears after scrolling 400px)
- Breadcrumbs on product page use Next.js `Link` — proper navigation, no `onClick` navigation
- Recently Viewed strip: CSS `scroll-snap` for smooth swipe on mobile
- Stock indicator: live countdown decrements as cart items are added (same as NOIR, but typed)
- "Back" buttons use `router.back()` — preserves scroll position
- Size guide: persists selected garment tab to `searchParams` — shareable URL
- Checkout: sticky order summary sidebar on desktop

### Performance
- `next/dynamic` for `GarmentDesigner` — code-split (heavy canvas/EmailJS logic, client-only)
- `next/font/google` for Bebas Neue + DM Sans — no layout shift, font subsetting
- React Query not needed for v1 (all data is static) — skip until real API exists
- `generateStaticParams` for all dynamic routes — full static export option

---

## 9. Scaffold Deliverable

The scaffold will include:
- Fully configured Next.js 15 App Router project with TypeScript strict
- All routes created with placeholder `page.tsx` shells
- All Zustand stores wired up
- All data files typed and populated (ported from NOIR)
- CSS variables + Tailwind config with semantic tokens
- `cn()`, `byGender()`, `getPrice()`, `getStock()` utilities
- Font setup via `next/font/google`
- Radix / shadcn/ui components installed (Dialog, Sheet, etc.)
- motion installed and configured
- `CLAUDE.md` inside the project root

When each component is implemented, it replaces the placeholder shell — no restructuring needed.
