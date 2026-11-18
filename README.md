# RIME: winter set landing page

A single, animation-heavy landing page for one product: a 3-piece winter bundle (beanie + neck warmer + touchscreen gloves) at $34.99.

"RIME" is a placeholder brand. Everything brand-specific lives in one config file, so renaming it is a one-line change (see [Rename the brand](#rename-the-brand)).

**Stack:** Next.js 16 (App Router) + TypeScript + Tailwind CSS v4, GSAP + ScrollTrigger + SplitText, Lenis, React Three Fiber + drei, Motion (Framer Motion).

## Run it

Requires Node 20.9 or newer.

```bash
npm install
npm run dev          # http://localhost:3000
```

Other scripts:

| Script | What it does |
|---|---|
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `npm run placeholders` | Regenerate the placeholder product art in `public/products` |

## The one config file

**`src/config/site.ts`** holds everything you are likely to change:

- brand name, tagline, metadata
- **`checkout.url`**: every buy button on the page points here
- price and product name
- theme colors
- colorways (names, swatches, palettes)
- the three pieces: copy, image paths, optional 3D model paths
- section copy: hero, bundle, details, reviews, FAQ, final CTA, footer

### Point the buttons at Shopify

Set `checkout.url` in `src/config/site.ts` to your Shopify checkout or cart permalink (for example `https://your-store.myshopify.com/cart/VARIANT_ID:1`). Set `checkout.newTab` to `true` if you want it to open in a new tab. The header button, hero button, bundle button, details button, final CTA and the mobile sticky bar all read from it.

### Change the copy

Edit the strings in `src/config/site.ts`. Headlines are arrays, one entry per line, so you control the line breaks.

### Change the colors

Edit `theme.colors` in the config. They are injected as CSS variables, so Tailwind classes like `bg-accent` and `text-frost` follow automatically. To try an icy blue accent instead of blaze orange, set `accent` to `#7fd4ff`.

### Rename the brand

1. Change `brandName` near the top of `src/config/site.ts`.
2. Run `npm run placeholders` (the placeholder art has the name on its woven label).
3. Optional: rename the GitHub repo with `gh repo rename <new-name>-site`.

The hero wordmark sizes itself to the length of the name.

## Swap in real product images

All image paths are in the config. The files live in `public/products/<colorway>/`.

| Config field | Used in | Recommended |
|---|---|---|
| `pieces[].images` | Hero and bundle (image mode), and the no-motion bundle list | Square cutout with a transparent background (PNG or WebP), product centered, about 1600px |
| `details.colorways.images` | The big colorway viewer | 4:5, about 1600 x 2000 |
| `details.features[].images` | Material, lining and fit close-ups | 4:5, about 1200 x 1500 |

Either overwrite the placeholder files or point the config at new paths. JPG, PNG, WebP and AVIF go through the Next.js image optimizer automatically; the SVG placeholders are served as they are.

Each image is defined **per colorway**, and the three swatches swap all of them at once.

**Important:** the hero and bundle sections show real-time 3D by default. Once you have real photos but no 3D models, set this in the config so those sections use your photos instead of the 3D placeholders:

```ts
stage: { mode: "images", mobile3d: true },
```

## Drop in real 3D models (.glb)

1. Put the files in `public/models/`.
2. Set `model` on the matching piece in the config:

```ts
{ id: "beanie", /* ... */ model: "/models/beanie.glb" },
```

The model is centered and scaled to fit the slot automatically, and it rides the same scroll choreography as the placeholder. If a model fails to load, the placeholder shows instead. Pieces without a `model` keep their procedural placeholder, so you can replace them one at a time.

Tips: keep each file small (under about 1 MB, Draco or Meshopt compressed), with baked or simple PBR materials. Note that `.glb` models keep their own materials, so they will not recolor with the colorway swatches.

## How the page is put together

| Section | Notes |
|---|---|
| Intro | Pure CSS, about 1.4s. Never waits on JavaScript. |
| Hero | Wordmark behind the product stage, headline and CTA in front. |
| The bundle | Pinned. The beanie travels in from the hero, then the neck warmer and gloves arrive one at a time. Ends on the full set and the price. |
| Details | Sticky colorway viewer with 3 swatches (also keyboard operable), plus material, lining and fit close-ups. |
| Reviews | **Placeholders, clearly labeled on the page.** See below. |
| FAQ | Accordion. Shipping and returns answers contain bracketed placeholders. |
| Final CTA + footer | Email signup is UI only (validates, shows a success state, sends nothing). |
| Sticky buy bar | Mobile only. Appears after the hero button scrolls away. |

**The product stage** (`src/components/stage/`) has two renderers driven by one choreography file:

- a React Three Fiber scene (procedural placeholder geometry or your `.glb` files), and
- layered product images with pointer and scroll parallax.

The images are server-rendered, so the hero is complete on first paint. The 3D scene is code-split and crossfades in when ready: right away on desktop, after the first touch or scroll on phones (`stage.mobile3d: false` keeps phones on images). If WebGL is unavailable the page stays on images.

**Motion and accessibility**

- With `prefers-reduced-motion`, there is no intro, no smooth scroll, no pinning, no snow and no 3D. The bundle section becomes a plain list. Nothing is hidden waiting for an animation.
- Semantic landmarks, one `h1`, alt text, visible focus rings, a skip link, keyboard-operable swatches and accordion.
- Custom cursor and magnetic buttons only run for mouse and trackpad users.

## Before you launch

Search `src/config/site.ts` for `TODO` and for square brackets. In particular:

- [ ] `checkout.url` is still `https://example.com/checkout`.
- [ ] **Reviews are placeholders.** Replace `reviews.items` with real customer quotes, then set `reviews.isPlaceholder` to `false` to remove the on-page "Placeholder" labels. Do not publish invented reviews.
- [ ] FAQ shipping and returns answers contain `[X to Y]` style placeholders. Fill in your real terms.
- [ ] Product copy (rib knit, fold-over cuff, fleece lining, which fingers are touchscreen-compatible) describes a typical set. Match it to what you actually ship.
- [ ] `brand.url` (used for metadata) and the footer contact address are `example.com`.
- [ ] The email signup does not send anything. Wire `SignupForm` to your provider (see the comment in `src/components/ui/SignupForm.tsx`).
- [ ] Replace the placeholder images.
- [ ] "RIME" has not been checked against existing trademarks.

## Deploy to Vercel

1. Push this repo to GitHub (already done if you are reading this there).
2. Go to [vercel.com/new](https://vercel.com/new), import the repo, and accept the defaults. Vercel detects Next.js; there are no environment variables to set.
3. Click Deploy. Every push to `main` redeploys, and pull requests get preview URLs.

Or from the terminal:

```bash
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production
```

After deploying, set `brand.url` in the config to your real domain.

## Performance

Measured with Lighthouse (mobile emulation, production build, localhost) on 2026-11-18: **performance 90 to 93, accessibility 100, best practices 100, SEO 100**. Numbers vary a little between runs and will differ on real hosting.

What keeps it fast:

- three.js is in its own chunk and never loads before first paint (on phones, not before the first interaction).
- Scroll reveals are set up lazily by IntersectionObserver, so page load has no long main-thread tasks.
- Fonts are self-hosted through `next/font`; the placeholder art is a few KB of SVG.
- Touch devices keep native scrolling.

Re-run the audit after adding real photography. Large unoptimized images are the usual way a page like this gets slow.

## Notes

- `three` is pinned to `0.182.0`. Version 0.183 deprecates `THREE.Clock`, which the current `@react-three/fiber` still uses, and logs a console warning on every load. Unpin once fiber moves to `THREE.Timer`.
- This repo uses Next.js 16. If you work on it with an AI coding agent, `AGENTS.md` points it at the version-matched docs in `node_modules/next/dist/docs/`.
