# Norelia Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a production-grade Next.js 15 App Router e-commerce project for "Norelia" at `C:\Users\denno\Desktop\Norelia project\` — with all routes, typed data files, Zustand stores, utilities, and component stubs wired together and building cleanly, ready for full component implementation.

**Architecture:** Next.js 15 App Router, TypeScript strict mode. Static product data in typed constants at `src/data/`. Zustand stores for cart/favorites/UI with 7-day localStorage TTL. All routes pre-created as shells. Component stubs ensure the project compiles and boots before any UI is implemented.

**Tech Stack:** Next.js 15, TypeScript 5 strict, Tailwind CSS with CSS variable semantic tokens, shadcn/ui (Dialog, Sheet), motion, Zustand + persist, react-hook-form, zod, next/font/google, next/image, lucide-react, clsx + tailwind-merge, Vitest + Testing Library

---

## File Map

```
C:\Users\denno\Desktop\Norelia project\
├── CLAUDE.md
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── package.json
├── public/
│   ├── payment-icons.webp        (copy from noir-stackblitz)
│   └── size-chart.jpg            (copy from noir-stackblitz)
└── src/
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx             ← root layout: fonts, Nav, Footer, panels
    │   ├── page.tsx               ← /  home shell
    │   ├── loading.tsx
    │   ├── error.tsx
    │   ├── not-found.tsx
    │   ├── sitemap.ts
    │   ├── robots.ts
    │   ├── studio/page.tsx        ← /studio
    │   ├── product/[id]/page.tsx  ← /product/:code
    │   ├── size-guide/page.tsx
    │   ├── checkout/page.tsx
    │   ├── about/page.tsx
    │   ├── shipping/page.tsx
    │   ├── returns/page.tsx
    │   ├── our-studio/page.tsx
    │   └── [gender]/
    │       ├── page.tsx           ← /men  /women
    │       └── [category]/page.tsx ← /men/tshirts etc.
    ├── types/
    │   └── index.ts               ← Product, CartItem, GarmentColor, SizeRow, etc.
    ├── data/
    │   ├── products.ts            ← PRODUCTS: Product[]  (29 items)
    │   ├── stock.ts               ← STOCK, DEFAULT_STOCK
    │   ├── colors.ts              ← GCOLORS
    │   ├── sizes.ts               ← SIZES, SIZE_DATA, SIZE_CHART_IMG
    │   ├── pricing.ts             ← BP, surcharges, VAT_RATE
    │   └── paths.ts               ← PATHS (SVG silhouettes)
    ├── lib/
    │   ├── utils.ts               ← cn(), byGender(), getPrice(), getStock(), helpers
    │   ├── utils.test.ts          ← Vitest unit tests
    │   └── constants.ts           ← BRAND, MARQUEE_TEXT, nav cats, TTL, thresholds
    ├── stores/
    │   ├── cart-store.ts          ← useCartStore (Zustand + persist)
    │   ├── favorites-store.ts     ← useFavoritesStore
    │   └── ui-store.ts            ← useUIStore (sidePanel, toast, recentlyViewed)
    └── components/
        ├── layout/
        │   ├── nav.tsx            ← stub → full Nav
        │   ├── site-footer.tsx    ← stub → full Footer
        │   ├── newsletter-bar.tsx ← stub
        │   ├── side-panel.tsx     ← stub
        │   ├── toast.tsx          ← stub
        │   └── gdpr-banner.tsx    ← stub
        ├── modals/
        │   ├── sign-in-modal.tsx
        │   ├── checkout-coming-soon-modal.tsx
        │   └── size-mini-guide.tsx
        ├── home/
        │   ├── hero.tsx
        │   ├── marquee.tsx
        │   └── featured-carousel.tsx
        ├── products/
        │   ├── product-card.tsx
        │   ├── product-grid.tsx
        │   ├── price-tag.tsx
        │   ├── related-products.tsx
        │   └── recently-viewed-strip.tsx
        ├── product-page/
        │   └── product-page.tsx
        ├── size-guide/
        │   ├── size-table.tsx
        │   ├── male-figure.tsx
        │   └── female-figure.tsx
        ├── studio/
        │   └── garment-designer.tsx
        ├── checkout/
        │   └── checkout-page.tsx
        └── scroll-to-top.tsx
```

---

### Task 1: Create Next.js Project and Install Dependencies

**Files:**
- Create: `C:\Users\denno\Desktop\Norelia project\` (entire project)

- [ ] **Step 1: Run create-next-app**

```powershell
cd "C:\Users\denno\Desktop"
npx create-next-app@latest "Norelia project" --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git
```

Select all defaults when prompted. The project directory is `C:\Users\denno\Desktop\Norelia project\`.

- [ ] **Step 2: Install runtime dependencies**

```powershell
cd "C:\Users\denno\Desktop\Norelia project"
npm install motion zustand react-hook-form zod @hookform/resolvers lucide-react clsx tailwind-merge class-variance-authority @radix-ui/react-dialog @radix-ui/react-slot @emailjs/browser
```

- [ ] **Step 3: Install dev dependencies**

```powershell
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom @types/node
```

- [ ] **Step 4: Init shadcn/ui**

```powershell
npx shadcn@latest init --defaults
```

- [ ] **Step 5: Add shadcn Dialog and Sheet**

```powershell
npx shadcn@latest add dialog sheet
```

- [ ] **Step 6: Copy public assets from NOIR**

```powershell
Copy-Item "C:\Users\denno\Desktop\noir-stackblitz\public\payment-icons.webp" -Destination "C:\Users\denno\Desktop\Norelia project\public\"
Copy-Item "C:\Users\denno\Desktop\noir-stackblitz\public\size-chart.jpg" -Destination "C:\Users\denno\Desktop\Norelia project\public\"
```

- [ ] **Step 7: Verify dev server boots**

```powershell
npm run dev
```

Expected: Next.js dev server starts on http://localhost:3000 with no console errors.

Stop the server (`Ctrl+C`).

- [ ] **Step 8: Init git and commit**

```powershell
git init
git add .
git commit -m "feat: initialize Norelia Next.js 15 project with full dependency stack"
```

---

### Task 2: Configure TypeScript, Tailwind, ESLint, and Next.js

**Files:**
- Modify: `tsconfig.json`
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`
- Modify: `next.config.ts`
- Create: `vitest.config.ts`

- [ ] **Step 1: Replace tsconfig.json**

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 2: Replace tailwind.config.ts**

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        surface:              'var(--color-surface)',
        'surface-alt':        'var(--color-surface-alt)',
        'surface-raised':     'var(--color-surface-raised)',
        'on-surface':         'var(--color-on-surface)',
        'on-surface-muted':   'var(--color-on-surface-muted)',
        accent:               'var(--color-accent)',
        destructive:          'var(--color-destructive)',
        success:              'var(--color-success)',
        border:               'var(--color-border)',
        'border-subtle':      'var(--color-border-subtle)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Impact', 'sans-serif'],
        body:    ['var(--font-body)', 'Helvetica Neue', 'sans-serif'],
      },
      keyframes: {
        ticker: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        ticker: 'ticker 22s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 3: Replace src/app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Light mode (default) */
    --color-surface:            #ffffff;
    --color-surface-alt:        #212121;
    --color-surface-raised:     #f5f5f5;
    --color-on-surface:         #212121;
    --color-on-surface-muted:   #888888;
    --color-accent:             #212121;
    --color-destructive:        #e11d48;
    --color-success:            #22c55e;
    --color-border:             #212121;
    --color-border-subtle:      #e0e0e0;
  }

  .dark {
    --color-surface:            #111111;
    --color-surface-alt:        #212121;
    --color-surface-raised:     #1a1a1a;
    --color-on-surface:         #f5f5f5;
    --color-on-surface-muted:   rgba(255, 255, 255, 0.55);
    --color-accent:             #ffffff;
    --color-destructive:        #e11d48;
    --color-success:            #22c55e;
    --color-border:             rgba(255, 255, 255, 0.15);
    --color-border-subtle:      rgba(255, 255, 255, 0.08);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
  }
}
```

- [ ] **Step 4: Replace next.config.ts**

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 5: Create vitest.config.ts**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
```

- [ ] **Step 6: Add test scripts to package.json**

In `package.json`, under `"scripts"`, add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 7: TypeScript check**

```powershell
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 8: Commit**

```powershell
git add .
git commit -m "feat: configure TypeScript strict, Tailwind semantic tokens, CSS variables, Vitest"
```

---

### Task 3: TypeScript Types

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: Create src/types/index.ts**

```ts
export type ProductCategory = 'TSHIRTS' | 'HOODIES' | 'ZIPPERS' | 'TANKTOPS'
export type Gender          = 'men' | 'women' | 'unisex'
export type GarmentType     = 'tshirt' | 'hoodie' | 'zipper'
export type SizeKey         = 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL'
export type SidePanelType   = 'cart' | 'favorites' | null
export type PrintMethod     = 'dtg' | 'embroidery'
export type FitType         = 'normal' | 'oversized'

