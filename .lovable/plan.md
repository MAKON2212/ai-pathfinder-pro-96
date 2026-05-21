# ScanAI — Lovable project plan

**Live URL:** https://aisnelscan.com
**Stack:** TanStack Start + React + TypeScript + Tailwind 4 on Cloudflare Workers
**Status:** Active · Gold Tech design system · live in production

## Propositie

"Calculate for free how much money your business is missing by not using AI."
The number is free; the report (how to capture that money) is paid (€29 / €97 / €297 tiers).

## Design system — Gold Tech (current)

`src/styles.css` defines the tokens:

- `--background: #08080a` (near-black)
- `--foreground: #f5ecd7` (warm cream)
- `--brand: #C9A664` (gold)
- `--brand-soft: rgba(201,166,100,0.12)`
- `--money: #E8CB85` (gold-2)
- `--gold-deep: #876B2C`
- `--gradient-value: linear-gradient(180deg, #FFE8A8 0%, #C9A664 60%, #876B2C 100%)`
- `--shadow-glow: 0 0 60px rgba(201,166,100,0.35)`

Glass surfaces (`.surface`, `.glass`, `.frosted`) use dark translucent
backgrounds with subtle gold-tinted highlights. Floating pill navbar
with backdrop-blur. Animated `live-dot` pulse for "live" indicators.

## Core flow

1. **`/`** — hero with eyebrow tag, oversized hero heading, live counter
   card (€213,480/year sample), CTAs, trust bar with portrait photos,
   stats section, 3-step flow section. Desktop: 2-col `lg:grid-cols-2`
   hero with left col text + CTAs and right col counter card.
2. **`/audit`** — 7 short questions (industry, size, hourly cost,
   repetitive hours, pain points, gross margin, missed leads/month).
   Live value meter at top of the page updates with each answer.
   Numbered options with delta-value hints (+€4.2k etc.).
3. **`/results-loading`** — 8-step shimmer loading animation
   (~19 seconds min delay) while `generateReport` server fn calls the
   Lovable AI gateway (`google/gemini-2.5-flash`) and Firecrawl scrapes
   the user's website if provided.
4. **`/results`** — full Gold Tech-styled report: executive summary,
   value breakdown table, radar chart (you vs benchmark), 3 score
   cards (readiness/automation/impact), chapters, roadmap, tool stack,
   quick wins, 90-day plan, sensitivity scenarios. Paywall via Stripe
   Embedded Checkout (€29 / €97 / €297 tiers).

## Server functions

- `generateReport` — Lovable AI gateway + Firecrawl multi-page scrape
- `setReportEmail` — capture email at paywall
- `verifyCheckoutSession` — Stripe verification on return URL
- `generatePDF` — server-rendered PDF of the report
- `trackAuditSession` — telemetry per audit step

## Required env vars (Cloudflare Workers)

- `LOVABLE_API_KEY` — Lovable AI gateway (required for report)
- `FIRECRAWL_API_KEY` — website scraping (optional, falls back gracefully)
- `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` — checkout
- `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` — report storage

## Recent commits

- `6bdc919` fix: report generation failed with 'Bedrijfsnaam ontbreekt'
- `4dc183f` feat: desktop 2-col layout, gold favicon, hooks fix
- `e005e57` fix: bigger sample numbers, real face photos, normal cursor
- `425229f` design: match Gold Tech reference — floating nav, counter
- `e1c297e` design: Gold Tech redesign — warm amber/gold on near-black
