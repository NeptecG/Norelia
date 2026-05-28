# Greek i18n (next-intl) Design Spec

**Date:** 2026-05-28
**Status:** Approved

---

## 1. Goal

Add Greek language support to Norelia using `next-intl`. Greek is the primary language (default, no URL prefix). English is the secondary language, accessible at `/en/`. A language switcher in the navbar lets users toggle between the two.

---

## 2. Architecture

### 2.1 Routing

All routes move under a `[locale]` dynamic segment:

```
src/app/
  [locale]/
    layout.tsx          ← locale-aware root layout (replaces src/app/layout.tsx)
    page.tsx            ← home
    [gender]/
      page.tsx
      [category]/
        page.tsx
    product/
      [id]/
        page.tsx
    checkout/
      page.tsx
    our-studio/
      page.tsx
    studio/
      page.tsx
    size-guide/
      page.tsx
    about/
      page.tsx
    shipping/
      page.tsx
    returns/
      page.tsx
    terms/
      page.tsx
    privacy/
      page.tsx
    not-found.tsx
    error.tsx
    loading.tsx
```

`src/app/layout.tsx` becomes a thin shell that just sets `<html>` and delegates to `[locale]/layout.tsx`.

### 2.2 Locale config

- **Default locale:** `el` (Greek) — no URL prefix, served at `/`
- **Secondary locale:** `en` (English) — served at `/en/`
- No other locales planned for v1

### 2.3 Middleware

`src/middleware.ts` uses `next-intl`'s `createMiddleware`:

```ts
import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['el', 'en'],
  defaultLocale: 'el',
  localePrefix: 'as-needed', // el = no prefix, en = /en/
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
```

**Note on `[locale]` vs `[gender]` segments:** The `[locale]` dynamic segment only activates for `el` and `en`. Paths like `/men/hoodies` are not locale-prefixed — the middleware passes them through unchanged, and Next.js matches them against `[locale]` = `el` (the default). There is no ambiguity because `men` and `women` are not valid locale codes.

### 2.4 Dependencies

- `next-intl` — sole i18n library (App Router native, full TypeScript)
- No additional routing library needed

---

## 3. Translation Files

### 3.1 File structure

```
messages/
  el.json    ← Greek (primary)
  en.json    ← English
```

### 3.2 Namespace strategy

Messages are namespaced by component/feature to avoid key collisions and make each component's strings self-contained:

```json
{
  "Nav": {
    "men": "ΑΝΔΡΑΣ",
    "women": "ΓΥΝΑΙΚΑ",
    "designYourOwn": "ΣΧΕΔΙΑΣΕ ΤΟ ΔΙΚΟ ΣΟΥ",
    "signIn": "Σύνδεση",
    "searchLabel": "Αναζήτηση",
    "cartLabel": "Καλάθι",
    "favoritesLabel": "Αγαπημένα"
  },
  "Hero": { ... },
  "ProductCard": { ... },
  "ProductPage": { ... },
  "SidePanel": { ... },
  "Toast": { ... },
  "NewsletterBar": { ... },
  "GDPRBanner": { ... },
  "SiteFooter": { ... },
  "CheckoutPage": { ... },
  "SignInModal": { ... },
  "CheckoutComingSoonModal": { ... },
  "SizeGuide": { ... },
  "Shipping": { ... },
  "Returns": { ... },
  "About": { ... },
  "OurStudio": { ... },
  "Terms": { ... },
  "Privacy": { ... },
  "NotFound": { ... },
  "ScrollToTop": { "label": "Επιστροφή στην αρχή" }
}
```

### 3.3 Greek uppercase / accent rule

Greek words lose their accent (tonos) when rendered in uppercase CSS (`text-transform: uppercase`). This creates incorrect Greek typography.

**Solution:** Write all Greek uppercase strings directly as uppercase without accents in the JSON file. Do NOT use CSS `text-transform: uppercase` on Greek text. English strings that need uppercase can still use CSS `uppercase`.

**Implementation pattern:**

```json
// el.json — written uppercase, no accents
"Nav": {
  "men": "ΑΝΔΡΑΣ",
  "women": "ΓΥΝΑΙΚΑ"
}

// en.json — written in normal case; CSS handles uppercase
"Nav": {
  "men": "Men",
  "women": "Women"
}
```

For nav links that use `tracking-[0.18em] uppercase` Tailwind class, the English strings will be uppercased by CSS, and the Greek strings arrive pre-uppercased from the JSON (no CSS transform applied to Greek text — the `uppercase` class is removed from elements that render Greek nav text).

In practice, the simplest approach: **remove `text-transform: uppercase` from all components** and write uppercase explicitly in both `el.json` and `en.json`. This avoids locale-conditional CSS classes and is consistent across both languages.

---

## 4. Font Strategy

### 4.1 Problem

Bebas Neue does not include Greek Unicode characters. Greek text falls back to a generic system font when Bebas Neue is used.

### 4.2 Solution

Load a second display font for Greek: **Oswald** (includes full Greek subset, similar condensed display personality to Bebas Neue).