export interface Product {
  id:          number
  name:        string
  cat:         ProductCategory
  gender:      Gender
  code:        string
  description: string
  price:       string        // "€45"
  salePrice?:  number        // plain number, no €
  tag:         'NEW' | ''
  img:         string
}

export interface CartItem extends Product {
  qty: number
}

export interface GarmentColor {
  name:     string
  hex:      string
  outline?: boolean
}

export interface SizeRow {
  size:   SizeKey
  intl:   string
  eu:     string
  uk:     string
  chest:  string
  waist:  string
  hip?:   string
  length: string
  sleeve: string
}

export type SizeData = {
  [K in GarmentType]: {
    men:   SizeRow[]
    women: SizeRow[]
  }
}

export type BasePrices = {
  [K in GarmentType]: {
    [S in SizeKey]: number
  }
}

export type StockMap = Record<number, number>

export interface GarmentPaths {
  front: string
  back:  string
}

export type AllPaths = {
  [K in GarmentType]: GarmentPaths
}

export interface ToastState {
  msg:     string
  visible: boolean
  type:    'add' | 'remove'
}

export interface DesignState {
  el:    HTMLImageElement | null
  x:     number
  y:     number
  w:     number
  h:     number
  angle: number
}
```

- [ ] **Step 2: TypeScript check**

```powershell
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```powershell
git add src/types/index.ts
git commit -m "feat: define full TypeScript type system for Norelia"
```

---

### Task 4: Data Files

**Files:**
- Create: `src/data/products.ts`
- Create: `src/data/stock.ts`
- Create: `src/data/colors.ts`
- Create: `src/data/sizes.ts`
- Create: `src/data/pricing.ts`
- Create: `src/data/paths.ts`

- [ ] **Step 1: Create src/data/products.ts**

```ts
import type { Product } from '@/types'

export const PRODUCTS: Product[] = [
  // ── T-SHIRTS ──────────────────────────────────────────────
  { id: 1,  name: 'FORM TEE 001',   cat: 'TSHIRTS', gender: 'men',    code: '100001', description: '100% high quality cotton. Relaxed fit with a structured collar and reinforced stitching.',                             price: '€45', tag: 'NEW', img: 'https://images.pexels.com/photos/3290886/pexels-photo-3290886.jpeg?auto=compress&cs=tinysrgb&w=400&h=533&fit=crop' },
  { id: 2,  name: 'VOID GRAPHIC',   cat: 'TSHIRTS', gender: 'men',    code: '100002', description: '100% high quality cotton. Heavyweight 220gsm fabric with a premium screen-printed graphic.',                           price: '€55', tag: '',    img: 'https://images.pexels.com/photos/15553972/pexels-photo-15553972.jpeg?auto=compress&cs=tinysrgb&w=400&h=533&fit=crop' },
  { id: 3,  name: 'MONO ESSENTIAL', cat: 'TSHIRTS', gender: 'unisex', code: '100003', description: '100% high quality cotton. A wardrobe essential in a classic unisex cut.',                                             price: '€40', tag: '',    img: 'https://images.pexels.com/photos/4066292/pexels-photo-4066292.jpeg?auto=compress&cs=tinysrgb&w=400&h=533&fit=crop' },
  { id: 4,  name: 'STRUCTURE TEE',  cat: 'TSHIRTS', gender: 'women',  code: '100004', description: '100% high quality cotton. Slim structured fit with subtle side seam detailing.',                                      price: '€48', tag: '',    img: 'https://images.pexels.com/photos/2112427/pexels-photo-2112427.jpeg?auto=compress&cs=tinysrgb&w=400&h=533&fit=crop' },
  { id: 13, name: 'SHADOW TEE',     cat: 'TSHIRTS', gender: 'men',    code: '100005', description: '100% high quality cotton. Oversized silhouette in a dense 240gsm jersey.',                                            price: '€52', tag: '',    img: 'https://images.pexels.com/photos/18930893/pexels-photo-18930893.jpeg?auto=compress&cs=tinysrgb&w=400&h=533&fit=crop' },
  { id: 14, name: 'OUTLINE TEE',    cat: 'TSHIRTS', gender: 'women',  code: '100006', description: '100% high quality cotton. Lightweight everyday tee with a relaxed drop-shoulder fit.',                                price: '€38', tag: '',    img: 'https://images.pexels.com/photos/2252167/pexels-photo-2252167.jpeg?auto=compress&cs=tinysrgb&w=400&h=533&fit=crop' },
  { id: 15, name: 'CONTRAST TEE',   cat: 'TSHIRTS', gender: 'unisex', code: '100007', description: '100% high quality cotton. Contrast-panel design in a modern boxy cut.',                                              price: '€58', tag: 'NEW', img: 'https://images.pexels.com/photos/9558567/pexels-photo-9558567.jpeg?auto=compress&cs=tinysrgb&w=400&h=533&fit=crop' },
  { id: 16, name: 'MINIMAL BLOCK',  cat: 'TSHIRTS', gender: 'men',    code: '100008', description: '100% high quality cotton. Clean minimal aesthetic with tonal stitching.',                                             price: '€44', tag: '',    img: 'https://images.pexels.com/photos/3015689/pexels-photo-3015689.jpeg?auto=compress&cs=tinysrgb&w=400&h=533&fit=crop' },
  { id: 25, name: 'BLACK MAMBA',    cat: 'TSHIRTS', gender: 'men',    code: '100009', description: '100% high quality cotton. Bold oversized silhouette with a premium heavyweight jersey and a striking contrast print.',  price: '€37', salePrice: 27, tag: 'NEW', img: 'https://images.pexels.com/photos/14428678/pexels-photo-14428678.jpeg?auto=compress&cs=tinysrgb&w=400&h=533&fit=crop' },

  // ── HOODIES ───────────────────────────────────────────────
  { id: 5,  name: 'ARCH HOODIE',     cat: 'HOODIES', gender: 'men',    code: '200001', description: '80% cotton, 20% polyester fleece. Heavyweight 380gsm fabric with a brushed interior for warmth.',          price: '€89',  tag: 'NEW', img: 'https://images.pexels.com/photos/31700390/pexels-photo-31700390.jpeg?auto=compress&cs=tinysrgb&w=400&h=533&fit=crop' },
  { id: 6,  name: 'VOID HOODIE',     cat: 'HOODIES', gender: 'unisex', code: '200002', description: '80% cotton, 20% polyester fleece. Relaxed unisex fit with a spacious kangaroo pocket.',                    price: '€85',  salePrice: 50, tag: '', img: 'https://images.pexels.com/photos/19461586/pexels-photo-19461586.jpeg?auto=compress&cs=tinysrgb&w=400&h=533&fit=crop' },
  { id: 7,  name: 'OVERCAST HOODIE', cat: 'HOODIES', gender: 'women',  code: '200003', description: '80% cotton, 20% polyester fleece. Oversized fit with dropped shoulders and a double-layered hood.',       price: '€98',  tag: '',    img: 'https://images.pexels.com/photos/6763595/pexels-photo-6763595.jpeg?auto=compress&cs=tinysrgb&w=400&h=533&fit=crop' },
  { id: 8,  name: 'SERIF HOODIE',    cat: 'HOODIES', gender: 'women',  code: '200004', description: '80% cotton, 20% polyester fleece. Slim athletic cut with ribbed cuffs and hem.',                          price: '€95',  tag: '',    img: 'https://images.pexels.com/photos/8410841/pexels-photo-8410841.jpeg?auto=compress&cs=tinysrgb&w=400&h=533&fit=crop' },
  { id: 17, name: 'FADE HOODIE',     cat: 'HOODIES', gender: 'men',    code: '200005', description: '80% cotton, 20% polyester fleece. Premium garment-dyed finish for a lived-in look.',                      price: '€92',  tag: 'NEW', img: 'https://images.pexels.com/photos/16168419/pexels-photo-16168419.jpeg?auto=compress&cs=tinysrgb&w=400&h=533&fit=crop' },
  { id: 18, name: 'BLOCK HOODIE',    cat: 'HOODIES', gender: 'unisex', code: '200006', description: '80% cotton, 20% polyester fleece. Boxy unisex silhouette with reinforced seams.',                         price: '€78',  salePrice: 55, tag: '', img: 'https://images.pexels.com/photos/9321370/pexels-photo-9321370.jpeg?auto=compress&cs=tinysrgb&w=400&h=533&fit=crop' },
  { id: 19, name: 'CORE HOODIE',     cat: 'HOODIES', gender: 'women',  code: '200007', description: '80% cotton, 20% polyester fleece. Soft-touch fleece lining with a structured hood.',                      price: '€86',  tag: '',    img: 'https://images.pexels.com/photos/4100431/pexels-photo-4100431.jpeg?auto=compress&cs=tinysrgb&w=400&h=533&fit=crop' },
  { id: 20, name: 'SLATE HOODIE',    cat: 'HOODIES', gender: 'men',    code: '200008', description: '80% cotton, 20% polyester fleece. Classic fit with a smooth face and plush interior.',                    price: '€94',  tag: '',    img: 'https://images.pexels.com/photos/8267978/pexels-photo-8267978.jpeg?auto=compress&cs=tinysrgb&w=400&h=533&fit=crop' },

  // ── ZIPPERS ───────────────────────────────────────────────
  { id: 9,  name: 'VOID ZIP',   cat: 'ZIPPERS', gender: 'men',    code: '300001', description: '80% cotton, 20% polyester. Full-zip hoodie with a YKK metal zipper and flat-lock stitching.',              price: '€110', tag: 'NEW', img: 'https://images.pexels.com/photos/16168419/pexels-photo-16168419.jpeg?auto=compress&cs=tinysrgb&w=400&h=533&fit=crop' },
  { id: 10, name: 'FORM ZIP',   cat: 'ZIPPERS', gender: 'unisex', code: '300002', description: '80% cotton, 20% polyester. Relaxed unisex cut with a smooth exterior and cosy fleece lining.',             price: '€105', tag: '',    img: 'https://images.pexels.com/photos/9321370/pexels-photo-9321370.jpeg?auto=compress&cs=tinysrgb&w=400&h=533&fit=crop' },
  { id: 11, name: 'MONO ZIP',   cat: 'ZIPPERS', gender: 'women',  code: '300003', description: '80% cotton, 20% polyester. Slim-fit zip hoodie with ribbed trims and a two-pocket front.',                 price: '€99',  tag: '',    img: 'https://images.pexels.com/photos/7228053/pexels-photo-7228053.jpeg?auto=compress&cs=tinysrgb&w=400&h=533&fit=crop' },
  { id: 12, name: 'ARCH ZIP',   cat: 'ZIPPERS', gender: 'men',    code: '300004', description: '80% cotton, 20% polyester. Structured zip-up with a high collar and contrast zip tape.',                   price: '€115', tag: '',    img: 'https://images.pexels.com/photos/31700390/pexels-photo-31700390.jpeg?auto=compress&cs=tinysrgb&w=400&h=533&fit=crop' },
  { id: 21, name: 'FADE ZIP',   cat: 'ZIPPERS', gender: 'women',  code: '300005', description: '80% cotton, 20% polyester. Oversized silhouette with a premium garment-dyed finish.',                     price: '€108', tag: 'NEW', img: 'https://images.pexels.com/photos/933499/pexels-photo-933499.jpeg?auto=compress&cs=tinysrgb&w=400&h=533&fit=crop' },
  { id: 22, name: 'CORE ZIP',   cat: 'ZIPPERS', gender: 'unisex', code: '300006', description: '80% cotton, 20% polyester. Unisex boxy fit with a concealed zip and minimal branding.',                   price: '€95',  salePrice: 68, tag: '', img: 'https://images.pexels.com/photos/4066292/pexels-photo-4066292.jpeg?auto=compress&cs=tinysrgb&w=400&h=533&fit=crop' },
  { id: 23, name: 'SHADOW ZIP', cat: 'ZIPPERS', gender: 'men',    code: '300007', description: '80% cotton, 20% polyester. Midweight zip hoodie with a shadow-toned panelled front.',                     price: '€112', tag: '',    img: 'https://images.pexels.com/photos/8267978/pexels-photo-8267978.jpeg?auto=compress&cs=tinysrgb&w=400&h=533&fit=crop' },
  { id: 24, name: 'SLATE ZIP',  cat: 'ZIPPERS', gender: 'women',  code: '300008', description: '80% cotton, 20% polyester. Relaxed everyday zip-up with a fleece-backed interior.',                       price: '€102', salePrice: 74, tag: '', img: 'https://images.pexels.com/photos/14758623/pexels-photo-14758623.jpeg?auto=compress&cs=tinysrgb&w=400&h=533&fit=crop' },

  // ── TANK TOPS (men only) ───────────────────────────────────
  { id: 26, name: 'VOID TANK',   cat: 'TANKTOPS', gender: 'men', code: '400001', description: '100% high quality cotton. Ribbed sleeveless silhouette with a reinforced neckline and clean dropped armholes.', price: '€32', tag: 'NEW', img: 'https://images.pexels.com/photos/3290886/pexels-photo-3290886.jpeg?auto=compress&cs=tinysrgb&w=400&h=533&fit=crop' },
  { id: 27, name: 'ARCH TANK',   cat: 'TANKTOPS', gender: 'men', code: '400002', description: '100% high quality cotton. Oversized boxy cut with raw-edge armholes and a subtle back logo.',                 price: '€28', salePrice: 19, tag: 'NEW', img: 'https://images.pexels.com/photos/15553972/pexels-photo-15553972.jpeg?auto=compress&cs=tinysrgb&w=400&h=533&fit=crop' },
  { id: 28, name: 'FORM TANK',   cat: 'TANKTOPS', gender: 'men', code: '400003', description: '100% high quality cotton. Fitted athletic cut with a deep scoop neckline and elongated hem.',                price: '€30', tag: 'NEW', img: 'https://images.pexels.com/photos/18516993/pexels-photo-18516993.jpeg?auto=compress&cs=tinysrgb&w=400&h=533&fit=crop' },
  { id: 29, name: 'SHADOW TANK', cat: 'TANKTOPS', gender: 'men', code: '400004', description: '100% high quality cotton. Relaxed longline silhouette with tonal stitching and a subtle drop hem.',          price: '€34', tag: '',    img: 'https://images.pexels.com/photos/3015689/pexels-photo-3015689.jpeg?auto=compress&cs=tinysrgb&w=400&h=533&fit=crop' },
]
```

