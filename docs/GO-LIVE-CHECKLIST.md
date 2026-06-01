# Norelia — Go-Live Checklist

> Last updated: 2026-06-01
> Purpose: everything required to turn Norelia from a polished front-end demo into
> a real, legal, money-taking Greek e-commerce store. Work top to bottom; the
> sections are roughly in dependency order.

**Legend for "Owner":**
- 👤 **You** — business/paperwork/accounts only you can do
- 🤖 **Claude** — code/integration I do once you hand me the credentials
- 🤝 **Both** — you provide info/account, I wire it up

> ⚠️ Legal items are marked 🔴. I am not a lawyer — get a one-time check from a
> Greek accountant (λογιστής) / lawyer before launch. The list reflects standard
> Greek e-shop practice, not formal legal advice.

---

## Current state (honest baseline)

What exists today:
- ✅ Full bilingual (EL/EN) storefront UI, responsive, accessible
- ✅ Product browsing, cart, favorites, checkout *screens*
- ✅ "Design Your Own" studio, size guide, info pages
- ✅ Cookie consent banner (stores choice in browser only)

What does **not** exist yet (the gap to "live"):
- ❌ No backend / database — all products are static arrays in `src/data/`
- ❌ No real payments — checkout does not charge anyone
- ❌ No order storage / order management
- ❌ No real shipping or stock logic
- ❌ No company identity / legal entity wired in
- ❌ No transactional emails (order confirmation, etc.)

So "go live" = business setup + backend + payments + legal + logistics + content.

---

## 1. Business & legal foundation 🔴 (👤 You)

Nothing else can be finalized until this exists.

- [ ] Register the business (ατομική επιχείρηση / sole trader, or company) — get **ΑΦΜ** (VAT number)
- [ ] Register with **ΓΕΜΗ** (General Commercial Registry) — get ΓΕΜΗ number
- [ ] Confirm your **ΚΑΔ** codes cover e-commerce retail of clothing (e.g. 47.91 mail-order/online retail)
- [ ] Open a **business bank account** (Greek bank)
- [ ] Register the e-shop with **ΑΑΔΕ / myDATA** as required for online businesses
- [ ] Decide registered business address (used in legal footer + invoices)

➡️ Output you'll hand me later: legal business name, ΑΦΜ, ΔΟΥ, ΓΕΜΗ, address.

---

## 2. Payments 🤝

**Decision made: Viva.com as primary processor (cards + IRIS + Apple/Google Pay + installments).**

- [ ] 👤 Sign up for **Viva.com** business account (needs ΑΦΜ + business bank account)
- [ ] 👤 Request these be enabled on the account:
  - [ ] Card payments (Visa/Mastercard)
  - [ ] **IRIS** online payments
  - [ ] **Apple Pay + Google Pay**
  - [ ] Installments (δόσεις) — optional but expected for fashion
- [ ] 👤 Confirm your **exact all-in fee** (published floor is 0.20% debit / 0.30% credit + €0.03 min; real rate depends on plan). Sole traders: capped at €0.50/transaction up to €5,000/day (Law 5167/2024).
- [ ] 👤 Get **API keys / merchant credentials** from Viva dashboard
- [ ] 🤖 Build backend payment layer + integrate Viva checkout (cards/IRIS/wallets) into the existing checkout page
- [ ] 🤖 Handle payment success/failure, order confirmation, webhook verification

> **Cash on Delivery (Αντικαταβολή)** is NOT a Viva feature — it's handled by the
> courier (see §5). It's a separate toggle in checkout that I wire to the order flow.

---

## 3. Backend & infrastructure 🤝

The site currently has no server-side data. To sell, it needs:

- [ ] 🤝 **Database** — Supabase is already planned in the codebase (CLAUDE.md references it). Set up project + tables: products, variants, stock, orders, customers.
  - 👤 create the Supabase account/project; 🤖 schema + integration
- [ ] 🤖 Move products out of `src/data/` static arrays into the database
- [ ] 🤖 Real **stock/inventory** tracking (decrement on purchase, prevent overselling)
- [ ] 🤖 **Order management** — store orders, statuses (paid / shipped / delivered / refunded)
- [ ] 🤖 **Admin view** to see/manage orders (basic, can start simple)
- [ ] 🤖 Add the deferred `loading.tsx` skeletons once real async data lands (listed in CLAUDE.md)
- [ ] 🤖 **Transactional email** (order confirmation, shipping notice) — pick a provider (Resend / Postmark / similar); 👤 create account, 🤖 integrate

---

## 4. Legal pages & compliance 🔴 🤝