```ts
// src/app/[locale]/layout.tsx
import { Bebas_Neue, Oswald, DM_Sans } from 'next/font/google'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display-latin',
  display: 'swap',
})

const oswald = Oswald({
  weight: ['400', '500'],
  subsets: ['latin', 'greek'],
  variable: '--font-display-greek',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin', 'greek'],   // add greek subset
  weight: ['300', '400', '500', '700'],
  variable: '--font-body',
  display: 'swap',
})
```

### 4.3 CSS variable switching

In `globals.css`, the `--font-display` variable switches based on the `lang` attribute that next-intl sets on `<html>`:

```css
:root {
  --font-display: var(--font-display-latin);
}

html[lang="el"] {
  --font-display: var(--font-display-greek);
}

html[lang="en"] {
  --font-display: var(--font-display-latin);
}
```

All existing `font-display` usage in components remains unchanged — they inherit the correct font automatically based on locale.

### 4.4 Body font

DM Sans covers both Latin and Greek well. Adding `subsets: ['latin', 'greek']` is sufficient.

---

## 5. Language Switcher

### 5.1 Placement in Nav

```
[Search] [Heart] [Cart]  |  Sign In  |  🇬🇷 EL  🇬🇧 EN
```

- The `|` separator is `w-px h-4 bg-on-surface/20` between "Sign In" and the flag group
- Flags are inline SVG (not emoji, not `<img>`)
- Active locale: full opacity (`opacity-100`)
- Inactive locale: reduced opacity (`opacity-45 hover:opacity-70`)
- Transition: `transition-opacity duration-150`

### 5.2 Flag SVGs

**Greek flag** — blue and white horizontal stripes (9 stripes), blue canton top-left with white Greek cross:

```tsx
export function FlagGreece({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 14" className={className} aria-hidden="true">
      {/* 9 stripes, alternating blue/white */}
      {[0,1,2,3,4,5,6,7,8].map((i) => (
        <rect key={i} x="0" y={i * (14/9)} width="20" height={14/9}
          fill={i % 2 === 0 ? '#0D5EAF' : '#FFFFFF'} />
      ))}
      {/* Blue canton 5/9 height */}
      <rect x="0" y="0" width="8" height={14 * 5/9} fill="#0D5EAF" />
      {/* White cross */}
      <rect x="3.2" y="0" width="1.6" height={14 * 5/9} fill="#FFFFFF" />
      <rect x="0" y={14 * 5/9 / 2 - 0.8} width="8" height="1.6" fill="#FFFFFF" />
    </svg>
  )
}
```

**UK flag** — Union Jack (simplified clean SVG):

```tsx
export function FlagUK({ className }: { className?: string }) {
  // Standard Union Jack: dark blue field, red cross with white borders
  // (full implementation in task — standard SVG path data)
}
```

Both flags render at `w-5 h-3.5` (20×14 proportions).

### 5.3 Navigation helpers

next-intl requires locale-aware navigation helpers. Create `src/navigation.ts`:

```ts
// src/navigation.ts
import { createNavigation } from 'next-intl/navigation'

export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales: ['el', 'en'] as const,
  defaultLocale: 'el',
  localePrefix: 'as-needed',
})
```

All internal `<Link>` usage and `useRouter`/`usePathname` imports in translated components switch to `@/navigation` instead of `next/navigation`.

### 5.4 Component: LanguageSwitcher

```tsx
// src/components/layout/language-switcher.tsx
'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/navigation'
import { FlagGreece } from '@/components/icons/flag-greece'
import { FlagUK }     from '@/components/icons/flag-uk'
import { cn }         from '@/lib/utils'

export function LanguageSwitcher() {
  const locale   = useLocale()
  const router   = useRouter()
  const pathname = usePathname()

  function switchLocale(next: 'el' | 'en') {
    if (next === locale) return
    router.replace(pathname, { locale: next })
  }

  return (
    <div className="flex items-center gap-2.5">
      <button
        onClick={() => switchLocale('el')}
        aria-label="Switch to Greek"
        className={cn(
          'flex items-center gap-1.5 font-body text-[10px] tracking-[0.12em] uppercase transition-opacity duration-150',
          locale === 'el' ? 'opacity-100' : 'opacity-45 hover:opacity-70',
        )}
      >
        <FlagGreece className="w-5 h-3.5 rounded-[1px]" />
        EL
      </button>
      <button
        onClick={() => switchLocale('en')}
        aria-label="Switch to English"
        className={cn(
          'flex items-center gap-1.5 font-body text-[10px] tracking-[0.12em] uppercase transition-opacity duration-150',
          locale === 'en' ? 'opacity-100' : 'opacity-45 hover:opacity-70',
        )}
      >
        <FlagUK className="w-5 h-3.5 rounded-[1px]" />
        EN
      </button>
    </div>
  )
}
```

---

## 6. Components Requiring Translation

Every user-visible string must move to the message files. Full list:

