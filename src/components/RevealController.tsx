"use client";

import { useEffect } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { motionOk } from "@/lib/env";

/**
 * Wires up every scroll reveal on the page from data attributes, so sections
 * can stay server components:
 *
 *   data-reveal="fade"    fades and lifts in (staggered with its neighbors)
 *   data-reveal="lines"   splits text into lines that rise out of a mask
 *   data-reveal="clip"    wipes an image in from the bottom
 *   data-parallax="0.06"  drifts against the scroll (fraction of its height)
 *
 * The matching hidden states live in globals.css and only apply when
 * `html.motion` is set, so nothing is ever hidden without this running.
 *
 * Everything is lazy: an IntersectionObserver does the watching, and the
 * (comparatively expensive) text splitting and scroll-linked tweens are only
 * created when an element is about to come on screen. That keeps page load
 * free of long main-thread tasks.
 */
export function RevealController() {
  useEffect(() => {
    if (!motionOk()) return;
    const ctx = gsap.context(() => {});

    const reveal = new IntersectionObserver(
      (entries) => {
        const fades: HTMLElement[] = [];
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal.unobserve(entry.target);
          const el = entry.target as HTMLElement;
          const kind = el.dataset.reveal;
          if (kind === "fade") {
            fades.push(el);
          } else if (kind === "clip") {
            ctx.add(() => {
              gsap.to(el, { clipPath: "inset(0% 0 0 0)", duration: 1.4, ease: "expo.out" });
            });
          } else if (kind === "lines") {
            ctx.add(() => {
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
                  });
                },
              });
            });
          }
        }
        if (fades.length) {
          ctx.add(() => {
            gsap.to(fades, { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.09 });
          });
        }
      },
      // Fire once the element is a little way into the viewport.
      { rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => reveal.observe(el));

    const parallax = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          parallax.unobserve(entry.target);
          const el = entry.target as HTMLElement;
          const amount = Number(el.dataset.parallax) * 100;
          ctx.add(() => {
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
        }
      },
      // Set up a screen ahead, so the drift is already running on arrival.
      { rootMargin: "100% 0px 100% 0px" },
    );
    document.querySelectorAll("[data-parallax]").forEach((el) => parallax.observe(el));

    return () => {
      reveal.disconnect();
      parallax.disconnect();
      ctx.revert();
    };
  }, []);

  return null;
}