- [ ] 🤖 **Company identity block** in footer: legal name · ΑΦΜ · ΔΟΥ · ΓΕΜΗ · address (👤 provides the values)
- [ ] 🤖 **EU ODR (Online Dispute Resolution) link** in footer → https://ec.europa.eu/consumers/odr (mandatory for all EU online sellers)
- [ ] 🤝 **Terms of Service (Όροι Χρήσης)** — review/expand existing page with real company details, ordering process, pricing/VAT, liability
- [ ] 🤝 **Privacy Policy** — verify it's accurate once you actually collect data (accounts, orders, analytics)
  - [ ] 🔴 Add a **children's-data clause** ("we do not knowingly collect data from under-15s; contact us to delete")
- [ ] 🤖 **Cookies Policy** — dedicated page (separate from Privacy), listing cookies used; wire it to the banner
- [ ] 🤝 **Returns / Withdrawal** — confirm the page states the EU **14-day right of withdrawal** clearly
- [ ] 🤝 Add **Consumer Ombudsman (Συνήγορος του Καταναλωτή)** reference (standard on GR shops)
- [ ] 🤖 Wire the cookie banner so "Decline" actually blocks analytics/marketing scripts (not just records the choice)

---

## 5. Shipping & logistics 🤝

- [ ] 👤 Sign a contract with a **courier**: ACS, ELTA Courier, Geniki Taxydromiki, Speedex, or BoxNow (lockers are popular)
- [ ] 👤 Enable **Cash on Delivery (Αντικαταβολή)** with the courier (they collect cash, remit to you)
- [ ] 👤 Decide **shipping rates** (flat? free over €X? by weight/zone?) and delivery timeframes
- [ ] 👤 Decide **returns logistics** (who pays return shipping, how customers send back)
- [ ] 🤖 Implement shipping options + COD in checkout, reflecting your rates
- [ ] 🤖 (Optional) courier API integration for labels/tracking — or start manual

---

## 6. Domain, hosting & email 🤝

- [ ] 👤 Buy/confirm domain (norelia.com or .gr)
- [ ] 👤 Set up branded **email** (hello@norelia.com) — Google Workspace / Zoho / etc.
- [ ] 🤖 Connect domain to **Vercel** (already hosting there), configure DNS + SSL
- [ ] 🤖 Fix the favicon/branding for production (was patched earlier — verify on live domain)
- [ ] 🤖 Set up environment variables/secrets in Vercel (Viva keys, Supabase keys, email keys)

---

## 7. Content & catalog 🤝

- [ ] 👤 Real **product photography** (the demo uses placeholder/stock imagery)
- [ ] 👤 Real **product data**: names, descriptions (EL + EN), prices, sizes, colors, stock counts
- [ ] 👤 Decide **VAT handling** — Greek clothing VAT is 24%; prices shown should be VAT-inclusive (consumer rule)
- [ ] 🤖 Load real catalog into the database
- [ ] 👤 Real **social media** accounts (footer links currently point to /norelia placeholders) — consider adding **Facebook + TikTok** (big in GR)

---

## 8. Analytics & marketing (optional at launch) 🤝

- [ ] 👤 Decide if you want analytics (Google Analytics 4 / Meta Pixel)
- [ ] 🤖 Integrate **only behind cookie consent** (load after "Accept")
- [ ] 🤝 Newsletter: pick provider (Mailchimp / Klaviyo / Brevo); 🤖 wire the existing newsletter bar to it
- [ ] 🤝 (Optional) Google Merchant Center / Meta catalog for shopping ads

---

## 9. Pre-launch QA 🤖

- [ ] 🤖 End-to-end test a real purchase (card, IRIS, COD) in Viva **test mode**
- [ ] 🤖 Verify order confirmation emails fire
- [ ] 🤖 Verify stock decrements and oversell protection
- [ ] 🤖 Re-run accessibility, responsive (375/768/1280), dark mode, Greek-accent audit
- [ ] 🤖 Lighthouse / performance pass
- [ ] 🤖 Test on real mobile devices
- [ ] 👤 Do a real low-value live transaction before announcing

---

## Critical path (the order that actually unblocks things)

1. **Business registration** (👤) → unlocks bank account → unlocks Viva
2. **Viva account + Supabase** (👤) → unlocks payments + backend (🤖)
3. **Backend: products, orders, stock, payments, emails** (🤖) — the big build
4. **Legal block + pages** (🤝) — needs business details from step 1
5. **Courier + shipping + COD** (👤 then 🤖)
6. **Real content/photos** (👤)
7. **QA + soft launch** (🤖 then 👤)

The single biggest dependency is **step 1 (business registration)** — almost
everything money-related is blocked until the ΑΦΜ and business bank account exist.
The single biggest *build* is **step 3 (the backend)**.

---

## What I can start on BEFORE you have the business set up

These don't need your ΑΦΜ/accounts and can be done anytime:
- Cookies Policy page + wiring the banner to gate scripts
- Children's-data clause + 14-day withdrawal wording on existing pages
- ODR link in footer
- Footer legal-strip layout (with placeholders until real numbers arrive)
- Supabase schema design + migrating products off static arrays (structure only)
- Facebook/TikTok footer icons

Just say the word and I'll knock out the no-dependency items now.