- [ ] **Step 2: Create src/data/stock.ts**

```ts
import type { StockMap } from '@/types'

export const STOCK: StockMap = {
  25: 2,
  1: 8,  6: 5,  9: 3,  14: 7, 17: 9,
  21: 6, 22: 4, 26: 10, 28: 3,
}

export const DEFAULT_STOCK = 25
```

- [ ] **Step 3: Create src/data/colors.ts**

```ts
import type { GarmentColor } from '@/types'

export const GCOLORS: GarmentColor[] = [
  { name: 'White',    hex: '#FFFFFF', outline: true },
  { name: 'Black',    hex: '#1e1e1e' },
  { name: 'Grey',     hex: '#919191' },
  { name: 'Bordeaux', hex: '#6b1b2c' },
]
```

- [ ] **Step 4: Create src/data/sizes.ts**

```ts
import type { SizeData } from '@/types'

export const SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL'] as const

export const SIZE_CHART_IMG = '/size-chart.jpg'

export const SIZE_DATA: SizeData = {
  tshirt: {
    men: [
      { size: 'S',   intl: 'S',   eu: '44–46', uk: '34–36', chest: '88–92',   waist: '76–80',   length: '70', sleeve: '22' },
      { size: 'M',   intl: 'M',   eu: '48–50', uk: '38–40', chest: '96–100',  waist: '84–88',   length: '72', sleeve: '23' },
      { size: 'L',   intl: 'L',   eu: '52–54', uk: '42–44', chest: '104–108', waist: '92–96',   length: '74', sleeve: '24' },
      { size: 'XL',  intl: 'XL',  eu: '56–58', uk: '46–48', chest: '112–116', waist: '100–104', length: '76', sleeve: '25' },
      { size: '2XL', intl: '2XL', eu: '60–62', uk: '50–52', chest: '120–124', waist: '108–112', length: '78', sleeve: '26' },
      { size: '3XL', intl: '3XL', eu: '64–66', uk: '54–56', chest: '128–132', waist: '116–120', length: '80', sleeve: '27' },
    ],
    women: [
      { size: 'S',   intl: 'S',   eu: '36–38', uk: '8–10',  chest: '84–88',   waist: '68–72',   hip: '92–96',   length: '60', sleeve: '20' },
      { size: 'M',   intl: 'M',   eu: '40–42', uk: '12–14', chest: '92–96',   waist: '76–80',   hip: '100–104', length: '62', sleeve: '21' },
      { size: 'L',   intl: 'L',   eu: '44–46', uk: '16–18', chest: '100–104', waist: '84–88',   hip: '108–112', length: '64', sleeve: '22' },
      { size: 'XL',  intl: 'XL',  eu: '48–50', uk: '20–22', chest: '108–112', waist: '92–96',   hip: '116–120', length: '66', sleeve: '23' },
      { size: '2XL', intl: '2XL', eu: '52–54', uk: '24–26', chest: '116–120', waist: '100–104', hip: '124–128', length: '68', sleeve: '24' },
      { size: '3XL', intl: '3XL', eu: '56–58', uk: '28–30', chest: '124–128', waist: '108–112', hip: '132–136', length: '70', sleeve: '25' },
    ],
  },
  hoodie: {
    men: [
      { size: 'S',   intl: 'S',   eu: '44–46', uk: '34–36', chest: '96–100',  waist: '84–88',   length: '68', sleeve: '62' },
      { size: 'M',   intl: 'M',   eu: '48–50', uk: '38–40', chest: '104–108', waist: '92–96',   length: '70', sleeve: '64' },
      { size: 'L',   intl: 'L',   eu: '52–54', uk: '42–44', chest: '112–116', waist: '100–104', length: '72', sleeve: '65' },
      { size: 'XL',  intl: 'XL',  eu: '56–58', uk: '46–48', chest: '120–124', waist: '108–112', length: '74', sleeve: '66' },
      { size: '2XL', intl: '2XL', eu: '60–62', uk: '50–52', chest: '128–132', waist: '116–120', length: '76', sleeve: '67' },
      { size: '3XL', intl: '3XL', eu: '64–66', uk: '54–56', chest: '136–140', waist: '124–128', length: '78', sleeve: '68' },
    ],
    women: [
      { size: 'S',   intl: 'S',   eu: '36–38', uk: '8–10',  chest: '92–96',   waist: '76–80',   hip: '100–104', length: '62', sleeve: '58' },
      { size: 'M',   intl: 'M',   eu: '40–42', uk: '12–14', chest: '100–104', waist: '84–88',   hip: '108–112', length: '64', sleeve: '59' },
      { size: 'L',   intl: 'L',   eu: '44–46', uk: '16–18', chest: '108–112', waist: '92–96',   hip: '116–120', length: '66', sleeve: '60' },
      { size: 'XL',  intl: 'XL',  eu: '48–50', uk: '20–22', chest: '116–120', waist: '100–104', hip: '124–128', length: '68', sleeve: '61' },
      { size: '2XL', intl: '2XL', eu: '52–54', uk: '24–26', chest: '124–128', waist: '108–112', hip: '132–136', length: '70', sleeve: '62' },
      { size: '3XL', intl: '3XL', eu: '56–58', uk: '28–30', chest: '132–136', waist: '116–120', hip: '140–144', length: '72', sleeve: '63' },
    ],
  },
  zipper: {
    men: [
      { size: 'S',   intl: 'S',   eu: '44–46', uk: '34–36', chest: '96–100',  waist: '84–88',   length: '68', sleeve: '62' },
      { size: 'M',   intl: 'M',   eu: '48–50', uk: '38–40', chest: '104–108', waist: '92–96',   length: '70', sleeve: '64' },
      { size: 'L',   intl: 'L',   eu: '52–54', uk: '42–44', chest: '112–116', waist: '100–104', length: '72', sleeve: '65' },
      { size: 'XL',  intl: 'XL',  eu: '56–58', uk: '46–48', chest: '120–124', waist: '108–112', length: '74', sleeve: '66' },
      { size: '2XL', intl: '2XL', eu: '60–62', uk: '50–52', chest: '128–132', waist: '116–120', length: '76', sleeve: '67' },
      { size: '3XL', intl: '3XL', eu: '64–66', uk: '54–56', chest: '136–140', waist: '124–128', length: '78', sleeve: '68' },
    ],
    women: [
      { size: 'S',   intl: 'S',   eu: '36–38', uk: '8–10',  chest: '92–96',   waist: '76–80',   hip: '100–104', length: '62', sleeve: '58' },
      { size: 'M',   intl: 'M',   eu: '40–42', uk: '12–14', chest: '100–104', waist: '84–88',   hip: '108–112', length: '64', sleeve: '59' },
      { size: 'L',   intl: 'L',   eu: '44–46', uk: '16–18', chest: '108–112', waist: '92–96',   hip: '116–120', length: '66', sleeve: '60' },
      { size: 'XL',  intl: 'XL',  eu: '48–50', uk: '20–22', chest: '116–120', waist: '100–104', hip: '124–128', length: '68', sleeve: '61' },
      { size: '2XL', intl: '2XL', eu: '52–54', uk: '24–26', chest: '124–128', waist: '108–112', hip: '132–136', length: '70', sleeve: '62' },
      { size: '3XL', intl: '3XL', eu: '56–58', uk: '28–30', chest: '132–136', waist: '116–120', hip: '140–144', length: '72', sleeve: '63' },
    ],
  },
}
```

