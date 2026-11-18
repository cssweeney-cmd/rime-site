"use client";

import { useRef, type CSSProperties } from "react";
import { site } from "@/config/site";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { motionOk } from "@/lib/env";
import { stageState } from "@/components/stage/store";
import { CtaButton } from "@/components/ui/CtaButton";
import { Snow } from "@/components/ui/Snow";

const delay = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

/**
 * Hero. The giant wordmark sits behind the product stage; the headline and
 * CTA sit in front of it. Scrolling feeds `stageState.hero`, which sends the
 * pieces off toward the bundle section.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const { hero, brand } = site;
  // Size the wordmark to span most of the width whatever the brand length.
  const wordmarkSize = `min(${Math.round(200 / Math.max(brand.name.length, 3))}vw, 58svh)`;

  useGSAP(
    () => {
      if (!motionOk()) return;
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          stageState.hero = self.progress;
        },
        onRefresh: (self) => {
          stageState.hero = self.progress;
        },
      });
      const scrub = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to("[data-hero-wordmark]", { yPercent: 28, scale: 1.12, opacity: 0.25, ease: "none", scrollTrigger: scrub });
      gsap.to("[data-hero-copy]", { yPercent: -18, opacity: 0, ease: "none", scrollTrigger: { ...scrub, end: "60% top" } });
    },
    { scope: root },
  );

  return (
    <section
      id="top"
      ref={root}
      className="relative flex h-svh min-h-[40rem] flex-col overflow-clip"
    >
      <div aria-hidden="true" className="glow-cold absolute inset-0" />
      <Snow />

      {/* Wordmark: decorative, behind the product stage. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[13%] flex justify-center md:top-1/2 md:-translate-y-[56%]"
      >
        <div data-hero-wordmark className="will-change-transform">
          <span className="rise-mask display block leading-[0.8] select-none" style={{ fontSize: wordmarkSize }}>
            <span className="block bg-gradient-to-b from-frost to-frost/55 bg-clip-text text-transparent">
              {brand.name}
            </span>
          </span>
        </div>
      </div>

      {/* Copy: in front of the stage. */}
      <div
        data-hero-copy
        className="relative z-20 mt-auto grid items-end gap-x-8 gap-y-6 px-(--gutter) pb-8 md:grid-cols-12 md:pb-12"
      >
        <div className="md:col-span-6">
          <p className="rise eyebrow flex items-center gap-3 text-accent" style={delay(0.25)}>
            <span aria-hidden="true" className="inline-block h-px w-8 bg-accent" />
            {hero.eyebrow}
          </p>
          <h1 className="display mt-4 text-[clamp(2.6rem,5.4vw,5.25rem)]">
            {hero.headline.map((line, i) => (
              <span key={line} className="rise-mask block" style={delay(0.3 + i * 0.09)}>
                <span className="block">{line}</span>
              </span>
            ))}
          </h1>
        </div>
        <div className="md:col-span-4 md:col-start-9">
          <p className="rise max-w-sm text-base text-frost/75 md:text-lg" style={delay(0.45)}>
            {hero.sub}
          </p>
          <div id="hero-cta" className="rise mt-6" style={delay(0.55)}>
            <CtaButton size="lg" />
          </div>
          <ul className="rise eyebrow mt-6 flex flex-wrap gap-x-5 gap-y-2 text-mute" style={delay(0.65)}>
            {hero.notes.map((note) => (
              <li key={note} className="flex items-center gap-2">
                <span aria-hidden="true" className="size-1 rounded-full bg-accent" />
                {note}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="rise eyebrow absolute top-1/2 right-(--gutter) z-20 hidden origin-right -translate-y-1/2 rotate-90 items-center gap-3 text-mute lg:flex"
        style={delay(0.8)}
      >
        {hero.scrollHint}
        <span className="inline-block h-px w-10 bg-mute" />
      </div>
    </section>
  );
}
