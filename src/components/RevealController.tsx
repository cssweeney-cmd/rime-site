"use client";

import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { motionOk } from "@/lib/env";

/**
 * Wires up every scroll reveal on the page from data attributes, so sections
 * can stay server components:
 *
 *   data-reveal="fade"    fades and lifts in (batched and staggered)
 *   data-reveal="lines"   splits text into lines that rise out of a mask
 *   data-reveal="clip"    wipes an image in from the bottom
 *   data-parallax="0.15"  drifts against the scroll (fraction of its height)
 *
 * The matching hidden states live in globals.css and only apply when
 * `html.motion` is set, so nothing is ever hidden without this running.
 */
export function RevealController() {
  useGSAP(() => {
    if (!motionOk()) return;

    ScrollTrigger.batch('[data-reveal="fade"]', {
      start: "top 90%",
      once: true,
      onEnter: (els) =>
        gsap.to(els, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.09,
          overwrite: true,
        }),
    });

    gsap.utils.toArray<HTMLElement>('[data-reveal="lines"]').forEach((el) => {
      SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit(self) {
          gsap.set(el, { visibility: "visible" });
          return gsap.from(self.lines, {
            yPercent: 112,
            duration: 1.2,
            ease: "expo.out",
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        },
      });
    });

    gsap.utils.toArray<HTMLElement>('[data-reveal="clip"]').forEach((el) => {
      gsap.to(el, {
        clipPath: "inset(0% 0 0 0)",
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
      const amount = Number(el.dataset.parallax) * 100;
      gsap.fromTo(
        el,
        { yPercent: -amount },
        {
          yPercent: amount,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });
  });

  return null;
}