- [ ] **Step 5: Create src/data/pricing.ts**

```ts
import type { BasePrices } from '@/types'

export const BP: BasePrices = {
  tshirt: { S: 22.99, M: 24.99, L: 24.99, XL: 26.99, '2XL': 28.99, '3XL': 30.99 },
  hoodie: { S: 42.99, M: 44.99, L: 44.99, XL: 46.99, '2XL': 49.99, '3XL': 52.99 },
  zipper: { S: 49.99, M: 52.99, L: 52.99, XL: 55.99, '2XL': 59.99, '3XL': 63.99 },
}

export const FIT_SURCHARGE            = 4   // +€4 oversized
export const EMBROIDERY_SURCHARGE     = 7   // +€7 embroidery
export const FREE_SHIPPING_THRESHOLD  = 60
export const VAT_RATE                 = 0.24
```

- [ ] **Step 6: Create src/data/paths.ts**

```ts
import type { AllPaths } from '@/types'

export const PATHS: AllPaths = {
  tshirt: {
    front: 'M168,35 C150,44 90,64 80,76 C56,102 8,136 2,156 C6,174 46,186 70,172 C90,160 105,138 110,120 L110,418 L290,418 L290,120 C295,138 310,160 330,172 C354,186 394,174 398,156 C392,136 344,102 320,76 C310,64 250,44 232,35 C218,62 182,62 168,35 Z',
    back:  'M168,35 C150,44 90,64 80,76 C56,102 8,136 2,156 C6,174 46,186 70,172 C90,160 105,138 110,120 L110,418 L290,418 L290,120 C295,138 310,160 330,172 C354,186 394,174 398,156 C392,136 344,102 320,76 C310,64 250,44 232,35 C218,30 182,30 168,35 Z',
  },
  hoodie: {
    front: 'M88,55 Q200,-15 312,55 C330,64 352,82 364,102 C376,128 384,165 382,352 C378,366 364,380 348,378 C332,366 312,285 300,228 C294,206 291,198 290,192 L290,450 L110,450 L110,192 C109,198 106,206 100,228 C88,285 68,366 52,378 C36,380 22,366 18,352 C16,165 24,128 36,102 C48,82 70,64 88,55 Z',
    back:  'M88,55 Q200,-42 312,55 C330,64 352,82 364,102 C376,128 384,165 382,352 C378,366 364,380 348,378 C332,366 312,285 300,228 C294,206 291,198 290,192 L290,450 L110,450 L110,192 C109,198 106,206 100,228 C88,285 68,366 52,378 C36,380 22,366 18,352 C16,165 24,128 36,102 C48,82 70,64 88,55 Z',
  },
  zipper: {
    front: 'M88,55 Q200,-15 312,55 C330,64 352,82 364,102 C376,128 384,165 382,352 C378,366 364,380 348,378 C332,366 312,285 300,228 C294,206 291,198 290,192 L290,450 L110,450 L110,192 C109,198 106,206 100,228 C88,285 68,366 52,378 C36,380 22,366 18,352 C16,165 24,128 36,102 C48,82 70,64 88,55 Z',
    back:  'M88,55 Q200,-42 312,55 C330,64 352,82 364,102 C376,128 384,165 382,352 C378,366 364,380 348,378 C332,366 312,285 300,228 C294,206 291,198 290,192 L290,450 L110,450 L110,192 C109,198 106,206 100,228 C88,285 68,366 52,378 C36,380 22,366 18,352 C16,165 24,128 36,102 C48,82 70,64 88,55 Z',
  },
}
```

- [ ] **Step 7: TypeScript check**