| Component / Page | Key strings |
|---|---|
| `Nav` | Men, Women, Design Your Own, Sign In, icon aria-labels |
| `Hero` | Headline, subtitle, CTA button |
| `Marquee` | Marquee text (kept as constant — same in both languages, all caps) |
| `FeaturedCarousel` | Section heading |
| `ProductCard` | Add to cart button aria-label, favourites aria-label |
| `ProductPage` | Size label, Add to Cart, Add to Favourites, sold out, size guide link |
| `SidePanel` | Cart title, empty state, item count, checkout button, total label |
| `Toast` | Added to cart, added to favourites, removed from favourites |
| `NewsletterBar` | Headline, subtitle, placeholder, subscribe button, success message |
| `GDPRBanner` | Title, body text, Accept All button, Decline button |
| `SiteFooter` | All link labels, copyright text |
| `SignInModal` | Title, body text, CTA |
| `CheckoutComingSoonModal` | Title, body text |
| `SizeMiniGuide` | All labels, measurements |
| `SizeGuide` (page) | All labels and measurements |
| `CheckoutPage` | All labels, empty state, totals |
| `About` (page) | Full copy |
| `OurStudio` (page) | Full copy, eyebrow, strip |
| `Shipping` (page) | All section titles and body copy |
| `Returns` (page) | All section titles and body copy |
| `Terms` (page) | Full copy |
| `Privacy` (page) | Full copy |
| `NotFound` | Heading, subtext, back link |
| `ScrollToTop` | aria-label |
| `BackButton` | aria-label |

### 6.1 Info pages strategy

Long-form pages (About, OurStudio, Shipping, Returns, Terms, Privacy) contain several paragraphs of copy. These go in the message JSON as multi-line strings. Since they're static, this is fine for v1 — no CMS needed.

---

## 7. Supabase Bilingual Product Content (Future)

Product names and descriptions stay English-only in v1 (hardcoded in `src/data/products.ts`).

When Supabase lands, product descriptions will use a JSONB column:

```sql
-- products table
description jsonb  -- { "en": "...", "el": "..." }
name        jsonb  -- { "en": "Classic Tee", "el": "Κλασικό Μπλουζάκι" }
```

The product fetch will return the current locale's string:

```ts
const name = product.name[locale] ?? product.name.en
```

This is a Supabase-phase concern. No action needed in the i18n implementation task.

---

## 8. `next-intl` Setup Details

### 8.1 `i18n.ts` request config

```ts
// src/i18n.ts
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../messages/${locale}.json`)).default,
}))
```

### 8.2 next.config.ts

```ts
import createNextIntlPlugin from 'next-intl/plugin'
const withNextIntl = createNextIntlPlugin('./src/i18n.ts')
export default withNextIntl({ /* existing config */ })
```

### 8.3 TypeScript types

`next-intl` supports typed messages. After generating types, `useTranslations('Nav')` will be fully type-safe.

---

## 9. Testing Strategy

- All existing tests reference components directly — they do not exercise routing. Most will pass with minimal changes.
- Components that use `useTranslations` need a `NextIntlClientProvider` wrapper in tests.
- Create `src/test-utils/intl-wrapper.tsx`: a utility that wraps test renders with the provider loaded with `en.json` messages (English is simpler to assert against in tests).
- Do NOT rewrite all test assertions to Greek strings — use the English messages file as the test default.
- New tests for `LanguageSwitcher`: renders both buttons, active locale has full opacity class, clicking inactive locale calls `router.push` with correct path.

---

## 10. Scope Boundaries (v1)

| In scope | Out of scope |
|---|---|
| All UI strings in `el.json` / `en.json` | Product content in Greek (Supabase phase) |
| Language switcher in navbar | URL slugs in Greek (e.g. `/el/andras`) |
| Font switching (Oswald / Bebas Neue) | RTL support |
| GDPR, toasts, modals translated | SEO `hreflang` meta tags (can add later) |
| All existing tests stay green | Playwright i18n E2E tests |

---

## 11. File Summary

### New files

| File | Purpose |
|---|---|
| `src/middleware.ts` | next-intl locale routing |
| `src/i18n.ts` | next-intl request config |
| `messages/el.json` | All Greek strings |
| `messages/en.json` | All English strings |
| `src/components/icons/flag-greece.tsx` | Greek flag SVG |
| `src/components/icons/flag-uk.tsx` | UK flag SVG |
| `src/components/layout/language-switcher.tsx` | Locale toggle component |
| `src/components/layout/language-switcher.test.tsx` | Switcher tests |
| `src/navigation.ts` | Locale-aware Link, useRouter, usePathname exports |
| `src/test-utils/intl-wrapper.tsx` | Provider wrapper for tests |

### Modified files

| File | Change |
|---|---|
| `src/app/layout.tsx` | Thin shell only; delegates to `[locale]/layout.tsx` |
| `src/app/[locale]/layout.tsx` | Locale-aware root layout; `lang` attribute; dual fonts |
| `src/app/globals.css` | Add `html[lang]` CSS variable switching rules |
| `next.config.ts` | Wrap with `withNextIntl` |
| All components in section 6 | Replace hardcoded strings with `useTranslations()` |
| All test files for translated components | Wrap renders with `intl-wrapper` |
