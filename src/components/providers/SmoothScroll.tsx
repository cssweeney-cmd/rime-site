"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { motionOk } from "@/lib/env";

/**
 * Lenis smooth scrolling, driven by the GSAP ticker so scroll position and
 * ScrollTrigger animations update in the same frame. Skipped entirely when
 * the visitor prefers reduced motion (native scrolling stays in charge).
 */
export function SmoothScroll() {
  useEffect(() => {
    if (!motionOk()) return;

    const lenis = new Lenis({ autoRaf: false, anchors: true, lerp: 0.11 });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Fonts and images can shift layout after first paint.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh).catch(() => {});
    window.addEventListener("load", refresh, { once: true });

    return () => {
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