```powershell
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 8: Commit**

```powershell
git add src/data src/types
git commit -m "feat: typed data layer — products (29), stock, colors, sizes, pricing, SVG paths"
```

---

### Task 5: Utilities, Constants, and Tests

**Files:**
- Create: `src/lib/utils.ts`
- Create: `src/lib/constants.ts`
- Create: `src/lib/utils.test.ts`

- [ ] **Step 1: Create src/lib/utils.ts**

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { PRODUCTS } from '@/data/products'
import { STOCK, DEFAULT_STOCK } from '@/data/stock'
import { BP, FIT_SURCHARGE, EMBROIDERY_SURCHARGE } from '@/data/pricing'
import type { Product, Gender, GarmentType, SizeKey, FitType, PrintMethod } from '@/types'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function byGender(gender: Gender, pool: Product[] = PRODUCTS): Product[] {
  return pool.filter(p => p.gender === gender || p.gender === 'unisex')
}

export function getStock(id: number): number {
  return STOCK[id] ?? DEFAULT_STOCK
}

export function getPrice(
  garment: GarmentType,
  size: SizeKey,
  fit: FitType,
  printMethod: PrintMethod,
): number {
  const base      = BP[garment][size] ?? 0
  const fitExtra  = fit === 'oversized' ? FIT_SURCHARGE : 0
  const pmExtra   = printMethod === 'embroidery' ? EMBROIDERY_SURCHARGE : 0
  return base + fitExtra + pmExtra
}

export function parsePriceNumber(price: string): number {
  return parseFloat(price.replace('€', ''))
}

export function calcSalePercent(price: string, salePrice: number): number {
  const orig = parsePriceNumber(price)
  return Math.round((1 - salePrice / orig) * 100)
}

export const CAT_SLUG_TO_FILTER: Record<string, string> = {
  tshirts:  'TSHIRTS',
  hoodies:  'HOODIES',
  zippers:  'ZIPPERS',
  tanktops: 'TANKTOPS',
  newin:    'NEWIN',
  sale:     'SALES',
}

export const FILTER_TO_SLUG: Record<string, string> = {
  TSHIRTS:  'tshirts',
  HOODIES:  'hoodies',
  ZIPPERS:  'zippers',
  TANKTOPS: 'tanktops',
  NEWIN:    'newin',
  SALES:    'sale',
}

export function catLabel(cat: string): string {
  const map: Record<string, string> = {
    TSHIRTS:  'T-Shirt',
    HOODIES:  'Hoodie',
    ZIPPERS:  'Zip Hoodie',
    TANKTOPS: 'Tank Top',
  }
  return map[cat] ?? cat
}

export function catLabelPlural(cat: string): string {
  const map: Record<string, string> = {
    TSHIRTS:  'T-Shirts',
    HOODIES:  'Hoodies',
    ZIPPERS:  'Zippers',
    TANKTOPS: 'Tank Tops',
  }
  return map[cat] ?? cat
}
```

- [ ] **Step 2: Create src/lib/constants.ts**

```ts
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
```

- [ ] **Step 3: Write failing tests for utils**

Create `src/lib/utils.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { cn, byGender, getStock, getPrice, parsePriceNumber, calcSalePercent } from './utils'
import type { Product } from '@/types'

const makeProduct = (overrides: Partial<Product>): Product => ({
  id: 1, name: '', cat: 'TSHIRTS', gender: 'men', code: '', description: '', price: '€40', tag: '', img: '',
  ...overrides,
})

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })
  it('deduplicates tailwind classes — last wins', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })
  it('handles falsy values', () => {
    expect(cn('foo', false && 'bar', undefined, 'baz')).toBe('foo baz')
  })
})

describe('byGender', () => {
  it('returns only men products for men', () => {
    const pool = [makeProduct({ gender: 'men' }), makeProduct({ id: 2, gender: 'women' })]
    expect(byGender('men', pool)).toHaveLength(1)
    expect(byGender('men', pool)[0].id).toBe(1)
  })
  it('includes unisex in both men and women', () => {
    const pool = [makeProduct({ gender: 'unisex' })]
    expect(byGender('men', pool)).toHaveLength(1)
    expect(byGender('women', pool)).toHaveLength(1)
  })
  it('excludes the other gender', () => {
    const pool = [makeProduct({ gender: 'women' })]
    expect(byGender('men', pool)).toHaveLength(0)
  })
})

describe('getStock', () => {
  it('returns specific low-stock count for product id 25', () => {
    expect(getStock(25)).toBe(2)
  })
  it('returns DEFAULT_STOCK (25) for unknown product', () => {
    expect(getStock(9999)).toBe(25)
  })
  it('returns specific count for product id 9 (3 left)', () => {
    expect(getStock(9)).toBe(3)
  })
})

describe('getPrice', () => {
  it('returns base price for normal fit DTG t-shirt M', () => {
    expect(getPrice('tshirt', 'M', 'normal', 'dtg')).toBeCloseTo(24.99)
  })
  it('adds €4 for oversized fit', () => {
    expect(getPrice('tshirt', 'M', 'oversized', 'dtg')).toBeCloseTo(28.99)
  })
  it('adds €7 for embroidery', () => {
    expect(getPrice('tshirt', 'M', 'normal', 'embroidery')).toBeCloseTo(31.99)
  })
  it('adds both surcharges', () => {
    expect(getPrice('tshirt', 'M', 'oversized', 'embroidery')).toBeCloseTo(35.99)
  })
  it('uses hoodie base price', () => {
    expect(getPrice('hoodie', 'S', 'normal', 'dtg')).toBeCloseTo(42.99)
  })
})

describe('parsePriceNumber', () => {
  it('strips € prefix and returns float', () => {
    expect(parsePriceNumber('€45')).toBe(45)
    expect(parsePriceNumber('€110')).toBe(110)
    expect(parsePriceNumber('€24.99')).toBeCloseTo(24.99)
  })
})

describe('calcSalePercent', () => {
  it('calculates 25% off correctly', () => {
    expect(calcSalePercent('€100', 75)).toBe(25)
  })
  it('rounds to nearest integer', () => {
    expect(calcSalePercent('€37', 27)).toBe(27)  // 1 - 27/37 = 27.02%
  })
})
```

- [ ] **Step 4: Run tests and confirm they pass**

```powershell
npm test
```

Expected output:
```
✓ src/lib/utils.test.ts (14 tests)
Test Files  1 passed
Tests       14 passed
```

- [ ] **Step 5: Commit**

```powershell
git add src/lib vitest.config.ts package.json
git commit -m "feat: utilities, constants, and 14 passing unit tests"
```

---

### Task 6: Zustand Stores

**Files:**
- Create: `src/stores/cart-store.ts`
- Create: `src/stores/favorites-store.ts`
- Create: `src/stores/ui-store.ts`

- [ ] **Step 1: Create src/stores/cart-store.ts**

```ts
'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { STORAGE_TTL_MS } from '@/lib/constants'

interface CartStore {
  cartItems: Record<number, number>
  addToCart:      (id: number, qty?: number) => void
  removeFromCart: (id: number) => void
  decrementCart:  (id: number) => void
  clearCart:      () => void
  cartCount:      () => number
}

function makeTTLStorage() {
  return {
    getItem: (name: string): string | null => {
      if (typeof window === 'undefined') return null
      const str = localStorage.getItem(name)
      if (!str) return null
      try {
        const parsed = JSON.parse(str) as { state: unknown; expires: number }
        if (Date.now() > parsed.expires) { localStorage.removeItem(name); return null }
        return JSON.stringify({ state: parsed.state })
      } catch { return null }
    },
    setItem: (name: string, value: string) => {
      if (typeof window === 'undefined') return
      const parsed = JSON.parse(value) as { state: unknown }
      localStorage.setItem(name, JSON.stringify({ ...parsed, expires: Date.now() + STORAGE_TTL_MS }))
    },
    removeItem: (name: string) => {
      if (typeof window === 'undefined') return
      localStorage.removeItem(name)
    },
  }
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: {},
      addToCart: (id, qty = 1) =>
        set(s => ({ cartItems: { ...s.cartItems, [id]: (s.cartItems[id] ?? 0) + qty } })),
      removeFromCart: (id) =>
        set(s => { const { [id]: _, ...rest } = s.cartItems; return { cartItems: rest } }),
      decrementCart: (id) =>
        set(s => {
          const cur = s.cartItems[id]
          if (!cur || cur <= 1) { const { [id]: _, ...rest } = s.cartItems; return { cartItems: rest } }
          return { cartItems: { ...s.cartItems, [id]: cur - 1 } }
        }),
      clearCart: () => set({ cartItems: {} }),
      cartCount: () => Object.values(get().cartItems).reduce((sum, q) => sum + q, 0),
    }),
    { name: 'norelia_cart', storage: createJSONStorage(makeTTLStorage) },
  ),
)
```

- [ ] **Step 2: Create src/stores/favorites-store.ts**

