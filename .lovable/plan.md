## Doel

Verschuif de propositie van "AI-roadmap rapport" naar **"Bereken gratis hoeveel geld jouw bedrijf misloopt door geen AI te gebruiken"**. Het bedrag krijgen ze gratis, het rapport (hoe ze dat geld pakken) is betaald. Dark theme, mobile-first.

## 1. Theme switch — Midnight Indigo (dark)

`src/styles.css`: vervang de Cosmos-pale tokens door dark:
- `--background: #0a0a1a` (deep navy/black)
- `--foreground: #e8eaf3`
- `--card: #141432`, `--surface: #141432`, `--surface-2: #1e1e5a`
- `--primary: #4f46e5` (electric indigo)
- `--accent: #4f46e5`, `--brand: #4f46e5`, `--brand-soft: rgba(79,70,229,0.15)`
- `--muted: #1a1a3a`, `--muted-foreground: #8a90b8`
- `--border: rgba(255,255,255,0.08)`
- Nieuwe tokens: `--money: #22c55e` (positieve geld-glow), `--gradient-value: linear-gradient(135deg,#4f46e5,#22c55e)`, `--shadow-glow: 0 0 60px rgba(79,70,229,0.35)`
- `.surface` / `.glass`: dark card met subtiele indigo-border + glow on hover
- `.frosted` (navbar pill): dark frosted variant

`MeshBackground`: vervang door donkere ambient gradient (radial indigo glow op zwarte canvas).

## 2. Audit-form herontwerp — 7 vragen, money framing

Vervang `src/routes/audit.tsx` met een nieuwe mobile-first flow. Vragen:

1. **Branche** (chips: Marketing, E-commerce, Zorg, Bouw, Consultancy, Tech, Anders)
2. **Teamgrootte** (1-5 / 6-20 / 21-50 / 51-200 / 200+)
3. **Gemiddeld uurtarief** (€25 / €50 / €75 / €100 / €150+)
4. **Repetitieve uren per medewerker per week** (slider 0-40)
5. **Grootste tijdvreter** (multi-select: e-mail, rapportages, klantvragen, content, data-invoer, planning, research)
6. **Marge op je dienst/product** (laag <15% / midden 15-35% / hoog 35%+)
7. **Klanten/leads die je per maand misloopt door capaciteit** (0 / 1-5 / 5-20 / 20+)

Berekening (`src/lib/value-calc.ts`, nieuw, deterministisch):
```
yearlyMissed = team * repetitiveHrs * 52 * hourlyRate * 0.6   // 60% AI-automatiseerbaar
+ missedLeads * 12 * avgDealValue(margin, industry)
```
Onder/bovengrens ±20% voor range-weergave.

## 3. Value-building animatie (sticky boven form, mobile)

Nieuwe component `src/components/ValueMeter.tsx`:
- **Sticky header (top)** zichtbaar bij scrollen: groot tellend bedrag (`€0 → €X.XXX/jaar`) met framer-motion `animate` op number-tween (300ms ease-out per update).
- **Tank/progress meter** ernaast: verticale of horizontale balk die vult van 0% → 100% (= aantal beantwoorde vragen / totaal). Indigo→groen gradient fill. Subtiele glow-pulse op elke vulling.
- Bij elk antwoord: tweens het bedrag + meter, korte sparkle (3 indigo dots, 600ms scale+fade).
- Bij vraag 7 (laatste): bedrag krijgt sterkere glow + label "Jouw misgelopen omzet/jaar".

## 4. Reveal-scherm na laatste vraag

Op `/audit` na submit (geen redirect):
- Groot bedrag, "Dit loop je mis. Per jaar."
- Korte breakdown: 3 bullets (uren, leads, marge-impact) — gratis.
- **Geblurde rapport-preview** (hergebruik `LiveReportPreview` style): 4 hoofdstukken zichtbaar, content blurred (8px), met een lock-icoon en CTA-knop "Ontgrendel rapport — €X" → bestaande Stripe-flow.
- Onder: "Wat zit erin" (bullets, niet geblurd: roadmap, tool-stack, ROI per kwartaal, 90-dagen plan).

## 5. Homepage (`src/routes/index.tsx`)

Vereenvoudig naar één primaire CTA:
- Hero: "Hoeveel geld loopt jouw bedrijf mis door geen AI?" + sub "Reken het in 90 seconden uit. Gratis."
- Grote knop → `/audit`
- 3 social-proof cijfers (statisch)
- Verwijder secundaire content die niet aan deze funnel bijdraagt (haal AI-tools blok weg of verklein tot één regel).

## 6. Mobile-first focus

- Form: full-width cards, 16px padding, opties als 2-col grid voor korte chips, 1-col voor lange.
- Sticky `ValueMeter` bovenin (`position: sticky; top: 0`), 64px hoog op mobile.
- Bottom-fixed "Volgende"-knop (full width, 56px) zodat je 'm altijd kunt raken.
- Desktop: zelfde layout, gecentreerd op max-w-md. Geen 2-col layout — niet relevant volgens user.

## 7. Files

**Nieuw:**
- `src/lib/value-calc.ts` (deterministische bereken-functie)
- `src/components/ValueMeter.tsx` (sticky tellende counter + meter)
- `src/components/ValueReveal.tsx` (eindscherm met geblurde teaser)

**Vervangen:**
- `src/routes/audit.tsx` (volledig herschreven, ~300 regels ipv 602)
- `src/routes/index.tsx` (vereenvoudigd, ~120 regels)
- `src/styles.css` (dark tokens)
- `src/components/MeshBackground.tsx` (dark variant)

**Verwijderen / verbergen:**
- `HypeBanner` (niet meer relevant — value-meter neemt het over)
- `LiveValueRange` (vervangen door ValueMeter)
- `LiveReportPreview` (logica gaat op in `ValueReveal`, oude file kan blijven of weg)

## 8. Buiten scope (deze ronde)

- AI-call (`report.functions.ts`) blijft zoals 'ie is — wordt pas getriggerd na betaling, dus geen credits-verspilling tijdens de gratis flow.
- Auth, payments-config, admin: ongewijzigd.
- Light theme: niet ondersteund (user zei dark only).
- Tablet/desktop optimalisatie: minimaal (mobile is de focus).

## Technische details

- Tellende counter: `framer-motion` `useMotionValue` + `useTransform` + `animate(mv, target, {duration: 0.4, ease: 'easeOut'})`.
- Meter-fill: width-transition met CSS, gradient `--gradient-value`.
- Audit tracking (`trackAuditSession`) blijft draaien — antwoorden gaan mee in payload.
- State-management: lokale `useState` voor antwoorden (Map of object), geen URL-state nodig.
- Berekende waarde live in component via `useMemo` op antwoorden.

Na goedkeuring lever ik dit in één edit-batch op.