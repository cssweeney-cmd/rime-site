"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { FINE_POINTER, motionOk } from "@/lib/env";

/**
 * Lenis smooth scrolling, driven by the GSAP ticker so scroll position and
 * ScrollTrigger animations update in the same frame.
 *
 * Only runs for mouse and trackpad users. Touch devices already scroll
 * smoothly on the compositor thread, so they keep native scrolling (and skip
 * the per-frame work). Skipped entirely with reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (!motionOk() || !window.matchMedia(FINE_POINTER).matches) return;

    const lenis = new Lenis({ autoRaf: false, anchors: true, lerp: 0.11 });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
