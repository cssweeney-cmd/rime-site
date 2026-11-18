"use client";

import { useRef, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/config/site";
import { useColorway } from "@/components/providers/ColorwayProvider";
import { CtaButton } from "@/components/ui/CtaButton";
import { SwapImage } from "@/components/ui/ProductImage";

/**
 * Details: a sticky colorway viewer on the left (three swatches that swap
 * every image in the section and recolor the 3D pieces), and material, lining
 * and fit close-ups scrolling past on the right.
 */
export function Details() {
  const { details, colorways } = site;
  const { colorway, setColorway } = useColorway();
  const swatches = useRef<(HTMLButtonElement | null)[]>([]);

  // Radio-group keyboard behavior: arrows move and select.
  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const step =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;
    if (!step) return;
    e.preventDefault();
    const next = (index + step + colorways.length) % colorways.length;
    setColorway(colorways[next].id);
    swatches.current[next]?.focus();
  };

  return (
    <section id="details" aria-labelledby="details-title" className="relative px-(--gutter) py-28 md:py-44">
      <header className="grid items-end gap-8 md:grid-cols-12">
        <div className="md:col-span-8">
          <p data-reveal="fade" className="eyebrow flex items-center gap-3 text-accent">
            <span aria-hidden="true" className="inline-block h-px w-8 bg-accent" />
            {details.eyebrow}
          </p>
          <h2 id="details-title" data-reveal="lines" className="display text-section mt-6">
            {details.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>
        <p data-reveal="fade" className="max-w-sm text-lg text-frost/75 md:col-span-4 md:pb-3">
          {details.intro}
        </p>
      </header>

      <div className="mt-16 grid gap-x-10 gap-y-16 md:mt-24 md:grid-cols-12">
        {/* Colorway viewer */}
        <div className="self-start md:sticky md:top-24 md:col-span-6">
          <div data-reveal="clip" className="relative aspect-[4/5] overflow-hidden rounded-sm bg-ink-2">
            <SwapImage
              src={details.colorways.images[colorway.id]}
              alt={`${details.colorways.alt}, ${colorway.name} colorway`}
              sizes="(min-width: 768px) 46vw, 92vw"
            />
          </div>

          <div data-reveal="fade" className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <div className="min-w-0">
              <p id="colorway-label" className="eyebrow text-mute">
                {details.colorways.label}
              </p>
              <div className="relative mt-2 h-[3.25rem] overflow-clip md:h-16">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.p
                    key={colorway.id}
                    className="display text-6xl md:text-7xl"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {colorway.name}
                  </motion.p>
                </AnimatePresence>
              </div>
              <p aria-live="polite" className="mt-2 max-w-xs text-sm text-frost/70">
                {colorway.blurb}
              </p>
            </div>

            <div role="radiogroup" aria-labelledby="colorway-label" className="flex gap-3">
              {colorways.map((c, i) => {
                const selected = c.id === colorway.id;
                return (
                  <button
                    key={c.id}
                    ref={(node) => {
                      swatches.current[i] = node;
                    }}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={c.name}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setColorway(c.id)}
                    onKeyDown={(e) => onKeyDown(e, i)}
                    className="group relative grid size-12 place-items-center rounded-full"
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute inset-0 rounded-full border transition-[scale,border-color] duration-500 ease-out-expo ${
                        selected ? "scale-100 border-frost" : "scale-75 border-transparent group-hover:scale-90 group-hover:border-frost/40"
                      }`}
                    />
                    <span
                      aria-hidden="true"
                      className="size-8 rounded-full ring-1 ring-white/15 transition-[scale] duration-500 ease-out-expo group-hover:scale-105 group-active:scale-90"
                      style={{ backgroundColor: c.swatch }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Close-ups */}
        <ul className="grid gap-16 md:col-span-5 md:col-start-8 md:gap-28 md:pt-24">
          {details.features.map((feature, i) => (
            <li key={feature.id} className={i % 2 === 1 ? "md:w-4/5 md:justify-self-end" : ""}>
              <div
                data-reveal="clip"
                className="group relative aspect-[4/5] overflow-hidden rounded-sm bg-ink-2"
              >
                <div data-parallax="0.06" className="absolute -inset-y-[8%] inset-x-0">
                  <div className="absolute inset-0 transition-transform duration-[1200ms] ease-out-expo fine:group-hover:scale-105">
                    <SwapImage
                      src={feature.images[colorway.id]}
                      alt={feature.alt}
                      sizes="(min-width: 768px) 38vw, 92vw"
                    />
                  </div>
                </div>
              </div>
              <p data-reveal="fade" className="eyebrow mt-6 flex items-center gap-3 text-mute">
                <span className="text-accent">0{i + 1}</span>
                {feature.label}
              </p>
              <h3
                data-reveal="fade"
                className="mt-3 text-3xl leading-[1.05] font-semibold tracking-tight [font-stretch:80%] md:text-4xl"
              >
                {feature.title}
              </h3>
              <p data-reveal="fade" className="mt-3 max-w-md text-frost/75 md:text-lg">
                {feature.body}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div data-reveal="fade" className="mt-20 flex flex-col items-start gap-5 border-t border-line pt-8 md:mt-28 md:flex-row md:items-center md:justify-between">
        <p className="max-w-md text-lg text-frost/75">
          {site.product.summary}. {colorways.length} colorways, one size.
        </p>
        <CtaButton size="lg" />
      </div>
    </section>
  );
}