```ts
'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { STORAGE_TTL_MS } from '@/lib/constants'

interface FavoritesStore {
  favorites:       number[]
  toggleFavorite:  (id: number) => void
  isFavorite:      (id: number) => boolean
}

function makeTTLStorage() {
  return {
    getItem: (name: string): string | null => {
      if (typeof window === 'undefined') return null
      const str = localStorage.getItem(name)
      if (!str) return null
      try {
        const parsed = JSON.parse(str) as { state: unknown; expires: number }
        if (Date.now() > parsed.expires) { localStorage.removeItem(name); return null }
        return JSON.stringify({ state: parsed.state })
      } catch { return null }
    },
    setItem: (name: string, value: string) => {
      if (typeof window === 'undefined') return
      const parsed = JSON.parse(value) as { state: unknown }
      localStorage.setItem(name, JSON.stringify({ ...parsed, expires: Date.now() + STORAGE_TTL_MS }))
    },
    removeItem: (name: string) => {
      if (typeof window === 'undefined') return
      localStorage.removeItem(name)
    },
  }
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (id) =>
        set(s => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter(x => x !== id)
            : [...s.favorites, id],
        })),
      isFavorite: (id) => get().favorites.includes(id),
    }),
    { name: 'norelia_favorites', storage: createJSONStorage(makeTTLStorage) },
  ),
)
```

- [ ] **Step 3: Create src/stores/ui-store.ts**

```ts
'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { STORAGE_TTL_MS, TOAST_DURATION_MS, RECENTLY_VIEWED_MAX } from '@/lib/constants'
import type { SidePanelType, ToastState, Product } from '@/types'

interface UIStore {
  sidePanel:            SidePanelType
  setSidePanel:         (panel: SidePanelType) => void
  toggleSidePanel:      (panel: 'cart' | 'favorites') => void

  toast:                ToastState
  showToast:            (msg: string, type: 'add' | 'remove') => void

  showSignIn:           boolean
  setShowSignIn:        (val: boolean) => void

  showCheckoutModal:    boolean
  setShowCheckoutModal: (val: boolean) => void

  recentlyViewed:       Product[]
  addToRecent:          (product: Product) => void
}

function makeTTLStorage() {
  return {
    getItem: (name: string): string | null => {
      if (typeof window === 'undefined') return null
      const str = localStorage.getItem(name)
      if (!str) return null
      try {
        const parsed = JSON.parse(str) as { state: unknown; expires: number }
        if (Date.now() > parsed.expires) { localStorage.removeItem(name); return null }
        return JSON.stringify({ state: parsed.state })
      } catch { return null }
    },
    setItem: (name: string, value: string) => {
      if (typeof window === 'undefined') return
      const parsed = JSON.parse(value) as { state: unknown }
      localStorage.setItem(name, JSON.stringify({ ...parsed, expires: Date.now() + STORAGE_TTL_MS }))
    },
    removeItem: (name: string) => {
      if (typeof window === 'undefined') return
      localStorage.removeItem(name)
    },
  }
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidePanel: null,
      setSidePanel:    (panel) => set({ sidePanel: panel }),
      toggleSidePanel: (panel) => set(s => ({ sidePanel: s.sidePanel === panel ? null : panel })),

      toast: { msg: '', visible: false, type: 'add' },
      showToast: (msg, type) => {
        set({ toast: { msg, visible: true, type } })
        setTimeout(
          () => set(s => ({ toast: { ...s.toast, visible: false } })),
          TOAST_DURATION_MS,
        )
      },

      showSignIn: false,
      setShowSignIn: (val) => set({ showSignIn: val }),

      showCheckoutModal: false,
      setShowCheckoutModal: (val) => set({ showCheckoutModal: val }),

      recentlyViewed: [],
      addToRecent: (product) =>
        set(s => {
          const filtered = s.recentlyViewed.filter(p => p.id !== product.id)
          return { recentlyViewed: [product, ...filtered].slice(0, RECENTLY_VIEWED_MAX) }
        }),
    }),
    {
      name: 'norelia_ui',
      storage: createJSONStorage(makeTTLStorage),
      partialize: (s) => ({ recentlyViewed: s.recentlyViewed }),
    },
  ),
)
```

- [ ] **Step 4: TypeScript check**

```powershell
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 5: Commit**

```powershell
git add src/stores
git commit -m "feat: Zustand stores for cart, favorites, and UI with 7-day localStorage TTL"
```

---

### Task 7: Root Layout, Fonts, and Error Boundaries

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css` (already done in Task 2)
- Create: `src/app/loading.tsx`
- Create: `src/app/not-found.tsx`
- Create: `src/app/error.tsx`

- [ ] **Step 1: Replace src/app/layout.tsx**

```tsx
import type { Metadata } from 'next'
import { Bebas_Neue, DM_Sans } from 'next/font/google'
import './globals.css'
import { BRAND } from '@/lib/constants'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: BRAND, template: `%s | ${BRAND}` },
  description: 'Minimalist premium streetwear. Custom printing. Free shipping over €60.',
  metadataBase: new URL('https://norelia.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${dmSans.variable}`}>
      <body className="font-body bg-surface text-on-surface antialiased">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Create src/app/loading.tsx**

```tsx
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-on-surface-muted border-t-on-surface" />
    </div>
  )
}
```

- [ ] **Step 3: Create src/app/not-found.tsx**

```tsx
import Link from 'next/link'
import { BRAND } from '@/lib/constants'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 text-center">
      <p className="font-display text-[120px] leading-none text-border-subtle select-none">404</p>
      <h1 className="font-display text-4xl tracking-widest text-on-surface mb-4">Page Not Found</h1>
      <p className="font-body text-sm tracking-widest uppercase text-on-surface-muted mb-10">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="border border-on-surface px-8 py-3 font-body text-[10px] tracking-[0.2em] uppercase text-on-surface transition-colors hover:bg-on-surface hover:text-surface"
      >
        Back to {BRAND}
      </Link>
    </div>
  )
}
```

- [ ] **Step 4: Create src/app/error.tsx**

```tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 text-center gap-6">
      <p className="font-display text-4xl tracking-widest text-on-surface">Something went wrong</p>
      <p className="font-body text-sm text-on-surface-muted">{error.message}</p>
      <button
        onClick={reset}
        className="border border-on-surface px-8 py-3 font-body text-[10px] tracking-[0.2em] uppercase text-on-surface transition-colors hover:bg-on-surface hover:text-surface"
      >
        Try Again
      </button>
    </div>
  )
}
```

- [ ] **Step 5: Build check**

```powershell
npm run build
```

Expected: Build succeeds, no TypeScript errors.

- [ ] **Step 6: Commit**

```powershell
git add src/app/layout.tsx src/app/loading.tsx src/app/not-found.tsx src/app/error.tsx
git commit -m "feat: root layout with next/font/google, loading, not-found, and error boundaries"
```

---

### Task 8: CLAUDE.md

**Files:**
- Create: `CLAUDE.md`

- [ ] **Step 1: Create CLAUDE.md at project root**

```markdown
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
```

- [ ] **Step 2: Commit**

```powershell
git add CLAUDE.md
git commit -m "docs: CLAUDE.md with architecture, commands, and coding rules"
```

---

### Task 9: All Route Shells

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/app/studio/page.tsx`
- Create: `src/app/product/[id]/page.tsx`
- Create: `src/app/size-guide/page.tsx`
- Create: `src/app/checkout/page.tsx`
- Create: `src/app/about/page.tsx`
- Create: `src/app/shipping/page.tsx`
- Create: `src/app/returns/page.tsx`
- Create: `src/app/our-studio/page.tsx`
- Create: `src/app/[gender]/page.tsx`
- Create: `src/app/[gender]/[category]/page.tsx`
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`

- [ ] **Step 1: Replace src/app/page.tsx**

```tsx
import { BRAND } from '@/lib/constants'

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-surface">
      <p className="font-display text-6xl tracking-widest text-on-surface">{BRAND}</p>
    </main>
  )
}
```

- [ ] **Step 2: Create src/app/studio/page.tsx**

```tsx
import type { Metadata } from 'next'
import { BRAND } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Design Your Own',
  description: `Custom garment designer — ${BRAND}`,
}

export default function StudioPage() {
  return (
    <main className="min-h-screen pt-20 px-8 bg-surface">
      <p className="font-display text-4xl text-on-surface">Studio (shell)</p>
    </main>
  )
}
```

- [ ] **Step 3: Create src/app/product/[id]/page.tsx**

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PRODUCTS } from '@/data/products'
import { BRAND } from '@/lib/constants'

interface Props { params: Promise<{ id: string }> }

