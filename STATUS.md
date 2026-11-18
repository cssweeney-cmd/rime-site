Author: Chris

**State (2026-11-18):** v1 landing page built and verified locally on the production build: all six sections at desktop (1440) and phone (390) widths, reduced-motion pass, no-WebGL pass, `.glb` drop-in tested with a throwaway model. Lighthouse mobile: performance 90 to 93, accessibility 100, best practices 100, SEO 100. Not deployed.

**Why it stops here:** everything left needs real inputs from Chris. Brand name "RIME" is a placeholder, checkout points at `https://example.com/checkout`, art is generated placeholder SVG, 3D pieces are procedural stand-ins.

**Next steps**
1. Pick the real brand name (one line in `src/config/site.ts`, then `npm run placeholders`).
2. Paste the Shopify checkout or cart permalink into `checkout.url`.
3. Add real product photos, or `.glb` models; with photos only, set `stage.mode` to `"images"`.
4. Replace the placeholder reviews and set `reviews.isPlaceholder` to `false`.
5. Fill the bracketed shipping and returns terms in the FAQ, then deploy to Vercel (README has the steps).

**Open questions (Chris only)**
- Icy blue vs blaze orange accent: went with orange; the swap is one hex in the config.
- Product copy assumes a rib-knit beanie with a fold-over cuff and touchscreen pads on thumb + index finger. Confirm against the actual product.
- Email signup is UI only. Which provider (Klaviyo, Shopify, Mailchimp)?
- 3D on phones loads after the first touch or scroll. Only checked in emulation, not on a real device: worth a look on an actual phone.
