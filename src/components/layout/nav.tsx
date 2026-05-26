'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Heart, ShoppingBag, X, Search } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'
import { BRAND, MEN_NAV_CATS, WOMEN_NAV_CATS, NAV_CAT_TO_SLUG } from '@/lib/constants'
import { PRODUCTS } from '@/data/products'
import { useUIStore } from '@/stores/ui-store'
import { useCartStore } from '@/stores/cart-store'
import { useFavoritesStore } from '@/stores/favorites-store'

// ── Module-level helper hooks ─────────────────────────────────────────────────

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

// ── Nav ───────────────────────────────────────────────────────────────────────

export function Nav() {
  const isMobile = useIsMobile()
  const shouldReduceMotion = useReducedMotion()

  // Dropdown animation variants — computed inside component to depend on shouldReduceMotion
  const dropdownVariants = {
    initial: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 },
    animate: shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
    exit:    shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 },
  }

  // Local state
  const [activeMenu, setActiveMenu]   = useState<'men' | 'women' | null>(null)
  const [searchOpen, setSearchOpen]   = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobMenuOpen, setMobMenuOpen] = useState(false)
  const [mobExpanded, setMobExpanded] = useState<'men' | 'women' | null>(null)

  const searchRef   = useRef<HTMLDivElement>(null)
  const searchInput = useRef<HTMLInputElement>(null)
  const closeTimer  = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Close search on outside click
  useEffect(() => {
    if (!searchOpen) return
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
        setSearchQuery('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [searchOpen])

  // Auto-focus search input
  useEffect(() => { if (searchOpen) searchInput.current?.focus() }, [searchOpen])

  // Close mobile menu on route change
  const pathname = usePathname()
  useEffect(() => {
    function closeMenu() {
      setMobMenuOpen(false)
      setMobExpanded(null)
    }
    closeMenu()
  }, [pathname])

  // Clean up dropdown close timer on unmount
  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current) }, [])

  // Dropdown helpers
  const openMenu = (name: 'men' | 'women') => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setActiveMenu(name)
  }
  const closeMenu = () => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 180)
  }

  // Search logic
  const sq = searchQuery.trim().toLowerCase()
  const searchResults = sq.length < 1 ? [] : PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(sq) || p.code.includes(sq)
  ).slice(0, 7)

  // Store values
  const { toggleSidePanel, setShowSignIn } = useUIStore()
  const { cartCount } = useCartStore()
  const { favorites } = useFavoritesStore()
  const totalCartCount = cartCount()
  const totalFavCount  = favorites.length

  // ── Desktop ─────────────────────────────────────────────────────────────────

  if (!isMobile) {
    return (
      <nav className="dark sticky top-0 z-[100] bg-surface-alt border-b border-border">
        <div className="max-w-[1440px] mx-auto px-[60px] flex items-center justify-between h-[54px] relative z-10">

          {/* Brand */}
          <Link href="/" className="font-display text-[22px] tracking-[0.2em] text-on-surface shrink-0">
            {BRAND}
          </Link>

          {/* Center links */}
          <div className="flex gap-8 items-center">

            {/* Home */}
            <Link href="/" className="relative group font-body text-[10px] tracking-[0.2em] uppercase text-on-surface/82 hover:text-on-surface transition-colors">
              Home
              <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-on-surface scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-[280ms]" />
            </Link>

            {/* Men dropdown */}
            <div
              className="relative"
              onMouseEnter={() => openMenu('men')}
              onMouseLeave={closeMenu}
              onKeyDown={(e) => { if (e.key === 'Escape') setActiveMenu(null) }}
              aria-expanded={activeMenu === 'men'}
              aria-haspopup="menu"
            >
              <Link
                href="/men"
                className="relative group font-body text-[10px] tracking-[0.2em] uppercase text-on-surface/82 hover:text-on-surface transition-colors"
              >
                Men
                <span className={cn('absolute -bottom-0.5 left-0 right-0 h-px bg-on-surface transition-transform origin-left duration-[280ms]', activeMenu === 'men' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100')} />
              </Link>
              <AnimatePresence>
                {activeMenu === 'men' && (
                  <motion.div
                    key="men-dropdown"
                    variants={dropdownVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute top-[calc(100%+1px)] left-1/2 -translate-x-1/2 bg-surface-alt border border-border py-1.5 min-w-[140px] z-50"
                  >
                    {MEN_NAV_CATS.map(cat => (
                      <Link
                        key={cat}
                        href={`/men/${NAV_CAT_TO_SLUG[cat]}`}
                        onClick={() => setActiveMenu(null)}
                        className={cn(
                          'group/item relative block px-5 py-2.5 font-body text-[10px] tracking-[0.18em] uppercase transition-colors',
                          cat === 'Sales' ? 'text-destructive hover:text-destructive' : 'text-on-surface/82 hover:text-on-surface',
                        )}
                      >
                        <span className="relative">
                          {cat}
                          <span className={cn('absolute -bottom-0.5 left-0 right-0 h-px scale-x-0 group-hover/item:scale-x-100 transition-transform origin-left duration-[250ms]', cat === 'Sales' ? 'bg-destructive' : 'bg-on-surface')} />
                        </span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Women dropdown */}
            <div
              className="relative"
              onMouseEnter={() => openMenu('women')}
              onMouseLeave={closeMenu}
              onKeyDown={(e) => { if (e.key === 'Escape') setActiveMenu(null) }}
              aria-expanded={activeMenu === 'women'}
              aria-haspopup="menu"
            >
              <Link
                href="/women"
                className="relative group font-body text-[10px] tracking-[0.2em] uppercase text-on-surface/82 hover:text-on-surface transition-colors"
              >
                Women
                <span className={cn('absolute -bottom-0.5 left-0 right-0 h-px bg-on-surface transition-transform origin-left duration-[280ms]', activeMenu === 'women' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100')} />
              </Link>
              <AnimatePresence>
                {activeMenu === 'women' && (
                  <motion.div
                    key="women-dropdown"
                    variants={dropdownVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute top-[calc(100%+1px)] left-1/2 -translate-x-1/2 bg-surface-alt border border-border py-1.5 min-w-[140px] z-50"
                  >
                    {WOMEN_NAV_CATS.map(cat => (
                      <Link
                        key={cat}
                        href={`/women/${NAV_CAT_TO_SLUG[cat]}`}
                        onClick={() => setActiveMenu(null)}
                        className={cn(
                          'group/item relative block px-5 py-2.5 font-body text-[10px] tracking-[0.18em] uppercase transition-colors',
                          cat === 'Sales' ? 'text-destructive hover:text-destructive' : 'text-on-surface/82 hover:text-on-surface',
                        )}
                      >
                        <span className="relative">
                          {cat}
                          <span className={cn('absolute -bottom-0.5 left-0 right-0 h-px scale-x-0 group-hover/item:scale-x-100 transition-transform origin-left duration-[250ms]', cat === 'Sales' ? 'bg-destructive' : 'bg-on-surface')} />
                        </span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Studio */}
            <Link href="/studio" className="relative group font-body text-[10px] tracking-[0.2em] uppercase text-on-surface/82 hover:text-on-surface transition-colors">
              Design Your Own
              <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-on-surface scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-[280ms]" />
            </Link>

          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-5">

            {/* Search */}
            <div ref={searchRef} className="relative flex items-center gap-2">
              {searchOpen && (
                <input
                  ref={searchInput}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="absolute right-[calc(100%+8px)] top-1/2 -translate-y-1/2 w-[220px] bg-on-surface/13 border-none outline-none font-body text-[10px] tracking-[0.1em] text-on-surface placeholder:text-on-surface/40 px-2.5 h-7 z-[601]"
                />
              )}
              <button
                aria-label="Search products"
                onClick={() => { setSearchOpen(v => !v); setSearchQuery('') }}
                className="group relative flex items-center text-on-surface/82 hover:text-on-surface transition-colors"
              >
                <Search size={16} />
                <span className="absolute -bottom-1 left-0 right-0 h-px bg-on-surface scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-[280ms]" />
              </button>

              {/* Desktop search dropdown — uses light surface tokens for contrast against the page */}
              {searchOpen && sq.length > 0 && (
                <div className="absolute top-[calc(100%+14px)] right-0 w-[300px] bg-surface border border-border-subtle shadow-lg z-[600]">
                  {searchResults.length === 0 ? (
                    <p className="font-body text-[10px] text-on-surface-muted tracking-[0.1em] text-center py-3.5">
                      No results for &ldquo;{searchQuery}&rdquo;
                    </p>
                  ) : searchResults.map(p => (
                    <Link
                      key={p.id}
                      href={`/product/${p.code}`}
                      onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                      className="flex gap-2.5 items-center px-3 py-2.5 border-b border-border-subtle hover:bg-surface-raised transition-colors"
                    >
                      <div className="relative w-9 h-12 shrink-0 bg-surface-raised overflow-hidden">
                        <Image src={p.img} alt={p.name} fill className="object-cover" sizes="36px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-[11px] font-bold tracking-wide uppercase text-on-surface truncate">{p.name}</p>
                        <p className="font-body text-[9px] text-on-surface-muted tracking-wide">#{p.code}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        {p.salePrice ? (
                          <>
                            <p className="font-body text-[9px] text-on-surface-muted line-through">€{p.price.replace('€', '')}</p>
                            <p className="font-body text-[11px] font-bold text-destructive">€{p.salePrice}</p>
                          </>
                        ) : (
                          <p className="font-body text-[11px] font-semibold text-on-surface">€{p.price.replace('€', '')}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Favorites */}
            <button
              aria-label={`Favorites${totalFavCount > 0 ? ` (${totalFavCount})` : ''}`}
              onClick={() => toggleSidePanel('favorites')}
              className="group relative flex items-center gap-1.5 text-on-surface/82 hover:text-on-surface transition-colors"
            >
              <span className="relative shrink-0">
                <Heart size={17} className={totalFavCount > 0 ? 'fill-destructive stroke-destructive' : ''} />
                {totalFavCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-[15px] h-[15px] bg-destructive text-surface font-body text-[7px] font-bold flex items-center justify-center">
                    {totalFavCount}
                  </span>
                )}
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-on-surface scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-[280ms]" />
            </button>

            {/* Cart */}
            <button
              aria-label={`Cart${totalCartCount > 0 ? ` (${totalCartCount} items)` : ''}`}
              onClick={() => toggleSidePanel('cart')}
              className="group relative flex items-center gap-1.5 text-on-surface/82 hover:text-on-surface transition-colors"
            >
              <span className="relative shrink-0">
                <ShoppingBag size={17} />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-[15px] h-[15px] bg-on-surface text-surface-alt font-body text-[7px] font-bold flex items-center justify-center">
                    {totalCartCount}
                  </span>
                )}
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-on-surface scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-[280ms]" />
            </button>

            {/* Divider */}
            <div className="w-px h-3.5 bg-on-surface/15" />

            {/* Sign In */}
            <button
              aria-label="Sign in to your account"
              onClick={() => setShowSignIn(true)}
              className="font-body text-[10px] tracking-[0.18em] uppercase text-on-surface/80 border border-on-surface/68 px-3.5 py-1.5 hover:text-on-surface hover:border-on-surface/70 transition-colors"
            >
              Sign In
            </button>

          </div>

        </div>
      </nav>
    )
  }

  // ── Mobile ───────────────────────────────────────────────────────────────────

  return (
    <nav className="dark sticky top-0 z-[200] bg-surface-alt border-b border-border">

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 h-[54px] relative z-[201]">

        {/* Brand */}
        <Link href="/" className="font-display text-[22px] tracking-[0.2em] text-on-surface shrink-0">
          {BRAND}
        </Link>

        {/* Right icons */}
        <div className="flex items-center gap-3.5">

          {/* Search */}
          <button
            aria-label="Search"
            onClick={() => { setSearchOpen(v => !v); setSearchQuery(''); setMobMenuOpen(false) }}
            className="text-on-surface/82 flex items-center"
          >
            <Search size={17} strokeWidth={1.6} />
          </button>

          {/* Favorites */}
          <button
            aria-label={`Favorites${totalFavCount > 0 ? ` (${totalFavCount})` : ''}`}
            onClick={() => toggleSidePanel('favorites')}
            className="relative text-on-surface/82"
          >
            <Heart size={18} strokeWidth={1.6} className={totalFavCount > 0 ? 'fill-destructive stroke-destructive' : ''} />
            {totalFavCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-destructive text-surface font-body text-[8px] font-bold rounded-full flex items-center justify-center">
                {totalFavCount}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            aria-label={`Cart${totalCartCount > 0 ? ` (${totalCartCount} items)` : ''}`}
            onClick={() => toggleSidePanel('cart')}
            className="relative text-on-surface/82"
          >
            <ShoppingBag size={18} strokeWidth={1.6} />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-destructive text-surface font-body text-[8px] font-bold rounded-full flex items-center justify-center">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Hamburger */}
          <button
            aria-label="Menu"
            onClick={() => { setMobMenuOpen(v => { if (v) setMobExpanded(null); return !v }); setSearchOpen(false) }}
            className="text-on-surface/82 flex items-center justify-center w-[22px] h-[22px]"
          >
            {mobMenuOpen ? <X size={20} strokeWidth={1.8} /> : (
              <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                <rect y="0" width="20" height="2" fill="currentColor" />
                <rect y="6" width="20" height="2" fill="currentColor" />
                <rect y="12" width="20" height="2" fill="currentColor" />
              </svg>
            )}
          </button>

        </div>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div ref={searchRef} className="bg-surface-alt border-b border-border px-4 py-2.5 relative z-[200]">
          <div className="flex items-center gap-2.5">
            <Search size={14} className="text-on-surface/40 shrink-0" />
            <input
              ref={searchInput}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 bg-transparent border-none outline-none font-body text-[11px] tracking-wide text-on-surface placeholder:text-on-surface/40 py-1"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-on-surface/40 flex">
                <X size={14} />
              </button>
            )}
          </div>
          {sq.length > 0 && (
            <div className="mt-2 border-t border-border pt-2">
              {searchResults.length === 0 ? (
                <p className="font-body text-[10px] text-on-surface/35 tracking-[0.1em] py-2">No results for &ldquo;{searchQuery}&rdquo;</p>
              ) : searchResults.map(p => (
                <Link
                  key={p.id}
                  href={`/product/${p.code}`}
                  onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                  className="flex gap-2.5 items-center py-2 border-b border-border/6 last:border-b-0"
                >
                  <div className="relative w-8 h-[42px] shrink-0 overflow-hidden">
                    <Image src={p.img} alt={p.name} fill className="object-cover" sizes="32px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-[10px] font-bold tracking-wide uppercase text-on-surface truncate">{p.name}</p>
                    <p className="font-body text-[9px] text-on-surface/40 tracking-wide">#{p.code}</p>
                  </div>
                  <p className={cn('font-body text-[11px] font-semibold shrink-0', p.salePrice ? 'text-destructive' : 'text-on-surface')}>
                    €{p.salePrice ?? p.price.replace('€', '')}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mobile menu overlay — inside .dark nav so bg-surface-alt resolves to dark surface */}
      {mobMenuOpen && (
        <div className="fixed top-[54px] left-0 right-0 bottom-0 bg-surface-alt z-[199] overflow-y-auto px-6 pb-12 pt-2">

          <Link href="/" onClick={() => { setMobMenuOpen(false); setMobExpanded(null) }} className="block font-body text-[12px] tracking-[0.18em] uppercase text-on-surface/88 py-[15px] border-b border-on-surface/7">Home</Link>

          {/* Men accordion */}
          <button
            onClick={() => setMobExpanded(e => e === 'men' ? null : 'men')}
            className="w-full flex justify-between items-center font-body text-[12px] tracking-[0.18em] uppercase text-on-surface/88 py-[15px] border-b border-on-surface/7"
          >
            <span>Men</span>
            <span className="text-on-surface/30 text-[16px] leading-none">{mobExpanded === 'men' ? '−' : '+'}</span>
          </button>
          {mobExpanded === 'men' && MEN_NAV_CATS.map(cat => (
            <Link
              key={cat}
              href={`/men/${NAV_CAT_TO_SLUG[cat]}`}
              onClick={() => { setMobMenuOpen(false); setMobExpanded(null) }}
              className="block pl-5 font-body text-[10px] tracking-[0.14em] uppercase text-on-surface/45 py-[11px]"
            >
              {cat}
            </Link>
          ))}

          {/* Women accordion */}
          <button
            onClick={() => setMobExpanded(e => e === 'women' ? null : 'women')}
            className="w-full flex justify-between items-center font-body text-[12px] tracking-[0.18em] uppercase text-on-surface/88 py-[15px] border-b border-on-surface/7"
          >
            <span>Women</span>
            <span className="text-on-surface/30 text-[16px] leading-none">{mobExpanded === 'women' ? '−' : '+'}</span>
          </button>
          {mobExpanded === 'women' && WOMEN_NAV_CATS.map(cat => (
            <Link
              key={cat}
              href={`/women/${NAV_CAT_TO_SLUG[cat]}`}
              onClick={() => { setMobMenuOpen(false); setMobExpanded(null) }}
              className="block pl-5 font-body text-[10px] tracking-[0.14em] uppercase text-on-surface/45 py-[11px]"
            >
              {cat}
            </Link>
          ))}

          <Link href="/studio" onClick={() => { setMobMenuOpen(false); setMobExpanded(null) }} className="block font-body text-[12px] tracking-[0.18em] uppercase text-on-surface/88 py-[15px] border-b border-on-surface/7">Design Your Own</Link>

          <button
            onClick={() => { setShowSignIn(true); setMobMenuOpen(false); setMobExpanded(null) }}
            className="block mt-7 w-full border border-on-surface/35 font-body text-[10px] tracking-[0.2em] uppercase text-on-surface/75 px-6 py-3 text-left"
          >
            Sign In
          </button>

        </div>
      )}

    </nav>
  )
}
