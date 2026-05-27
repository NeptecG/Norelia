# CLAUDE.md — Norelia Project

Norelia is a minimalist premium streetwear e-commerce brand.

## Commands

```bash
npm run dev          # Dev server → http://localhost:3000
npm run build        # Production build
npm run start        # Serve production build
npm test             # Vitest unit tests (must all pass)
npx tsc --noEmit     # TypeScript strict check (must exit 0)
npx eslint src --max-warnings=0  # ESLint (zero warnings allowed)
```

## Stack

Next.js 15 App Router · TypeScript strict · Tailwind CSS + CSS variables · shadcn/ui (Dialog, Sheet) · motion (import from `motion`, never `framer-motion`) · Zustand · react-hook-form + zod · next/font/google · next/image · lucide-react · clsx + tailwind-merge (always use `cn()`)

## Architecture

- **Server-first.** RSC by default. `"use client"` only at interaction leaves.
- **Zustand stores:** `useCartStore`, `useFavoritesStore`, `useUIStore` — all in `src/stores/`
- **Static data:** `src/data/` — no API calls, no database in v1
- **Path alias:** `@/` → `src/`

## Key Files

- `src/types/index.ts` — all TypeScript interfaces
- `src/data/products.ts` — 29 products
- `src/lib/utils.ts` — cn(), byGender(), getPrice(), getStock()
- `src/lib/constants.ts` — BRAND, MARQUEE_TEXT, nav categories, thresholds

## Design Rules

Use semantic Tailwind only: `bg-surface`, `text-on-surface`, `bg-surface-alt`, `text-destructive`, `text-success`, `border-border`, etc.
Never use raw Tailwind color scales (`bg-zinc-900`, `text-gray-500`) inside components.

## Never

- Never import from `framer-motion` — use `motion` only
- Never use `any` or `@ts-ignore` — fix the root cause
- Never use `style={{}}` inline — Tailwind classes only
- Never use `<a>` for internal links — use Next.js `<Link>`
- Never define a component inside another component
- Never use default exports except `page.tsx` and `layout.tsx`
- Never use raw Tailwind color scales in components
- **Never use em-dashes (—) anywhere in user-visible text** — page titles, body copy, metadata, toasts, labels, placeholders. Use commas, colons, periods, or the middle dot (·) instead.