export function generateStaticParams() {
  return PRODUCTS.map(p => ({ id: p.code }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = PRODUCTS.find(p => p.code === id)
  if (!product) return {}
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | ${BRAND}`,
      images: [{ url: product.img, width: 400, height: 533 }],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const product = PRODUCTS.find(p => p.code === id)
  if (!product) notFound()
  return (
    <main className="min-h-screen pt-20 px-8 bg-surface">
      <p className="font-display text-4xl text-on-surface">{product.name} (shell)</p>
    </main>
  )
}
```

- [ ] **Step 4: Create src/app/size-guide/page.tsx**

```tsx
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Size Guide' }
export default function SizeGuidePage() {
  return <main className="min-h-screen pt-20 px-8 bg-surface"><p className="font-display text-4xl text-on-surface">Size Guide (shell)</p></main>
}
```

- [ ] **Step 5: Create src/app/checkout/page.tsx**

```tsx
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Checkout' }
export default function CheckoutPage() {
  return <main className="min-h-screen pt-20 px-8 bg-surface"><p className="font-display text-4xl text-on-surface">Checkout (shell)</p></main>
}
```

- [ ] **Step 6: Create info page shells**

Create `src/app/about/page.tsx`:
```tsx
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'About Us' }
export default function AboutPage() {
  return <main className="min-h-screen pt-20 px-8 bg-surface"><p className="font-display text-4xl text-on-surface">About (shell)</p></main>
}
```

Create `src/app/shipping/page.tsx`:
```tsx
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Shipping' }
export default function ShippingPage() {
  return <main className="min-h-screen pt-20 px-8 bg-surface"><p className="font-display text-4xl text-on-surface">Shipping (shell)</p></main>
}
```

Create `src/app/returns/page.tsx`:
```tsx
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Returns & Exchanges' }
export default function ReturnsPage() {
  return <main className="min-h-screen pt-20 px-8 bg-surface"><p className="font-display text-4xl text-on-surface">Returns (shell)</p></main>
}
```

Create `src/app/our-studio/page.tsx`:
```tsx
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Our Studio' }
export default function OurStudioPage() {
  return <main className="min-h-screen pt-20 px-8 bg-surface"><p className="font-display text-4xl text-on-surface">Our Studio (shell)</p></main>
}
```

- [ ] **Step 7: Create src/app/[gender]/page.tsx**

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface Props { params: Promise<{ gender: string }> }

const VALID = ['men', 'women']

export function generateStaticParams() {
  return VALID.map(gender => ({ gender }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { gender } = await params
  if (!VALID.includes(gender)) return {}
  return { title: gender === 'men' ? 'Men' : 'Women' }
}

export default async function GenderPage({ params }: Props) {
  const { gender } = await params
  if (!VALID.includes(gender)) notFound()
  return (
    <main className="min-h-screen pt-20 px-8 bg-surface">
      <p className="font-display text-4xl capitalize text-on-surface">{gender} (shell)</p>
    </main>
  )
}
```

- [ ] **Step 8: Create src/app/[gender]/[category]/page.tsx**

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CAT_SLUG_TO_FILTER, catLabelPlural } from '@/lib/utils'

const VALID_GENDERS = ['men', 'women']
const VALID_CATS    = Object.keys(CAT_SLUG_TO_FILTER)

interface Props { params: Promise<{ gender: string; category: string }> }

export function generateStaticParams() {
  return VALID_GENDERS.flatMap(gender =>
    VALID_CATS.map(category => ({ gender, category }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { gender, category } = await params
  const filter = CAT_SLUG_TO_FILTER[category]
  if (!filter) return {}
  return { title: `${catLabelPlural(filter)} — ${gender === 'men' ? 'Men' : 'Women'}` }
}

export default async function CategoryPage({ params }: Props) {
  const { gender, category } = await params
  if (!VALID_GENDERS.includes(gender) || !VALID_CATS.includes(category)) notFound()
  return (
    <main className="min-h-screen pt-20 px-8 bg-surface">
      <p className="font-display text-4xl capitalize text-on-surface">{gender} / {category} (shell)</p>
    </main>
  )
}
```

- [ ] **Step 9: Create src/app/sitemap.ts**

```ts
import type { MetadataRoute } from 'next'
import { PRODUCTS } from '@/data/products'

const BASE = 'https://norelia.com'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE,                  lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/men`,         lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/women`,       lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/studio`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/size-guide`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/about`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/shipping`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/returns`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/our-studio`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    ...PRODUCTS.map(p => ({
      url: `${BASE}/product/${p.code}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
}
```

- [ ] **Step 10: Create src/app/robots.ts**

```ts
import type { MetadataRoute } from 'next'
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/checkout', '/api/'] },
    sitemap: 'https://norelia.com/sitemap.xml',
  }
}
```

- [ ] **Step 11: Build check**

```powershell
npm run build
```

Expected: Build succeeds. Static routes pre-rendered. 0 TypeScript errors.

- [ ] **Step 12: Commit**

```powershell
git add src/app
git commit -m "feat: all route shells with generateStaticParams, metadata, sitemap, robots"
```

---

### Task 10: Component Stubs

**Files:** All stubs under `src/components/` — creates the full component tree so layout wiring compiles.

- [ ] **Step 1: Create layout stubs**

Create `src/components/layout/nav.tsx`:
```tsx
'use client'
export function Nav() {
  return <nav className="sticky top-0 z-50 h-14 bg-surface-alt border-b border-[rgba(255,255,255,0.12)]" />
}
```

Create `src/components/layout/site-footer.tsx`:
```tsx
export function SiteFooter() {
  return <footer className="bg-surface-alt text-on-surface py-10" />
}
```

Create `src/components/layout/newsletter-bar.tsx`:
```tsx
'use client'
export function NewsletterBar() {
  return <div className="bg-[#181818] border-t border-[rgba(255,255,255,0.07)] border-b border-[rgba(255,255,255,0.07)] py-3" />
}
```

Create `src/components/layout/side-panel.tsx`:
```tsx
'use client'
export function SidePanel() { return null }
```

Create `src/components/layout/toast.tsx`:
```tsx
'use client'
export function Toast() { return null }
```

Create `src/components/layout/gdpr-banner.tsx`:
```tsx
'use client'
export function GDPRBanner() { return null }
```

- [ ] **Step 2: Create modal stubs**

Create `src/components/modals/sign-in-modal.tsx`:
```tsx
'use client'
interface Props { onClose: () => void }
export function SignInModal({ onClose }: Props) { return null }
```

Create `src/components/modals/checkout-coming-soon-modal.tsx`:
```tsx
'use client'
interface Props { onClose: () => void }
export function CheckoutComingSoonModal({ onClose }: Props) { return null }
```

Create `src/components/modals/size-mini-guide.tsx`:
```tsx
'use client'
import type { Product } from '@/types'
interface Props { product: Product; onClose: () => void }
export function SizeMiniGuide({ product, onClose }: Props) { return null }
```

- [ ] **Step 3: Create home component stubs**

Create `src/components/home/hero.tsx`:
```tsx
'use client'
export function Hero() {
  return <div className="h-[88vh] bg-surface-raised border-b border-border" />
}
```

Create `src/components/home/marquee.tsx`:
```tsx
interface Props { dark?: boolean }
export function Marquee({ dark }: Props) {
  return (
    <div className={`overflow-hidden py-2 border-t border-b ${dark ? 'bg-surface-alt border-[rgba(255,255,255,0.15)]' : 'bg-surface border-border'}`} />
  )
}
```

Create `src/components/home/featured-carousel.tsx`:
```tsx
'use client'
import type { Product } from '@/types'
interface Props { title: string; subtitle?: string; products: Product[] }
export function FeaturedCarousel({ title }: Props) {
  return (
    <section className="py-16 border-t border-border-subtle">
      <div className="max-w-[1440px] mx-auto px-16">
        <p className="font-display text-4xl text-on-surface">{title}</p>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create product component stubs**

Create `src/components/products/price-tag.tsx`:
```tsx
interface Props { price: string; salePrice?: number }
export function PriceTag({ price }: Props) {
  return <p className="font-body text-sm font-medium text-on-surface">{price}</p>
}
```

Create `src/components/products/product-card.tsx`:
```tsx
'use client'
import type { Product } from '@/types'
interface Props { product: Product }
export function ProductCard({ product }: Props) {
  return <div className="border border-border aspect-[3/4] bg-surface-raised" aria-label={product.name} />
}
```

Create `src/components/products/product-grid.tsx`:
```tsx
import type { Product } from '@/types'
interface Props {
  products: Product[]
  filter: string
  genderFilter?: string
  onFilterChange?: (f: string) => void
}
export function ProductGrid({ products }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-0">
      {products.map(p => (
        <div key={p.id} className="border border-border aspect-[3/4] bg-surface-raised" />
      ))}
    </div>
  )
}
```

Create `src/components/products/related-products.tsx`:
```tsx
import type { Product } from '@/types'
interface Props { product: Product }
export function RelatedProducts({ product: _ }: Props) { return null }
```

Create `src/components/products/recently-viewed-strip.tsx`:
```tsx
'use client'
import type { Product } from '@/types'
interface Props { products: Product[] }
export function RecentlyViewedStrip({ products: _ }: Props) { return null }
```

- [ ] **Step 5: Create product-page stub**

Create `src/components/product-page/product-page.tsx`:
```tsx
'use client'
import type { Product } from '@/types'
interface Props { product: Product }
export function ProductPageClient({ product }: Props) {
  return (
    <div className="max-w-[1440px] mx-auto px-8 py-12 bg-surface">
      <p className="font-display text-4xl text-on-surface">{product.name}</p>
    </div>
  )
}
```

- [ ] **Step 6: Create size-guide stubs**

Create `src/components/size-guide/size-table.tsx`:
```tsx
import type { SizeRow } from '@/types'
interface Props { rows: SizeRow[]; gender: string; mini?: boolean }
export function SizeTable({ rows: _ }: Props) { return <table /> }
```

Create `src/components/size-guide/male-figure.tsx`:
```tsx
export function MaleFigure() {
  return <svg viewBox="0 0 240 370" width="100%" style={{ maxWidth: 200 }} />
}
```

Create `src/components/size-guide/female-figure.tsx`:
```tsx
export function FemaleFigure() {
  return <svg viewBox="0 0 240 370" width="100%" style={{ maxWidth: 200 }} />
}
```

- [ ] **Step 7: Create studio stub**

Create `src/components/studio/garment-designer.tsx`:
```tsx
'use client'
export function GarmentDesigner() {
  return (
    <div className="text-center py-24 font-body text-sm tracking-widest uppercase text-on-surface-muted">
      Loading designer…
    </div>
  )
}
```

- [ ] **Step 8: Create checkout stub**

Create `src/components/checkout/checkout-page.tsx`:
```tsx
'use client'
export function CheckoutPageClient() {
  return (
    <div className="max-w-[1440px] mx-auto px-8 py-12 bg-surface">
      <p className="font-display text-4xl text-on-surface">My Shopping Cart</p>
    </div>
  )
}
```

- [ ] **Step 9: Create scroll-to-top stub**

Create `src/components/scroll-to-top.tsx`:
```tsx
'use client'
export function ScrollToTop() { return null }
```

- [ ] **Step 10: TypeScript check**

```powershell
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 11: Commit**

```powershell
git add src/components
git commit -m "feat: complete component stub tree — all 30 components compile cleanly"
```

---

### Task 11: Wire Root Layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace src/app/layout.tsx with fully wired version**

```tsx
import type { Metadata } from 'next'
import { Bebas_Neue, DM_Sans } from 'next/font/google'
import './globals.css'
import { BRAND } from '@/lib/constants'
import { Nav }           from '@/components/layout/nav'
import { SiteFooter }    from '@/components/layout/site-footer'
import { NewsletterBar } from '@/components/layout/newsletter-bar'
import { SidePanel }     from '@/components/layout/side-panel'
import { Toast }         from '@/components/layout/toast'
import { GDPRBanner }    from '@/components/layout/gdpr-banner'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: BRAND, template: `%s | ${BRAND}` },
  description: 'Minimalist premium streetwear. Custom printing. Free shipping over €60.',
  metadataBase: new URL('https://norelia.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${dmSans.variable}`}>
      <body className="font-body bg-surface text-on-surface antialiased">
        <Nav />
        <main>{children}</main>
        <NewsletterBar />
        <SiteFooter />
        {/* Client-only overlays rendered after main content */}
        <SidePanel />
        <Toast />
        <GDPRBanner />
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Start dev server and verify layout**

```powershell
npm run dev
```

Open http://localhost:3000. Verify:
- Dark nav bar stub visible at top
- `NORELIA.` text visible on the home shell
- No console errors
- No hydration mismatches

Stop server (`Ctrl+C`).

- [ ] **Step 3: Commit**

```powershell
git add src/app/layout.tsx
git commit -m "feat: wire root layout — Nav, Footer, NewsletterBar, SidePanel, Toast, GDPRBanner"
```

---

### Task 12: Final Verification

- [ ] **Step 1: TypeScript strict check**

```powershell
npx tsc --noEmit
```

Expected: **0 errors.**

- [ ] **Step 2: ESLint check**

```powershell
npx eslint src --max-warnings=0
```

Expected: **0 warnings, 0 errors.**

- [ ] **Step 3: All unit tests pass**

```powershell
npm test
```

Expected: **14 tests pass**, 0 failures.

- [ ] **Step 4: Production build**

```powershell
npm run build
```

Expected: Build succeeds. All routes pre-rendered. Size stats logged. No type errors. No warnings.

- [ ] **Step 5: Spot-check all routes in dev**

```powershell
npm run dev
```

Visit each URL and confirm it renders with no console errors:

| URL | Expected |
|-----|----------|
| http://localhost:3000/ | "NORELIA." display text, dark nav stub at top |
| http://localhost:3000/men | "men (shell)" |
| http://localhost:3000/women | "women (shell)" |
| http://localhost:3000/men/tshirts | "men / tshirts (shell)" |
| http://localhost:3000/women/hoodies | "women / hoodies (shell)" |
| http://localhost:3000/product/100001 | "FORM TEE 001 (shell)" |
| http://localhost:3000/product/200001 | "ARCH HOODIE (shell)" |
| http://localhost:3000/studio | "Studio (shell)" |
| http://localhost:3000/checkout | "Checkout (shell)" |
| http://localhost:3000/size-guide | "Size Guide (shell)" |
| http://localhost:3000/about | "About (shell)" |
| http://localhost:3000/shipping | "Shipping (shell)" |
| http://localhost:3000/returns | "Returns (shell)" |
| http://localhost:3000/our-studio | "Our Studio (shell)" |
| http://localhost:3000/sitemap.xml | Valid XML sitemap |
| http://localhost:3000/robots.txt | Valid robots.txt |

- [ ] **Step 6: Final commit**

```powershell
git add -A
git commit -m "feat: complete Norelia scaffold — wired, type-safe, and building cleanly"
```

---

## Self-Review

### Spec Coverage
- ✅ Task 1: Project scaffolding, npm deps, shadcn/ui, public assets
- ✅ Task 2: TypeScript strict, Tailwind semantic tokens, CSS variables (light + dark), Vitest
- ✅ Task 3: All TypeScript types — Product, CartItem, GarmentColor, SizeRow, SizeData, BasePrices, AllPaths, ToastState, DesignState, etc.
- ✅ Task 4: All 6 data files fully populated with real data from NOIR
- ✅ Task 5: All utilities — cn(), byGender(), getPrice(), getStock(), parsePriceNumber(), calcSalePercent(), catLabel(), slug maps — plus 14 passing tests
- ✅ Task 6: All 3 Zustand stores with 7-day localStorage TTL — cart, favorites, ui (sidePanel, toast, recentlyViewed, showSignIn, showCheckoutModal)
- ✅ Task 7: Root layout with next/font/google (Bebas Neue + DM Sans), loading.tsx, not-found.tsx, error.tsx
- ✅ Task 8: CLAUDE.md with commands, stack, rules
- ✅ Task 9: All 13 routes with generateStaticParams + generateMetadata, sitemap.ts, robots.ts
- ✅ Task 10: All 30 component stubs — layout (6), modals (3), home (3), products (5), product-page (1), size-guide (3), studio (1), checkout (1), scroll-to-top (1)
- ✅ Task 11: Root layout wired with all stubs
- ✅ Task 12: TypeScript 0 errors, ESLint 0 warnings, 14 tests pass, production build succeeds

### Type Consistency
- `Product.id` is `number` — `cartItems: Record<number, number>` — consistent throughout
- `Product.code` is `string` — used as URL param `[id]` — consistent
- `GarmentType` = `'tshirt' | 'hoodie' | 'zipper'` — used in `BP`, `PATHS`, `SIZE_DATA`, `getPrice()` — consistent
- `SizeKey` = `'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL'` — used in `BP` and `SIZES` constant — consistent
- `FitType`, `PrintMethod` used in `getPrice()` signature and `GarmentDesigner` stub — consistent

### What This Plan Does Not Cover
The following are intentionally out of scope — they belong in the component implementation plan (next phase):
- Full Nav component with dropdowns, search, animations
- Hero with split layout and motion animations
- ProductCard with Quick Add overlay, color swatches
- GarmentDesigner (canvas, SVG, EmailJS)
- SidePanel (Radix Sheet), Toast (motion), GDPRBanner (motion)
- All info pages (About, Shipping, Returns, OurStudio)
- Full responsive polish across all breakpoints
