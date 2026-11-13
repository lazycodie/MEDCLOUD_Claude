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
| `/` | Hero search, popular price list, catalogue preview, packages, services, centres, about |
| `/tests` | Full price list. Accepts `?q=` (search) and `?concern=` (Diabetes, Thyroid, …) |
| `/tests/[dept]` | One page per department (haematology … radiology), statically generated |
| `/packages`, `/services`, `/centres`, `/about` | Section pages |

## Structure

- `data/tests.json` — the 362 tests as `[name, price, department]`. Edit prices here.
- `lib/data.ts` — typed data layer: departments, packages, centres, contact numbers, search.
- `components/SlipProvider.tsx` — "My tests" list (React context, saved in localStorage) and drawer state.
- `components/SlipDrawer.tsx` — the list, booking form and WhatsApp hand-off. No backend: the request is
  sent as a prefilled WhatsApp message to the lab's number. Replace `review()`/the done view with an API
  route when a booking backend exists.
- `components/Catalogue.tsx`, `HeroSearch.tsx`, `Centres.tsx` — interactive pieces.
- `components/Sections.tsx`, `Chrome.tsx` — server-rendered sections, header and footer.
- `app/globals.css` — design tokens (`:root`) and all styles.

## Before going live

- Package prices are not published on the current site (only "starting @ INR 999*").
- Concern groupings, tube-colour labels and the map positions are design additions, not lab data.
- No testimonials: the ones on the current site are placeholder text.
