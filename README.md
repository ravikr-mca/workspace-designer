# Workspace Designer · monis.rent

Design your dream Bali workspace visually — pick a desk, a chair, monitors, lighting and plants, watch the room come to life, then rent the whole setup in one tap.

Built for the Desent Solutions developer challenge.

**Live:** _(deployed on Vercel — see repo About link)_

## The approach

The brief asked for a fun, visual alternative to a boring product catalog, so the illustrated room **is** the product page. Every product in the catalog is hand-drawn SVG in one shared style (same palette, same shading language), and a slot compositor places items into the scene: desks swap without losing what's on them, monitors auto-arrange as you add more, floor items claim their corners, and everything pops in with a spring.

User-centric details I cared about:

- **Instant gratification** — three starter bundles (modeled on monis.rent's Curated Bundles) fill the room in one tap, then you tweak.
- **Real-feeling prices** — weekly USD rates modeled on the actual monis.rent catalog, with a running $/week total always visible and 1 week / 1 month / 3 months pricing (longer stays save 10–20%) in checkout.
- **Shareable setups** — the whole configuration lives in the URL (`?s=desk-teak.chair-ergo…`), so you can send your build to a friend or come back later. No account, no database.
- **A checkout that closes the loop** — itemized summary, duration picker, delivery promise, confetti. The "same-day delivery in Bali" promise from the real site is the closing argument.
- **Mobile-first** — scene on top, thumb-reach tray below, sticky rent bar; verified at 375 / 768 / 1440 with zero horizontal scroll.
- **Accessible** — keyboard operable, `aria-pressed` selection states, visible focus rings, 44px touch targets, and every animation (springs, plant sway, coffee steam, confetti) is disabled under `prefers-reduced-motion`.

## Tech choices

- **Next.js 16 (App Router) + TypeScript** — required by the brief; the designer is a single client component tree over a static shell. No API routes, no env vars.
- **Tailwind CSS 4** — all styling; the design tokens (warm sand / palm ink / terracotta OKLCH palette, Bricolage Grotesque + Instrument Sans type) are defined as theme variables in `globals.css`.
- **Motion (`motion/react`)** — spring pop-ins for scene items, the checkout sheet, and the confetti burst.
- **Hand-rolled everything else** — no component library. State is a single `useReducer` (`lib/setup-state.ts`) with pure, testable pricing and URL-codec functions; the catalog is typed data (`lib/catalog.ts`); the scene compositor and item artwork live in `components/scene/`.

## What I'd improve with more time

- Drag to reposition items within the room (the slot system already knows anchor points).
- A photo mode: swap the illustration for real monis.rent product photography per item.
- Item variants (wood finishes, chair colors) and quantity for monitors beyond one of each.
- A real order handoff — POST the setup to an API / WhatsApp deep link with the encoded URL.
- Unit tests for the reducer/pricing/codec (they're pure functions, deliberately).
- Ambient day/night toggle: the window scene shifting to sunset as you change rental duration.

## Run it locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
