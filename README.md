# Medcloud Labs — website redesign

Next.js (App Router, TypeScript) redesign concept for medcloudlabs.com. Content, prices, addresses and
contact details were taken from the live site.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (all routes are static)
```

## Routes

| Route | What it is |
| --- | --- |
| `/` | Animated hero search, marquee, department bento, quick-pick tabs, home collection, packages, services, centres, FAQ |
| `/tests` | Full price list. Accepts `?q=` (search) and `?concern=` (Diabetes, Thyroid, …) |
| `/tests/[dept]` | One page per department |
| `/tests/[dept]/[test]` | One page per test (362), with price, booking and related tests |
| `/packages` | Packages plus a comparison table |
| `/services`, `/services/[slug]` | Services index and four service pages |
| `/centres/[id]` | One page per centre |
| `/centres`, `/about`, `/contact` | Centres map, about, contact form (hands off to WhatsApp) |

The home page is a scroll story: `components/Orb.tsx` (three.js stage: sections marked `data-orb` and
`data-shape` are stops, and the object morphs between a cell, DNA helix, scanner, medical cross and sample tube), `components/Cinema.tsx` (splash counter and the masked-card mosaic) and `public/field.jpg`
(the mosaic's shared image, generated art).

Other motion lives in `components/Motion.tsx` (scroll reveal, count-up, cursor spotlight, typed placeholder),
`app/template.tsx` (route transition) and the "v2" block at the end of `app/globals.css`.
All of it is switched off under `prefers-reduced-motion`.

## Structure

- `data/tests.json` — the 362 tests as `[name, price, department]`. Edit prices here.
- `lib/data.ts` — typed data layer: departments, packages, centres, contact numbers, search.
- `components/SlipProvider.tsx` — "My tests" list (React context, saved in localStorage) and drawer state.
- `components/SlipDrawer.tsx` — the list, booking form and WhatsApp hand-off. No backend: the request is
  sent as a prefilled WhatsApp message to the lab's number. Replace `review()`/the done view with an API
  route when a booking backend exists.
- `components/Catalogue.tsx`, `HeroSearch.tsx`, `Centres.tsx` — interactive pieces.
- `components/Header.tsx` — sticky header with mega-menu and mobile menu.
- `components/Sections.tsx`, `HomeSections.tsx`, `Chrome.tsx` — page sections and footer.
- `app/globals.css` — design tokens (`:root`) and all styles.

## Before going live

Needs Medcloud's sign-off or real data; the site is written so these are easy to fill in:

- **Clinical review.** Per-test descriptions, sample types and preparation notes (`ABOUT` and `testInfo` in
  `lib/data.ts`) come from general medical knowledge and the test names, not from the lab.
- **Report times, opening hours, per-centre services.** Not published anywhere; pages say "confirmed when you book".
- **Package prices.** Only "starting @ INR 999*" is published.
- **Privacy policy.** The footer links to the current site's policy. It must be reviewed against the booking flow
  (name, mobile, address and test list sent over WhatsApp).
- **Map positions** are approximate; **testimonials** on the current site are placeholder text and are left out.
- **Not measured:** Lighthouse, Core Web Vitals, screen-reader behaviour.

## Themes

`components/ThemeToggle.tsx` switches between day (default) and dark. The choice is stored in the browser and
applied before first paint by a small script in `app/layout.tsx`. Colours are tokens in the "v5" block of
`app/globals.css`; `:root[data-theme="light"]` holds the day palette.

## Palette

Visme "Clean and Modern" (#24): `#17252A` ink, `#2B7A78` teal, `#3AAFA9` aqua, `#DEF2F1` pale aqua, `#FEFFFF` white.
Tokens live in the "v6" block of `app/globals.css`.
