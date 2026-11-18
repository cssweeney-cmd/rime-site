# rime-site

Landing page for a winter accessories DTC brand ("RIME" is a placeholder name) selling one product: a 3-piece bundle (beanie + neck warmer + touchscreen gloves) at $34.99. Static, no backend. See `README.md` for the owner-facing guide and `STATUS.md` for current state.

@AGENTS.md

## Commands
- `npm run dev` / `npm run build` / `npm run start`
- `npm run lint`, `npm run typecheck`
- `npm run placeholders`: regenerates `public/products/**` from the colorway palettes (run after renaming the brand or changing palettes)

## Map
- `src/config/site.ts`: THE config. Brand, copy, price, `checkout.url`, theme colors, colorways, image paths, optional `.glb` paths. New content goes here, not in components.
- `src/app/`: `layout.tsx` (fonts, theme CSS variables, pre-paint `js`/`motion` class script), `page.tsx` (section order), `globals.css` (tokens, intro, reveal initial states, stage image poses).
- `src/components/stage/`: the product stage behind hero + bundle.
  - `choreography.ts`: single source of truth for piece poses vs scroll. Both renderers read it.
  - `Scene.tsx` + `pieces.tsx`: React Three Fiber renderer (procedural placeholders, `.glb` drop-in).
  - `LayeredProducts.tsx`: image renderer (server-rendered, also the no-WebGL and pre-3D tier).
  - `Stage.tsx`: decides which renderer shows; `store.ts`: mutable scroll/pointer state.
- `src/components/sections/`: Hero, Bundle (pinned), Marquee, Details, Reviews, Faq, FinalCta, Footer.
- `src/components/ui/`: CtaButton, Magnetic, Cursor, Snow, ProductImage, SignupForm.
- `src/components/RevealController.tsx`: all `data-reveal` / `data-parallax` behavior.
- `src/components/providers/`: ColorwayProvider (page-wide colorway), SmoothScroll (Lenis).
- `scripts/generate-placeholders.ts`: placeholder SVG art generator.
- `public/products/<colorway>/`: images. `public/models/`: optional `.glb` files.

## Rules that are easy to break
- **Motion gate.** All animation CSS/JS is gated on `html.motion` (set before paint unless reduced motion). Use the `motion:` Tailwind variant and `motionOk()`. The no-motion page must stay complete and readable: never hide content that only JS reveals without that gate.
- **`cacheComponents` is on.** No `Math.random()`, `Date.now()` or `new Date()` during render (server or client components). Keep them inside effects.
- **Tailwind v4 uses the `translate`/`scale`/`rotate` properties.** Setting `style.transform` does not override a `scale-x-0` class; set `style.scale`. Transitions need `transition-[translate]` etc, not `transform`.
- **No layout reads in frame loops** (`clientWidth`, `getBoundingClientRect`). Measure with ResizeObserver. This was the main cause of a slow first version.
- **No eager WebGL probing.** Creating a throwaway context blocked hydration for ~300ms. The scene fails into `SceneBoundary` instead.
- **Keep reveals lazy.** New scroll reveals go through `data-reveal` so nothing is set up at load.
- Pinned sections use CSS `position: sticky` with ScrollTrigger only reading progress. The stage sticks inside an absolutely positioned zone-sized box (a negative-margin sticky overstays by 100vh).
- `three` is pinned to 0.182.0 on purpose (see README notes).
- No em-dashes anywhere (copy, comments, commits).
- Reviews are placeholders and must stay visibly labeled until the owner supplies real ones. Do not invent customer names, ratings, counts or urgency claims.

## Verifying changes
Typecheck and lint are not enough here. Build, run `npm run start`, and look at it: desktop (1440 wide) and phone (390 wide), scrolling through the pinned bundle section, plus a reduced-motion pass (`--force-prefers-reduced-motion`) and a no-WebGL pass (`--disable-3d-apis`). Re-run Lighthouse mobile after touching anything that runs on load (target: performance 85+).
