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
| `/centres`, `/about`, `/contact` | Centres map, about, contact form (hands off to WhatsApp) |

Motion lives in `components/Motion.tsx` (scroll reveal, count-up, cursor spotlight, typed placeholder),
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

- Package prices are not published on the current site (only "starting @ INR 999*").
- Concern groupings, tube-colour labels, FAQ wording, per-test booking notes and the map positions are
  design additions written from the site's facts, not lab-supplied data.
- No testimonials: the ones on the current site are placeholder text.
