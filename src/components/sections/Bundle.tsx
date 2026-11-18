"use client";

import { useRef, useState } from "react";
import { site } from "@/config/site";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { motionOk } from "@/lib/env";
import { useColorway } from "@/components/providers/ColorwayProvider";
import { BEATS, panelAt } from "@/components/stage/choreography";
import { stageState } from "@/components/stage/store";
import { CtaButton } from "@/components/ui/CtaButton";
import { ProductImage } from "@/components/ui/ProductImage";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * "Build the set": a pinned section. As you scroll, the stage brings in the
 * beanie, the neck warmer and the gloves one at a time, and the copy panel
 * swaps to match. The last beat shows the full set with the price.
 *
 * Without motion (reduced-motion or no JS) it is a plain list: each piece
 * with its image and copy, one after another.
 */
export function Bundle() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { colorway } = useColorway();
  const { bundle, pieces, details } = site;

  const panels = [
    ...pieces.map((p) => ({
      key: p.id,
      index: p.index,
      name: p.name,
      benefit: p.benefit,
      body: p.body,
      tags: p.tags,
      image: p.images[colorway.id],
      alt: p.alt,
      cutout: true,
    })),
    {
      key: "set",
      ...bundle.finale,
      tags: [] as string[],
      image: details.colorways.images[colorway.id],
      alt: details.colorways.alt,
      cutout: false,
    },
  ];

  useGSAP(
    () => {
      const el = root.current;
      if (!el || !motionOk()) return;
      const fills = Array.from(el.querySelectorAll<HTMLElement>("[data-fill]"));
      const stops = [...BEATS.panels, 1];
      const apply = (progress: number) => {
        stageState.bundle = progress;
        setActive(panelAt(progress));
        fills.forEach((fill, i) => {
          const local = clamp01((progress - stops[i]) / (stops[i + 1] - stops[i]));
          fill.style.transform = `scaleX(${local})`;
        });
      };
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => apply(self.progress),
        onRefresh: (self) => apply(self.progress),
      });
    },
    { scope: root },
  );

  /** Keyboard users who tab into a hidden panel get scrolled to it. */
  const scrollToPanel = (i: number) => {
    const el = root.current;
    if (!el || !motionOk() || i === active) return;
    const span = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + span * (BEATS.panels[i] + 0.06) });
  };

  return (
    <section
      id="bundle"
      ref={root}
      aria-labelledby="bundle-title"
      className="relative motion:h-[460vh]"
    >
      <div className="relative z-20 px-(--gutter) py-24 motion:sticky motion:top-0 motion:h-svh motion:overflow-clip motion:py-0">
        {/* Section label + progress */}
        <div className="motion:absolute motion:inset-x-(--gutter) motion:top-20 md:motion:top-24">
          <div className="flex items-baseline justify-between gap-6">
            <h2 id="bundle-title" className="eyebrow text-frost">
              <span className="text-accent">{bundle.eyebrow}</span>
              <span aria-hidden="true" className="mx-3 text-mute">
                /
              </span>
              {bundle.title}
            </h2>
            <p aria-hidden="true" className="eyebrow hidden text-mute tabular-nums motion:block">
              {panels[active].index} / {panels[panels.length - 1].index}
            </p>
          </div>
          <div aria-hidden="true" className="mt-4 hidden gap-1.5 motion:flex">
            {panels.map((panel) => (
              <span key={panel.key} className="h-px flex-1 bg-line">
                <span data-fill className="block h-full origin-left scale-x-0 bg-accent" />
              </span>
            ))}
          </div>
        </div>

        {/* Panels */}
        <ol className="mt-14 grid gap-20 motion:mt-0 motion:block">
          {panels.map((panel, i) => {
            const state = i === active ? "active" : i < active ? "before" : "after";
            return (
              <li
                key={panel.key}
                data-state={state}
                onFocus={() => scrollToPanel(i)}
                className="grid items-center gap-8 md:grid-cols-2 motion:absolute motion:bottom-24 motion:left-(--gutter) motion:block motion:w-[calc(100%-2*var(--gutter))] motion:transition-[opacity,translate] motion:duration-700 motion:ease-out-expo motion:data-[state=after]:pointer-events-none motion:data-[state=after]:translate-y-8 motion:data-[state=after]:opacity-0 motion:data-[state=before]:pointer-events-none motion:data-[state=before]:-translate-y-8 motion:data-[state=before]:opacity-0 md:motion:top-1/2 md:motion:bottom-auto md:motion:w-[min(42vw,36rem)] md:motion:-translate-y-1/2 md:motion:data-[state=after]:-translate-y-[calc(50%-2rem)] md:motion:data-[state=before]:-translate-y-[calc(50%+2rem)]"
              >
                {/* Inline image: only for the no-motion layout. The stage shows the product otherwise. */}
                <div
                  className={`relative mx-auto aspect-square w-full max-w-md motion:hidden ${
                    panel.cutout ? "" : "overflow-hidden rounded-sm"
                  }`}
                >
                  <ProductImage
                    src={panel.image}
                    alt={panel.alt}
                    sizes="(min-width: 768px) 28rem, 90vw"
                    className={panel.cutout ? "!object-contain" : ""}
                  />
                </div>

                <div>
                  <p className="flex items-center gap-4">
                    <span className="display text-5xl text-transparent [-webkit-text-stroke:1px_var(--c-accent)] md:text-6xl">
                      {panel.index}
                    </span>
                    <span className="eyebrow text-mute">{panel.name}</span>
                  </p>
                  <h3 className="display text-panel mt-4 md:mt-6">{panel.benefit}</h3>
                  <p className="mt-4 max-w-md text-base text-frost/75 md:mt-6 md:text-lg">
                    {panel.body}
                  </p>
                  {panel.tags.length > 0 && (
                    <ul className="mt-5 flex flex-wrap gap-2 md:mt-7">
                      {panel.tags.map((tag) => (
                        <li
                          key={tag}
                          className="eyebrow rounded-full border border-line px-3 py-2 text-frost/80"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                  {panel.key === "set" && (
                    <div className="mt-6 md:mt-8">
                      <CtaButton size="lg" />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
